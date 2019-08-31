var app = getApp();
var appData = app.globalData;
var that;

var goodsDataById = {};

Page({
  data: {
		curSifMain: '菜单', // 选中的顶部菜单
		isShowShopCar: false, // 是否显示购物袋详情
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
      allPrice: 0, // 总价格（加上规格的）
      attr: [], // 规格
      num: 1,
      chooseAttrId: {}, // 选中的规格id
      chooseAttrVal: {}, // 选中的规格值
      chooseAttrPrice: {}, // 选中的规格价格
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
    shopCarList: [], // 购物袋列表
    shopCarId: '', // 用户cartid，用来加入购物袋，获取不到时不能提交
    shopCarNum: 0, // 购物袋数量
    shopCarAllPrice: 0, // 购物袋总价
    commentList: [], // 评价列表
    bannerImg:[],//匠方轮播
	},
	toChooseShopPage() { // 选择门店
		app.openUrl('mapShop');
	},
	toOrderSettlePage() { // 去结算
    if (that.data.shopCarList.length==0){
      wx.showModal({
        title: '操作失败',
        content: '请先将要购买的商品加入到购物袋',
        showCancel: false,
      })
      return false;
    }
    app.openUrl('orderSettle', 'way=' + that.data.orderWayType);
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
        var commentList = [];
        r.list.forEach((b,a)=>{
          var totalStarArr = [];
          for (var i = 0; i < b.totalStar; i++) {
            totalStarArr.push(1);
          }

          var fileUrls = (b.fileUrls||'').split('#');
          var imgArr = [];
          fileUrls.forEach((b,a)=>{
            if (endWith(b, '.png') || endWith(b, '.jpg') || endWith(b, '.jpeg')){
              imgArr.push( b.replace(appData.qiniu_imgServer, appData.qiniu_imgServer+'tmp/') );
            }
          })

          commentList.push({
            username: (b.user.nickname || '--'),
            head: (b.user.headUrl || ''),
            totalStarArr: totalStarArr, // 总评（用来循环星星）
            date: b.createTime.substring(0,10).replace(/-/g,'.'),
            content: b.content,
            imgArr: imgArr,
          })
        })
        that.setData({
          commentList: commentList,
        })
      },
    })

    function endWith (data,endStr){ // 判断是否以指定字符串结尾
      var d = data.length - endStr.length;
      return (d >= 0 && data.lastIndexOf(endStr) == d);
    }
  },
	showShopCar(e){ // 显示购物袋
		that.setData({
			isShowShopCar: true,
		})
    that.getShopCar();
	},
	hideShopCar(e) { // 隐藏购物袋
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
    wx.showTabBar({
      animation: true,
    });
	},
  showProductAttr(e) { // 显示商品规格
    var pid = app.attr(e, 'id');
    var pd = goodsDataById[pid] || {};
    that.setData({
      showProductAttrData: { // 商品规格数据
        id: pid,
        img: pd.logoUrl,
        name: pd.name,
        price: pd.price,
        allPrice: 0, // 总价格（加上规格的）
        attr: [], // 规格
        num: 1,
        chooseAttrId: {}, // 选中的规格id
        chooseAttrVal: {}, // 选中的规格值
        chooseAttrPrice: {}, // 选中的规格价格
        chooseAttrTxt: '',
      },
			isShowProductDetail: false,
			isShowProductAttr: true,
    })
    that.getShopProductAttr(pid,function(r){
      // console.log(r);
      var attrArr = [];
      var chooseAttrId = {};
      var chooseAttrVal = {};
      var chooseAttrPrice = {};
      var firstAttrPrice = 0;
      var firstAllPrice = pd.price;
      r.forEach((b,a)=>{
        var list = [];
        var firstAttrId = '', firstAttrVal = '';
        b.items.forEach((b2, a2) => {
          if (a2 == 0) {
            firstAttrId = b2.id;
            firstAttrVal = b2.name;
            firstAttrPrice = Number(b2.price||0);
            firstAllPrice += Number(b2.price||0);
          }
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
        chooseAttrId[b.itemName] = firstAttrId;
        chooseAttrVal[b.itemName] = firstAttrVal;
        chooseAttrPrice[b.itemName] = firstAttrPrice;
      })

      var chooseAttrTxt = [];
      for (var s in chooseAttrVal) {
        chooseAttrTxt.push(chooseAttrVal[s]);
      }

      that.setData({
        'showProductAttrData.allPrice': firstAllPrice,
        'showProductAttrData.attr': attrArr,
        'showProductAttrData.chooseAttrId': chooseAttrId,
        'showProductAttrData.chooseAttrVal': chooseAttrVal,
        'showProductAttrData.chooseAttrPrice': chooseAttrPrice,
        'showProductAttrData.chooseAttrTxt': chooseAttrTxt.toString(),
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
  getbanner(){//获取匠方轮播
    app.ajax({
      url: 'p/common/viewBanner',
      success: function (res) {
        // console.log(res)
        // console.log(res)
        // console.log(res.value.split('#'))
        that.setData({
          bannerImg: res.value.split('#'),
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
  chooseAttrLabel(e) { // 选择规格
    var chooseAttrId = that.data.showProductAttrData.chooseAttrId;
    var chooseAttrVal = that.data.showProductAttrData.chooseAttrVal;
    var chooseAttrPrice = that.data.showProductAttrData.chooseAttrPrice;
    var chooseId = app.attr(e, 'id');
    var chooseKey = app.attr(e, 'key');
    var chooseVal = app.attr(e, 'val');
    var choosePrice = app.attr(e, 'price');
    var pdPrice = app.attr(e,'pdprice');
    chooseAttrId[chooseKey] = chooseId;
    chooseAttrVal[chooseKey] = chooseVal;
    chooseAttrPrice[chooseKey] = choosePrice;
    var chooseAttrTxt = [];
    for (var s in chooseAttrVal){
      chooseAttrTxt.push(chooseAttrVal[s]);
    }
    var chooseAllPrice = pdPrice;
    for (var s in chooseAttrVal) {
      chooseAllPrice += Number(chooseAttrPrice[s]||0);
    }
    that.setData({
      'showProductAttrData.allPrice': chooseAllPrice,
      'showProductAttrData.chooseAttrId': chooseAttrId,
      'showProductAttrData.chooseAttrVal': chooseAttrVal,
      'showProductAttrData.chooseAttrTxt': chooseAttrTxt.toString(),
    })
  },
  addCard(){ // 加入购物袋
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
          title: '成功加入购物袋',
        })
        that.hideProductAttr();
        that.getShopCar();
      },
    })
  },
  getShopCarId(call){
    app.ajax({
      url: 'shop/getCart',
      data: {
        shopId: appData.shopid,
      },
      success: function (r) {
        // console.log(r)
        that.setData({
          shopCarId: r.id, // 用户cartid，用来加入购物袋，获取不到时不能提交
        })
        call && call();
      },
    })
  },
  getShopCar(){ // 获取购物袋列表
    app.ajax({
      url: 'cart/getById',
      data: {
        cartId: that.data.shopCarId,
      },
      success: function (r) {
        var shopCarList = [];
        r.other.items.forEach((b,a)=>{
          shopCarList.push({
            id: b.id,
            name: b.good.name,
            price: b.price,
            num: b.num,
            attr: b.goodItems||'',
            gid: b.goodId,
          })
        })
        that.setData({
          // shopCarId: r.id, // 用户cartid，用来加入购物袋，获取不到时不能提交
          shopCarNum: r.other.items.length, // 购物袋数量
          shopCarAllPrice: r.price, // 购物袋总价
          shopCarList: shopCarList,
        })
      },
    })
  },
  subShopCarNum(e){ // 购物袋列表数量-
    var index = app.attr(e, 'index');
    var shopCarLi = that.data.shopCarList[index];
    var nowNum = Number(shopCarLi.num);
    nowNum--;
    that.setData({
      ['shopCarList[' + index + '].num']: nowNum,
    })
    if (nowNum >= 1) {
      var productArr = [{
        id: shopCarLi.id,
        goodId: shopCarLi.gid,
        num: nowNum,
        itemIds: shopCarLi.attr[0].id || '',
      }];
      app.ajax({
        url: 'shop/insertCart',
        formPost: true,
        data: {
          cartId: that.data.shopCarId,
          goodJson: JSON.stringify(productArr),
        },
        success: function (r) {
          that.getShopCar();
        },
      })
    }else{ // 删除该商品
      app.ajax({
        url: 'shop/deleteCartItem',
        formPost: true,
        data: {
          itemId: shopCarLi.id,
        },
        success: function (r) {
          that.getShopCar();
        },
      })
    }
  },
  inputShopCarNum(e) { //购物袋列表数量更改
    var index = app.attr(e, 'index');
    var shopCarLi = that.data.shopCarList[index];
    // return e.detail.value.replace(/[^1-9]/g, '');
    var nowNum = Number(e.detail.value.replace(/[^1-9]/g, ''));
    that.setData({
      ['shopCarList['+index+'].num']: nowNum,
    })

    var productArr = [{
      id: shopCarLi.id,
      goodId: shopCarLi.gid,
      num: nowNum,
      itemIds: shopCarLi.attr[0].id || '',
    }];
    app.ajax({
      url: 'shop/insertCart',
      formPost: true,
      data: {
        cartId: that.data.shopCarId,
        goodJson: JSON.stringify(productArr),
      },
      success: function (r) {
        that.getShopCar();
      },
    })
  },
  addShopCarNum(e){ // 购物袋列表数量+
    var index = app.attr(e, 'index');
    var shopCarLi = that.data.shopCarList[index];
    var nowNum = Number(shopCarLi.num);
    nowNum++;
    that.setData({
      ['shopCarList[' + index + '].num']: nowNum,
    })
    var productArr = [{
      id: shopCarLi.id,
      goodId: shopCarLi.gid,
      num: nowNum,
      itemIds: shopCarLi.attr[0].id||'',
    }];
    app.ajax({
      url: 'shop/insertCart',
      formPost: true,
      data: {
        cartId: that.data.shopCarId,
        goodJson: JSON.stringify(productArr),
      },
      success: function (r) {
        that.getShopCar();
      },
    })
  },
  emptyShopCar() { // 清空购物袋
    app.ajax({
      url: 'cart/clear',
      formPost: true,
      data: {
        cartId: that.data.shopCarId,
      },
      success: function (r) {
        that.getShopCar();
      },
    })
  },
  showImg(e) { // 预览图片
    var index = app.attr(e, 'index');
    var imgindex = app.attr(e, 'imgindex');
    var imgData = that.data.commentList[index].imgArr;
    var showUrl = imgData[imgindex];
    wx.previewImage({
      urls: imgData,
      current: showUrl,
    });
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
  onShow() {
    that.setData({
      shopInfo: {},
      foodStarArr: [], // 食材数组（用来循环星星）
      packageStarArr: [], // 包装数组（用来循环星星）
    })
    app.getShopInfo(r => {
      // console.log(r);
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
    },true)
    
    that.getShopProduct();
    that.getbanner();
    that.getShopCarId(that.getShopCar);
    
  },
	onShareAppMessage() { },
})
