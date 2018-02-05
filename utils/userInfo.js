/**
 * @function GetUserInfo
 * @param callBack<用户信息>
 * 
 * @function Login
 * @param callBack<用户code>
 *
 * @function GetLocation
 * @param callBack<经纬度, 所在城市>
 * 
 * @export <getUserInfo: function, login: function, getLocation: function>
 * 
 * @author phuhoang
 * @time 2018-01-16
 */
const app = getApp();

/* ------------------------- 获取用户信息 ------------------------- */
const GetUserInfo = (callback) => {
  if (app.globalData.userInfo) {
    callback(app.globalData.userInfo);
  }
  wx.getUserInfo({
    withCredentials: true,
    success: res => {
      app.globalData.userInfo = res;
      callback(app.globalData.userInfo);
    },
    fail: err => {
      wx.showModal({
        title: '获取用户信息失败',
        content: '请在设置页允许获取个人信息',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.openSetting({
              success(res) {
                wx.getUserInfo({
                  withCredentials: true,
                  success(res) {
                    app.globalData.userInfo = res;
                    callback(app.globalData.userInfo);
                  }
                })
              },
              complete(err) {
                GetUserInfo(callback)
              }
            })
          }
        }
      })
    }
  });

}


/* ------------------------- 判断登陆状态 ------------------------- */
const GetUserInfoAndLogin = (callback) => {
  wx.checkSession({
    success: function () {
      GetUserInfo(callback)
    },
    fail: function () {
      wx.login({
        success: function (res) {
          if (res.code) {
            GetUserInfo(callback)
          } else {
            wx.showModal({
              title: '登陆失败',
              content: '请退出小程序重新打开',
              showCancel: false,
              success(res) {}
            })
          }
        }
      });
    }
  })
}


/* ------------------------- 获取地理位置 ------------------------- */
const GetLocation = (callback) => {
  wx.getLocation({
    type: 'wgs84',
    success (res) {
      GetCity({lat: res.latitude, lon: res.longitude}).then( address => {
        callback(res, address)
      }).catch( err => {
        callback(res, null)
      })
    },
    fail(err) {
      wx.showModal({
        title: '获取用户地址失败',
        content: '请在设置页允许获取所在地址',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.openSetting({
              success(res) {
                wx.getLocation({
                  type: 'wgs84',
                  success() {
                    GetCity({ lat: res.latitude, lon: res.longitude }).then(address => {
                      callback(res, address)
                    }).catch(err => {
                      callback(res, null)
                    })
                  }
                })
              },
              complete(err) {
                GetLocation(callback)
              }
            })
          }
        }
      })
    }
  })
}

/* ------------------------- 获取所在城市 ------------------------- */
const Http = require('./request.js');
const GetCity = (obj) => {
  return new Promise((resolve, reject) => {
    Http.get('https://apis.map.qq.com/ws/geocoder/v1', {
      location: obj.lat + ',' + obj.lon,
      key: 'VNIBZ-SC4KQ-HON5Z-GRGRT-EWZSV-QNFPU'
    }).then( res => {
      if (res.status == 0) {
        resolve(res.result.ad_info)
      } else {
        reject('获取城市失败')
      }
      }).catch(err => {
        reject('获取城市失败')
    })
  })
}

const GetOpenid = (callback) => {

  return new Promise((resolve, reject) => {
    if (app.globalData.openid) {
      resolve(app.globalData.openid);
    } else {
      wx.login({
        success(res) {
          wx.request({
            // url: `http://keduo.beibeiyue.com/k/wxCodeInfo/useCodeGetInfo`,
            url: 'http://192.168.1.110:8081/wxCodeInfo/useCodeGetInfo',
            method: "POST",
            data: { code: res.code, spreadId: 11 },
            dataType: 'json',
            success (res) {
              if (res.data.code == 1000) {
                let result = JSON.parse(res.data.result);
                app.globalData.openid = result.openid;
                resolve(app.globalData.openid);
              } else {
                reject(null);
              }
            }
          })
        }
      })
    }
  })
}


module.exports = {
  getUserInfo: GetUserInfo,
  getUserInfoAndLogin: GetUserInfoAndLogin,
  getOpenid: GetOpenid,
  getLocation: GetLocation
}