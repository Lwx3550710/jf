var app = getApp();
var appData = app.globalData;
var that;
Page({
	data: {
		orderType: 0, // [0 自取] [1 外卖]
	},
	toChooseAddressPage(e) {
		app.openUrl('address/index');
	},
	toChooseShopPage(e) {
		app.openUrl('mapShop');
	},
	chooseType(e){
		var index = app.attr(e,'index');
		that.setData({
			orderType: index,
		})
	},
	onLoad(options) {
		that = this;
    // app.ajax({
    //   url: 'cart/getById',
    //   data: {
    //     cartId: 29
    //   },
    //   success: function (res) {
    //     console.log(res);
    //   },
    // })

    // app.ajax({
    //   url: 'order/pay',
    //   formPost: true,
    //   data: {
    //     cartId: 29,
    //     couponId: 0,
    //     repackId: 0,
    //     remark: 0,
    //     addressId: 64,
    //     type: 1,
    //     takeTime: 1565161166
    //   },
    //   success: function (res) {
    //     console.log(res);
    //   },
    // })


    // app.ajax({
    //   url: 'pay1/prepare',
    //   data:{
    //     cartId: 29,
    //     couponId:0,
    //     repackId:0,
    //     remark:0,
    //     addressId: 64,
    //     type: 1,
    //     takeTime: 1565161166
    //   },
    //   success: function (res) {
    //     var data = res;
    //     console.log(data.timeStamp)
    //     wx.requestPayment(
    //       {
    //         'timeStamp': data.timeStamp,
    //         'nonceStr': data.nonceStr,
    //         'package': data.package,
    //         'signType': 'MD5',
    //         'paySign': data.paySign,
    //         'success': function (res) {
    //           console.log(res)
    //          },
    //         'fail': function (res) { },
    //         'complete': function (res) { }
    //       })
    //     console.log(res);
    //   },
    // })
	},
	onShareAppMessage() { },
})