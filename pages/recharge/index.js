var app = getApp();
var appData = app.globalData;
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      'money': '100'
    }, {
      'money': '200'
    }, {
      'money': '300'
    }, {
      'money': '400'
    }],
    shopMoney:'100',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
  },
  chooseMoney(e) {//选择充值金额
    var type = app.attr(e, 'type');
    that.setData({
      shopMoney: type,
    })
  },
  comfirmMoney(){//点击立即充值
    wx.showModal({
      title: '提示',
      content: '确认充值？',
      success: function (res) {
        if (res.confirm) {
          app.ajax({
            url: 'pay/prepare',
            data: {
              userId: app.globalData.userid,
              amount: that.data.shopMoney
            },
            success: function (res) {
              console.log(res)
              var data = res;
              wx.requestPayment(
                {
                  'timeStamp': data.timeStamp,
                  'nonceStr': data.nonceStr,
                  'package': data.package,
                  'signType': 'MD5',
                  'paySign': data.paySign,
                  'success': function (res) {
                    wx.showToast({
                      title: '充值成功！'
                    })
                  },
                  'fail': function (res) { },
                  'complete': function (res) { }
                })
            },
          })

        }
      }
    })
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