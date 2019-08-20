var app = getApp();
var appData = app.globalData;
var that;
Page({
  data: {},
  onLoad: function (options) {
    that = this;
    
    that.setData({
      QR: "https://www.kuaizhan.com/common/encode-png?large=true&data=https://dcan.transtive.com/jig/?userid=" + app.globalData.userid,
    })
    this.getInvites();
  },

  getInvites: function () {
    app.ajax({
      url: 'user/invites',
      success: function (res) {
        console.log(res);
        that.setData({
          inviteData: res,
        })
      },
    })
  },
  //长按保存图片方法
  previewImage: function (e) {
    wx.previewImage({
      urls: e.currentTarget.dataset.img.split(',')
      // 需要预览的图片http链接  使用split把字符串转数组。不然会报错
    })
  },
  onShow: function () {},
  onShareAppMessage: function () {}
})