const md5 = require('../../utils/md5.js');

var app = getApp();
var appData = app.globalData;
var that;
Page({
	data: {
		showPass_development: true, // 是否显示出真正的密码框 [!! 开发模式专用，请勿擅自改动]
		model: '', // 功能 [set 设置交易密码] [edit 修改交易密码] [reset 重设交易密码]
		type: '', // 类型 [set-buyPass 设置交易密码] [set-buyPassConfirm 设置确认交易密码] [keyup-buyPassOld 输入旧交易密码] [keyup-phoneCode 输入手机验证码]
		title: '',
		info: '',
		imp: '',
		passFocus: false, // 密码框是否聚焦
		passConfirmFocus: false, // 重复密码框是否聚焦
		passOldFocus: false, // 旧密码框是否聚焦
		phoneCodeFocus: false, // 手机验证码框是否聚焦
		passVal: '', // 密码
		passConfirmVal: '', // 重复密码
		passOldVal: '', // 旧密码
		phoneCodeVal: '', // 手机验证码
		numberLength: 0, // 当前数值的长度
	},
	openPass(){ // 设置密码/验证码
		var type = that.data.type;
		if (type == 'set-buyPass') { // 设置交易密码
			that.setData({
				passFocus: true,
			})
		} else if (type == 'set-buyPassConfirm') { // 设置确认交易密码
			that.setData({
				passConfirmFocus: true,
			})
		} else if (type == 'keyup-buyPassOld') { // 输入旧交易密码
			that.setData({
				passOldFocus: true,
			})
		} else if (type == 'keyup-phoneCode') { // 输入手机验证码
			that.setData({
				phoneCodeFocus: true,
			})
		}
	},
	passInput(e) { // 输入密码
		var pass = e.detail.value.toString();
		that.setData({
			passVal: pass,
			numberLength: pass.length,
		})

		if (pass.length == 6) {
			// 检测密码强度
			if (that.checkIsSeriesNumber(pass)) { // 检测是否为连续数字/重复数字
				that.setData({
					imp: '您设定的交易密码过于简单，请重新输入',
					passVal: '',
					numberLength: 0,
					passFocus: true,
				})
			} else {
				that.setData({
					type: 'set-buyPassConfirm',
					title: '请再次确认交易密码',
					info: '',
					imp: '',
					numberLength: 0,
					passFocus: false,
					passConfirmFocus: true,
				})
			}
		}
	},
	passConfirmInput(e) { // 再次输入密码
		var model = that.data.model;
		var pass = e.detail.value.toString();
		that.setData({
			passConfirmVal: pass,
			numberLength: pass.length,
		})

		if (pass.length == 6) {
			if (pass != that.data.passVal){ // 检测再次重复密码是否一致
				wx.showToast({
					title: '两次密码不一致',
					image: '/images/sg_gth.png',
				})
				that.setData({
					type: 'set-buyPass',
					title: '请设置交易密码',
					info: '为了您的资金安全，请先设置交易密码',
					imp: '',
					passFocus: true,
					passConfirmFocus: false,
					passVal: '',
					passConfirmVal: '',
					numberLength: 0,
				})
			}else{
				that.setData({
					passConfirmFocus: false,
				})
				if (model=='set'){
          var passMd5 = md5.hexMD5(that.data.passVal)
          app.ajax({
            url: 'user/updatePayPwd',
            data: {
              payPwd: passMd5,
            },
            formPost: true,
            success: r => {
              // console.log(r);
              wx.showModal({
                title: '提示',
                content: '成功开通钱包',
                showCancel: false,
                success: r => {
                  app.openUrlCs('wallet/index');
                }
              })
            }
          })
				} else if (model == 'edit') {
					app.back();
				} else if (model == 'reset') {
					app.back();
				}
			}
		}
	},
	passOldInput(e) { // 输入旧密码
		var pass = e.detail.value.toString();
		that.setData({
			passOldVal: pass,
			numberLength: pass.length,
		})

		if (pass.length == 6) {
			if (pass != 123123) { // 检测旧密码是否正确
				that.setData({
					imp: '密码错误',
					passOldFocus: true,
					passOldVal: '',
					numberLength: 0,
				})
			} else {
				that.setData({
					passFocus: true,
					type: 'set-buyPass',
					title: '请输入新的交易密码',
					imp: '',
					numberLength: 0,
				})
			}
		}
	},
	phoneCodeInput(e) { // 输入手机验证码
		var code = e.detail.value.toString();
		that.setData({
			phoneCodeVal: code,
			numberLength: code.length,
		})

		if (code.length == 6) {
			if (code != 123123) { // 检测手机验证码是否正确
				that.setData({
					imp: '验证码错误',
					phoneCodeFocus: true,
					phoneCodeVal: '',
					numberLength: 0,
				})
			} else {
				that.setData({
					passFocus: true,
					type: 'set-buyPass',
					title: '请输入新的交易密码',
					imp: '',
					numberLength: 0,
				})
			}
		}
	},
	checkIsSeriesNumber(v) { // 检测是否为连续数字/重复数字
		var vSpi = v.toString().split('');
		var vDiff = Number(vSpi[1]) - Number(vSpi[0]); // 差值
		var checkNum = 0;
		for (let i = 2; i < vSpi.length; i++) {
			checkNum = vSpi[i-1];
			if (Number(vSpi[i]) - checkNum != vDiff){
				return false;
			}
		}
		return true;
	},
	onLoad(options) {
		that = this;

		if (options.type=='edit'){ // 修改交易密码
			that.setData({
				model: 'edit',
				passOldFocus: true,
				type: 'keyup-buyPassOld',
				title: '请输入当前交易密码',
			})
		}else if(options.type == 'reset'){ // 重设交易密码
			that.setData({
				model: 'reset',
				phoneCodeFocus: true,
				type: 'keyup-phoneCode',
				title: '请输入手机验证码',
				info: '短信接收默认为该小程序绑定的手机号',
			})
		}else{
			that.setData({
				model: 'set',
				passFocus: true,
				type: 'set-buyPass',
				title: '请设置交易密码',
				info: '为了您的资金安全，请先设置交易密码',
			})
		}
	},
	onShareAppMessage() { },
})