var app = getApp();
var appData = app.globalData;
var that;
Page({
	data: {
		count: 0,
		list: [],
	},
	toRulePage: function(){
		// app.openUrl('article','id=5');
	},
	onLoad(options) {
		that = this;

    that.getRecordList();

		that.setData({
			count: 281,
			list: [
				{ title: '消费 24.00元', location: '深圳北站高铁GO店', date: '2019-03-21 17:42:33', score: 12 },
				{ title: '消费 24.00元', location: '天环PINK店', date: '2019-03-21 17:42:33', score: 0 },
				{ title: '消费 24.00元', location: '深圳北站高铁GO店', date: '2019-03-21 17:42:33', score: -12 },
				{ title: '消费 24.00元', location: '天环PINK店', date: '2019-03-21 17:42:33', score: 12 },
				{ title: '消费 24.00元', location: '深圳北站高铁GO店', date: '2019-03-21 17:42:33', score: 12 },
				{ title: '消费 24.00元', location: '天环PINK店', date: '2019-03-21 17:42:33', score: 12 },
				{ title: '消费 24.00元', location: '深圳北站高铁GO店', date: '2019-03-21 17:42:33', score: 12 },
				{ title: '消费 24.00元', location: '天环PINK店', date: '2019-03-21 17:42:33', score: 12 },
			],
		})
	},
  getRecordList(){
    app.ajax({
      url: 'user/items',
      success: function (res) {
        console.log(res)
        that.setData({
          list: res.list
        })
      },
    })
  },
	onShareAppMessage() { },
})