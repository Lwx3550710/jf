var app = getApp();
var appData = app.globalData;
var that;
Page({
	data: {},
	chooseWay() {
		app.back();
	},
	onLoad(options) {
		that = this;
	},
	onShareAppMessage() { },
})