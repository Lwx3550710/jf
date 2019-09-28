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
    wx.getUserInfo({
      success: r2 => {
        console.log(r2)
        that.setData({
          iv: r2.iv,
          encryptedData: r2.encryptedData,
          nickName: r2.userInfo.nickName,
          gender: r2.userInfo.gender,
          avatarUrl: r2.userInfo.avatarUrl,
          userInfo:r2.userInfo,
        });
      }
    })
  },
  getUserinfoSuccess: function (e) {
    var s = that.data.userInfo;
    console.log(11)
    // console.log(s)
    if (s) {
      appData.userInfo = { // 用户微信信息
        country: s.country, // 国家
        province: s.province, // 省份
        city: s.city, // 城市
        name: s.nickName, // 用户昵称
        head: s.avatarUrl, // 微信头像
        gender: s.gender, // 性别
      }
      console.log(22)

      wx.login({
        success: function(res) {
          console.log(33)
          if (res.code) {
            that.code = res.code;
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
              success: function(r) {
                console.log(44)
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
      wx.showModal({
        title: '提示',
        content: '拒绝授权个人信息则无法正常使用小程序，请重新点击授权！',
        showCancel: false,
      })
    }
  },
})