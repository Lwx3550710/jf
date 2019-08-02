var app = getApp();
var appData = app.globalData;
var that;

Page({
	data: {
	},
	toOrderDetailPage(e){ // 订单详情
		app.openUrl('orderDetails');
	},
	toOrderCommentPage(e) { // 订单评价
		app.openUrl('orderComment');
	},
	onLoad(options) {
		that = this;
	},
	onShareAppMessage() { },
})