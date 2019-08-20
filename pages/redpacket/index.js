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
        shopCarId: options.shopCarId,
        couponsAmount: options.couponsAmount
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
        app.ajax({//重新获取价格
          url: 'cart/getById',
          data: {
            cartId: that.data.shopCarId,
          },
          success: function (r) {
            var lastPage = app.getPage(-1);
            lastPage.setData({
              redpacketInfo: {
                amount: data.coupon.amount,
                id: data.id,
              },
              couponsAmount: that.data.couponsAmount,
              repacksAmount: data.coupon.amount,
              shopCarAllPrice: r.price - data.coupon.amount - that.data.couponsAmount
            })
            app.back();
          },
        })
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