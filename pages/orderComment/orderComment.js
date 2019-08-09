var app = getApp();
var appData = app.globalData;
var that;
Page({
  data: {
    orderId: '',
    star_all: 4,
    star_food: 4,
    star_bz: 4,
    starTxt: '',
    fb_contentVal: '', // 评论内容
    fb_uploadImg: [], //评论图片
    fb_uploadImgHash: [], //评论图片hash值
  },
  getStarTxt(num) {
    if(num==1){
      return '非常不满意';
    } else if (num == 2) {
      return '不满意';
    } else if (num == 3) {
      return '一般';
    } else if (num == 4) {
      return '满意';
    } else if (num == 5) {
      return '非常满意';
    } else {
      return '';
    }
  },
  chooseStar(e){
    var val = app.attr(e, 'val');
    var num = app.attr(e, 'num');
    that.setData({
      [val]: num,
      starTxt: that.getStarTxt(num),
    })
  },
  getImgFile() { // 选择图片
    var imgData = that.data.fb_uploadImg;
    var imgDataHash = that.data.fb_uploadImgHash;
    app.chooseImg(6 - imgData.length, true, (t, r) => {
      if (t == 'success') {
        r.forEach((v, i) => {
          imgData.push(appData.qiniu_imgServer + v.imageURL);
          imgDataHash.push(appData.qiniu_imgServer + v.hash);
        })
        that.setData({
          fb_uploadImg: imgData,
          fb_uploadImgHash: imgDataHash,
        });
      } else {
        console.log(r);
      }
    })
  },
  delUploadImg(e) { // 删除图片
    var imgData = that.data.fb_uploadImg;
    var imgDataHash = that.data.fb_uploadImgHash;
    var delIndex = app.attr(e, 'index');
    imgData.splice(delIndex, 1);
    imgDataHash.splice(delIndex, 1);
    that.setData({
      fb_uploadImg: imgData,
      fb_uploadImgHash: imgDataHash,
    })
  },
  showImg(e) { // 预览图片
    var imgData = that.data.fb_uploadImg;
    var showUrl = app.attr(e, 'url');
    wx.previewImage({
      urls: imgData,
      current: showUrl,
    });
  },
  descInput(e) { // 输入评论内容
    that.setData({
      fb_contentVal: e.detail.value,
    })
  },
  submitForm() { // 提交表单
    var data = that.data;
    if(data.fb_contentVal.length==0){
      wx.showModal({
        title: '提示',
        content: '请输入评价内容~',
        showCancel: false,
      })
      return false;
    }

    var s_arr = [];
    data.fb_uploadImg.forEach((b, a) => {
      s_arr.push(b.replace('/tmp/', ''));
    })
    var arr = data.fb_uploadImgHash.concat(s_arr);

    app.ajax({
      url: 'order/insertEval',
      formPost: true,
      data: {
        orderId: data.orderId,
        likeJson: '[]', // 食物评价列表json串
        // "likeJson": "[{\"orderInfoItemId\":11,\"type\":1},{\"orderInfoItemId\":12,\"type\":1},{\"orderInfoItemId\":13,\"type\":1}]"
        //orderInfoItemId 为每个orderInfoItem对象的中id
        //type:  0:赞；1：不喜欢
        totalStar: data.star_all, // 门店总体评价
        foodStar: data.star_food, // 食材评价
        packageStar: data.star_bz, // 包装评价
        content: data.fb_contentVal, // 评价
        fileUrls: arr.join('#'), // 图片集合；#隔开
        type: 0, // 评价方式 [0 不匿名] [1 匿名]
        deliveryStar: 2, //配送评价 [0 差] [1 一般] [2 很棒]
        deliveryConfigIds: 0, // 配送员评价类型；多个#隔开
        deliveryContent: '', // 配送员文字评价
      },
      success: r => {
        // console.log(r);
        wx.showModal({
          title: '提示',
          content: '评价成功！',
          showCancel: false,
          success: function(){
            app.back();
          }
        })
      },
      fail: r => {
        console.error('评价失败：', r);
      },
    });
  },
	onLoad(options) {
		that = this;
    that.setData({
      orderId: options.oid,
      starTxt: that.getStarTxt(that.data.star_all),
    })
	},
	onShareAppMessage() { },
})