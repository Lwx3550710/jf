var app = getApp();
var appData = app.globalData;
var that;

Page({
	data: {
		fb_type: [],
		canSubmit: 0,
		fb_chooseType: 0, // 反馈问题类型
		fb_contentVal: '', // 反馈问题内容
    fb_uploadImg: [], // 反馈问题图片
		fb_uploadImgHash: [], // 反馈问题图片hash值
	},
	contentInput(e) { // 输入昵称
		that.setData({
			fb_contentVal: e.detail.value,
		})
		that.checkForm();
	},
	getImgFile() { // 选择图片
    var imgData = that.data.fb_uploadImg;
    var imgDataHash = that.data.fb_uploadImgHash;
		app.chooseImg(3 - imgData.length, true, (t,r) => {
			if(t=='success'){
				r.forEach((v, i)=>{
          imgData.push(appData.qiniu_imgServer+v.imageURL);
          imgDataHash.push(appData.qiniu_imgServer +v.hash);
				})
				that.setData({
          fb_uploadImg: imgData,
          fb_uploadImgHash: imgDataHash,
				});
			}else{
				console.log(r);
			}
		})
	},
	delUploadImg(e) { // 删除图片
    var imgData = that.data.fb_uploadImg;
    var imgDataHash = that.data.fb_uploadImgHash;
		var delIndex = app.attr(e,'index');
    imgData.splice(delIndex, 1);
    imgDataHash.splice(delIndex,1);
		that.setData({
      fb_uploadImg: imgData,
      fb_uploadImgHash: imgDataHash,
		})
	},
	showImg(e) { // 预览图片
		var imgData = that.data.fb_uploadImg;
		var showUrl = app.attr(e,'url');
		wx.previewImage({
			urls: imgData,
			current: showUrl,
		});
	},
	chooseTypeFb(e) { // 选择类型
		var choose = app.attr(e,'value');
		that.setData({
			fb_chooseType: choose,
		});
	},
	checkForm() { // 检查表单
		if (that.data.fb_contentVal.length > 0) {
			that.setData({
				canSubmit: 1,
			})
		} else {
			that.setData({
				canSubmit: 0,
			})
		}
	},
	submitForm() { // 提交表单
		var data = that.data;
		if (that.data.canSubmit == 1) {
      var s_arr = [];
      data.fb_uploadImg.forEach((b,a)=>{
        s_arr.push(b.replace('/tmp/', ''));
      })
      var arr = data.fb_uploadImgHash.concat(s_arr);
      
			app.ajax({
        url: 'user/insertSuggest',
        formPost: true,
				data: {
          type: data.fb_type[data.fb_chooseType].id,
          desc: data.fb_contentVal,
          fileUrls: arr.join('#'),
				},
				success: r => {
					// console.log(r);
          wx.showModal({
            title: '提示',
            content: '提交成功，感谢您的反馈！',
            showCancel: false,
          })
					that.setData({
						canSubmit: 0,
						fb_chooseType: 0, // 反馈问题类型
						fb_contentVal: '', // 反馈问题内容
            fb_uploadImg: [], // 反馈问题图片
            fb_uploadImgHash: [], // 反馈问题图片hash值
					})
				},
				fail: r => {
					console.error('获取个人信息失败：', r);
				},
			});
		}
  },
	onLoad(options) {
		that = this;

    // 获取类型
    app.ajax({
      url: '/common/configs',
      data: {
        type: 0,
      },
      success: function (res) {
        that.setData({
          fb_type: res,
        })
      }
    })
	},
	onShareAppMessage() { },
})

