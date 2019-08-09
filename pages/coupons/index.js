var app = getApp();
var appData = app.globalData;
var that;

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
    that = this;
    if (options.init) {
      that.setData({
        init: options.init,
      })
    }
    this.getCoupon();
  },

  getCoupon: function(){
    app.ajax({
      url: 'user/coupons',
      data: {
        userId: app.globalData.userid,
      },
      success: function (res) {
        console.log(res);
        that.setData({
          couponData: res.list,
        })
      },
    })
  },
  chooseCoupons(e) {
    var index = app.attr(e, 'index');
    var status = app.attr(e, 'status');
    var data = that.data.couponData[index];
    if (status == 0) {//判断是否有用的红包
      console.log(that.data.init)
      if (that.data.init == 'orderSettle') { // 订单结算
        var lastPage = app.getPage(-1);
        lastPage.setData({
          couponInfo: { // 外卖地址
            amount: data.coupon.amount,
            id: data.id
          },
        })
        app.back();
      }
    } else {
      wx.showToast({
        title: '已过期！',
        icon: 'none',
      })
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})