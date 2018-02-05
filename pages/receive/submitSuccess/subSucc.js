const app = getApp();
const http = require('./../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let requestPath = app.globalData.luckbagType == 1 ? '/wxLuckbag/getMatter' : app.globalData.luckbagType == 2 ? '/wxLuckbag/getPhotograph' : '/wxLuckbag/getFlow';
    http.post(requestPath, {
      openId: app.globalData.openid,
      spreadId: 11
    });
  },
  //保存二维码
  saveFn: function () {
    wx.getImageInfo({
      src: 'https://ketu.beibeiyue.com/pp.png',
      success: function (res) {
        wx.downloadFile({
          url: 'https://ketu.beibeiyue.com/pp.png', //图片路径
          success: function (res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
              //保存图片到相册
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: res => {
                  wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 2000
                  })
                },
                fail: error => {
                  wx.showToast({
                    title: '保存失败',
                    icon: 'success',
                    duration: 2000
                  })
                }
              })
            } else {
              wx.showToast({
                title: '保存失败',
                icon: 'success',
                duration: 2000
              })
            }
          },
          fail: error => {
            wx.showToast({
              title: '保存失败',
              icon: 'success',
              duration: 2000
            })
          },
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})