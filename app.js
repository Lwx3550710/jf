// 初始化AV
const AV = require('./utils/av-weapp.js');
const appId = "wx8afdcf3654b4ba03";
const appKey = "143d15030aa33de9f37e87491e20a2f9";
const qiniuUploader = require("./utils/qiniuUploader.js");

AV.init({ 
	appId: appId, 
	appKey: appKey,
});

// 初始化七牛相关参数
function initQiniu(uptoken) {
  var options = {
    region: 'SCN', // 华北区
    // uptokenURL: 'https://[yourserver.com]/api/uptoken', //请求后端uptoken的url地址
    uptoken: uptoken,  //你请求后端的uptoken,和上面一样的，uptokenURL不填就找uptoken,填一个就可以了（这里是字符串数据不是url了）
    domain: '', //yourBucketId:这个去你域名配置那里要
    shouldUseQiniuFileName: false,
    //key: '' 
  };
  qiniuUploader.init(options);
}

// 小程序版本迭代
function checkUpdateVersion() {
  //判断微信版本是否 兼容小程序更新机制API的使用
  if (wx.canIUse('getUpdateManager')) {
    //创建 UpdateManager 实例
    var updateManager = wx.getUpdateManager();
    // 检测版本更新
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        // 监听小程序有版本更新事件
        updateManager.onUpdateReady(function () {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启 （自动更新）
          updateManager.applyUpdate();
        })
        updateManager.onUpdateFailed(function () {
          // 新版本下载失败
          wx.showModal({
            title: '已经有新版本喽~',
            content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开哦~',
          })
        })
      }
    })
  } else {
    //TODO 此时微信版本太低
    wx.showModal({
      title: '溫馨提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    })
  }
}

var that;

App({
	globalData: {
    serverUrl: 'https://dcan.transtive.com/jig/',
    userid: '',
    userOpenid: '',
    userInfo: { // 用户微信信息
      country: '', // 国家
      province: '', // 省份
      city: '', // 城市
      name: '', // 用户昵称
      head: '', // 微信头像
      gender: 0, // 性别
    },
    userLocation: { // 用户当前经纬度信息
      lat: 0, // 经度
      long: 0, // 纬度
    },
    shopid: '',
    shopInfo: {}, // shopid 对应的门店信息
    qiniu_uploadToken: '', // 七牛图片上传的token
    qiniu_imgServer: 'https://qijiang.kangjiaobainian.xyz/', // 七牛链接前缀
    wayImgUrl: '../../images/home/', // 下单方式图片地址
    wayList: [ // 下单方式
      { type: '外卖', img: 'waimai.png' },
      { type: '自取', img: 'ziqu.png' },
      { type: '堂食', img: 'shitang.png' },
    ],
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
  ajax(obj) { // formPost为true时为“post表单提交”
    var header = obj.header || {}
    if (!header['Content-Type']) {
      header['Content-Type'] = 'application/json'
    }
    // if (!header['Authorization']) {
    //   header['Authorization'] = this.globalData.token
    // }
    if (obj.url.indexOf('http://') == -1 && obj.url.indexOf('https://') == -1) {
      obj.url = that.globalData.serverUrl + obj.url;
    }

    if(obj.formPost==true){ // post表单提交
      header["Content-Type"] = "application/x-www-form-urlencoded";
      obj.type = 'POST';
    }

    var objData = obj.data || {};
    if (!objData.userId && obj.noUserid!=true){
      objData.userId = that.globalData.userid;
    }

    wx.request({
      url: obj.url,
      data: objData,
      method: obj.type || 'GET',
      header: header,
      success: function (res) {
        typeof obj.success == "function" && obj.success(res.data.value)
      },
      fail: obj.fail || function () { },
    })
  },
  getPage(num) { // 获取指定page 如 -1 为上一页
    var pages = getCurrentPages();
    var curPage = pages[pages.length - 1 + num];
    return curPage;
  },
  chooseImg(num, needCompressImage, fun) { // 选择图片 （图片最大选择数,是否需要压缩图片）
    wx.chooseImage({
      count: num,
      sizeType: (needCompressImage ? ['original', 'compressed'] : ['original']),
      success: function (res) {
        // console.log(res)
        var tempFileArr = res.tempFilePaths;
        that.uploadImg(tempFileArr, (t, r) => {
          // console.log(t,r);
          fun && fun(t, r);
        });
      },
      fail: function (e) {
        console.error(e.errMsg);
        if (e.errMsg == 'chooseImage:fail cancel') {
          return false;
        }
        wx.showModal({
          title: '提示',
          content: '【wechat】选择图片出错，请重试',
          showCancel: false,
        })
      },
    });
  },
  uploadImg(imgArr, call, endData) { // 上传图片【配合选择图片使用】
    endData = endData || [];
    // wx.uploadFile({
    //   url: serverUrl + 'Uploader/image',
    //   filePath: imgArr[0],
    //   name: 'images',
    //   formData: {},
    //   success: function (r) {
    //     var d = JSON.parse(r.data);
    //     if (d.status == 'success') {
    //       endData.push(d.data);
    //       if (imgArr.length > 1) {
    //         imgArr.splice(0, 1);
    //         that.uploadImg(imgArr, call, endData);
    //       } else {
    //         call && call('success', endData);
    //       }
    //     } else {
    //       call && call('fail', d.msg);
    //     }
    //   },
    //   fail(r) {
    //     // call && call('wxfail',r.errMsg);
    //     console.error(r.errMsg);
    //     wx.showModal({
    //       title: '提示',
    //       content: '【wechat】上传出错，请重试',
    //       showCancel: false,
    //     })
    //   },
    // })
    qiniuUploader.upload(imgArr[0], res => {
      // console.log(res);
      endData.push(res);
      if (imgArr.length > 1) {
        imgArr.splice(0, 1);
        that.uploadImg(imgArr, call, endData);
      } else {
        call && call('success', endData);
      }
    }, error=>{
      call && call('fail', error);
    })
  },
	onLaunch(options) {
    checkUpdateVersion(); // 检测版本更新

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

    // 获取七牛图片上传的token
    that.ajax({
      url: 'common/getUpToken',
      data: {},
      success: r=>{
        // console.log(r);
        that.globalData.qiniu_uploadToken = r||''; // 七牛图片上传的token
        initQiniu(r);
      },
    })
  },
	onShow(options) {
	},
})