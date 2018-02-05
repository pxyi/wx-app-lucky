const app = getApp();
const http = require('./../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  regionChange(e) {
    this.setData({
      region: e.detail.value
    })
  },

  formSubmit(e) {
    let nameReg = /^[a-zA-Z\u4e00-\u9fa5 ]{2,40}$/;
    if (!nameReg.test(e.detail.value.receiverName)) {
      wx.showToast({
        title: '请输入正确的姓名',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!phoneReg.test(e.detail.value.receiverPhone)) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    
    if (!e.detail.value.region.length) {
      wx.showToast({
        title: '请选择省市区地址',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    if (e.detail.value.detailAddress.length < 5) {
      wx.showToast({
        title: '请输入正确的收货地址',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    wx.showLoading({
      title: '提交信息中',
      mask: true
    });
    console.log(this.data)
    http.post('/wxLuckbagPrizeAddress/insert', {
      openId: app.globalData.openid,
      receiverName: e.detail.value.receiverName,
      receiverPhone: e.detail.value.receiverPhone,
      province: e.detail.value.region[0],
      city: e.detail.value.region[1],
      area: e.detail.value.region[2],
      detailAddress: e.detail.value.detailAddress,
      spreadId: 11
    }).then( res => {
      if (res.code == 1000) {
        wx.hideLoading()
        wx.navigateTo({
          url: '/pages/receive/submitSuccess/subSucc',
        })
      } else if (res.code == 1041) {
        wx.showToast({
          title: '您已提交过',
          duration: 2000
        })
      }
    })

  }
})