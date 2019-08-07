var util = require("../../utils/util.js");
var app = getApp();
var appData = app.globalData;
var that;
Page({
  data: {
    orderType: 0, // [0 自取] [1 外卖]
    shopInfo: {}, // 门店信息
    shopCarList: [], // 购物车列表
    shopCarId: '', // 用户cartid，用来加入购物车，获取不到时不能提交
    shopCarNum: 0, // 购物车数量
    shopCarAllNum: 0, // 商品总数量
    shopCarAllPrice: 0, // 购物车总价
    canChooseRedCar: false, // 是否可选择红包
    addressInfo: { // 外卖地址
      id: '',
      name: '',
      phone: '',
      txt: '',
    },
    payType: 0, // 支付方式 [0 微信] [1 钱包]
    ls_payBoxShow: false, // 选择支付方式弹框是否选择
    ls_pay: 0, // 临时选择支付方式 [0 微信] [1 钱包]
    takeTime: 0, // 取餐时间（时间戳）
    takeTimeTxt: '尽快取餐', // 取餐时间
    takeTimeLeftChoose: 0,
    takeTimeLeftArr: [],
    takeTimeRightChoose: 0,
    takeTimeRightArr: [],
    takeTimeBoxShow: false, // 选择取餐时间弹框是否显示
    desc: '', // 备注
  },
  makePhone(e) { // 打电话
    var phone = app.attr(e, 'phone');
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    })
  },
  toChooseAddressPage(e) { // 选择外卖地址
    app.openUrl('address/index', 'init=orderSettle');
  },
  toChooseShopPage(e) { // 选择门店
    // app.openUrl('mapShop');
  },
  toChooseRedCarPage() { // 选择红包
    if (that.data.canChooseRedCar) {
      app.openUrl('redpacket/index');
    }
  },
  agreePayType() {
    that.setData({
      payType: that.data.ls_pay,
      ls_payBoxShow: false,
    })
  },
  chooseOrderType(e) {
    var index = app.attr(e, 'index');
    that.setData({
      orderType: index,
    })
  },
  showPayType() {
    that.setData({
      ls_payBoxShow: true,
      ls_pay: that.data.payType,
    })
  },
  hidePayType() {
    that.setData({
      ls_payBoxShow: false,
    })
  },
  choosePayType(e) {
    var val = app.attr(e, 'val');
    that.setData({
      ls_pay: val,
    })
  },
  showTakeTime() {
    that.setData({
      takeTimeBoxShow: true,
    })
  },
  hideTakeTime() {
    that.setData({
      takeTimeBoxShow: false,
    })
  },
  chooseTakeTime(e) {
    var index = app.attr(e, 'index');
    var val = app.attr(e, 'val');
    var txt = app.attr(e, 'txt');
    that.setData({
      takeTimeRightChoose: index,
      takeTime: val,
      takeTimeTxt: txt,
    })
    that.hideTakeTime();
  },
  descInput(e) {
    that.setData({
      desc: e.detail.value,
    })
  },
  getShopCarId(call) {
    app.ajax({
      url: 'shop/getCart',
      data: {
        shopId: appData.shopid,
      },
      success: function(r) {
        // console.log(r)
        that.setData({
          shopCarId: r.id, // 用户cartid，用来加入购物车，获取不到时不能提交
        })
        call && call();
      },
    })
  },
  getShopCar() { // 获取购物车列表
    app.ajax({
      url: 'cart/getById',
      data: {
        cartId: that.data.shopCarId,
      },
      success: function(r) {
        var shopCarList = [];
        var countNum = 0;
        r.other.items.forEach((b, a) => {
          shopCarList.push({
            id: b.id,
            name: b.good.name,
            price: b.price,
            num: b.num,
            attr: b.goodItems || '',
            gid: b.goodId,
          })
          countNum += Number(b.num);
        })
        that.setData({
          // shopCarId: r.id, // 用户cartid，用来加入购物车，获取不到时不能提交
          shopCarNum: r.other.items.length, // 购物车数量
          shopCarAllNum: countNum, // 商品总数量
          shopCarAllPrice: r.price, // 购物车总价
          shopCarList: shopCarList,
        })
      },
    })
  },
  toPay() { // 开始支付
    var cartid = that.data.shopCarId;
    var orderType = that.data.orderType;
    var addressId = that.data.addressInfo.id || 0;
    var takeTime = that.data.takeTime;
    var desc = that.data.desc;

    if (orderType == 1 && addressId == 0){
      wx.showModal({
        title: '支付失败',
        content: '请先选择配送地址',
        showCancel: false,
      })
      return false;
    }

    if (that.data.payType == 0) { // 微信支付
      app.ajax({
        url: 'pay1/prepare',
        formPost: true,
        data: {
          cartId: cartid,
          couponId: 0, // 优惠券ID
          repackId: 0, // 红包卷ID
          remark: desc,
          addressId: addressId,
          type: orderType,
          takeTime: takeTime,
        },
        success: function(r) {
          console.log(r.timeStamp)
          wx.requestPayment({
            'timeStamp': r.timeStamp,
            'nonceStr': r.nonceStr,
            'package': r.package,
            'signType': 'MD5',
            'paySign': r.paySign,
            'success': function(r) {
              console.log(r)
              wx.showModal({
                title: '温馨提示',
                content: '您已经支付成功',
                showCancel: false,
              })
            },
            'fail': function(r) {
              wx.showModal({
                title: '支付失败',
                content: '支付失败，请稍后重试',
                showCancel: false,
              })
            },
          })
        },
      })
    } else { // 钱包支付
      app.ajax({
        url: 'order/pay',
        formPost: true,
        data: {
          cartId: cartid,
          couponId: 0, // 优惠券ID
          repackId: 0, // 红包卷ID
          remark: desc,
          addressId: addressId,
          type: orderType,
          takeTime: takeTime,
        },
        success: function(r) {
          // console.log(r);
          wx.showModal({
            title: '温馨提示',
            content: '您已经支付成功',
            showCancel: false,
          })
        },
      })
    }
  },
  setTakeTimeData() {
    var date = new Date();
    var nowStamp = parseInt(date.getTime() / 1000);
    var kStamp = 1800; // 30分钟
    var weekData = util.getDates(1, util.formatDate(date))[0];
    var takeTimeLeftArr = [{
      val: '今天(' + weekData.week + ')'
    }, ];
    var takeTimeRightArr = [{
      val: '0',
      txt: '尽快取餐'
    }, ];

    var timeData = util.escTime(date);
    var startHour = timeData.hour;
    var startMinute = timeData.minute;
    if (startMinute < 30) {
      startMinute = 30;
    } else {
      startHour++;
      startMinute = 0;
    }
    var sx = 24 * 2 - startHour * 2 - (startMinute > 0 ? 1 : 0) + 1;
    var r_dcx = dcx();
    takeTimeRightArr.push({
      val: eStamp(r_dcx),
      txt: r_dcx
    })
    for (var i = 1; i < sx; i++) {
      var r_dcx = dcx(true);
      takeTimeRightArr.push({
        val: eStamp(r_dcx),
        txt: r_dcx
      })
    }
    that.setData({
      takeTimeLeftChoose: 0,
      takeTimeLeftArr: takeTimeLeftArr,
      takeTimeRightChoose: 0,
      takeTimeRightArr: takeTimeRightArr,
    })

    function dcx(st) {
      if (st) {
        if (startMinute == 0) {
          startMinute = 30;
        } else {
          startHour++;
          startMinute = 0;
        }
      }
      return util.formatNumber(startHour) + ':' + util.formatNumber(startMinute);
    }

    function eStamp(t) {
      return parseInt(new Date(weekData.time.replace(/-/g, '/') + ' ' + t + ':00').getTime() / 1000);
    }
  },
  noEvent() {}, // 用来阻止事件
  onLoad(options) {
    that = this;
    that.getShopCarId(that.getShopCar);
    that.setData({
      orderType: (options.way == '自取' ? 0 : 1), // [0 自取] [1 外卖]
    })

    that.setTakeTimeData();
  },
  onShow() {
    that.setData({
      shopInfo: appData.shopInfo,
    })
  },
  onShareAppMessage() {},
})