var app = getApp();
var appData = app.globalData;
var that;
Page({
	data: {},
	toNextPage() { // 下一步
		app.openUrlCs('tradepintwo/index');
	},
	onLoad(options) {
		that = this;
	},
	onShareAppMessage() { },
})