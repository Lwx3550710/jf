var app = getApp();
var that;
Page({
  data: {
    sex:0,
    id:0,
  },
  onLoad: function (options) {
    that = this;
    if(options.id){
      that.setData({
        type: options.type,
        id: options.id
      })
      if (options.type == 'edit') {
        that.getAddress();//获取地址详情
      }
    }
    
  },
  getAddress(){
    app.ajax({
      url: 'user/getAddress',
      data: {
        id: that.data.id
      },
      success: function (res) {
        console.log(res)
        that.setData({
          name: res.name,
          mobile: res.mobile,
          sex: res.type,
          shdz: res.address,
          mph: res.detail,
        })
      },
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (!e.detail.value.name){
      wx.showToast({
        title: '输入姓名!',
        icon: 'loading',
        duration: 1500
      })
      return false;
    } else if (!e.detail.value.mobile){
      wx.showToast({
        title: '输入手机号!',
        icon: 'loading',
        duration: 1500
      })
      return false;
    } else if (!e.detail.value.shdz) {
      wx.showToast({
        title: '输入收货地址!',
        icon: 'loading',
        duration: 1500
      })
      return false;
    }
    that.setData({
      name: e.detail.value.name,
      sex: e.detail.value.sex,
      mobile: e.detail.value.mobile,
      shdz: e.detail.value.shdz,
      mph: e.detail.value.mph
    })
    wx.showModal({
      title: '提示',
      content: '确认保存？',
      success: function (res) {
        if (res.confirm) {
          app.ajax({
            url: 'user/updateAddress',
            formPost: true,
            data: {
              userId: app.globalData.userid,
              id: that.data.id,
              name: that.data.name,
              mobile: that.data.mobile,
              address: that.data.shdz,
              detail: that.data.mph,
              type: that.data.sex,
            },
            success: function (res) {
              console.log(res)
              app.back();
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