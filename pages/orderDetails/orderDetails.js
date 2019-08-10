var app = getApp();
var appData = app.globalData;
var that;
Page({
  data: {
    shopInfo: {}, // 门店信息
    orderId: '', // 订单id
    odo: {}, // 订单信息
    stateData: {}, // 状态内容
  },
  toOrderCommentPage(e) { // 订单评价
    app.openUrl('orderComment','oid='+that.data.orderId);
  },
  getData() { // 获取订单详情
    app.ajax({
      url: 'order/getById',
      data: {
        orderId: that.data.orderId,
      },
      success: function (r) {
        // console.log(r);
        that.setData({
          odo: r,
          stateData: that.getStateData(r.status,r),
        })
      },
    })
  },
  getStateData(t,d){
    var shopPhone = that.data.shopInfo.mobile;
    if (t == 0) { // 待接单
      return { txt: '待接单', btn: [{ cap: '取消订单', tap: 'cancelOrder' }] };
    } else if (t == 2) { // 已接单，商家制作中
      return { txt: '已接单，商家制作中', btn: [{ cap: '联系门店', tap: 'makePhone', val: shopPhone }] };
    } else if (t == 3) { // 骑手已接单
      return { txt: '骑手已接单' };
    } else if (t == 4) { // 骑手已到店
      return { txt: '骑手已到店' };
    } else if (t == 5) { // 骑手配送中
      return { txt: '骑手配送中', btn: [{ cap: '联系门店', tap: 'makePhone', val: shopPhone }] };
    } else if (t == 6) { // 已送达
      if (d.eval==false){
        return { txt: '已送达', btn: [{ cap: '再来一单', tap: 'againOrder' }, { cap: '评价', tap: 'toOrderCommentPage' }] };
      }else{
        return { txt: '已送达', btn: [{ cap: '再来一单', tap: 'againOrder' }, { cap: '已评价', class: 'not' }] };
      }
    } else if (t == 7) { // 退款申请中
      return { txt: '退款申请中' };
    } else if (t == 8) { // 退款成功
      return { txt: '退款成功' };
    } else if (t == 9) { // 取消订单
      return { txt: '已取消' }; // btn: [{ cap: '删除订单', tap: '' }]
    }else{
      return '';
    }
  },
  makePhone(e) { // 打电话
    var phone = app.attr(e, 'val');
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    })
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
  againOrder(){ // 再来一单
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
	onLoad(options) {
		that = this;
    that.setData({
      orderId: options.oid,
    })

    // that.testOrderState(6);
	},
  onShow(){
    that.setData({
      shopInfo: appData.shopInfo,
    })
    that.getData();
  },
	onShareAppMessage() { },


  testOrderState(state){ // 测试更改状态专用，非开发人员不要动这个接口，也不要使用
    app.ajax({
      url: 'order/updateOrder',
      formPost: true,
      noUserid: true,
      data: {
        orderId: that.data.orderId,
        status: state
      },
      success: function (res) {
        console.log(res);
      },
    })
  }
})