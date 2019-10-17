var app = getApp()
var appData = app.globalData;
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
      'icon': '../../images/my/address.png',
      'target': 'address'
    }, {
      'title': '我的订单',
      'icon': '../../images/my/order.png',
      'target': 'orderlist'
    }, {
      'title': '我的会员',
      'icon': '../../images/my/member.png',
      'target': 'member'
    }, {
      'title': '邀请好友',
      'icon': '../../images/my/invite.png',
      'target': 'invite'
    }, {
      'title': '在线客服',
      'icon': '../../images/my/kf.png',
      'target': 'kf'
    }, {
      'title': '意见反馈',
      'icon': '../../images/my/idea.png',
			'target': 'feedback'
    }, {
      'title': '关于匠方',
      'icon': '../../images/my/about.png',
      'target': 'about'
    }, {
      'title': '投资人/经营人',
      'icon': '../../images/my/invest.png',
      'target': 'invest'
    }]
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      var that = this;
      let userInfo = e.detail;
      wx.login({
        success: function (res) {

          if (res.code) {
            that.code = res.code;

            that.setData({
              iv: userInfo.iv,
              encryptedData: userInfo.encryptedData,
              nickName: userInfo.userInfo.nickName,
              gender: userInfo.userInfo.gender,
              avatarUrl: userInfo.userInfo.avatarUrl,
              userInfo: userInfo.userInfo,
            });
            // 获取openId并缓存
            app.ajax({
              url: 'user/getWechatAuthorize.do',
              noUserid: true,
              data: {
                js_code: res.code,
                userId: that.data.inViteId,
                nickName: that.data.nickName,
                gender: that.data.gender,
                avatarUrl: that.data.avatarUrl
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (r) {
                // console.log(r)
                appData.userOpenid = r.openId;
                appData.userid = r.userId;
                wx.switchTab({
                  url: '/pages/index/index',
                })
              }
            });


          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
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
    app.openUrl('myinfo/index');
  },
  myScore: function (e) {
    app.openUrl('myScore/myScore');
  },
  coupons: function (e) {
    app.openUrl('coupons/index');
  },
  redpacket: function (e) {
    app.openUrl('redpacket/index');
  },
  myWallet: function (e) {
    if (that.data.isOpenWallet){ // 已开启钱包
      app.openUrl('wallet/index');
    }else{
      app.openUrl('myWallet/myWallet');
    }
  },
  bindShowTarget: function(e){
    app.openUrl(e.currentTarget.dataset.id+'/index');
  },
  onLoad(options) {
    that = this;
  },
  onShow() {
    that.getUserData(); // 获取用户信息
    that.setData({
      appDataUserid: appData.userid
    })
  },
})