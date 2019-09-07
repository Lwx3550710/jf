var app = getApp()
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasOrder:true,
    dadaMobile:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
  },
  getTakeOrders(){
    app.ajax({
      url: 'order/takeOrders',
      data:{
        shopId: app.globalData.shopid
      },
      success: function (res) {
        console.log(res)
        var data = res[0];
        if (res.length > 0 && data.status < 6){//判断有数据 且 订单进行中
          that.setData({
            dadaName: data.dadaName || '--',
            dadaMobile: data.dadaMobile || '',
            goodItem: data.other.items,
            price: data.price || 0,
            code: data.code || '--',
            shopName: data.shop.name || '--',
            type: data.type,
            hasOrder:false
          })
        }
      },
    })
  },
  toChooseShopPage() { // 选择门店
    app.openUrl('mapShop', 'type=qucan');
  },
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: that.data.dadaMobile, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  goToOrder(){
    wx.switchTab({
      url: '/pages/index/index',
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
    that.getTakeOrders();
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