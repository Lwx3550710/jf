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
	},
	onShareAppMessage() { },
})