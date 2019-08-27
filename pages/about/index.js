var app = getApp();
var appData = app.globalData;
var that;

Page({
  data: {
    list: [
			{ name: '匠方文化', target: 'ourCulture' },
      { name: '匠方隐私保护政策', target: 'privacyPolicy' },
			{ name: '加盟匠方', target: 'joinUs' },
			{ name: '钱包章程', target: 'walletRule' },
			{ name: '常见问题', target: 'commonQuestion' },
		]
  },
	toTargetPage(e){
		var target = app.attr(e,'target');
		if(target!=''){
			app.openUrl(target);
		}
	},
  onLoad: function (options) {
		that = this;
	},
  onShow: function () {},
  onShareAppMessage: function () {}
})