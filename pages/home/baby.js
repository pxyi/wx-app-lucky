
const app = getApp();
const formatTime = require('../../utils/util.js');
const http = require('./../../utils/request.js');
const userInfo = require('./../../utils/userInfo.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTime: formatTime.formatTime(new Date())
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.showModal({
    //   confirmText: '男宝宝',
    //   cancelText: '女宝宝',
    //   content: '请选择宝宝性别',
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
  },
  dateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  //抢福袋
  formSubmit(e) {
    if (!e.detail.value.date) {
      wx.showToast({
        title: '请选择宝宝生日',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showLoading({
        mask: true,
        title: '加载中'
      })
      http.post('/wxCustomerBabyInfomation/insert', {
        openId: app.globalData.openid,
        babyDate: e.detail.value.date,
        spreadId: 11,
        formId: e.detail.formId
      }).then( res => {
        wx.hideLoading();
        wx.navigateTo({
          url: `/pages/invitation/lucky`
        });
      })
    }
    
  },
  /**
   * 选择日期
   */
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
})