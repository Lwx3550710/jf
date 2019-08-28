var app = getApp()
var that;

Page({
  data: {
    userInfo: {
      isOpenWallet: false, // 是否已开通钱包功能
      nickName: 'mpvue',
      avatarUrl: 'http://mpvue.com/assets/logo.png',
    },
    shouquan: true,
    group: [{
      'title': '收货地址',
      'icon': '/../../images/my/address.png',
      'target': 'address'
    }, {
      'title': '我的订单',
      'icon': '/../../images/my/order.png',
      'target': 'orderlist'
    }, {
      'title': '我的会员',
      'icon': '/../../images/my/member.png',
      'target': 'member'
    }, {
      'title': '邀请好友',
      'icon': '/../../images/my/invite.png',
      'target': 'invite'
    }, {
      'title': '在线客服',
      'icon': '/../../images/my/kf.png',
      'target': 'kf'
    }, {
      'title': '意见反馈',
      'icon': '/../../images/my/idea.png',
			'target': 'feedback'
    }, {
      'title': '关于匠方',
      'icon': '/../../images/my/about.png',
      'target': 'about'
    }, {
      'title': '投资人/经营人',
      'icon': '/../../images/my/invest.png',
      'target': 'invest'
    }]
  },
  getUserData(){ // 获取用户信息
    app.ajax({
      url: 'user/getById',
      success: function (res) {
        console.log(res)
        that.setData({
          isOpenWallet: (res.payPwd == null ? false : true), // 是否已开通钱包功能
          headUrl: res.headUrl,
          nickname: res.nickname,
          point: res.point,
          couponNum: res.other.couponNum,
          repackNum: res.other.repackNum,
          leftAmount: res.leftAmount,
        })

        if (res.mobile!=''){//判断是否依有授权
          that.setData({
            shouquan: false
          })
        }
      },
    })
  },
  getPhoneNumber(e) {//获取手机号码
    if (e.detail.iv == null || e.detail.encryptedData == null) {
      wx.showToast({
        title: '获取失败',
        icon: 'none',
      })
      return false
    }
    app.ajax({
      url: 'user/deciphering',
      data: {
        encrypdata: e.detail.encryptedData,
        openId: app.globalData.userOpenid,
        ivdata: e.detail.iv,
        sessionkey: app.globalData.sessionKey
      },
      success: function (res) {
        console.log(res)
        app.globalData.phoneNumber = res.phoneNumber;
        wx.showToast({
          title: '获取成功',
          icon: 'none',
        })
        that.setData({
          shouquan:false
        })
      },
    })
  },
  myinfo: function (e) {
    wx.navigateTo({
      url: `../myinfo/index`
    })
  },
  myScore: function (e) {
    wx.navigateTo({
      url: `../myScore/myScore`
    })
  },
  coupons: function (e) {
    wx.navigateTo({
      url: `../coupons/index`
    })
  },
  redpacket: function (e) {
    wx.navigateTo({
      url: `../redpacket/index`
    })
  },
  myWallet: function (e) {
    if (that.data.isOpenWallet){ // 已开启钱包
      app.openUrl('wallet/index');
    }else{
      app.openUrl('myWallet/myWallet');
    }
  },
  bindShowTarget: function(e){
    wx.navigateTo({
      url: `../${e.currentTarget.dataset.id}/index`
    })
  },
  onLoad(options) {
    that = this;
    that.getUserData(); // 获取用户信息
  },
  onShow() {
    that.getUserData(); // 获取用户信息
  },
})