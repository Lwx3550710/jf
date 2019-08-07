var app = getApp();
var appData = app.globalData;
var that;
Page({
	data: {
    init: '', // 初始化值 [orderSettle 订单结算]
		orderType: 0, // [0 自取] [1 外卖]
    addressData: [], // 地址列表
	},
	toAddAddressPage(e) { // 添加地址
		app.openUrl('add-address/index','type=add');
	},
	toEditAddressPage(e) { // 修改地址
    var id = app.attr(e, 'id');
    app.openUrl('add-address/index', 'id=' + id +'&type=edit');
	},
  chooseAddress(e){
    var index = app.attr(e,'index');
    var data = that.data.addressData[index];
    if (that.data.init == 'orderSettle') { // 订单结算
      var lastPage = app.getPage(-1);
      lastPage.setData({
        addressInfo: { // 外卖地址
          id: data.id,
          name: data.name,
          phone: data.mobile,
          txt: data.address,
        },
      })
      app.back();
    }
  },
	onLoad(options) {
		that = this;
    that.setData({
      init: options.init,
    })
	},
  onShow() {
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