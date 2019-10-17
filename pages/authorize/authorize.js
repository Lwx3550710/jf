var app = getApp();
var appData = app.globalData;
var that;

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'), // 判断小程序的API，回调，参数，组件等是否在当前版本可用。
    hasPower: true, // 是否已经获取授权
    inViteId:'',
  },
  onLoad(options){
    that = this;
    if(options.inViteId){
      that.setData({
        inViteId: options.inViteId
      });
    }
  },
  onShow(){
    
  },
  getUserinfoSuccess: function (e) {
      wx.login({
        success: function(res) {

          if (res.code) {
            that.code = res.code;

            wx.getUserInfo({
              success: r2 => {
                console.log(111)
                console.log(r2)
                that.setData({
                  iv: r2.iv,
                  encryptedData: r2.encryptedData,
                  nickName: r2.userInfo.nickName,
                  gender: r2.userInfo.gender,
                  avatarUrl: r2.userInfo.avatarUrl,
                  userInfo: r2.userInfo,
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

              }
            })
            
            
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    
  },
})