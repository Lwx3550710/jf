var app = getApp();
var appData = app.globalData;
var that;
Page({
	data: {
		markers: [{
			iconPath: "/images/sg-img/ads-1.png",
			id: 0,
			latitude: 23.099994+0.0032,
			longitude: 113.324520,
			width: 23,
			height: 28
		}],
	},
	chooseShop(e) { // 选择门店
		// var choose = app.attr(e, 'id');
		app.back();
	},
	onLoad(options) {
		that = this;
	},
	onShareAppMessage() { },
})