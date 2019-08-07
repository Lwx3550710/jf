var app = getApp();
var appData = app.globalData;
var that;
Page({
  data: {
    orderId: '', // 订单id
    odo: {}, // 订单信息
    stateData: {}, // 状态内容
  },
  getData() { // 获取订单详情
    app.ajax({
      url: 'order/getById',
      data: {
        orderId: that.data.orderId,
      },
      success: function (r) {
        console.log(r);
        that.setData({
          odo: r,
          stateData: that.getStateData(r.status),
        })
      },
    })
  },
  getStateData(t){
    if (t == 0){
      return { txt: '待接单', btn: { val: '取消订单', tap: 'cancelOrder' } };
    }else if(t==1){
      return { txt: '已接单，商家制作中' };
    }else if(t==2){
      return { txt: '待取餐', btn: { val: '确认取餐', tap: '' } };
    }else if(t==3){
      return { txt: '骑手已接单' };
    }else if(t==4){
      return { txt: '骑手已到店' };
    }else if(t==5){
      return { txt: '骑手配送中', btn: { val: '联系门店', tap: '' } };
    }else if(t==6){
      return { txt: '已送达' };
    }else if(t==7){
      return { txt: '退款申请中' };
    }else if(t==8){
      return { txt: '退款成功' };
    }else if(t==9){
      return { txt: '取消订单' };
    }else{
      return '';
    }
  },
  cancelOrder(){ // 取消订单
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
              orderId: that.data.orderId,
              status: 9
            },
            success: function (res) {
              // console.log(res);
              wx.showToast({
                title: '已取消！',
                success: function () {
                  that.getData();
                }
              })
            },
          })
        }
      }
    })
  },
	onLoad(options) {
		that = this;
    that.setData({
      orderId: options.oid,
    })
	},
  onShow(){
    that.getData();
  },
	onShareAppMessage() { },
})