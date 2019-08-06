var app = getApp();
var appData = app.globalData;
var that;

var goodsDataById = {};

Page({
  data: {
		curSifMain: '菜单', // 选中的顶部菜单
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
      chooseAttrId: {}, // 选中的规格id
      chooseAttrVal: {},
      chooseAttrTxt: '',
    },
    shopInfo: {}, // 门店信息
    wayImgUrl: '',
    orderWayType: '', // 下单方式
    orderWayImg: '', // 下单图片
    shopMenuIndex: 0, // 选中的商品分类
    goodsData: [], // 商品列表
    foodStarArr: [], // 食材数组（用来循环星星）
    packageStarArr: [], // 包装数组（用来循环星星）
    shopCarList: [], // 购物车列表
    shopCarId: '', // 用户cartid，用来加入购物车，获取不到时不能提交
    shopCarNum: 0, // 购物车数量
    shopCarAllPrice: 0, // 购物车总价
    commentList: [], // 评价列表
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
	chooseSifMain(e) { // 切换顶部菜单
		var type = app.attr(e, 'type');
		that.setData({
			curSifMain: type,
		})

    if(type=='评价'){
      that.getCommentData();
    }
	},
  getCommentData(){ // 获取评价数据
    app.ajax({
      url: 'shop/evals',
      data: {
        shopId: appData.shopid,
        type: 1,
      },
      success: function (r) {
        // console.log(r)
        that.setData({
          commentList: r.list,
        })
      },
    })
  },
	showShopCar(e){ // 显示购物车
		that.setData({
			isShowShopCar: true,
		})
    that.getShopCar();
	},
	hideShopCar(e) { // 隐藏购物车
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
        sale: pd.storeNum,
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
        chooseAttrId: {}, // 选中的规格id
        chooseAttrVal: {},
      },
			isShowProductDetail: false,
			isShowProductAttr: true,
    })
    that.getShopProductAttr(pid,function(r){
      // console.log(r);
      var attrArr = [];
      var chooseAttrId = {};
      var chooseAttrVal = {};
      r.forEach((b,a)=>{
        var list = [];
        b.items.forEach((b2, a2) => {
          list.push({
            // gid: b2.goodId,
            id: b2.id,
            val: b2.name,
            price: b2.price,
          })
        })
        attrArr.push({
          name: b.itemName,
          list: list,
        })
        chooseAttrId[b.itemName] = '';
        chooseAttrVal[b.itemName] = '';
      })
      that.setData({
        'showProductAttrData.attr': attrArr,
        'showProductAttrData.chooseAttrId': chooseAttrId,
        'showProductAttrData.chooseAttrVal': chooseAttrVal,
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
  chooseShopMenu(e) { // 切换产品分类
    var type = app.attr(e, 'type');
    that.setData({
      shopMenuIndex: type,
    })
    that.getShopProduct();
  },
  makePhone(e){ // 打电话
    var phone = app.attr(e,'phone');
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    })
  },
  subOneNum(){ // 规格弹框数量-
    var nowNum = Number(that.data.showProductAttrData.num);
    nowNum--;
    if (nowNum < 1) {
      nowNum = 1;
    }
    that.setData({
      'showProductAttrData.num': nowNum,
    })
  },
  inputOneNum(e) { // 规格弹框数量更改
    // return e.detail.value.replace(/[^1-9]/g, '');
    that.setData({
      'showProductAttrData.num': e.detail.value.replace(/[^1-9]/g, ''),
    })
  },
  addOneNum(){ // 规格弹框数量+
    var nowNum = Number(that.data.showProductAttrData.num);
    nowNum++;
    that.setData({
      'showProductAttrData.num': nowNum,
    })
  },
  chooseAttrLabel(e){ // 选择规格
    var chooseAttrId = that.data.showProductAttrData.chooseAttrId;
    var chooseAttrVal = that.data.showProductAttrData.chooseAttrVal;
    var chooseId = app.attr(e, 'id');
    var chooseKey = app.attr(e, 'key');
    var chooseVal = app.attr(e, 'val');
    var choosePrice = app.attr(e,'price');
    chooseAttrId[chooseKey] = chooseId;
    chooseAttrVal[chooseKey] = chooseVal;
    var chooseAttrTxt = [];
    for (var s in chooseAttrVal){
      chooseAttrTxt.push(chooseAttrVal[s]);
    }
    that.setData({
      'showProductAttrData.price': choosePrice,
      'showProductAttrData.chooseAttrId': chooseAttrId,
      'showProductAttrData.chooseAttrVal': chooseAttrVal,
      'showProductAttrData.chooseAttrTxt': chooseAttrTxt.toString(),
    })
  },
  addCard(){ // 加入购物车
    var sData = that.data.showProductAttrData;
    var t = [];
    for (var s in sData.chooseAttrId) {
      t.push(sData.chooseAttrId[s]);
    }
    var productArr = [{
      id: 0,
      goodId: sData.id,
      num: sData.num,
      itemIds: t.join('#'),
    }];

    app.ajax({
      url: 'shop/insertCart',
      formPost: true,
      data: {
        cartId: that.data.shopCarId,
        goodJson: JSON.stringify(productArr),
      },
      success: function (r) {
        wx.showToast({
          title: '成功加入购物车',
        })
        that.hideProductAttr();
      },
    })
  },
  getShopCar(){ // 获取购物车列表
    app.ajax({
      url: 'shop/getCart',
      data: {
        shopId: appData.shopid,
      },
      success: function (r) {
        console.log(r)
        that.setData({
          shopCarId: r.id, // 用户cartid，用来加入购物车，获取不到时不能提交
          shopCarNum: 0, // 购物车数量
          shopCarAllPrice: r.price, // 购物车总价
          shopCarList: [
            // { name: 'hehehe', price: 20, num: 10 },
          ],
        })
      },
    })
  },
  subShopCarNum(e){ // 购物车列表数量-
    var index = app.attr(e,'index');
    var nowNum = Number(that.data.shopCarList[index].num);
    nowNum--;
    if (nowNum >= 1) {
      that.setData({
        ['shopCarList[' + index + '].num']: nowNum,
      })
    }else{ // 删除该商品

    }
  },
  inputShopCarNum(e) { //购物车列表数量更改
    var index = app.attr(e, 'index');
    // return e.detail.value.replace(/[^1-9]/g, '');
    that.setData({
        ['shopCarList['+index+'].num']: e.detail.value.replace(/[^1-9]/g, ''),
    })
  },
  addShopCarNum(e){ // 购物车列表数量+
    var index = app.attr(e, 'index');
    var nowNum = Number(that.data.shopCarList[index].num);
    nowNum++;
    that.setData({
      ['shopCarList[' + index + '].num']: nowNum,
    })
  },
  emptyShopCar() { // 清空购物车
    that.getShopCar();
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
    var foodStarArr = [], packageStarArr = [];
    for (var i = 0; i < appData.shopInfo.foodStar; i++) {
      foodStarArr.push(1);
    }
    for (var i = 0; i < appData.shopInfo.packageStar; i++) {
      packageStarArr.push(1);
    }

    that.setData({
      shopInfo: appData.shopInfo,
      foodStarArr: foodStarArr, // 食材数组（用来循环星星）
      packageStarArr: packageStarArr, // 包装数组（用来循环星星）
    })
    that.getShopProduct();
    that.getShopCar();
  },
	onShareAppMessage() { },
})
