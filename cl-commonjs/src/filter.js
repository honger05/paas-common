//document.domain = 'chenlaisoft.sz';
/**
 * Title: filter 过滤器
 * Author: honger.zheng
 * Date: 2015-01-22
 */
var $ = require('$'),
	Utils = require('common').utils,
    jslet = require('jslet-ui');


$(document).on('click',function(){top.globalModule && top.globalModule.hideContents && top.globalModule.hideContents();});

jslet.global.beforeSubmit = function(settings) {
	settings.headers = {authToken: Utils.getUser().sessionId}; 
	return settings;
}

jslet.global.defaultRecordClass = 'com.chenlai.cloud.paas.common.entity.DynamicEntity';
jslet.global.defaultFocusKeyCode = 13; //按回车键切换焦点
jslet.global.serverErrorHandler = function(errCode, errMsg) {
	console.log(errCode+"------"+errMsg);
	if(errCode === '6666'){
		if (top.relogin) {
			top.relogin();
		}
		return true;
	}
	return false;
};

document.onkeydown = Utils.forbidBackSpace;


