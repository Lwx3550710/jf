var app = getApp();
var appData = app.globalData;
var that;

Page({
  data: {
    list: [
      { 'name': '消费记录', 'target': 'record', 'param': '' },
      // { 'name': '修改交易密码', 'target': 'setPass', 'param': 'type=edit' },
      { 'name': '修改交易密码', 'target': 'setPass', 'param': '' },
      // { 'name': '重置交易密码', 'target': 'setPass', 'param': 'type=reset' },
      { 'name': '重置交易密码', 'target': 'setPass', 'param': '' },
    ],
  },
  toPage(e){
    var target = app.attr(e, 'page');
    var param = app.attr(e,'param');
    if(target!=''){
      app.openUrl(target, param);
    }
  },
  onLoad: function (options) {
    that = this;
  },
  onShow: function () {},
  onShareAppMessage: function () {}
})