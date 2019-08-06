var app = getApp();
var appData = app.globalData;
var that;
Page({
	data: {
		orderType: 0, // [0 自取] [1 外卖]
	},
	toAddAddressPage(e) { // 添加地址
		app.openUrl('add-address/index','type=add');
	},
	toEditAddressPage(e) { // 修改地址
    var id = app.attr(e, 'id');
    app.openUrl('add-address/index', 'id=' + id +'&type=edit');
	},
	onLoad(options) {
		that = this;
    that.getAddressList();
	},
  onshow() {
    that.getAddressList();
  },
  getAddressList: function () {
    app.ajax({
      url: 'user/addresss',
      success: function (res) {
        console.log(res);
        that.setData({
          addressData: res
        })
      },
    })
  },
	onShareAppMessage() { },
})