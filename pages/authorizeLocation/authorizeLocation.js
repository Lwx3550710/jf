var app = getApp();
var appData = app.globalData;
var that;
Page({
	data: {
		requestCount: 0, // 请求次数（最多为4次，都不成功显示手动刷新）
		initLoadState: 0, // 请求状态 [0 未请求] [1 请求中] [2 请求成功] [3 请求失败] [4 4次请求失败]
	},
	toInitPage() {
    app.openUrlCs('authorize');
	},
	getData() {
		that.setData({
			requestCount: that.data.requestCount+1,
			initLoadState: 1,
		})

    that.getLocationPower(lor=>{
      app.globalData.userLocation = {
        lat: lor.lat,
        long: lor.long,
      };

      // that.toInitPage();

      // 获取最近门店 shopid
      that.getShop({
        lat: lor.lat,
        long: lor.long,
        call: r=>{
          // console.log(r);
          if(r.list.length>0){
            var s = r.list[0];
            appData.shopid = s.id;
            s.distance = parseInt(s.distance);
            appData.shopInfo = s;
          }

          // 先检测是否已经进行用户授权，如已经授权直接进入首页，否则进入授权页
          that.checkPower();
        },
      })
    });
	},
  getShop(json){ // 获取附近门店
    app.ajax({
      url: 'shop/selectShop',
      data: {
        lati: json.lat,
        longt: json.long,
      },
      success: r=>{
        // console.log(r);
        json.call && json.call(r);
      },
    })
  },
	resetInit() { // 重试
		that.setData({
			requestCount: 0, // 请求次数（最多为5次，都不成功显示手动刷新）
			initLoadState: 0, // 请求状态 [0 未请求] [1 请求中] [2 请求成功] [3 请求失败] [4 5次请求失败]
		});
		that.getData();
	},
  getLocationPower(success) { // 获取用户地理位置权限
    //判断是否获得了用户地理位置授权
    wx.getSetting({
      success: (r) => {
        // console.log(r);
        // if (r.authSetting['scope.userLocation']) { // 用户已授权地理位置权限，直接进入主页
        //   success && success();
        // } else {
          wx.getLocation({
            success: function (r) {
              // console.log(r);
              success && success({
                lat: r.latitude,
                long: r.longitude,
              });
            },
            fail: function () {
              wx.showModal({
                title: '警告',
                content: '必须开启位置服务权限才能正常使用！',
                showCancel: false,
                success: function () {
                  wx.openSetting(); // 强制进入设置界面
                },
              })
            },
          })
        // }
      }
    })
  },
  checkPower() {
    // 判断是否获得了用户个人信息授权
    wx.getSetting({
      success: (r) => {
        if (r.authSetting['scope.userInfo']) { // 用户已授权个人信息权限
          wx.getUserInfo({
            success: r2 => {
              that.getUserinfoSuccess({
                detail: {
                  userInfo: r2.userInfo,
                },
              });
            }
          })
        } else {
          that.toInitPage();
        }
      },
      fail: (r) => {
        that.toInitPage();
      }
    })
  },
  getUserinfoSuccess: function (e) {
    var s = e.detail.userInfo;
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

      wx.login({
        success: function (res) {
          if (res.code) {
            that.code = res.code;
            // 获取openId并缓存
            app.ajax({
              url: 'user/getWechatAuthorize.do',
              noUserid: true,
              data: {
                js_code: res.code,
              },
              noUserid:true,
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
  onLoad: function (options) {
    that = this;
    that.getData();
  },
  onShow() { },
})
