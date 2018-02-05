const app = getApp();

const http = require('./../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    luckyBagInfo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let _this = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      
    }
    return {
      title: '我正在给我家宝宝拆一个新春福袋，请求支援！',
      path: `/pages/help/first?parentPropagateNo=${app.globalData.propagateNo}`,
      imageUrl: '/img/share.jpg',
      success: function (res) {
        
        //转发成功跳转页面
        // wx.reLaunch({
        //   url: `/pages/openBox/openBox?luckyBagInfo=${_this.data.luckyBagInfo}`
        // })
        wx.redirectTo({
          url: `/pages/myBlessing/openBox`
        })
      },
      fail: function (res) {
        
      }
    }
  }
})