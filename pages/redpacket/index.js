var app = getApp();
var appData = app.globalData;
var that;
Page({
  data: {
  },
  toUse(){ // 立即使用
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  onLoad: function (options) {
    that = this;
    this.getRepacks();
  },
  getRepacks: function () {
    app.ajax({
      url: 'user/repacks',
      data: {
        userId: app.globalData.userid,
      },
      success: function (res) {
        console.log(res);
        that.setData({
          repacksData: res.list,
        })
      },
    })
  },
  onShareAppMessage: function () {

  }
})