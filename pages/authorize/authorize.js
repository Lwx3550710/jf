const app = getApp();
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'), // 判断小程序的API，回调，参数，组件等是否在当前版本可用。
    serverUrl: '',
    logo: '',
    hasPower: true, // 是否已经获取授权
  },
  onLoad: function () {
    var that = this;
    that.setData({
      serverUrl: app.globalData.serverUrl,
      logo: 'static/logo.jpg',
    });
  },
  getUserinfoSuccess: function(e){
    var that = this;
    // console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      wx.login({
          success: function(res) {
            if (res.code) {
                that.code = res.code;
                console.log(res.code)
                console.log(that.data.serverUrl)
                // 获取openId并缓存
                wx.request({
                  url: that.data.serverUrl+'user/getWechatAuthorize.do',
                  data: {
                    code: res.code,
                  },
                  method: 'Get',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: function (response) {
                    console.log(response)
                    that.openid = response.data.openid;
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
    }
  },
})
