// 初始化AV
const AV = require('./utils/av-weapp.js');
const appId = "wx8afdcf3654b4ba03";
const appKey = "143d15030aa33de9f37e87491e20a2f9";

AV.init({ 
	appId: appId, 
	appKey: appKey,
});

var that;

App({
	globalData: {
		// API_URL: 'http://localhost:3000',
		serverUrl: 'http://120.79.37.4:8094/jig/'
	},
	back() { // 返回上一页
		wx.navigateBack();
	},
	attr(e, name) { // 获取点击对象的data
		return e.currentTarget.dataset[name];
	},
	openUrl(file, param, success, fail) { // 跳转
		if (file.indexOf('/')==-1){
			file = file + '/' + file;
		}
		wx.navigateTo({
			url: '/pages/' + file + '?' + param,
			success(t) {
				success && success(t);
			},
			fail(t) {
				fail && fail(t);
			},
		})
	},
	openUrlCs(file, param, success, fail) { // 关闭当前并跳转
		if (file.indexOf('/') == -1) {
			file = file + '/' + file;
		}
		wx.redirectTo({
			url: '/pages/' + file + '?' + param,
			success(t) {
				success && success(t);
			},
			fail(t) {
				fail && fail(t);
			},
		})
	},
	onLaunch(options) {
		that = this;
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
	onShow(options) {
	},
})