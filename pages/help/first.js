const app = getApp();
const http = require('./../../utils/request.js');
const userInfo = require('./../../utils/userInfo.js');
const format = require('./../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    friendItems: [],
    luckbagId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.parentPropagateNo = options.parentPropagateNo;
    console.log(app.globalData.parentPropagateNo)
    wx.setClipboardData({
      data: app.globalData.parentPropagateNo,
      success: function (res) {
        
      }
    })

    wx.showLoading({
      title: '加载中',
    });
    setTimeout( _ => {
      wx.hideLoading()
    }, 10000)

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
        http.post('/wxCustomerInformation/insert', params).then(response => {
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


      /* --------------------- 获取福袋信息 --------------------- */
      http.post(`/wxLuckbagHelpHistory/helpOpen`, {
        helpOpenId: openid,
        spreadId: 11,
        parentPropagateNo: options.parentPropagateNo
      }).then(res => {
        wx.hideLoading();
        if (res.code == 1000) {
          this.setData({
            luckbagId: res.result.luckbagId
          })
          if (res.result.history && res.result.history.length == 3) {
            wx.showModal({
              content: '宝宝的福袋已经拆开啦~',
              showCancel: false,
              success: function (res) {
                wx.redirectTo({
                  url: '/pages/index/index',
                })
              }
            })
          }
          if (res.result.history) {
            this.setData({
              friendItems: res.result.history
            })
          }
        } else if (res.code == 1040) {
          wx.redirectTo({
            url: '/pages/index/index'
          })
        }
      })

    });


  },
  checkLuckbag(e) {
    wx.showLoading({
      title: '加载中',
    });
    setTimeout(_ => {
      wx.hideLoading()
    }, 10000)
    http.post(`/wxLuckbagHelpHistory/checkLuckbag`, {
      helpOpenId: app.globalData.openid,
      spreadId: 11,
      parentPropagateNo: app.globalData.parentPropagateNo,
      luckbagId: this.data.luckbagId
    }).then( res => {
      console.log('帮忙回调', res)
      wx.hideLoading();
      wx.showModal({
        showCancel: false,
        content: res.code == 1000 ? '感谢您的帮助' : res.code == 1032 ? '福袋已经打开啦,感谢您的帮助' : res.code == 1012 ? '您已经帮过忙啦,去帮别人吧' : '帮忙失败',
        success() {
          if (res.code == 1000 || res.code == 1032 || res.code == 1012) {
            wx.redirectTo({
              url: '/pages/helpSuccess/gift',
            })
          }
        }
      })
    })
  } 
})