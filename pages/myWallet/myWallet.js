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
        // app.openUrlCs('tradepinone/index');
        app.openUrlCs('setPass');
			}
		})
	},
	onLoad(options) {
		that = this;

    app.ajax({
      url: 'user/getById',
      success: r => {
        // console.log(r);
        if (r.payPwd != null) { // 已开通
          app.openUrlCs('wallet/index');
        }
      }
    })
	},
	onShareAppMessage() { },
})