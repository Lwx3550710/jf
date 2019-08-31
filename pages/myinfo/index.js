var app = getApp();
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.getUserData();
  },
  onShow: function () {
    that.getUserData();
  },
  //监听文本输入
  inputNum: function (e) {
    return this.checkInputText(e.detail.value);
  },
  //检查输入文本，限制只能为数字并且数字最多带2位小数
  checkInputText: function (text) {
    var reg = /^(\.*)(\d+)(\.?)(\d{0,2}).*$/g;
    if (reg.test(text)) { //正则匹配通过，提取有效文本
      text = text.replace(reg, '$2$3$4');
    }
    else { //正则匹配不通过，直接清空
      text = '';
    }
    return text; //返回符合要求的文本（为数字且最多有带2位小数）
  },
  getUserData() { // 获取用户信息
    app.ajax({
      url: 'user/getById',
      success: function (res) {
        that.setData({
          headUrl: res.headUrl,
          nickname: res.nickname,
          mobile: res.mobile,
          sex: res.sex,
          birth: res.birth
        })
      },
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    that.setData({
      mobile: e.detail.value.mobile,
      sex: e.detail.value.sex,
      birth: e.detail.value.birth
    })
    wx.showModal({
      title: '提示',
      content: '确认保存？',
      success: function (res) {
        if (res.confirm) {
          app.ajax({
            url: 'user/updateUser',
            formPost: true,
            data:{
              userId: app.globalData.userid,
              mobile: that.data.mobile,
              sex: that.data.sex,
            },
            success: function (res) {
              console.log(res)
              wx.showToast({
                title: '保存成功！'
              })
            },
          })

          app.ajax({
            url: 'user/updateBirth',
            formPost: true,
            data: {
              userId: app.globalData.userid,
              birth: that.data.birth
            },
            success: function (res) {
              console.log(res)
            },
          })
        }
      }
    })
  },
})