var app = getApp();
var appData = app.globalData;
var that;

Page({
	data: {
	},
	toOrderDetailPage(e){ // 订单详情
    var oid = app.attr(e,'oid');
    app.openUrl('orderDetails', 'oid=' + oid);
	},
  toOrderCommentPage(e) { // 订单评价
    var oid = app.attr(e, 'oid');
    app.openUrl('orderComment', 'oid=' + oid);
	},
	onLoad(options) {
		that = this;
	},
  onShow(){
    that.getOrderList();
  },
  getOrderList(){//获取订单列表
    app.ajax({
      url: 'order/orders',
      success: function (res) {
        that.setData({
          orderData: res.list
        })
      },
    })
  },
  cancelOrder(e) {//取消订单
    var id = app.attr(e, 'id');
    wx.showModal({
      title: '提示',
      content: '确认取消？',
      success: function (res) {
        if (res.confirm) {
          app.ajax({
            url: 'order/updateOrder',
            formPost: true,
            noUserid: true,
            data: {
              orderId: id,
              status: 9
            },
            success: function (res) {
              console.log(res);
              wx.showToast({
                title: '已取消！',
                success: function () {
                  that.onShow()
                }
              })
            },
          })
        }
      }
    })
  },
  confirmOrder(e) {//确定订单
    var id = app.attr(e, 'id');
    wx.showModal({
      title: '提示',
      content: '确认取餐？',
      success: function (res) {
        if (res.confirm) {
          app.ajax({
            url: 'order/updateOrder',
            formPost: true,
            noUserid: true,
            data: {
              orderId: id,
              status: 6
            },
            success: function (res) {
              console.log(res);
              wx.showToast({
                title: '已取餐！',
                success: function () {
                  that.onShow()
                }
              })
            },
          })
        }
      }
    })
  },
  toIndex(){
    wx.switchTab({    //跳转到首页
      url: "/pages/index/index"
    })
  },
	onShareAppMessage() { },
})