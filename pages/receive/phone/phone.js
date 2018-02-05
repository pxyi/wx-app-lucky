const app = getApp();
const http = require('./../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    allowRequest: true,
    allowRequestTime: 60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  submit() {
    let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!phoneReg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    if (!this.data.code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      })
      return;
    }



    wx.showLoading({
      title: '加载中...',
    })

    http.post('/wxCustomerInformation/toRegist', {
      openId: app.globalData.openid,
      phone: this.data.phone,
      verifyNum: this.data.code,
      spreadId: 11,
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
  },
  phoneChange(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  codeChange(e) {
    this.setData({
      code: e.detail.value
    })
  },
  getCode(e) {
    if (!this.data.allowRequest) { return; }
    let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!phoneReg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    wx.showLoading({
      title: '加载中...',
    })

    http.post('/wxCustomerInformation/toVerify', {
      openId: app.globalData.openid,
      phone: this.data.phone,
      spreadId: 11,
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        this.setData({
          allowRequest: false
        });
        let allowRequestTime = 60;
        let interval = setInterval( _ => {
          allowRequestTime--;
          if (allowRequestTime <= 0) {
            this.setData({
              allowRequest: true,
              allowRequestTime: 60
            });
            clearInterval(interval);
          }
          this.setData({
            allowRequestTime: allowRequestTime
          });
        }, 1000)
      } else if (res.code == 1009) {
        wx.showToast({
          title: '验证码十分钟请求超过三次',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})