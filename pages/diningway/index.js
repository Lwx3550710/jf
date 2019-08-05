var app = getApp();
var appData = app.globalData;
var that;

Page({
	data: {
    wayList: [],
    choose_type: '',
    choose_img: '',
    wayImgUrl: '',
  },
  chooseWay(e) {
    var index = app.attr(e,'index');
    var wayList = that.data.wayList;
    // that.setData({
    //   choose_type: wayList[index].type,
    //   choose_img: wayList[index].img,
    // })
    app.getPage(-1).setData({
      orderWayType: wayList[index].type,
      orderWayImg: wayList[index].img,
    });
		app.back();
	},
	onLoad(options) {
		that = this;
    var wayList = appData.wayList;
    that.setData({
      wayImgUrl: appData.wayImgUrl,
      wayList: wayList,
      choose_type: (options.type||wayList[0].type),
      choose_img: (options.img ||wayList[0].img),
    })
	},
	onShareAppMessage() { },
})