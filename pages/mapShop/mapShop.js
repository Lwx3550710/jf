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
    markerList: [],
		markers: [],
    allList: [], // 门店
    shopList: [], // 门店
    searchHide: true,
    searchVal: '',
	},
  openSearch(){ // 开启搜索门店
    that.setData({
      searchHide: false,
      searchVal: '',
    })
  },
  closeSearch() { // 关闭搜索门店
    that.setData({
      searchHide: true,
      shopList: that.data.allList,
    })
  },
  bindSearchInput(e){
    that.setData({
      searchVal: e.detail.value,
    })
  },
  endSearch(){ // 搜索门店
    var searchVal = that.data.searchVal;
    var allList = that.data.allList; // 门店
    var shopList = [];
    allList.forEach((b, a) => {
      if (b.name.indexOf(searchVal) >= 0 || b.address.indexOf(searchVal) >= 0){
        shopList.push(b);
      }
    })
    that.setData({
      shopList: shopList,
    })

    if(shopList.length==0){
      wx.showModal({
        title: '提示',
        content: '搜索不到符合的门店！',
        showCancel: false,
      })
    }
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
      // markers: that.data.markers,
      markers: [ that.data.markerList[index] ],
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
            // title: b.name,
            callout: {
              content: b.name+'>',
              color: '#333',
              fontSize: 12,
              display: 'ALWAYS',
              bgColor: '#fff',
              textAlign: 'center',
              padding: 10,
              borderRadius: 4,
              borderWidth: 0,
            },
            id: a,
            latitude: Number(b.lati),
            longitude: Number(b.longt),
            width: 23,
            height: 28
          });
        })
        that.setData({
          shopList: r.list || [],
          allList: r.list||[],
          // markers: markerArr,
          markerList: markerArr,
        })
      }
    });
	},
	onShareAppMessage() { },
})