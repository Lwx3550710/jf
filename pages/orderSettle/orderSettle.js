var app = getApp();
var appData = app.globalData;
var that;
Page({
	data: {
		orderType: 0, // [0 自取] [1 外卖]
	},
	toArticlePage(e) {
		// var choose = app.attr(e, 'id');
		// app.openUrl('question');
	},
	chooseType(e){
		var index = app.attr(e,'index');
		that.setData({
			orderType: index,
		})
	},
	onLoad(options) {
		that = this;
	},
	onShareAppMessage() { },
})