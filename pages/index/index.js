var app = getApp();
var appData = app.globalData;
var that;

Page({
  data: {
		curSifMain: '菜单',
		isShowShopCar: false, // 是否显示购物车详情
		isShowProductDetail: false, // 是否显示商品详情
		isShowProductAttr: false, // 是否显示商品规格
	},
	toChooseShopPage() { // 选择门店
		app.openUrl('mapShop');
	},
	toOrderSettlePage() { // 去结算
		app.openUrl('orderSettle');
	},
	toDiningwayPage() { // 选择用餐方式
		app.openUrl('diningway/index');
	},
	chooseSifMain(e) {
		var type = app.attr(e, 'type');
		that.setData({
			curSifMain: type,
		})
	},
	showShopCar(e){
		that.setData({
			isShowShopCar: true,
		})
	},
	hideShopCar(e) {
		that.setData({
			isShowShopCar: false,
		})
	},
	showProductDetail(e) {
		that.setData({
			isShowProductDetail: true,
		})
	},
	hideProductDetail(e) {
		that.setData({
			isShowProductDetail: false,
		})
	},
	showProductAttr(e) {
		that.setData({
			isShowProductDetail: false,
			isShowProductAttr: true,
		})
	},
	hideProductAttr(e) {
		that.setData({
			isShowProductAttr: false,
		})
	},
	noEvent(){}, // 用来阻止事件
	onLoad(options) {
		that = this;
	},
	onShareAppMessage() { },
})
