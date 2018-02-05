const app = getApp();
const http = require('./../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    luckyBagInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    /* ---------------------- 不是第一次进入小程序(在首页就获取到了福袋信息) ------------------- */
    if (app.globalData.luckyBagInfo) {
      let luckyBagInfo = app.globalData.luckyBagInfo;
      if (!luckyBagInfo.history) {
        luckyBagInfo.history = [];
      }
      this.setData({
        luckyBagInfo: luckyBagInfo
      });
    } else {
      /* ---------------------- 第一次进入小程序获取到了福袋(获取福袋信息) ------------------- */
      wx.showLoading({
        title: '加载中...',
      })
      http.post('/wxLuckbagHelpHistory/findLuckbagByopenId', {
        openId: app.globalData.openid,
        spreadId: 11
      }).then(res => {
        wx.hideLoading();
        if (res.code == 1000) {
          app.globalData.luckyBagInfo = res.result;

          let luckyBagInfo = app.globalData.luckyBagInfo;
          if (!luckyBagInfo.history) {
            luckyBagInfo.history = [];
          }
          this.setData({
            luckyBagInfo: luckyBagInfo
          });
          
        }
      })
    }
  },
  /* --------------------- 领取福袋奖品 --------------------- */
  receiveLucky() {
    wx.showLoading({
      title: '加载中',
    });
    setTimeout( _ => {
      wx.hideLoading();
    }, 10000)
    http.post('/wxLuckbag/holdPrize', {
      openId: app.globalData.openid,
      spreadId: 11,
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        app.globalData.luckbagType = res.result;
        if (res.result == 1) {
          wx.navigateTo({
            url: '/pages/receive/address/addres',
          })
        } else {
          wx.navigateTo({
            url: '/pages/receive/phone/phone',
          })
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '我正在给我家宝宝拆一个新春福袋，请求支援！',
      path: `/pages/help/first?parentPropagateNo=${app.globalData.propagateNo}`,
      imageUrl: '/img/share.jpg',
      success: function (res) {
        // 转发成功
        
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})