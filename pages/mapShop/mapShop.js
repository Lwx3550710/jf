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
    // that.setData({
    //   chooseLocation: {
    //     lat: d.lati,
    //     long: d.longt,
    //   },
    // })
    var map = wx.createMapContext("map"); 
    map.moveToLocation({
      longitude: d.longt,
      latitude: d.lati,
      success: r => {},
      fail: t => {
        console.log(t);
      },
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
        r.list.forEach((b, a) => {
          b.distance = parseInt(b.distance);
          if(b.id==shopid){ // 当前选择门店
            that.setData({
              markers: [{
                iconPath: "/images/sg-img/ads-1.png",
                id: 0,
                latitude: b.lati,
                longitude: b.longt,
                width: 23,
                height: 28
              }],
            })
            return false;
          }
        })
        that.setData({
          shopList: r.list||[],
        })
      }
    });
	},
	onShareAppMessage() { },
})