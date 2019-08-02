var app = getApp();
var appData = app.globalData;
var that;
Page({
	data: {},
	keep() { // 保存密码
		app.openUrlCs('wallet/index');
	},
	onLoad(options) {
		that = this;
	},
	onShareAppMessage() { },
})