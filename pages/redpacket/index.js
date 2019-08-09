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
    if (options.init) {
      that.setData({
        init: options.init,
      })
    }
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
  chooseRepacks(e) {
    var index = app.attr(e, 'index');
    var status = app.attr(e, 'status');
    var data = that.data.repacksData[index];
    if (status == 0){//判断是否有用的红包
      if (that.data.init == 'orderSettle') { // 订单结算
        var lastPage = app.getPage(-1);
        lastPage.setData({
          redpacketInfo: { // 外卖地址
            amount: data.coupon.amount
          },
        })
        app.back();
      }
    }else{
      wx.showToast({
        title: '已过期！',
        icon: 'none',
      })
    }
    
  },
  onShareAppMessage: function () {

  }
})