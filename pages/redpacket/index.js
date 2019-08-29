var app = getApp();
var appData = app.globalData;
var that;
Page({
  data: {
    couponsAmount:0,
    shopCarAllPriceUser:0,
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
        couponsAmount: options.couponsAmount || 0,
        shopCarAllPriceUser: options.shopCarAllPriceUser || 0
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
        let listMoney = that.data.shopCarAllPriceUser - that.data.couponsAmount;
        if(!that.data.init){//判断是否是订单跳转
          listMoney = 100000;
        }
        let listArray = [];
        res.list.forEach(item => {//筛选出符合购物车总价的条件
          if (item.coupon.amount < listMoney) {
            listArray.push(item);
          }
        })
        that.setData({
          repacksData: listArray,
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
      }else{
        wx.switchTab({
          url: '/pages/index/index',
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