/**
 * Title: 对$做语言特性扩展,定义系统共用的方法
 * Author: honger.zheng
 * Date: 2015-01-16
 */

var $ = require('$');
	
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
