var app = getApp();
var appData = app.globalData;
var that;
Page({
	data: {},
	openWallet(){
		wx.showModal({
			title: '请设置交易密码',
			content: '为保障您的钱包安全，请先设置6位数密码',
			showCancel: false,
			confirmColor: '#17c717',
			success(){
				app.openUrlCs('tradepinone/index');
			}
		})
	},
	toArticlePage(e) {
		// var choose = app.attr(e, 'id');
		// app.openUrl('question');
	},
	onLoad(options) {
		that = this;
	},
	onShareAppMessage() { },
})