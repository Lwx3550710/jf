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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})