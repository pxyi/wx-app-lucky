const app = getApp();
const userInfo = require('./../../utils/userInfo.js');
const http = require('./../../utils/request.js');

Page({
  data: {
  },
  onLoad: function (e) {

    if (e.parentPropagateNo) {
      app.globalData.parentPropagateNo = e.parentPropagateNo;
    }


    /* ----------------------- 获取openid ---------------------- */
    userInfo.getOpenid().then(openid => {
      app.globalData.openid = openid;

      /* --------------------- 获取用户信息 --------------------- */
      userInfo.getUserInfo((res) => {
        let params = res.userInfo;
        params.openId = openid;
        params.spreadId = 11;
        params.parentPropagateNo = app.globalData.parentPropagateNo;

        /* -------------------- 存储用户信息 -------------------- */
        http.post('/wxCustomerInformation/insert', params).then( response => {
            /* -------------------- 获取用户推广码 -------------------- */
            http.post('/wxPropagateRelation/getRelation', {
              openId: openid,
              spreadId: 11,
              parentPropagateNo: app.globalData.parentPropagateNo
            }).then(res => {
              if (res.code == 1000) {
                app.globalData.propagateNo = JSON.parse(res.result).propagateNo;
              }
            })
        })
      })
      
    });
  },

  submit() {
    wx.showLoading({
      title: '加载中...',
    });
    setTimeout( _ => {
      wx.hideLoading();
    }, 10000)
    /* -------------------- 获取用户福袋 -------------------- */
    http.post('/wxLuckbagHelpHistory/findLuckbagByopenId', {
      openId: app.globalData.openid,
      spreadId: 11
    }).then(res => {
      console.log('成功', res)
      wx.hideLoading();
      if (res.code == 1000) {
        app.globalData.luckyBagInfo = res.result;
        if (res.result.state == 0) {
          wx.navigateTo({
            url: `/pages/invitation/lucky`,
          })
        } else {
          wx.navigateTo({
            url: `/pages/myBlessing/openBox`,
          })
        }
      } else if (res.code == 1032) {
        wx.navigateTo({
          url: '/pages/receive/submitSuccess/subSucc',
        })
      } else {
        wx.navigateTo({
          url: '/pages/home/baby',
        })
      }
    })
  }
})
