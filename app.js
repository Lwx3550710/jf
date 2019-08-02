// 初始化AV
const AV = require('./utils/av-weapp.js');
const appId = "wx8afdcf3654b4ba03";
const appKey = "143d15030aa33de9f37e87491e20a2f9";

AV.init({ 
	appId: appId, 
	appKey: appKey,
});

// 授权登录
App({
	onLaunch: function () {
        // // auto login via SDK
        // var that = this;
        // AV.User.loginWithWeapp();
        // wx.login({
        //     success: function(res) {
        //       if (res.code) {
        //         that.code = res.code;
        //           // 获取openId并缓存
        //           wx.request({
        //             url: 'http://120.79.37.4:8094/jig/user/getWechatAuthorize.do',
        //             data: {
        //               code: res.code,
        //             },
        //             method: 'Get',
        //             header: {
        //               'content-type': 'application/x-www-form-urlencoded'
        //             },
        //             success: function (response) {
        //               console.log(response)
        //               that.openid = response.data.openid;
        //             }
        //         });
        //         } else {
        //           console.log('获取用户登录态失败！' + res.errMsg)
        //         }
        //     }
        // });

        // // 设备信息
        // wx.getSystemInfo({
        //   success: function(res) {
        //     that.screenWidth = res.windowWidth;
        //     that.screenHeight = res.windowHeight;
        //     that.pixelRatio = res.pixelRatio;
        //   }
        // });
  },
  globalData:{
    // API_URL: 'http://localhost:3000',
    serverUrl: 'http://120.79.37.4:8094/jig/'
  }
})
