var app = getApp();
var appData = app.globalData;
var that;
Page({
	data: {},
	toArticlePage(e) {
		// var choose = app.attr(e, 'id');
		// app.openUrl('question');
	},
	onLoad(options) {
		that = this;
	},
	onShareAppMessage() { },
})