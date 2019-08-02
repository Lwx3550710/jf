// pages/my/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      nickName: 'mpvue',
      avatarUrl: 'http://mpvue.com/assets/logo.png'
    },
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
      'target': 'idea'
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    wx.navigateTo({
      url: `../myWallet/myWallet`
    })
  },

  bindShowTarget: function(e){
    wx.navigateTo({
      url: `../${e.currentTarget.dataset.id}/index`
    })
  }
})