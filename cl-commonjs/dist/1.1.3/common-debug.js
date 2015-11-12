define("cl-commonjs/dist/1.1.3/common-debug", ["$","emqttws","xlsx"], function(require, exports, module){
/**
 * Title: 公共模块的接口, 无任何依赖，可以被任何功能依赖
 * Author: honger.zheng
 * Date: 2015-01-16
 */
module.exports = {
		
	utils: require("cl-commonjs/dist/1.1.3/utils-debug"),
	
	drag: require("cl-commonjs/dist/1.1.3/drag-debug"),
	
	synchronizer: require("cl-commonjs/dist/1.1.3/synchronizer-debug"),
	
	client: require("cl-commonjs/dist/1.1.3/client-debug"),
	
	emqttd: require("cl-commonjs/dist/1.1.3/emqttd-debug"),
	
	ENI: require("cl-commonjs/dist/1.1.3/eni-debug")
	
}


});
define("cl-commonjs/dist/1.1.3/utils-debug", ["$"], function(require, exports, module){
/**
 * Title: 对$做语言特性扩展,定义系统共用的方法
 * Author: honger.zheng
 * Date: 2015-01-16
 */

var $ = require("$");
	
var Utils = {};

$.fn.extend({
    trim: function () { return $.trim(this.val()); },
    lTrim: function () { return this.val().replace(/^\s+/, ''); },
    rTrim: function () { return this.val().replace(/\s+$/, ''); },
    setDisabled: function (disabled) {return this.each(function () { $(this).attr('disabled', disabled).css('opacity', disabled ? 0.5 : 1.0); });},
    setReadOnly: function (readonly) {return this.each(function () { $(this).attr('readonly', readonly).css('opacity', readonly ? 0.5 : 1.0); });},
    setChecked: function (checked, value) {return this.each(function () { if (value == undefined) { $(this).attr('checked', checked); } else if ($(this).val() == value.toString()) { $(this).attr('checked', checked); } });},
    insertAtCaret: function(myValue){var $t=$(this)[0];if (document.selection) { this.focus();sel = document.selection.createRange();sel.text = myValue; this.focus();} else if ($t.selectionStart || $t.selectionStart == '0') { this.focus();var startPos = $t.selectionStart;var endPos = $t.selectionEnd; var scrollTop = $t.scrollTop;$t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length); $t.selectionStart = startPos + myValue.length;$t.selectionEnd = startPos + myValue.length;$t.scrollTop = scrollTop;} else { this.value += myValue; this.focus();} }, 
    showLoading: function(options){var indicatorID;var settings={'addClass':'','beforeShow':'','afterShow':'','hPos':'center','vPos':'center','indicatorZIndex':5001,'overlayZIndex':5000,'parent':'','marginTop':0,'marginLeft':0,'overlayWidth':null,'overlayHeight':null};$.extend(settings,options);var loadingDiv=$('<div></div>');var overlayDiv=$('<div></div>');if(settings.indicatorID){indicatorID=settings.indicatorID;}else{indicatorID=$(this).attr('id');}$(loadingDiv).attr('id','loading-indicator-'+indicatorID);$(loadingDiv).addClass('loading-indicator');if(settings.addClass){$(loadingDiv).addClass(settings.addClass);}$(overlayDiv).css('display','none');$(document.body).append(overlayDiv);$(overlayDiv).attr('id','loading-indicator-'+indicatorID+'-overlay');$(overlayDiv).addClass('loading-indicator-overlay');if(settings.addClass){$(overlayDiv).addClass(settings.addClass+'-overlay');}var overlay_width;var overlay_height;var border_top_width=$(this).css('border-top-width');var border_left_width=$(this).css('border-left-width');border_top_width=isNaN(parseInt(border_top_width))?0:border_top_width;border_left_width=isNaN(parseInt(border_left_width))?0:border_left_width;var overlay_left_pos=$(this).offset().left+parseInt(border_left_width);var overlay_top_pos=$(this).offset().top+parseInt(border_top_width);if(settings.overlayWidth!==null){overlay_width=settings.overlayWidth;}else{overlay_width=parseInt($(this).width())+parseInt($(this).css('padding-right'))+parseInt($(this).css('padding-left'));}if(settings.overlayHeight!==null){overlay_height=settings.overlayWidth;}else{overlay_height=parseInt($(this).height())+parseInt($(this).css('padding-top'))+parseInt($(this).css('padding-bottom'));}$(overlayDiv).css('width',overlay_width.toString()+'px');$(overlayDiv).css('height',overlay_height.toString()+'px');$(overlayDiv).css('left',overlay_left_pos.toString()+'px');$(overlayDiv).css('position','absolute');$(overlayDiv).css('top',overlay_top_pos.toString()+'px');$(overlayDiv).css('z-index',settings.overlayZIndex);if(settings.overlayCSS){$(overlayDiv).css(settings.overlayCSS);}$(loadingDiv).css('display','none');$(document.body).append(loadingDiv);$(loadingDiv).css('position','absolute');$(loadingDiv).css('z-index',settings.indicatorZIndex);var indicatorTop=overlay_top_pos;if(settings.marginTop){indicatorTop+=parseInt(settings.marginTop);}var indicatorLeft=overlay_left_pos;if(settings.marginLeft){indicatorLeft+=parseInt(settings.marginTop);}if(settings.hPos.toString().toLowerCase()=='center'){$(loadingDiv).css('left',(indicatorLeft+(($(overlayDiv).width()-parseInt($(loadingDiv).width()))/2)).toString()+'px');}else if(settings.hPos.toString().toLowerCase()=='left'){$(loadingDiv).css('left',(indicatorLeft+parseInt($(overlayDiv).css('margin-left'))).toString()+'px');}else if(settings.hPos.toString().toLowerCase()=='right'){$(loadingDiv).css('left',(indicatorLeft+($(overlayDiv).width()-parseInt($(loadingDiv).width()))).toString()+'px');}else{$(loadingDiv).css('left',(indicatorLeft+parseInt(settings.hPos)).toString()+'px');}if(settings.vPos.toString().toLowerCase()=='center'){$(loadingDiv).css('top',(indicatorTop+(($(overlayDiv).height()-parseInt($(loadingDiv).height()))/2)).toString()+'px');}else if(settings.vPos.toString().toLowerCase()=='top'){$(loadingDiv).css('top',indicatorTop.toString()+'px');}else if(settings.vPos.toString().toLowerCase()=='bottom'){$(loadingDiv).css('top',(indicatorTop+($(overlayDiv).height()-parseInt($(loadingDiv).height()))).toString()+'px');}else{$(loadingDiv).css('top',(indicatorTop+parseInt(settings.vPos)).toString()+'px');}if(settings.css){$(loadingDiv).css(settings.css);}var callback_options={'overlay':overlayDiv,'indicator':loadingDiv,'element':this};if(typeof(settings.beforeShow)=='function'){settings.beforeShow(callback_options);}$(overlayDiv).show();$(loadingDiv).show();if(typeof(settings.afterShow)=='function'){settings.afterShow(callback_options);}return this;},
    hideLoading: function(options){var settings={};$.extend(settings,options);if(settings.indicatorID){indicatorID=settings.indicatorID;} else{indicatorID=$(this).attr('id');}$(document.body).find('#loading-indicator-'+indicatorID).remove();$(document.body).find('#loading-indicator-'+indicatorID+'-overlay').remove();return this;}
});

$.extend(Utils, {
	
	getImageURL: function(user, targetName) {
		return user.ofsserver + '/load/file.do?fileName=' + targetName + '&authtoken=' + user.sessionId;
	},
	
	isEmptyObject: function(obj) {
		for (var i in obj) {
			return false;
		}
		return true;
	},
	
	getMenuId: function() {
		var activeItem = top.globalModule.tabNav.getActivedItem();
		var menuId = activeItem.get('id');
		return menuId;
	},
	
	setStorage: function(key, value, scope) {
		scope = scope ? localStorage : sessionStorage;
		value = value || {};
		scope.setItem('$' + key, Utils.stringifyJSON(value));
	},
	
	getStorage: function(key, scope) {
		scope = scope ? localStorage : sessionStorage;
		var valueString = scope.getItem('$' + key) || '{}';
		return $.parseJSON(valueString);
	},
	
	gotoLoginPage: function() {
		top.location.replace(Utils.basePath());
	},
	
	createCsvURL: function(dataString) {
		var blob = new Blob([dataString], { type: 'text/plain' });
	    var csvURL = URL.createObjectURL(blob); 
		return csvURL;
	}, 
	
    //触发eventMap内的事件
    fireEvent:function(eventMap){for(var i in eventMap){var arr=i.split(" "),ids = arr[0],eventName = arr[1],selector = arr[2] || null;(function(k){selector ? $(ids).on(eventName,selector,function(e){eventMap[k].call(this,e);}) : $(document).on(eventName,ids,function(e){eventMap[k].call(this,e);});})(i);}},
    
    //触发keyMap内的键盘事件
    fireKeyEvent: function(keyMap){
    	var _self = this;
    	
    	$(document).on('keyup',function(e){
    		e = window.event || e;
    		var keyCode = _self.getKeyCode(e);
    		var realKey = String.fromCharCode(keyCode);
    		console.log(keyCode +' ' +realKey);
    		for(i in keyMap){
    			if(keyCode == i){
    				e.keyCode = 0;
    				e.returnValue=false;        				
    				keyMap[i].call();
    			}
    		}
    	});
    	
    },
    
    //输入enter键  换焦点
    enterFocus: function($inp){
    	var _self = this;
    	$inp.first().focus();
        $inp.on('keyup', function (e) {
        	e = window.event || e;
    		var keyCode = _self.getKeyCode(e);
            if (keyCode == 13) {
                e.preventDefault();
                var nxtIdx = $inp.index(this) + 1;
                var $nxt = $inp.eq(nxtIdx);
                if(!$nxt.is('input')) $nxt = $nxt.find('input');
                $nxt.focus();
            }
        });
    },
    
    //获取url带的参数 例如 cc.html？a=1&b=2   request("a") //return 1
    request:function(strName){var strHref = window.document.location.href;var intPos = strHref.indexOf("?");var strRight = strHref.substr(intPos + 1);var arrTmp = strRight.split("&");for(var i = 0; i < arrTmp.length; i++){var arrTemp = arrTmp[i].split("=");if(arrTemp[0].toUpperCase() == strName.toUpperCase()) return arrTemp[1];}return ""; },
    
    //获取系统根路径
    baseUrl:function(){var curWwwPath=window.document.location.href;var pathName=window.document.location.pathname;var pos=curWwwPath.indexOf(pathName);var localhostPaht=curWwwPath.substring(0,pos);var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);return(localhostPaht+projectName); },
    
    //获取系统根站点
    basePath:function(){
    	var curWwwPath=window.document.location.href;
    	var pathName=window.document.location.pathname;
    	var pos=curWwwPath.indexOf(pathName);
    	var localhostPaht=curWwwPath.substring(0,pos + 1);
    	var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
    	return localhostPaht; 
    },

    //深度克隆对象或数组。 首先需要定义一个destination为空对象或空数组，然后再调用clone函数
    clone: function(destination,source){for(var p in source){if(getType(source[p])=="array"|| getType(source[p])=="object"){destination[p]=getType(source[p])=="array"?[]:{};arguments.callee(destination[p],source[p]);}else{destination[p]=source[p];}};function getType(o){var _t;return ((_t = typeof(o)) == "object" ? o==null && "null" || Object.prototype.toString.call(o).slice(8,-1):_t).toLowerCase();};},
    
    //对页面文字操作
    copyText: function(obj){ var str = Utils.IsElement(obj) ? obj.value : ($(obj).size() > 0 ? $(obj).val() : obj); if (window.clipboardData && clipboardData.setData && window.clipboardData.setData("Text", str)) { return true; } else { if (Utils.IsElement(obj)) o.select(); return false; } },
    addBookMark: function(url, title){ try { if (window.sidebar) { window.sidebar.addPanel(title, url, ''); } else if (Utils.IsIE) { window.external.AddFavorite(url, title); } else if (window.opera && window.print) { return true; } } catch (e) { alert("Your browser does not support it."); } },
    setHomePage: function(url){ try { document.body.style.behavior = 'url(#default#homepage)'; document.body.setHomePage(url); } catch (e) { if (window.netscape) { try { netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect"); } catch (e) { alert("Your browser does not support it."); } var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch); prefs.setCharPref('browser.startup.homepage', url); } } },

    // 获取 cookie
    getCookie: function(name){ 
    	var r = new RegExp('(^|;|\\s+)' + name + '=([^;]*)(;|$)'); 
    	var m = document.cookie.match(r); 
    	return (!m ? '' : decodeURIComponent(m[2])); 
    },
    
    // 设置 cookie
    setCookie: function(name, value, hours, domain, path){ 
    	var s = name + '=' + encodeURIComponent(value); 
    	if (!Utils.isUndefined(path)) s = s + '; path=' + path; 
    	if (hours > 0) { 
    		var d = new Date(); 
    		d.setHours(d.getHours() + hours); 
    		if (!Utils.isUndefined(domain)) 
    			s = s + '; domain=' + domain; 
    		s = s + '; expires=' + d.toGMTString();
    	} 
    	document.cookie = s; 
    },
    
    // 删除 cookie
    removeCookie: function(name, domain, path){ 
    	var s = name + '='; 
    	if (!Utils.isUndefined(domain)) 
    		s = s + '; domain=' + domain; 
    	if (!Utils.isUndefined(path)) 
    		s = s + '; path=' + path; s = s + '; expires=Fri, 02-Jan-1970 00:00:00 GMT'; 
    	document.cookie = s;
    },

    //判断js基本类型
    isUndefined: function(obj){ return typeof obj == 'undefined'; },
    isObject: function(obj){ return typeof obj == 'object'; },
    isNumber: function(obj){ return typeof obj == 'number'; },
    isString: function(obj){ return typeof obj == 'string'; },
    isElement: function(obj){ return obj && obj.nodeType == 1; },
    isFunction: function(obj){ return typeof obj == 'function'; },
    isArray: function(obj){ return Object.prototype.toString.call(obj) === '[object Array]'; },

    //通过正则表达式做一些常用的判断
    isInt: function(str){ return /^-?\d+$/.test(str); },
    isFloat: function(str){ return /^(-?\d+)(\.\d+)?$/.test(str); },
    isIntPositive: function(str){ return /^[0-9]*[1-9][0-9]*$/.test(str); },
    isFloatPositive: function(str){ return /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(str); },
    isLetter: function(str){ return /^[A-Za-z]+$/.test(str); },
    isChinese: function(str){ return /^[\u0391-\uFFE5]+$/.test(str); },
    isZipCode: function(str){ return /^[1-9]\d{5}$/.test(str); },
    isEmail: function(str){ return /^[A-Z_a-z0-9-\.]+@([A-Z_a-z0-9-]+\.)+[a-z0-9A-Z]{2,4}$/.test(str); },
    isMobile: function(str){ return /^((\(\d{2,3}\))|(\d{3}\-))?((1[35]\d{9})|(18[89]\d{8}))$/.test(str); },
    isUrl: function(str){ return /^(http:|ftp:)\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"])*$/.test(str); },
    isIpAddress: function(str){ return /^(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5])$/.test(str); },

    //对页面URL加密
    encode: function(str){ return encodeURIComponent(str); },
    decode: function(str){ return decodeURIComponent(str); },
    formatString: function(){ if (arguments.length == 0) return ''; if (arguments.length == 1) return arguments[0]; var args = Utils.CloneArray(arguments); args.splice(0, 1); return arguments[0].replace(/{(\d+)?}/g, function ($0, $1) { return args[parseInt($1)]; }); },
    escapeHtml: function(str){ return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); },
    unEscapeHtml: function(str){ return str.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&quot;/g, "\"").replace(/&amp;/g, "&"); },
    filterHtml: function(str){ str = str.replace(/\<(.*?)\>/g, '', str); str = str.replace(/\<\/(.*?)\>/g, '', str); return str; },
    
    parseURL: function(url) {
        var a =  document.createElement( 'a');
        a.href = url;
        return {
            source: url,
            protocol: a.protocol.replace( ':', ''),
            host: a.hostname,
            port: a.port,
            query: a.search,
            params: ( function(){
                var ret = {},
                    seg = a.search.replace( /^\?/, '').split( '&'),
                    len = seg.length, i = 0, s;
                for (;i<len;i++) {
                    if (!seg[i]) { continue; }
                    s = seg[i].split( '=');
                    ret[s[0]] = s[1];
                }
                return ret;
            })(),
            file: (a.pathname.match( /\/([^\/?#]+)$/i) || [, ''])[1],
            hash: a.hash.replace( '#', ''),
            path: a.pathname.replace( /^([^\/])/, '/$1'),
            relative: (a.href.match( /tps?:\/\/[^\/]+(.+)/) || [,''])[1],
            segments: a.pathname.replace( /^\//, '').split( '/')
        };
    },
    
    //关联键盘事件
    getKeyCode: function(e){ var evt = window.event || e; return evt.keyCode ? evt.keyCode : evt.which ? evt.which : evt.charCode; },
    enterSubmit: function(e, v){ var evt = window.event || e; if (this.getKeyCode(evt) == 13) { if (this.isFunction(v)) { v(); } else if (this.isString(v)) { $(v)[0].click(); } } },
    ctrlEnterSubmit: function(e, v){ var evt = window.event || e; if (evt.ctrlKey && this.getKeyCode(evt) == 13) { if (this.isFunction(v)) { v(); } else if (this.isString(v)) { $(v)[0].click(); } } },

    //将json对象解析为json格式的字符串
    stringifyJSON : function(data){var special = {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\'},escape = function(chr){ return special[chr] || '\\u' + ('0000' + chr.charCodeAt(0).toString(16)).slice(-4); }; if (window.JSON && window.JSON.stringify)return window.JSON.stringify(data);switch ($.type(data)){case 'string':return '"' + data.replace(/[\x00-\x1f\\"]/g, escape) + '"';case 'array':return '[' + $.map(data, $.stringifyJSON) + ']';case 'object':var string = [];$.each(data, function(key, val){var json = $.stringifyJSON(val);if (json)string.push($.stringifyJSON(key) + ':' + json);});return '{' + string + '}';case 'number':case 'boolean':return '' + data;case 'undefined':case 'null':return 'null';}return data;},
    
    //add sub mul div 两个浮点数的加减乘除
    accAdd: function(arg1,arg2){ 
    	var r1,r2,m; 
    	try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0} 
    	try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    	m=Math.pow(10,Math.max(r1,r2)); 
    	return ((arg1*m+arg2*m)/m).toFixed(2);
    },
    	
    accSub: function(arg1,arg2){
    	var r1,r2,m,n;
    	try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    	try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    	m=Math.pow(10,Math.max(r1,r2));
    	n=(r1>=r2)?r1:r2;
    	return ((arg1*m-arg2*m)/m).toFixed(n);
    },
    
    accMul: function(arg1,arg2){
    	var m=0,s1=arg1.toString(),s2=arg2.toString();
    	try{m+=s1.split(".")[1].length}catch(e){} 
    	try{m+=s2.split(".")[1].length}catch(e){} 
    	return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
    },
    
    accDiv: function(arg1,arg2){ 
    	var t1=0,t2=0,r1,r2; 
    	try{t1=arg1.toString().split(".")[1].length}catch(e){}
    	try{t2=arg2.toString().split(".")[1].length}catch(e){}
    	with(Math){ 
    		r1=Number(arg1.toString().replace(".",""));
    		r2=Number(arg2.toString().replace(".",""));
    		return (r1/r2)*pow(10,t2-t1);
    	} 
    },
    
    //系统统一调用的ajax方法:①若后台以@requestBody接受参数，请设置数据为  dataJson 而不是 data。 ②若需要检测是否登陆或登陆过期，请设置成功的方法为 successHandler 而不是 success。
    ajax: function (config) {
    	config.dataJson && $.extend(config,{contentType: 'application/json',data: this.stringifyJSON(config.dataJson)});
    	
    	config = $.extend({
			type: "POST",
			url: "",
			data: {},
			cache: false,
			success: function (data,textStatus,jqXHR) {
				//未登录 或 已过期
				if(data.errorCode === '6666'){
					if (top.relogin) {
						top.relogin();
					}
					return true;
				//正常请求
				}else{
					this.successHandler(data,textStatus,jqXHR);
				}
			},
			successHandler: function(data,textStatus,jqXHR){},
			error: function(jqXHR,textStatus,errorThrown){
				console.error("请求异常，请稍后重试！");
			}
    	}, config);
    	
    	config.headers = {authtoken: Utils.getUser().sessionId};
    	
    	$.ajax(config);
    },
    
    //检查画布是否超过最小高度
    checkLay: function(){
    	var h = $('body').height()+40;
    	if(h>904){
    		$(parent.document).find('.clui-page-wrapper').height(h+24);
    		$(parent.document).find('.tab-content-container').height(h);
    	}
    },
    
    //表格高度自适应
    autoPageSize: function(offsetH){
    	function auto(){
			var tabHeight = $(parent.document).find('#tabNav').height() - 100,h;
    		if(offsetH) {
    			h = tabHeight - offsetH;
    		}else{
    			h = tabHeight - $('.panel:first').height();
    		}
    		$('.result').height(h);
		}
    	auto();
		window.onresize = auto;
	},
	
	dataset2Array: function(dataset,wl){
		var arr = [];
		for(var i in dataset){
			var value = dataset[i];
			arr.push(Utils.toArray(value,wl))
		}			
		return arr;
	},
	
	toArray: function(value,wl){
		var temp = [];
		for(var k in wl){
			var pass = wl[k].fieldName;
			if(value[pass]){
				temp.push(value[pass])
			}else{
				temp.push('')
			}
		}
		return temp;
	},
	
	getDPI: function(){
	    var arrDPI = new Array;
	    if (window.screen.deviceXDPI) {
	        arrDPI[0] = window.screen.deviceXDPI;
	        arrDPI[1] = window.screen.deviceYDPI;
	    }else {
	        var tmpNode = document.createElement("DIV");
	        tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
	        document.body.appendChild(tmpNode);
	        arrDPI[0] = parseInt(tmpNode.offsetWidth);
	        arrDPI[1] = parseInt(tmpNode.offsetHeight);
	        tmpNode.parentNode.removeChild(tmpNode);    
	    }
	    return arrDPI;
	},
	
	//添加一个取余的方法
	mod : function(x,y){
		var result = x%y;
		return result <0 ? result * (-1) : result;
	},	
	
	/**
     * 字符串左侧填充0
     * 
     * @param 格式化的长度
     * @param 目标对象
     * @param 填充的对象
     */
    padLeft: function(length, targetStr, fillStr){
         return Array(length - targetStr.length + 1).join(fillStr || " ") + targetStr;
    },
    
    /**
     * 字符串右侧填充0
     * 
     * @param 格式化的长度
     * @param 目标对象
     * @param 填充的对象
     */
    padRight: function(length, targetStr, fillStr){
        return targetStr + Array(length - targetStr.length + 1).join(fillStr || " ");
    },
    
    formatNumber: function(num,pattern){  
	  var strarr = num?num.toString().split('.'):['0'];  
	  var fmtarr = pattern?pattern.split('.'):[''];  
	  var retstr='';  
	  // 整数部分  
	  var str = strarr[0];  
	  var fmt = fmtarr[0];  
	  var i = str.length-1;    
	  var comma = false;  
	  for(var f=fmt.length-1;f>=0;f--){  
	    switch(fmt.substr(f,1)){  
	      case '#':  
	        if(i>=0 ) retstr = str.substr(i--,1) + retstr;  
	        break;  
	      case '0':  
	        if(i>=0) retstr = str.substr(i--,1) + retstr;  
	        else retstr = '0' + retstr;  
	        break;  
	      case ',':  
	        comma = true;  
	        retstr=','+retstr;  
	        break;  
	    }  
	  }  
	  if(i>=0){  
	    if(comma){  
	      var l = str.length;  
	      for(;i>=0;i--){  
	        retstr = str.substr(i,1) + retstr;  
	        if(i>0 && ((l-i)%3)==0) retstr = ',' + retstr;   
	      }  
	    }  
	    else retstr = str.substr(0,i+1) + retstr;  
	  }  
	  retstr = retstr+'.';  
	  // 处理小数部分  
	  str=strarr.length>1?strarr[1]:'';  
	  fmt=fmtarr.length>1?fmtarr[1]:'';  
	  i=0;  
	  for(var f=0;f<fmt.length;f++){  
	    switch(fmt.substr(f,1)){  
	      case '#':  
	        if(i<str.length) retstr+=str.substr(i++,1);  
	        break;  
	      case '0':  
	        if(i<str.length) retstr+= str.substr(i++,1);  
	        else retstr+='0';  
	        break;  
	    }  
	  }  
	  return retstr.replace(/^,+/,'').replace(/\.$/,'');  
	},
	
	newDate: function(str) { 
		var fullStr = str.split(" ");
		var yStr = fullStr[0].split("-");
		var hStr = fullStr[1].split(":");
		str = str.split('-');
		var date = new Date();
		date.setFullYear(yStr[0], yStr[1] - 1, yStr[2]);
		date.setHours(hStr[0],hStr[1], hStr[2]);
		return date;
	},
	
	currying: function(fn) {
		var slice = Array.prototype.slice;
		var args = slice.call(arguments, 1);
		return function() {
			var innerArgs = slice.call(arguments);
			var finalArgs = args.concat(innerArgs);
			return fn.apply(null, finalArgs);
		}
	},
	
	forbidBackSpace: function(ev) {
	    ev = ev || window.event; 
	    var obj = ev.target || ev.srcElement;
	    var t = obj.type || obj.getAttribute('type'); 
	    var vReadOnly = obj.readOnly;
	    var vDisabled = obj.disabled;
	    vReadOnly = (vReadOnly == undefined) ? false : vReadOnly;
	    vDisabled = (vDisabled == undefined) ? true : vDisabled;
	    var flag1 = ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea") && (vReadOnly == true || vDisabled == true);
	    var flag2 = ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea";
	    if (flag2 || flag1) return false;
	}
	
}); 

$.extend(Utils, {
	getUser: Utils.currying(Utils.getStorage, 'user'),
	setUser: Utils.currying(Utils.setStorage, 'user')
});

return Utils;

});
define("cl-commonjs/dist/1.1.3/drag-debug", [], function(require, exports, module){

function Drag(titleBar, dragDiv, config){
	titleBar = common.getById(titleBar),
	dragDiv = common.getById(dragDiv);
	
	this.moveable = false;
	this.dragArea = {maxLeft: 0,maxTop: 0,maxRight: common.getViewportSize.w - dragDiv.offsetWidth, maxBottom: common.getViewportSize.h - dragDiv.offsetHeight};
	
	if (config.area) {
        if (config.area.left && !isNaN(parseInt(config.area.left))) { this.dragArea.maxLeft = config.area.left };
        if (config.area.right && !isNaN(parseInt(config.area.right))) { 
        	this.dragArea.maxRight = config.area.right;
        }
        if (config.area.top && !isNaN(parseInt(config.area.top))) { this.dragArea.maxTop = config.area.top };
        if (config.area.bottom && !isNaN(parseInt(config.area.bottom))) { 
        	this.dragArea.maxBottom = config.area.bottom;
        }
    }
	
	dragObj = this;
	titleBar.onmousedown = function(ev){
		dragObj.mouseOffsetX = common.getMousePos(ev).x - dragDiv.offsetLeft;
		dragObj.mouseOffsetY = common.getMousePos(ev).y - dragDiv.offsetTop;
		dragObj.moveable = true;
		
		document.onmousemove = function(ev){
			if(dragObj.moveable){
				var moveX = common.getMousePos(ev).x - dragObj.mouseOffsetX,
					moveY = common.getMousePos(ev).y - dragObj.mouseOffsetY; 
				
				moveX = Math.min(Math.max(dragObj.dragArea.maxLeft,moveX),dragObj.dragArea.maxRight);
				moveY = Math.min(Math.max(dragObj.dragArea.maxTop,moveY),dragObj.dragArea.maxBottom);
				
				dragDiv.style.left = moveX + 'px';
				dragDiv.style.top = moveY + 'px';
			}
		}
		
		document.onmouseup = function(ev){
			if(dragObj.moveable){
				dragObj.moveable = false;
    			if( typeof dragObj.ondrop === 'function'){
                    dragObj.ondrop.call(dragDiv);
                }
			}
		}
	}
}

var common = {
     getById: function(id) {
          return typeof id === "string" ? document.getElementById(id) : id
     },
     getByClass: function(sClass, oParent) {
          var aClass = [];
          var reClass = new RegExp("(^| )" + sClass + "( |$)");
          var aElem = this.byTagName("*", oParent);
          for (var i = 0; i < aElem.length; i++) reClass.test(aElem[i].className) && aClass.push(aElem[i]);
          return aClass
     },
     getByTagName: function(elem, obj) {
          return (obj || document).getElementsByTagName(elem)
     },
     getMousePos: function(ev) {
    	 ev = ev || window.event;
    	 if(ev.pageX || ev.pageY){
    		 return {
    			 x: ev.pageX,
    			 y: ev.pageY
    		 }
    	 }
    	 var doc =document.documentElement,body =document.body;
    	 return {
    		 x: ev.clientX+(doc &&doc.scrollLeft||body &&body.scrollLeft||0)-(doc &&doc.clientLeft||body &&body.clientLeft||0),
	    	 y: ev.clientY+(doc &&doc.scrollTop||body &&body.scrollTop||0)-(doc &&doc.clientTop||body &&body.clientTop||0)
    	 }
      },
      getViewportSize: { 
    	  w: (window.innerWidth) ? window.innerWidth : (document.documentElement && document.documentElement.clientWidth) ? document.documentElement.clientWidth : document.body.offsetWidth, 
    	  h: (window.innerHeight) ? window.innerHeight : (document.documentElement && document.documentElement.clientHeight) ? document.documentElement.clientHeight : document.body.offsetHeight 
      }

}

module.exports = Drag;


});
define("cl-commonjs/dist/1.1.3/synchronizer-debug", [], function(require, exports, module){
/**
 * Title: 异步调用的同步器，用于协调各个异步调用的同步，某些异步都要完成后才能执行下一步动作
 * 
 * Author: Tony.Tong
 * Date: 2015-01-27
 */

/**
 * Synchronizer类,usage:
 * 
 * synchronizer = new Synchronizer(2); //有两项任务需要执行
 * synchronizer.done(function(){ 
 * 		这里为两项任务执行后，需要的操作
 *  });
 * 
 * 在具体异步任务的onsuccess或者always方法中，加入代码：
 * synchronizer.endTask();
 * 
 * @param taskCount {Integer} 任务的个数
 */
var Synchronizer = function(taskCount) {
	var isValid = false;
	if(taskCount) {
		taskCount = parseInt(taskCount);
		if(!isNaN(taskCount) && taskCount > 0) {
			isValid = true;
		}
	}
	if(!isValid) {
		throw new Error('taskCount必须为大于0的整数！')
	}
	this._taskCount = taskCount;
	this._doneFn = null;
};

Synchronizer.prototype = {
	/**
	 * 具体异步任务完成时，调用此方法，一般加入到onsuccess或者always方法中
	 */
	endTask: function() {
		this._taskCount--;
		if(this._taskCount === 0 && this._doneFn) {
			this._doneFn();
		}
	},
	
	/**
	 * 用于注册所有任务完成时调用的方法
	 * 
	 * @param doneFn {Function} 所有任务完成时调用的方法
	 */
	done: function(doneFn) {
		if(doneFn === null || typeof doneFn !== "function") {
			throw new Error('doneFn 必须有值且为function!');
		}
		this._doneFn = doneFn;
	}
}
return Synchronizer;

});
define("cl-commonjs/dist/1.1.3/client-debug", [], function(require, exports, module){
/**
 * @desc: 以下代码用来检测呈现引擎、平台、Window操作系统、移动设备和游戏系统。
 * @require: 原生JS，不依赖任何框架或者库。
 * */
;(function (factory) {

    if (typeof define === 'function' && define.cmd) {
        // CMD 支持
//        define(function(){
    	module.exports = factory();
//        });
    } else if (typeof exports === 'object') {
        // Node/CommonJS 支持
        module.exports = factory;
    } else {
        // 浏览器支持
        window.client = factory();
        //console.log(factory);
    }
}(function () {
    return function () {

        //呈现引擎
        var engine = {
            ie: 0,
            gecko: 0,
            webkit: 0,
            khtml: 0,
            opera: 0,

            //完整的版本号
            ver: null
        };

        //浏览器
        var browser = {

            //常见浏览器
            ie: 0,
            firefox: 0,
            safari: 0,
            konq: 0,
            opera: 0,
            chrome: 0,

            //具体的版本号
            ver: null
        };


        //平台、设备和操作系统
        var system = {
            win: false,
            mac: false,
            x11: false,

            //移动设备
            iphone: false,
            ipod: false,
            ipad: false,
            ios: false,
            android: false,
            nokiaN: false,
            winMobile: false,

            //游戏系统
            wii: false,
            ps: false
        };

        //检测呈现引擎和浏览器
        var ua = navigator.userAgent;
        if (window.opera) {
            engine.ver = browser.ver = window.opera.version();
            engine.opera = browser.opera = parseFloat(engine.ver);
        } else if (/AppleWebKit\/(\S+)/.test(ua)) {
            engine.ver = RegExp["$1"];
            engine.webkit = parseFloat(engine.ver);

            //确定是Chrome还是Safari
            if (/Chrome\/(\S+)/.test(ua)) {
                browser.ver = RegExp["$1"];
                browser.chrome = parseFloat(browser.ver);
            } else if (/Version\/(\S+)/.test(ua)) {
                browser.ver = RegExp["$1"];
                browser.safari = parseFloat(browser.ver);
            } else {
                //近似地确定版本号
                var safariVersion = 1;
                if (engine.webkit < 100) {
                    safariVersion = 1;
                } else if (engine.webkit < 312) {
                    safariVersion = 1.2;
                } else if (engine.webkit < 412) {
                    safariVersion = 1.3;
                } else {
                    safariVersion = 2;
                }

                browser.safari = browser.ver = safariVersion;
            }
        } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
            engine.ver = browser.ver = RegExp["$1"];
            engine.khtml = browser.konq = parseFloat(engine.ver);
        } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
            engine.ver = RegExp["$1"];
            engine.gecko = parseFloat(engine.ver);

            //确定是不是Firefox
            if (/Firefox\/(\S+)/.test(ua)) {
                browser.ver = RegExp["$1"];
                browser.firefox = parseFloat(browser.ver);
            }
        } else if (/MSIE ([^;]+)/.test(ua)) {
            engine.ver = browser.ver = RegExp["$1"];
            engine.ie = browser.ie = parseFloat(engine.ver);
        }

        //确定浏览器
        browser.ie = engine.ie;
        browser.opera = engine.opera;


        //检测平台
        var p = navigator.platform;
        system.win = p.indexOf("Win") == 0;
        system.mac = p.indexOf("Mac") == 0;
        system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);

        //检测Windows操作系统
        if (system.win) {
            if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
                if (RegExp["$1"] == "NT") {
                    switch (RegExp["$2"]) {
                        case "5.0":
                            system.win = "2000";
                            break;
                        case "5.1":
                            system.win = "XP";
                            break;
                        case "6.0":
                            system.win = "Vista";
                            break;
                        case "6.1":
                            system.win = "7";
                            break;
                        default:
                            system.win = "NT";
                            break;
                    }
                } else if (RegExp["$1"] == "9x") {
                    system.win = "ME";
                } else {
                    system.win = RegExp["$1"];
                }
            }
        }

        //移动设备
        system.iphone = ua.indexOf("iPhone") > -1;
        system.ipod = ua.indexOf("iPod") > -1;
        system.ipad = ua.indexOf("iPad") > -1;
        system.nokiaN = ua.indexOf("NokiaN") > -1;

        //windows 移动设备
        if (system.win == "CE") {
            system.winMobile = system.win;
        } else if (system.win == "Ph") {
            if (/Windows Phone OS (\d+.\d+)/.test(ua)) {
                system.win = "Phone";
                system.winMobile = parseFloat(RegExp["$1"]);
            }
        }


        //检测IOS版本
        if (system.mac && ua.indexOf("Mobile") > -1) {
            if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)) {
                system.ios = parseFloat(RegExp.$1.replace("_", "."));
            } else {
                system.ios = 2;  //不能真正测出来，所以只能猜测
            }
        }

        //检测Android版本
        if (/Android (\d+\.\d+)/.test(ua)) {
            system.android = parseFloat(RegExp.$1);
        }

        //游戏系统
        system.wii = ua.indexOf("Wii") > -1;
        system.ps = /playstation/i.test(ua);

        //返回测试信息
        return {
            engine: engine,
            browser: browser,
            system: system
        };

    }();
}));
});
define("cl-commonjs/dist/1.1.3/emqttd-debug", ["emqttws"], function(require, exports, module){

var Paho = require("emqttws");

function Emqttd() {
	this.client = null;
	this.onConnected = null;
}

// called when the client connects
function onConnect(context) {
  // Once a connection has been made, make a subscription and send a message.
  console.log("Client Connected");
  this.onConnected && this.onConnected(context);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("Connection Lost: "+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  console.log('Message Recieved: Topic: ', message.destinationName, '. Payload: ', message.payloadString, '. QoS: ', message.qos);
  this.onMsgArrived && this.onMsgArrived(message.payloadString);
}

Emqttd.prototype.connect = function(hostname, port, clientId) {
    console.info('Connecting to Server: Hostname: ', hostname, '. Port: ', port, '. Client ID: ', clientId);
    this.client = new Paho.MQTT.Client(hostname, Number(port), clientId);
    
    // set callback handlers
    this.client.onConnectionLost = onConnectionLost;
    this.client.onMessageArrived = onMessageArrived.bind(this);

    // connect the client
    this.client.connect({
    	onSuccess: onConnect.bind(this),
    	cleanSession: false,
        invocationContext: {host : hostname, port: port, clientId: clientId}
    });
}

Emqttd.prototype.disconnect = function() {
    console.info('Disconnecting from Server');
    this.client.disconnect();
}


Emqttd.prototype.publish = function(topic, qos, message) {
    console.info('Publishing Message: Topic: ', topic, '. QoS: ' + qos + '. Message: ', message);
    message = new Paho.MQTT.Message(message);
    message.destinationName = topic;
    message.qos = Number(qos);
    this.client.send(message);
}


Emqttd.prototype.subscribe = function(topic, qos) {
    console.info('Subscribing to: Topic: ', topic, '. QoS: ', qos);
    this.client.subscribe(topic, {qos: Number(qos)});
}

Emqttd.prototype.unsubscribe = function(topic) {
    console.info('Unsubscribing from ', topic);
    this.client.unsubscribe(topic, {
         onSuccess: unsubscribeSuccess,
         onFailure: unsubscribeFailure,
         invocationContext: {topic : topic}
    });
}


function unsubscribeSuccess(context){
    console.info('Successfully unsubscribed from ', context.invocationContext.topic);
}

function unsubscribeFailure(context){
    console.info('Failed to  unsubscribe from ', context.invocationContext.topic);
}

module.exports = new Emqttd();


});
define("cl-commonjs/dist/1.1.3/eni-debug", ["xlsx","$"], function(require, exports, module){
/**
 * export and import (eni)
 */
var xlsx = require("xlsx");
var CSV = require("cl-commonjs/dist/1.1.3/csv-debug");
var $ = require("$");
var filesaver = require("cl-commonjs/dist/1.1.3/filesaver-debug");

var ENI = (function() {
	function ENI(config) {
		this.config = $.extend({
			pickfiles: 'pickfiles'
		}, config);
	}
	
	ENI.prototype.import = function() {
		$('#' + this.config.pickfiles).on('click', handleClick.bind(this));
	}
	
	ENI.prototype.exports = function(data, fileName) {
		var ws_data = CSV.parse(data);
		var ws_name = "SheetJS";
		var wb = new Workbook(), ws = sheet_from_array_of_arrays(ws_data);
		wb.SheetNames.push(ws_name);
		wb.Sheets[ws_name] = ws;
		var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
		filesaver(new Blob([s2ab(wbout)], {type:"application/octet-stream"}), fileName);
	}
	
	ENI.prototype._handleChange = function(e) {
		var files = e.target.files;
		readFiles.call(this, files);
	}
	
	ENI.prototype.onImport = function(output) {
		console.log(output);
	}
	
	return ENI;
})();

ENI.import = function(cb) {
	var eni = new ENI();
	eni.onImport = cb;
	eni.import();
};

ENI.exports = function(data, fileName) {
	new ENI().exports(data, fileName);
}

function s2ab(s) {
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
}

function Workbook() {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}

function get_header_row(sheet) {
    var headers = [];
    if (!sheet['!ref']) return;
    var range = XLSX.utils.decode_range(sheet['!ref']);
    var C, R = range.s.r; /* start in the first row */
    /* walk every column in the range */
    for(C = range.s.c; C <= range.e.c; ++C) {
        var cell = sheet[XLSX.utils.encode_cell({c:C, r:R})] /* find the cell in the first row */

        var hdr = "UNKNOWN " + C; // <-- replace with your desired default 
        if(cell && cell.t) hdr = XLSX.utils.format_cell(cell);

        headers.push(hdr);
    }
    return headers;
}

function sheet_from_array_of_arrays(data, opts) {
	var ws = {};
	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
	for(var R = 0; R != data.length; ++R) {
		for(var C = 0; C != data[R].length; ++C) {
			if(range.s.r > R) range.s.r = R;
			if(range.s.c > C) range.s.c = C;
			if(range.e.r < R) range.e.r = R;
			if(range.e.c < C) range.e.c = C;
			var cell = {v: data[R][C] };
			if(cell.v == null) continue;
			var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
			
			if(typeof cell.v === 'number') cell.t = 'n';
			else if(typeof cell.v === 'boolean') cell.t = 'b';
			else if(cell.v instanceof Date) {
				cell.t = 'n'; cell.z = XLSX.SSF._table[14];
				cell.v = datenum(cell.v);
			}
			else cell.t = 's';
			
			ws[cell_ref] = cell;
		}
	}
	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
	return ws;
}

function readFiles(files) {
	var that = this;
    var i, f, len;
    var reader = new FileReader();
    for (i = 0, len = files.length; i < len; ++i) {
  	    f = files[i];
		var name = f.name;
		var suffix = name.substring(name.lastIndexOf('.') + 1);
		reader.onload = function(e) {
			var data = e.target.result;
			switch(suffix){
				case 'csv':
					handleCSV(data, that);
					break;
				default:
					var workbook = XLSX.read(data, {type: 'binary'});
					handleWorkbook(workbook, that);
					break;
			}
		};
		reader.readAsBinaryString(f);
	}
}

function handleWorkbook(workbook, that) {
	var output = to_json(workbook);
	that.onImport(output);
}

function to_json(workbook) {
	var result = {};
	workbook.SheetNames.forEach(function(sheetName, index) {
		var sheet = workbook.Sheets[sheetName];
		var header = get_header_row(sheet);
		var roa = XLSX.utils.sheet_to_row_object_array(sheet);
		if (roa.length > 0) {
			result[index] = roa;
			result[index + '_header'] = header;
		}
	});
	return result;
}

function handleCSV(data, that) {
	var output = CSV.parse(data);
	that.onImport(output);
}

function handleClick() {
	this._inputFile = $('<input type="file">')
	.on('change', this._handleChange.bind(this));
	this._inputFile.click();
}

module.exports = ENI;

});
define("cl-commonjs/dist/1.1.3/csv-debug", [], function(require, exports, module){
(function(root, factory) {
  if (typeof define === "function" && define.cmd) {
//    define([], factory);
	  module.exports = factory();
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.CSV = factory();
  }
}(this, function() {
  'use strict';

  var ESCAPE_DELIMITERS = ['|', '^'],
      CELL_DELIMITERS = [',', ';', '\t', '|', '^'],
      LINE_DELIMITERS = ['\r\n', '\r', '\n'];

  function isObject(object) {
    var type = typeof object;
    return type === 'function' || type === 'object' && !!object;
  }
  var isArray = Array.isArray || function(object) {
    return toString.call(object) === '[object Array]';
  }
  function isString(object) {
    return typeof object === 'string';
  }
  function isNumber(object) {
    return !isNaN(Number(object));
  }
  function isBoolean(value) {
    return value == false || value == true;
  }
  function isNull(value) {
    return value == null;
  }
  function isPresent(value) {
    return value != null;
  }

  function fallback(value, fallback) {
    return isPresent(value) ? value : fallback;
  }

  function forEach(collection, iterator) {
    for (var _i = 0, _len = collection.length; _i < _len; _i += 1) {
      if (iterator(collection[_i], _i) === false) break;
    }
  }

  function sanitizeString(string) {
    return string.replace(/"/g,'\\"');
  }

  function buildCell(index) {
    return 'attrs[' + index + ']';
  }

  function castCell(value, index) {
    if (isNumber(value)) {
      return 'Number(' + buildCell(index) + ')';
    } else if (isBoolean(value)) {
      return 'Boolean(' + buildCell(index) + ' == true)';
    } else {
      return 'String(' + buildCell(index) + ')';
    }
  }

  function buildConstructor(deserialize, cast, values, attrs) {
    var definition = [];
    if (arguments.length == 3) {
      if (cast) {
        if (isArray(cast)) {
          forEach(values, function(value, index) {
            if (isString(cast[index])) {
              cast[index] = cast[index].toLowerCase();
            } else {
              deserialize[cast[index]] = cast[index];
            }
            definition.push('deserialize[cast[' + index + ']](' + buildCell(index) + ')');
          });
        } else {
          forEach(values, function(value, index) {
            definition.push(castCell(value, index));
          });
        }
      } else {
        forEach(values, function(value, index) {
          definition.push(buildCell(index));
        });
      }
      definition = 'return [' + definition.join(',') + ']';
    } else {
      if (cast) {
        if (isArray(cast)) {
          forEach(values, function(value, index) {
            if (isString(cast[index])) {
              cast[index] = cast[index].toLowerCase();
            } else {
              deserialize[cast[index]] = cast[index];
            }
            definition.push('"' + sanitizeString(attrs[index]) + '": deserialize[cast[' + index + ']](' + buildCell(index) + ')');
          });
        } else {
          forEach(values, function(value, index) {
            definition.push('"' + sanitizeString(attrs[index]) + '": ' + castCell(value, index));
          });
        }
      } else {
        forEach(values, function(value, index) {
          definition.push('"' + sanitizeString(attrs[index]) + '": ' + buildCell(index));
        });
      }
      definition = 'return {' + definition.join(',') + '}';
    }
    return new Function('attrs', 'deserialize', 'cast', definition);
  }

  function detectDelimiter(string, delimiters) {
    var count = 0,
        detected;

    forEach(delimiters, function(delimiter) {
      var needle = delimiter,
          matches;
      if (ESCAPE_DELIMITERS.indexOf(delimiter) != -1) {
        needle = '\\' + needle;
      }
      matches = string.match(new RegExp(needle, 'g'));
      if (matches && matches.length > count) {
        count = matches.length;
        detected = delimiter;
      }
    });
    return (detected || delimiters[0]);
  }

  var CSV = (function() {
    function CSV(data, options) {
      if (!options) options = {};

      if (isArray(data)) {
        this.mode = 'encode';
      } else if (isString(data)) {
        this.mode = 'parse';
      } else {
        throw new Error("Incompatible format!");
      }

      this.data = data;

      this.options = {
        header: fallback(options.header, false),
        cast: fallback(options.cast, true)
      }

      var lineDelimiter = options.lineDelimiter || options.line,
          cellDelimiter = options.cellDelimiter || options.delimiter;

      if (this.isParser()) {
        this.options.lineDelimiter = lineDelimiter || detectDelimiter(this.data, LINE_DELIMITERS);
        this.options.cellDelimiter = cellDelimiter || detectDelimiter(this.data, CELL_DELIMITERS);
        this.data = normalizeCSV(this.data, this.options.lineDelimiter);
      } else if (this.isEncoder()) {
        this.options.lineDelimiter = lineDelimiter || '\r\n';
        this.options.cellDelimiter = cellDelimiter || ',';
      }
    }

    function invoke(method, constructor, attributes, deserialize, cast) {
      method(new constructor(attributes, deserialize, cast));
    }

    function normalizeCSV(text, lineDelimiter) {
      if (text.slice(-lineDelimiter.length) != lineDelimiter) text += lineDelimiter;
      return text;
    }

    CSV.prototype.set = function(setting, value) {
      return this.options[setting] = value;
    }

    CSV.prototype.isParser = function() {
      return this.mode == 'parse';
    }

    CSV.prototype.isEncoder = function() {
      return this.mode == 'encode';
    }

    CSV.prototype.parse = function(callback) {
      if (this.mode != 'parse') return;

      if (this.data.trim().length === 0) return [];

      var data = this.data,
          options = this.options,
          header = options.header,
          current = { cell: '', line: [] },
          deserialize = this.deserialize,
          flag, record, response;

      if (!callback) {
        response = [];
        callback = function(record) {
          response.push(record);
        }
      }

      function resetFlags() {
        flag = { escaped: false, quote: false, cell: true };
      }
      function resetCell() {
        current.cell = '';
      }
      function resetLine() {
        current.line = [];
      }

      function saveCell(cell) {
        current.line.push(flag.escaped ? cell.slice(1, -1).replace(/""/g, '"') : cell);
        resetCell();
        resetFlags();
      }
      function saveLastCell(cell) {
        saveCell(cell.slice(0, 1 - options.lineDelimiter.length));
      }
      function saveLine() {
        if (header) {
          if (isArray(header)) {
            record = buildConstructor(deserialize, options.cast, current.line, header);
            saveLine = function() { invoke(callback, record, current.line, deserialize, options.cast); };
            saveLine();
          } else {
            header = current.line;
          }
        } else {
          if (!record) {
            record = buildConstructor(deserialize, options.cast, current.line);
          }
          saveLine = function() { invoke(callback, record, current.line, deserialize, options.cast); };
          saveLine();
        }
      }

      if (options.lineDelimiter.length == 1) saveLastCell = saveCell;

      var dataLength = data.length,
          cellDelimiter = options.cellDelimiter.charCodeAt(0),
          lineDelimiter = options.lineDelimiter.charCodeAt(options.lineDelimiter.length - 1),
          _i, _c, _ch;

      resetFlags();

      for (_i = 0, _c = 0; _i < dataLength; _i++) {
        _ch = data.charCodeAt(_i);

        if (flag.cell) {
          flag.cell = false;
          if (_ch == 34) {
            flag.escaped = true;
            continue;
          }
        }

        if (flag.escaped && _ch == 34) {
          flag.quote = !flag.quote;
          continue;
        }

        if ((flag.escaped && flag.quote) || !flag.escaped) {
          if (_ch == cellDelimiter) {
            saveCell(current.cell + data.slice(_c, _i));
            _c = _i + 1;
          } else if (_ch == lineDelimiter) {
            saveLastCell(current.cell + data.slice(_c, _i));
            _c = _i + 1;
            saveLine();
            resetLine();
          }
        }
      }

      if (response) {
        return response;
      } else {
        return this;
      }
    }

    function serializeType(object) {
      if (isArray(object)) {
        return 'array';
      } else if (isObject(object)) {
        return 'object';
      } else if (isString(object)) {
        return 'string';
      } else if (isNull(object)) {
        return 'null';
      } else {
        return 'primitive';
      }
    }

    CSV.prototype.deserialize = {
      "string": function(string) {
        return String(string);
      },
      "number": function(number) {
        return Number(number);
      },
      "boolean": function(b) {
        return Boolean(b);
      }
    }

    CSV.prototype.serialize = {
      "object": function(object) {
        var that = this,
            attributes = Object.keys(object),
            serialized = Array(attributes.length);
        forEach(attributes, function(attr, index) {
          serialized[index] = that[serializeType(object[attr])](object[attr]);
        });
        return serialized;
      },
      "array": function(array) {
        var that = this,
            serialized = Array(array.length);
        forEach(array, function(value, index) {
          serialized[index] = that[serializeType(value)](value);
        });
        return serialized;
      },
      "string": function(string) {
        return '"' + String(string).replace(/"/g, '""') + '"';
      },
      "null": function(value) {
        return '';
      },
      "primitive": function(value) {
        return value;
      }
    }

    CSV.prototype.encode = function(callback) {
      if (this.mode != 'encode') return;

      if (this.data.length == 0) return '';

      var data = this.data,
          options = this.options,
          header = options.header,
          sample = data[0],
          serialize = this.serialize,
          offset = 0,
          attributes, response;

      if (!callback) {
        response = Array(data.length);
        callback = function(record, index) {
          response[index + offset] = record;
        }
      }

      function serializeLine(record) {
        return record.join(options.cellDelimiter);
      }

      if (header) {
        if (!isArray(header)) {
          attributes = Object.keys(sample);
          header = attributes;
        }
        callback(serializeLine(serialize.array(header)), 0);
        offset = 1;
      }

      var recordType = serializeType(sample),
          map;

      if (recordType == 'array') {
        if (isArray(options.cast)) {
          map = Array(options.cast.length);
          forEach(options.cast, function(type, index) {
            if (isString(type)) {
              map[index] = type.toLowerCase();
            } else {
              map[index] = type;
              serialize[type] = type;
            }
          });
        } else {
          map = Array(sample.length);
          forEach(sample, function(value, index) {
            map[index] = serializeType(value);
          });
        }
        forEach(data, function(record, recordIndex) {
          var serializedRecord = Array(map.length);
          forEach(record, function(value, valueIndex) {
            serializedRecord[valueIndex] = serialize[map[valueIndex]](value);
          });
          callback(serializeLine(serializedRecord), recordIndex);
        });
      } else if (recordType == 'object') {
        attributes = Object.keys(sample);
        if (isArray(options.cast)) {
          map = Array(options.cast.length);
          forEach(options.cast, function(type, index) {
            if (isString(type)) {
              map[index] = type.toLowerCase();
            } else {
              map[index] = type;
              serialize[type] = type;
            }
          });
        } else {
          map = Array(attributes.length);
          forEach(attributes, function(attr, index) {
            map[index] = serializeType(sample[attr]);
          });
        }
        forEach(data, function(record, recordIndex) {
          var serializedRecord = Array(attributes.length);
          forEach(attributes, function(attr, attrIndex) {
            serializedRecord[attrIndex] = serialize[map[attrIndex]](record[attr]);
          });
          callback(serializeLine(serializedRecord), recordIndex);
        });
      }

      if (response) {
        return response.join(options.lineDelimiter);
      } else {
        return this;
      }
    }

    CSV.prototype.forEach = function(callback) {
      return this[this.mode](callback);
    }

    return CSV;
  })();

  CSV.parse = function(data, options) {
    return new CSV(data, options).parse();
  }

  CSV.encode = function(data, options) {
    return new CSV(data, options).encode();
  }

  CSV.forEach = function(data, options, callback) {
    if (arguments.length == 2) {
      callback = options;
    }
    return new CSV(data, options).forEach(callback);
  }

  return CSV;
}));

});
define("cl-commonjs/dist/1.1.3/filesaver-debug", [], function(require, exports, module){
/*! FileSaver.js
 *  A saveAs() FileSaver implementation.
 *  2014-01-24
 *
 *  By Eli Grey, http://eligrey.com
 *  License: X11/MIT
 *    See LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs
  // IE 10+ (native saveAs)
  || (typeof navigator !== "undefined" &&
      navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator))
  // Everyone else
  || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof navigator !== "undefined" &&
	    /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var doc = view.document
		  // only get URL when necessary in case BlobBuilder.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, URL = view.URL || view.webkitURL || view
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = !view.externalHost && "download" in save_link
		, click = function(node) {
			var event = doc.createEvent("MouseEvents");
			event.initMouseEvent(
				"click", true, false, view, 0, 0, 0, 0, 0
				, false, false, false, false, 0, null
			);
			node.dispatchEvent(event);
		}
		, webkit_req_fs = view.webkitRequestFileSystem
		, req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		, fs_min_size = 0
		, deletion_queue = []
		, process_deletion_queue = function() {
			var i = deletion_queue.length;
			while (i--) {
				var file = deletion_queue[i];
				if (typeof file === "string") { // file is an object URL
					URL.revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			}
			deletion_queue.length = 0; // clear queue
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, FileSaver = function(blob, name) {
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, blob_changed = false
				, object_url
				, target_view
				, get_object_url = function() {
					var object_url = get_URL().createObjectURL(blob);
					deletion_queue.push(object_url);
					return object_url;
				}
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					// don't create more object URLs than needed
					if (blob_changed || !object_url) {
						object_url = get_object_url(blob);
					}
					if (target_view) {
						target_view.location.href = object_url;
					} else {
						window.open(object_url, "_blank");
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
				}
				, abortable = function(func) {
					return function() {
						if (filesaver.readyState !== filesaver.DONE) {
							return func.apply(this, arguments);
						}
					};
				}
				, create_if_not_found = {create: true, exclusive: false}
				, slice
			;
			filesaver.readyState = filesaver.INIT;
			if (!name) {
				name = "download";
			}
			if (can_use_save_link) {
				object_url = get_object_url(blob);
				// FF for Android has a nasty garbage collection mechanism
				// that turns all objects that are not pure javascript into 'deadObject'
				// this means `doc` and `save_link` are unusable and need to be recreated
				// `view` is usable though:
				doc = view.document;
				save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a");
				save_link.href = object_url;
				save_link.download = name;
				var event = doc.createEvent("MouseEvents");
				event.initMouseEvent(
					"click", true, false, view, 0, 0, 0, 0, 0
					, false, false, false, false, 0, null
				);
				save_link.dispatchEvent(event);
				filesaver.readyState = filesaver.DONE;
				dispatch_all();
				return;
			}
			// Object and web filesystem URLs have a problem saving in Google Chrome when
			// viewed in a tab, so I force save with application/octet-stream
			// http://code.google.com/p/chromium/issues/detail?id=91158
			if (view.chrome && type && type !== force_saveable_type) {
				slice = blob.slice || blob.webkitSlice;
				blob = slice.call(blob, 0, blob.size, force_saveable_type);
				blob_changed = true;
			}
			// Since I can't be sure that the guessed media type will trigger a download
			// in WebKit, I append .download to the filename.
			// https://bugs.webkit.org/show_bug.cgi?id=65440
			if (webkit_req_fs && name !== "download") {
				name += ".download";
			}
			if (type === force_saveable_type || webkit_req_fs) {
				target_view = view;
			}
			if (!req_fs) {
				fs_error();
				return;
			}
			fs_min_size += blob.size;
			req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
				fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
					var save = function() {
						dir.getFile(name, create_if_not_found, abortable(function(file) {
							file.createWriter(abortable(function(writer) {
								writer.onwriteend = function(event) {
									target_view.location.href = file.toURL();
									deletion_queue.push(file);
									filesaver.readyState = filesaver.DONE;
									dispatch(filesaver, "writeend", event);
								};
								writer.onerror = function() {
									var error = writer.error;
									if (error.code !== error.ABORT_ERR) {
										fs_error();
									}
								};
								"writestart progress write abort".split(" ").forEach(function(event) {
									writer["on" + event] = filesaver["on" + event];
								});
								writer.write(blob);
								filesaver.abort = function() {
									writer.abort();
									filesaver.readyState = filesaver.DONE;
								};
								filesaver.readyState = filesaver.WRITING;
							}), fs_error);
						}), fs_error);
					};
					dir.getFile(name, {create: false}, abortable(function(file) {
						// delete file if it already exists
						file.remove();
						save();
					}), abortable(function(ex) {
						if (ex.code === ex.NOT_FOUND_ERR) {
							save();
						} else {
							fs_error();
						}
					}));
				}), fs_error);
			}), fs_error);
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name) {
			return new FileSaver(blob, name);
		}
	;
	FS_proto.abort = function() {
		var filesaver = this;
		filesaver.readyState = filesaver.DONE;
		dispatch(filesaver, "abort");
	};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	view.addEventListener("unload", process_deletion_queue, false);
	saveAs.unload = function() {
		process_deletion_queue();
		view.removeEventListener("unload", process_deletion_queue, false);
	};
	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module !== null) {
  module.exports = saveAs;
} else if ((typeof define !== "undefined" && define !== null) && (define.cmd != null)) {
//  define([], function() {
	module.exports = saveAs;
//  });
}

});
