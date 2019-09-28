var app = getApp();
var appData = app.globalData;
var that;

Page({
  data: {
    list: [
      { 'name': '交易记录', 'target': 'record', 'param': '' },
      // { 'name': '修改交易密码', 'target': 'setPass', 'param': 'type=edit' },
      // { 'name': '修改交易密码', 'target': 'setPass', 'param': '' },
      // { 'name': '重置交易密码', 'target': 'setPass', 'param': 'type=reset' },
      // { 'name': '重置交易密码', 'target': 'setPass', 'param': '' },
    ],
  },
  toPage(e){
    var target = app.attr(e, 'page');
    var param = app.attr(e,'param');
    if(target!=''){
      app.openUrl(target, param);
    }
  },
  invest(){
    app.openUrl('recharge/index');
  },
  onLoad: function (options) {
    that = this;
    that.getUserData();
  },
  getUserData() { // 获取用户信息
    app.ajax({
      url: 'user/getById',
      success: function (res) {
        console.log(res)
        that.setData({
          left_amount: res.leftAmount
        })
      },
    })
  },
  onShow: function () {
    that.getUserData();
  },
  onShareAppMessage: function () {}
})