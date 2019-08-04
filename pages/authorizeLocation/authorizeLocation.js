var app = getApp();
var appData = app.globalData;
var that;
Page({
	data: {
		requestCount: 0, // 请求次数（最多为4次，都不成功显示手动刷新）
		initLoadState: 0, // 请求状态 [0 未请求] [1 请求中] [2 请求成功] [3 请求失败] [4 4次请求失败]
	},
	toInitPage() {
    wx.switchTab({
      url: '/pages/index/index',
    });
	},
	getData() {
		that.setData({
			requestCount: that.data.requestCount+1,
			initLoadState: 1,
		})

    that.getLocationPower(lor=>{
      app.globalData.userLocation = {
        // lat: lor.lat,
        // long: lor.long,
        lat: lor.lat+4,
        long: lor.long+1,
      };

      that.toInitPage();
      return false;
  //------------------------------------------------------
  
      app.ajax({
        url: 'shop/selectShop',
        noUserid: true,
        data: {
          lati: lor.lat,
          longt: lor.long,
        },
        success: r => {
          var d = r.data;
          console.log(d);
          if (r.statusCode == 404) {
            // console.error('获取内容失败：', r);
            app.debug({ failSocket: JSON.stringify(r), type: '初始化文件404' });

            if (that.data.requestCount >= 4) {
              that.setData({
                initLoadState: 4,
              })
            } else {
              that.setData({
                initLoadState: 3,
              })
              that.getData();
            }
            return false;
          }

          app.sg_otherData = d;

          that.setData({
            initLoadState: 2,
          })

          that.toInitPage();
        },
        fail: r => {
          // console.error('获取内容失败：', r);
          app.debug({ failSocket: JSON.stringify(r), type: '获取初始化数据失败' });

          if (that.data.requestCount >= 4) {
            that.setData({
              initLoadState: 4,
            })
          } else {
            that.setData({
              initLoadState: 3,
            })
            that.getData();
          }
        },
      })
    });
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
	onLoad: function (options) {
		that = this;
		that.getData();
	},
	onShow() {},
})
