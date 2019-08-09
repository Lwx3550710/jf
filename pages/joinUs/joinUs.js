var app = getApp();
var appData = app.globalData;
var that;
Page({
	data: {
    nameVal: '',
    phoneVal: '',
    yxVal: '',
    chooseTypeIndex: 0, // 选择的分类索引
    typeList: [], // 分类列表
  },
  nameInput(e) { // 输入姓名
    that.setData({
      nameVal: e.detail.value,
    })
  },
  phoneInput(e) { // 输入电话
    that.setData({
      phoneVal: e.detail.value,
    })
  },
  yxInput(e) { // 输入意向
    that.setData({
      yxVal: e.detail.value,
    })
  },
  chooseType(e){
    var index = app.attr(e,'index');
    that.setData({
      chooseTypeIndex: index,
    })
  },
  getTypeList(){ // 获取分类列表
    app.ajax({
      url: 'common/configs',
      data: {
        type: 3,
      },
      success:r=>{
        that.setData({
          typeList: r,
        })
      }
    })
  },
  formSubmit: function (e) {
    var nameVal = that.data.nameVal;
    var phoneVal = that.data.phoneVal;
    var yxVal = that.data.yxVal;
    var type = that.data.typeList[that.data.chooseTypeIndex].id;

    var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
    // var myreg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;  //判断是否是座机电话
    var isMobile = mobile.exec(phoneVal)
    if (!isMobile) {
      wx.showModal({
        title: '提示',
        content: '您输入的电话不符，请重新检查填写',
        showCancel: false,
      })
      return false;
    }

    app.ajax({
      url: 'common/join',
      formPost: true,
      data: {
        mobile: phoneVal,
        name: nameVal,
        area: yxVal,
        type: type,
      },
      success: r => {
        wx.showModal({
          title: '提示',
          content: '提交成功',
          showCancel: false,
        })
        that.setData({
          nameVal: '',
          phoneVal: '',
          yxVal: '',
          chooseTypeIndex: 0, // 选择的分类索引
        })
      }
    })
  },
	onLoad(options) {
		that = this;
    that.getTypeList();
	},
	onShareAppMessage() { },
})