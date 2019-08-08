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
  onShow: function () {},
  onShareAppMessage: function () {}
})