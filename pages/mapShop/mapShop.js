var app = getApp();
var appData = app.globalData;
var that;
Page({
	data: {
    userLocation: {
      lat: '',
      long: '',
    },
    chooseLocation: {
      lat: '',
      long: '',
    },
		markers: [],
    shopList: [], // 门店
	},
	chooseShop(e) { // 选择门店
		var index = app.attr(e, 'index');
    var d = that.data.shopList[index];
    appData.shopid = d.id;
    appData.shopInfo = d;
		app.back();
  },
  showShop(e) { // 显示门店
    var index = app.attr(e, 'index');
    var d = that.data.shopList[index];
    that.setData({
      chooseLocation: {
        lat: d.lati,
        long: d.longt,
      },
      markers: that.data.markers,
    })
  },
  getShop(json) { // 获取附近门店
    app.ajax({
      url: 'shop/selectShop',
      data: {
        lati: json.lat,
        longt: json.long,
      },
      success: r => {
        // console.log(r);
        json.call && json.call(r);
      },
    })
  },
	onLoad(options) {
		that = this;
    var userLocation = appData.userLocation;
    var shopid = appData.shopid;
    that.setData({
      userLocation: userLocation, // 用户位置
      chooseLocation: userLocation,
    });

    that.getShop({
      lat: userLocation.lat,
      long: userLocation.long,
      call(r){
        var markerArr = [];
        r.list.forEach((b, a) => {
          b.distance = parseInt(b.distance);
          markerArr.push({
            iconPath: "/images/sg-img/ads-1.png",
            title: b.name,
            id: a,
            latitude: Number(b.lati),
            longitude: Number(b.longt),
            width: 23,
            height: 28
          });
        })
        that.setData({
          shopList: r.list||[],
          markers: markerArr,
        })
      }
    });
	},
	onShareAppMessage() { },
})