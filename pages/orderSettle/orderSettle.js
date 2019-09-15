var util = require("../../utils/util.js");
var app = getApp();
var appData = app.globalData;
var that;
Page({
  data: {
    orderType: 0, // [0 自取] [1 外卖] [2 堂食]
    shopInfo: {}, // 门店信息
    shopCarList: [], // 购物袋列表
    shopCarId: '', // 用户cartid，用来加入购物袋，获取不到时不能提交
    shopCarNum: 0, // 购物袋数量
    shopCarAllNum: 0, // 商品总数量
    shopCarAllPrice: 0, // 购物袋总价
    shopCarAllParam: 0, // 购物袋总价(传参)
    shopCarAllPSum: 0, // 购物袋总价(传参 计算用 不包含优惠券跟红包 配送费 包含包装费) 
    shopCarAllSum: 0, // 购物袋总价(切换取餐方式 计算用 不包含配送费 包装费 包含优惠券跟红包 )
    canChooseRedCar: false, // 是否可选择红包
    canChooseCoupons: false, // 是否可选择优惠券
    addressInfo: { // 外卖地址
      id: '',
      name: '',
      phone: '',
      txt: '',
    },
    userPhone: '', // 用户联系方式
    couponInfo: {}, //优惠券地址
    redpacketInfo: {}, // 红包地址
    payType: 0, // 支付方式 [0 微信] [1 钱包]
    ls_payBoxShow: false, // 选择支付方式弹框是否选择
    ls_pay: 0, // 临时选择支付方式 [0 微信] [1 钱包]
    takeTime: '尽快取餐', // 取餐时间（时间戳）
    takeTimeTxt: '尽快取餐', // 取餐时间
    takeTimeLeftChoose: 0,
    takeTimeLeftArr: [],
    takeTimeRightChoose: 0,
    takeTimeRightArr: [],
    takeTimeBoxShow: false, // 选择取餐时间弹框是否显示
    desc: '', // 备注
    myMoney: 0, // 我的零钱
    arriveTime: '', //送达时间
    couponsAmount: 0,
    repacksAmount: 0,
    yunfei: 0, //运费

  },
  userPhoneInput(e) { // 输入用户联系方式
    that.setData({
      userPhone: e.detail.value,
    })
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
      app.openUrl('redpacket/index', 'init=orderSettle&shopCarId=' + that.data.shopCarId + '&couponsAmount=' + that.data.couponsAmount + '&shopCarAllParam=' + that.data.shopCarAllParam + '&yunfei=' + that.data.yunfei + '&packageAmount=' + that.data.packageAmount + '&orderType=' + that.data.orderType);
    }
  },
  toChooseCoupons() { // 选择优惠券
    if (that.data.canChooseCoupons) {
      app.openUrl('coupons/index', 'init=orderSettle&shopCarId=' + that.data.shopCarId + '&repacksAmount=' + that.data.repacksAmount + '&shopCarAllParam=' + that.data.shopCarAllParam + '&yunfei=' + that.data.yunfei + '&packageAmount=' + that.data.packageAmount + '&orderType=' + that.data.orderType);
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
    if (index == 1) {
      that.setData({
        shopCarAllPrice: that.data.shopCarAllSum + that.data.yunfei + that.data.packageAmount, // 购物袋总价
        shopCarAllParam: that.data.shopCarAllPSum
      })
    } else {
      that.setData({
        shopCarAllPrice: that.data.shopCarAllSum, // 购物袋总价
        shopCarAllParam: that.data.shopCarAllPSum - that.data.yunfei - that.data.packageAmount
      })
    }
    that.getCoupon();
  },
  showPayType() {
    that.getMyMoney();
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
    if (val == 1 && that.data.myMoney < that.data.shopCarAllPrice) {
      return false;
    }
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
          shopCarId: r.id, // 用户cartid，用来加入购物袋，获取不到时不能提交
        })
        call && call();
      },
    })
  },
  getShopCar() { // 获取购物袋列表
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
          // shopCarId: r.id, // 用户cartid，用来加入购物袋，获取不到时不能提交
          shopCarNum: r.other.items.length, // 购物袋数量
          shopCarAllNum: countNum, // 商品总数量
          shopCarAllPrice: Number(r.price) + Number(r.totalPackageAmount), // 购物袋总价
          shopCarAllParam: r.price + r.totalPackageAmount,
          shopCarAllPSum: r.price + r.totalPackageAmount,
          shopCarAllSum: r.price,
          shopCarList: shopCarList,
          packageAmount: r.totalPackageAmount,
          arriveTime: r.arriveTime, //送达时间
        })
        that.getCoupon();

      },
    })
  },
  toPay() { // 开始支付
    var cartid = that.data.shopCarId;
    var orderType = that.data.orderType;
    var addressId = that.data.addressInfo.id || 0;
    var takeTime = that.data.takeTime;
    var desc = that.data.desc;

    if (orderType == 1 && addressId == 0) {
      wx.showModal({
        title: '支付失败',
        content: '请先选择配送地址',
        showCancel: false,
      })
      return false;
    }

    var phoneVal = that.data.userPhone || '';
    if (orderType == 0 || orderType == 2) {
      if (phoneVal == '') {
        wx.showModal({
          title: '提示',
          content: '请输入您的联系方式',
          showCancel: false,
        })
        return false;
      }

      var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
      // var myreg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;  //判断是否是座机电话
      var isMobile = mobile.exec(phoneVal)
      if (!isMobile) {
        wx.showModal({
          title: '提示',
          content: '您输入的联系方式格式不正确，请重新检查填写',
          showCancel: false,
        })
        return false;
      }
    }

    if (that.data.payType == 0) { // 微信支付
      app.ajax({
        url: 'pay1/prepare',
        formPost: true,
        allData: true,
        data: {
          cartId: cartid,
          couponId: that.data.couponInfo.id || 0, // 优惠券ID
          repackId: that.data.redpacketInfo.id || 0, // 红包卷ID
          remark: desc,
          addressId: addressId,
          type: orderType,
          takeTime: takeTime,
          mobile: phoneVal,
          sendAmount: that.data.yunfei
        },
        success: function(res) {
          //console.log(res)
          if (res.value) {
            var data = res.value;
            wx.requestPayment({
              'timeStamp': data.timeStamp,
              'nonceStr': data.nonceStr,
              'package': data.package,
              'signType': 'MD5',
              'paySign': data.paySign,
              'success': function(r) {
                wx.showModal({
                  title: '温馨提示',
                  content: '您已经支付成功',
                  showCancel: false,
                  success: function() {
                    app.openUrl('orderDetails', 'oid=' + res.value);
                  },
                })
              },
              'fail': function(r) {
                // wx.showModal({
                //   title: '支付失败',
                //   content: '支付失败，请稍后重试',
                //   showCancel: false,
                // })
              },
            })
          } else {
            wx.showModal({
              title: '温馨提示',
              content: '支付失败！',
              showCancel: false,
            })
          }
        },
      })
    } else { // 钱包支付
      app.ajax({
        url: 'order/pay',
        formPost: true,
        allData: true,
        data: {
          cartId: cartid,
          couponId: that.data.couponInfo.id || 0, // 优惠券ID
          repackId: that.data.redpacketInfo.id || 0, // 红包卷ID
          remark: desc,
          addressId: addressId,
          type: orderType,
          takeTime: takeTime,
          mobile: phoneVal,
          sendAmount: that.data.yunfei
        },
        success: function(r) {
          //console.log(r);
          if (r.value) {
            wx.showModal({
              title: '温馨提示',
              content: '您已经支付成功',
              showCancel: false,
              success: function() {
                // wx.switchTab({
                //   url: '/pages/takefood/index',
                // })
                app.openUrl('orderDetails', 'oid=' + r.value);
              },
            })
          } else {
            wx.showModal({
              title: '温馨提示',
              content: r.detail,
              showCancel: false,
            })
          }

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
      val: '尽快取餐',
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
  getMyMoney() { // 获取我的零钱
    app.ajax({
      url: 'user/getById',
      data: {},
      success: function(r) {
        // console.log(r);
        that.setData({
          myMoney: Number(r.leftAmount),
        })
      },
    })
  },
  noEvent() {}, // 用来阻止事件
  onLoad(options) {
    that = this;
    that.getShopCarId(that.getShopCar);
    that.setData({
      orderType: (options.way == '自取' ? 0 : (options.way == '外卖' ? 1 : 2)), // [0 自取] [1 外卖] [2 堂食]
    })
    that.setTakeTimeData();
  },
  getCoupon: function() { //获取优惠券
    app.ajax({
      url: 'user/coupons',
      data: {
        userId: app.globalData.userid,
      },
      success: function(res) {
        //console.log(res);
        
        //重置
        that.setData({
          canChooseCoupons: false,
          couponsAmount: 0,
          couponInfo: {},
          shopCarAllPrice: Number(that.data.shopCarAllPrice) + that.data.couponsAmount,
          shopCarAllSum: Number(that.data.shopCarAllSum)  + that.data.couponsAmount
        })

        let Num = 0;
        let amountArray = [];
        if (res.list.length > 0) {
          res.list.forEach((item, index) => { //得到未使用的列表
            if (item.status == 0 && that.data.shopCarAllPrice > item.coupon.amount) {
              Num += 1;
              amountArray.push(item);
            }
          })

          let maxindex = 0;
          amountArray.forEach((item, index) => { //获取当前最大金额的索引
            if (amountArray[maxindex].coupon.amount <= item.coupon.amount) {
              maxindex = index;
            }
          })

          if (Num > 0) {
            that.setData({
              canChooseCoupons: true,
              couponsAmount: amountArray[maxindex].coupon.amount,
              couponInfo: {
                amount: amountArray[maxindex].coupon.amount,
                id: amountArray[maxindex].id
              },
              shopCarAllPrice: Number(that.data.shopCarAllPrice) - Number(amountArray[maxindex].coupon.amount),
              shopCarAllSum: Number(that.data.shopCarAllSum) - Number(amountArray[maxindex].coupon.amount)
            })
          }

        }

        that.getRepacks(); //获取红包
      },
    })
  },
  getRepacks: function() { //获取红包
    app.ajax({
      url: 'user/repacks',
      data: {
        userId: app.globalData.userid,
      },
      success: function(res) {
        //console.log(res);

        //重置
        that.setData({
          canChooseRedCar: false,
          repacksAmount: 0,
          redpacketInfo: {},
          shopCarAllPrice: Number(that.data.shopCarAllPrice) + that.data.repacksAmount,
          shopCarAllSum: Number(that.data.shopCarAllSum) + that.data.repacksAmount
        })

        let Num = 0;
        let amountArray = [];
        if (res.list.length > 0) {
          res.list.forEach((item, index) => { //得到未使用的列表
            if (item.status == 0 && that.data.shopCarAllPrice > item.coupon.amount) {
              Num += 1;
              amountArray.push(item);
            }
          })

          let maxindex = 0;
          amountArray.forEach((item, index) => { //获取当前最大金额的索引
            if (amountArray[maxindex].coupon.amount <= item.coupon.amount) {
              maxindex = index;
            }
          })

          if (Num > 0) {
            that.setData({
              canChooseRedCar: true,
              repacksAmount: amountArray[maxindex].coupon.amount,
              redpacketInfo: {
                amount: amountArray[maxindex].coupon.amount,
                id: amountArray[maxindex].id
              },
              shopCarAllPrice: Number(that.data.shopCarAllPrice) - Number(amountArray[maxindex].coupon.amount),
              shopCarAllSum: Number(that.data.shopCarAllSum) - Number(amountArray[maxindex].coupon.amount)
            })
          }

        }
      },
    })
  },
  onShow() {

    that.setData({
      shopInfo: appData.shopInfo,
    })

    if (that.data.addressInfo.id) { //判断是否选择了地址
      app.ajax({ //配送费
        url: 'cart/getDeliveryFee',
        data: {
          cartId: that.data.shopCarId,
          addressId: that.data.addressInfo.id
        },
        success: function(res) {
          // console.log(res);
          that.setData({
            yunfei: res,
            shopCarAllPrice: that.data.shopCarAllPSum - that.data.repacksAmount - that.data.couponsAmount + res, // 购物袋总价
            shopCarAllParam: that.data.shopCarAllPSum + res,
          })
        },
      })
    }
    that.getMyMoney();
  },
  onShareAppMessage() {},
})