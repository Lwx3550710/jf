var app = getApp();
var appData = app.globalData;
var that;

var goodsDataById = {};

Page({
  data: {
		curSifMain: '菜单',
    shopMenuIndex: 0,
		isShowShopCar: false, // 是否显示购物车详情
		isShowProductDetail: false, // 是否显示商品详情
    showProductDetailData: { // 商品详情数据
      id: '',
      img: '',
      name: '',
      sale: 0,
      txt: '',
      price: 0,
      priceOld: 0,
    },
		isShowProductAttr: false, // 是否显示商品规格
    showProductAttrData: { // 商品规格数据
      id: '',
      img: '',
      name: '',
      price: 0,
      attr: [], // 规格
      num: 1,
    },
    shopInfo: {}, // 门店信息
    wayImgUrl: '',
    orderWayType: '', // 下单方式
    orderWayImg: '', // 下单图片
    goodsData: [],
	},
	toChooseShopPage() { // 选择门店
		app.openUrl('mapShop');
	},
	toOrderSettlePage() { // 去结算
		app.openUrl('orderSettle');
	},
	toDiningwayPage() { // 选择下单方式
    app.openUrl('diningway/index', 'type=' + that.data.orderWayType+'&img='+that.data.orderWayImg);
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
	showProductDetail(e) { // 显示商品详情
    var pid = app.attr(e,'id');
    var pd = goodsDataById[pid]||{};
		that.setData({
      showProductDetailData: { // 商品详情数据
        id: pid,
        img: pd.logoUrl,
        name: pd.name,
        sale: pd.monthNum,
        txt: pd.content,
        price: pd.price,
        priceOld: pd.oldPrice,
      },
			isShowProductDetail: true,
		})
    wx.hideTabBar({
      animation: true,
    });
	},
  hideProductDetail(e) { // 隐藏商品详情
		that.setData({
			isShowProductDetail: false,
    })
	},
  showProductAttr(e) { // 显示商品规格
    var pid = app.attr(e, 'id');
    var pd = goodsDataById[pid] || {};
    that.setData({
      showProductAttrData: { // 商品规格数据
        id: pid,
        img: pd.logoUrl,
        name: pd.name,
        price: 0,
        attr: [], // 规格
        num: 1,
      },
			isShowProductDetail: false,
			isShowProductAttr: true,
    })
    that.getShopProductAttr(pid,function(r){
      // console.log(r);
      var attrArr = [];
      r.forEach((b,a)=>{
        var list = [];
        b.items.forEach((b2, a2) => {
          list.push({
            // gid: b2.goodId,
            id: b2.id,
            val: b2.name,
            price: b.price,
          })
        })
        attrArr.push({
          name: b.itemName,
          list: list,
        })
      })
      that.setData({
        'showProductAttrData.attr': attrArr,
      })
    });
    wx.hideTabBar({
      animation: true,
    });
	},
  hideProductAttr(e) { // 隐藏商品规格
		that.setData({
			isShowProductAttr: false,
    })
    wx.showTabBar({
      animation: true,
    });
	},
  getShopProduct(){//获取产品数据
    app.ajax({
      url: 'shop/getById',
      data: {
        shopId: appData.shopid,
        key: ''
      },
      success: function (res) {
        // console.log(res)
        var list = res.map.types;
        goodsDataById = {};
        list.forEach((b,a)=>{
          b.goods.forEach((b2, a2) => {
            goodsDataById[b2.id] = JSON.parse(JSON.stringify(b2));
          })
        });
        that.setData({
          shopData: list,
          goodsData: list[that.data.shopMenuIndex].goods,
        })
      },
    })
  },
  getShopProductAttr(pid,call) {//获取产品规格
    app.ajax({
      url: 'shop/getGoodItem',
      data: {
        goodId: pid,
      },
      success: function (r) {
        // console.log(r)
        call && call(r);
      },
    })
  },
  chooseShopMenu(e) {
    var type = app.attr(e, 'type');
    that.setData({
      shopMenuIndex: type,
    })
    that = this;
    that.getShopProduct();
  },
  makePhone(e){
    var phone = app.attr(e,'phone');
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    })
  },
	noEvent(){}, // 用来阻止事件
	onLoad(options) {
		that = this;
    that.setData({
      wayImgUrl: appData.wayImgUrl,
      orderWayType: appData.wayList[0].type, // 下单方式
      orderWayImg: appData.wayList[0].img, // 下单方式图片
    })
	},
  onShow(){
    that.setData({
      shopInfo: appData.shopInfo,
    })
    that.getShopProduct();
  },
	onShareAppMessage() { },
})
