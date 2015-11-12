define("cl-ued/dist/1.0.3/clui-debug", ["css-bui","css-main","css-resetui","$","common","bui/overlay","handlebars","cl-ued/import-style/1.0.0/index-debug"], function(require, exports, module){
/**
 * Title: 系统UI入口 工厂模式
 * Author: honger.zheng
 * Date: 2015-01-14
 * */
require("cl-ued/dist/1.0.3/css-debug");
var $ = require("$"),
	Utils = require("common").utils;
	
window.$ = window.jQuery = $;

var C = require("cl-ued/dist/1.0.3/code-debug");

var Clui = function(){};

Clui.C = C;

/**
 * tab 选项卡
 * @param config
 */
Clui.createTabPanel = function(config){
	return $.Deferred(function(dfd){
    	var Tab = require("cl-ued/dist/1.0.3/tab-debug");
		config = $.extend({
            tabs : '.clui-tab-item',
            contents : '.clui-panel-content',
        },config);
        
        var tabPanel = new Tab.TabPanel(config);
        
    	tabPanel.changeTab = function(){
    		Utils.checkLay();
    	}
    	
    	dfd.resolve(tabPanel);
	});
};

Clui.createContextMenu = function(config){
	return $.Deferred(function(dfd){
		var ContextMenu = require("cl-ued/dist/1.0.3/contextmenu-debug");
		config = $.extend({
			context: '.target',
			menu: [{
				name: '打印标签',
				handler: function(target) {
					console.log(target);
				}
			},
			{
				name: '打印常量',
				handler: function(target) {
					console.log(target);
				}
			}]
		}, config);
		var contextMenu = new ContextMenu(config);
		dfd.resolve(contextMenu);
	})
}

/**
 * dialog 公共业务
 * @param config
 */
Clui.createDialog = function(config){
	var Overlay = require("bui/overlay");
	config = $.extend({
		title: '公共业务',
		contentId: '',
		width:500,
        height:250,
        buttons:[{
        	text:'保存',
        	elCls : 'btn',
        	handler : function(){
        		this.saveHandler && this.saveHandler();
        	}
        },{
        	text:'取消',
        	elCls : 'btn',
        	handler : function(){
        		this.closeHandler && this.closeHandler();
        		this.close();
        	}
        }],
//            cancel: function(){//取消事件
//            },
//            closeable: false
	},config);
	
	var dialog = new Overlay.Dialog(config);
	
	return dialog;
};

/**
 * alert 公共模块
 * @param msg,callback,type
 */
Clui.alert = function(msg,callback,type, delay){
	return $.Deferred(function(dfd){
    	var Olay = require("cl-ued/dist/1.0.3/overlay-debug");
		type = type || 'success';
		Olay.Message.alert(msg,function(){
    		callback && callback.call();
    		dfd.resolve();
        }, type, delay);
	});
};

/**
 * 显示提示信息
 * 
 * @param msg, callback
 * 
 * @author Tony Tong
 */
Clui.info = function(msg, callback, delay){
	return Clui.alert(msg, callback, 'info', delay);
};

/**
 * 显示错误信息
 * 
 * @param msg, callback
 * 
 * @author Tony Tong
 */
Clui.error = function(msg, callback, delay){
	return Clui.alert(msg, callback, 'error', delay);
};

/**
 * confirm 公共模块
 * @param msg,callback,type
 */
Clui.confirm = function(msg,callbackSuc,callbackCan,type){
	return $.Deferred(function(dfd){
		var Olay = require("cl-ued/dist/1.0.3/overlay-debug");
    	type = type || 'question';
    	Olay.Message.confirm(msg,function(){
    		callbackSuc && callbackSuc.call();
    		dfd.resolve();
        },function(){
        	callbackCan && callbackCan.call();
        	dfd.reject()
        },type);
	});
};

/**
 * 覆盖jslet的提示信息对话框
 * 
 * @author Tony Tong
 */
jslet.showInfo = function(message, callBackFn, timeout) {
	Clui.info(message, callBackFn, timeout);
};

/**
 * 覆盖jslet的错误信息对话框
 * 
 * @author Tony Tong
 */
jslet.showError = function(message, callBackFn, timeout) {
	Clui.error(message, callBackFn, timeout);
};

/**
 * show 公共模块 会自动消失的提示信息
 * @param config
 */
Clui.show = function(msg,type){
	return $.Deferred(function(dfd){
		var Olay = require("cl-ued/dist/1.0.3/overlay-debug");
    	type = type || 'info';
    	config = {
			msg : msg,
          	type : type,
          	delay : 2000,
        };
    	Olay.Message.show(config);
    	dfd.resolve();
	})
};

/**
 * dialog 公告dialog
 * @param config
 */
Clui.createNoticeDialog = function(config){
	return $.Deferred(function(dfd){
		require.async('bui/overlay',function(Overlay){
    		config = $.extend({
        		title:'公告',
                width:500,
                height:250,
                bodyContent:'',
                bodyContents: [],
                indexNew: 0,
                buttons:[{
                    text:'已阅读',
                    elCls : 'btn btn-default el-center',
                    handler : function(){
                    	this.callback(this.indexNew);
                    	var len = this.bodyContents.length;
                		if(this.indexNew >= len){
                			this.close();
                			return;
                		}
                    	this.changeBdyCnt(this.indexNew);
                    	this.indexNew++
                    }
                }]
        	},config);
        	
        	Overlay.Dialog.prototype.changeBdyCnt = function(n){
        		var len = this.bodyContents.length;
        		if(n >= len) return;
        		$('.bui-dialog .bui-stdmod-body').html(this.bodyContents[n].bulletinContent);
        	};
        	
        	var noticeDialog = new Overlay.Dialog(config);
        	
        	dfd.resolve(noticeDialog);
    	});
	});
};

/**
 * 图片预览
 */
Clui.previewImage = function(url){
	return $.Deferred(function(dfd){
		require.async('bui/overlay',function(Overlay){
    		var config = $.extend({
        		title:'图片预览',
                width:600,
                height:450,
                bodyContent:'<img src="'+url+'">',
                buttons:[]
        	});
        	
        	var imgDialog = new Overlay.Dialog(config);
        	imgDialog.show();
        	
        	dfd.resolve(imgDialog);
    	});
	});
}

/**
 * 图片预览剪裁上传
 */
Clui.imageAreaSelect = function(config){
	return $.Deferred(function(dfd){
		require.async('$imgareaselect', function(){
    		var selectrate=1;
    		var rate=1;
    		var ias = null;
    		//图片控件绑定事件
    	    var img=$('#imageArea');
    	    img.load(function(){
    	      if(ias.isDisable){
    	    	 //取消选中
    	    	 ias.cancelSelection();
    	    	 //禁用控件
  				 ias.setOptions({  enable:false, disable:true});
	        	 return true;
	          }
    	      
	          // 加载完成 
	          var img=$('#imageArea');
	          //获取图片的真实宽高，HTML5支持
	          var naturalWidth = img[0].naturalWidth ,naturalHeight = img[0].naturalHeight;
	          var rect = clacImgZoomParam(300, 300, naturalWidth, naturalHeight);
	          
	          if(img.width() > img.height()){
	        	  img.removeAttr("height").attr("width",rect.width);
	          }else{
	        	  img.removeAttr("width").attr("height",rect.height);
	          }
	          $("#preview").width(img.width()/3);
	          $("#preview").height(img.width()/3*selectrate);
	          

	          var x1 = rect.width / 2 / 2;
        	  var  x2 = x1+100;
        	  var y1 = rect.height / 2 / 2;
        	  var y2 = y1+100;

	          //设置默认显示框
	          ias.setSelection(x1, y1, x2, y2, false);
	          ias.setOptions({ enable:true, disable:false, show: true});
	          ias.update();
	        
	          var _selection = {width:100,height:100, x1:x1, y1 : y1, x2:x2, y2 :y2};
	          preview(null,_selection);
	        });
	      
    		
    		var maxSize = 1024 * 1000;//最大上传大小1M;
    		$("#uploadImgArea").on("change",function(){
    			ias.isDisable = false;
    			//取消选择框
    			ias.cancelSelection();
    			$("#startX").val("");
				$("#startY").val("");
				$("#width").val("");
				$("#height").val("");
    			var file = this;
			    var files = !!file.files ? file.files : [];
				if(files[0].size >maxSize){
					Clui.alert("文件不可以大于1M.",null,'error');
					return false;
				}
				//显示图片
				img.show();
				
			    if (!files.length || !window.FileReader) return;
			        var reader = new FileReader();
			        reader.readAsDataURL(files[0]);
			        reader.onloadend = function(){
			        img.attr("src",this.result);
			        $("#view_imageArea").attr("src",this.result);
				}
			 });	
    	
    		 
    		 function clacImgZoomParam( maxWidth, maxHeight, width, height ){
	            var param = {top:0, left:0, width:width, height:height};
	            if(maxWidth){
	              rateWidth = width / maxWidth;
	              rateHeight = height / maxHeight;
	              if( rateWidth > rateHeight )
	              {
	                  param.width =  maxWidth;
	                  param.height = Math.round(height / rateWidth);
	                  rate=rateWidth;
	              }else
	              {
	                  param.width = Math.round(width / rateHeight);
	                  param.height = maxHeight;
	                  rate=rateHeight;
	              }
	            }
	            return param;
	        }
    		 
			function preview(img, selection) {
				if (!selection.width || !selection.height)
					return;
				var img=$("#view_imageArea");
				var scaleX =  $("#preview").width() / selection.width;
				var scaleY =  $("#preview").height() / selection.height;

				$('#preview img').css({
					width : Math.round(scaleX *  $("#imageArea").width()),
					height : Math.round(scaleY * $("#imageArea").height()),
					marginLeft : -Math.round(scaleX * selection.x1),
					marginTop : -Math.round(scaleY * selection.y1)
				});
				
				$("#startX").val(Math.round(selection.x1*rate));
				$("#startY").val(Math.round(selection.y1*rate));
				$("#width").val(Math.round(selection.width*rate));
				$("#height").val(Math.round(selection.height*rate));
			}
    					
			$(function() {
				init();
			});
					
	        function init(){
		        var width=$('#imageArea').width();
		        var height=$('#imageArea').height();
		        ias = $('#imageArea').imgAreaSelect({
		            aspectRatio : "1:1",
		            handles : true,
		            instance: true, 
		            enable:true,
		            disable:false,
		            onSelectChange : preview
		        });
		        
		        dfd.resolve(ias);
	        }
	        
	        $('#imageForm').submit(function(){
	        	var formData = new FormData($("#imageForm")[0]);
	        	config.data= formData;
	        	config.contentType = false;
	        	config.processData = false;
	        	config.type = 'POST';
	        	 $.ajax(config);
	        	return false;
	        })
	        
    	});
	});
}


/**
 * custom plupload 上传组件
 * @param config
 */
Clui.createCusUpload = function(config){
	return $.Deferred(function(dfd){
		require.async('plupload', function(Plupload){
			var user = Utils.getUser();
			var UP_FILE_URL = user.ofsserver + '/imageUpload.do';
			var DELETE_FILE_URL = user.ofsserver + '/delete/file.do';
			var headers = {authtoken: user.sessionId};
    		config = $.extend({
        		runtimes: 'gears,html5,flash',
        		browse_button: 'pickfiles',
        		container: 'container',
        		filelist: 'filelist',
        		max_file_size: '10mb',
        		headers: headers,
        		unique_names: true,
        		url: UP_FILE_URL,
        		multipart: true,
        		multipart_params: {
        		},
        		file_data_name: 'file',
        		resize: {width: 320, height: 240, quality: 90},
        		flash_swf_url: 'plupload.flash.swf',
        		filters: [
        			{title: 'Image files', extensions: 'jpg,gif,png,bmp,BMP,JPG,JPEG,PNG,GIF'},
        			{title: 'Zip files', extensions: 'zip,rar,7z'},
        			{title: 'word files', extensions: 'word,excel,doc,docx'}
        		],
        		deletes: function(){},
        		limits: 100,
        		isImportFile: false,//是不是用户自己处理上传返回逻辑
        	},config);
        	
        	var uploader = new Plupload.Uploader(config);

        	uploader.bind('Init', function(up, params) {
        		$('#'+config.filelist).html('<span class="describ">最大上传'+config.max_file_size+'，限制数量'+config.limits+'</span>');
        	});

        	uploader.init();

        	uploader.bind('FilesAdded', function(up, files) {
        		var flag = 0;
    			while(config.limits < up.files.length){
    				files.pop();
    				up.files.pop();
    				flag = 1;
    			}
    			if(flag === 1){
    				Clui.show("文件上传个数已达上限，请选择少于限制数量或者删除后重试！","warning");
    				flag = 0;
    				up.files.length = 0;
    				return;
    			}
    			
    			var $fl = $('#'+config.filelist);
    			plupload.each(files, function(file,index) {
    				if(index == 0) $fl.find(".describ").remove();
    				$fl.append('<span class="fn-mr5" id="' + file.id + '"><a target="_blank" data-filename="'+file.name+'">' + file.name + '</a> (' + plupload.formatSize(file.size) + ') <b></b></span>');
    			});
    			
    			//选中文件后立刻上传
    			uploader.start();
    			return false;
        	});

        	uploader.bind('UploadProgress', function(up, file) {
        		$('#'+file.id).find('b').html('<span>' + file.percent + '%</span>&nbsp;&nbsp;');
        	});
        	
        	uploader.bind('Error', function(up, err) {
        		if(err){
        			Clui.alert(err.message,null,'error');
        		}else{
        			//'上传图片服务器异常！请稍后重试...'
            		Clui.alert(C.E002)
        		}
        		var file = up.files.pop();
        		file &&　$('#'+file.id).remove();
        	});
        	
        	uploader.bind('FileUploaded', function(up, file, result) {
        		
        		var ret = {}, files, url;
        		
        		if (result.response) {
        			ret = $.parseJSON(result.response);
        		}
        		
        		if (ret.errorCode === '6666') {
        			if (top.relogin) {
        				top.relogin();
        				return;
        			}
        		}
        		
        		//1. 如果是自定义处理返回逻辑，就不需要执行以下的业务代码
        		if (config.isImportFile) {
        			return;
        		}
        		
        		if (ret.errorCode) {
        		
        		}
        		
        		url = Utils.getImageURL(user, file.target_name);
        		
    			if (config.fileUploaded) {
    				config.fileUploaded(file.target_name, file.name);
    			} 
        		
    			var extension = ['jpg', 'gif', 'png', 'bmp', 'jpeg'];
    			var ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
    			
    			var $a = $('#'+file.id).find('a');
    			if($.inArray(ext,extension) !== -1){
    				$a.on('click',function(){
        				Clui.previewImage(url);
        			}).data('dhref',url);
    			}else{
    				$a.attr('href',url).data('dhref',url);
    				$a.attr('download','download');
    			}
    			
        		var deletes = $('<a href="javascript:void(0);" class="delupload" title="删除"><i class="fa fa-times"></i></a>');
        		$('#'+file.id).find('b').after(deletes).remove();
        		
        		deletes.on('click',function(targetName){
        			return function() {
        				var $this = $(this);
            			
            			var fileName = $this.prev().attr('data-filename');
            			
            			var authtoken = Utils.getUser().sessionId;
            			
            			Utils.ajax({
            				url: DELETE_FILE_URL,
            				data: {authtoken: authtoken, fileName: targetName},
            				successHandler: function(data){
            					console.log(data);
        		    			$this.parent().remove();
        		    			
        		    			for(var i in up.files){
        		    				if(up.files[i].name == fileName){
        		    					up.files.splice(i,1);
        		    					break;
        		    				}
        		    			}
        		    			
        		    			if(up.files.length == 0) 
        		    				$('#'+config.filelist).html('<span class="describ" style="color:rgb(203, 197, 197)">最大上传'+config.max_file_size+'，限制数量'+config.limits+'</span>');
        		    			
        		    			config.deletes.call(this, targetName, fileName);
            				}
            			});
        			}
        		}(file.target_name));
        		
        		$('.delupload').on('del.upload',function(){
        			$(this).parent().remove();
        			up.files = [];
        		});
        		
        	});
        	
        	//模拟上传
        	uploader.bind('moniupload', function(up,file,result) {
        		var url = up.files[0].url,
        			fileName = up.files[0].filename;
        		
        		var authtoken = Utils.getUser().sessionId;
        		var targetName = up.files[0].url;
        		
        		up.del.on('click',function(){
        			$this = $(this);
        			Utils.ajax({
        				url: DELETE_FILE_URL,
        				data: {authtoken: authtoken, fileName: targetName},
        				successHandler: function(data){
        					console.log(data);
    		    			$this.parent().remove();
    		    			for(var i in up.files){
    		    				if(up.files[i].url == url){
    		    					up.files.splice(i,1);
    		    				}
    		    			}
    		    			
    		    			if(up.files.length == 0) 
    		    				$('#'+config.filelist).html('<span class="describ" style="color:rgb(203, 197, 197)">最大上传'+config.max_file_size+'，限制数量'+config.limits+'</span>');
    		    			
    		    			config.deletes.call(this,url,fileName);
        				}
        			});
        		});
        		
        		$('.delupload').on('del.upload',function(){
        			$(this).parent().remove();
        			up.files = [];
        		});
        	});
        	
        	dfd.resolve(uploader);
		});
	});
};

/**
 * queue plupload 上传组件
 * @param config
 */
Clui.createQueUpload = function(config){
	return $.Deferred(function(dfd){
		require.async(['queue','plupload'],function(){
    		config = $.extend({
        		runtimes : 'html5,flash',
        		url : '../upload.do',
        		max_file_size : '10mb',
        		chunk_size : '1mb',
        		unique_names : true,
        		flash_swf_url : 'plupload.flash.swf',
        		filters : [
        			{title : 'Image files', extensions : 'jpg,gif,png'},
        			{title : 'Zip files', extensions : 'zip,rar'}
        		],
        		resize : {width : 320, height : 240, quality : 90}
        	},config);
        	$("#"+config.browse_button).pluploadQueue(config);
        	dfd.resolve();
    	});
	});
};

/**
 * 导出dialog
 * @param config
 */
Clui.exports = function(downURL, fileName){
	return $.Deferred(function(dfd){
		var Olay = require("cl-ued/dist/1.0.3/overlay-debug");
		Olay.Message.exports(downURL, fileName);
		dfd.resolve();
	});
};

/**
 * 创建导航
 */
Clui.createTabNav = function(config){
	return $.Deferred(function(dfd){
		require.async("bui/tab",function(Tab){
			var wh = $(window).height()-98;
    		config = $.extend({
            	autoRender: true,
                render:'#tab',
                height:wh,
                listeners: {
                	itemclick : function(ev){
                		//console.log(ev)
                	}
                }
            },config);
    		var tab = new Tab.NavTab(config);
    		tab.on('activedchange',function(obj){
    			if(obj.item.updated){
    				obj.item.bizEvents.call();
    			}
    		});
    		
    		dfd.resolve(tab);
    	});
	});
};

module.exports = Clui;


});
define("cl-ued/dist/1.0.3/css-debug", ["css-bui","css-main","css-resetui","cl-ued/import-style/1.0.0/index-debug"], function(require, exports, module){
/**
 * Title: css加载项配置
 * Author: honger.zheng
 * Date: 2015-01-14
 * */
require("css-bui");
require("css-main");
require("css-resetui");
require("cl-ued/dist/1.0.3/clui-debug.css.js");

if(window.localStorage.clTheme){
	switch(window.localStorage.clTheme){
		case 'black':
			require.async('css-black');
			break;
		case 'blue':
			require.async('css-blue');
			break;
		default:
			require.async('css-default');
			break;
	}
	
}else{
	require.async('css-default');
}




});
define("cl-ued/dist/1.0.3/clui-debug.css.js", ["cl-ued/import-style/1.0.0/index-debug"], function(require, exports, module){
require("cl-ued/import-style/1.0.0/index-debug")('.bui-dialog .bui-stdmod-footer .btn+.btn{margin-left:5px;margin-bottom:0;}.clui-dialog{background-color:#fff;border:1px solid #999;border:1px solid rgba(0,0,0,.2);border-radius:6px;-webkit-box-shadow:0 3px 9px rgba(0,0,0,.5);box-shadow:0 3px 9px rgba(0,0,0,.5);background-clip:padding-box;outline:0;position:absolute;z-index:1070;}.clui-dialog .clui-common-header{padding:15px;font-family:ff-tisa-web-pro-1,ff-tisa-web-pro-2,"Lucida Grande","Helvetica Neue",Helvetica,Arial,"Hiragino Sans GB","Hiragino Sans GB W3","Microsoft YaHei UI","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;font-size:14px;font-weight:500;color:#333;border-bottom:1px solid #e5e5e5;cursor:move;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}.clui-dialog .clui-common-body{padding:15px;}.clui-dialog .clui-common-footer{padding:15px;text-align:right;border-top:1px solid #e5e5e5;}.clui-dialog a.clui-close{display:block;width:22px;height:22px;position:absolute;right:15px;top:15px;outline:0;overflow:hidden;cursor:pointer;text-decoration:none;z-index:1;}.clui-dialog .clui-ext-close-x{display:block;font-size:22px;line-height:1;cursor:pointer;border:none;}.clui-message{padding:10px 12px;}.clui-message .clui-common-header{padding:0;border-bottom:none;}.clui-message .clui-common-body{padding:10px 30px 15px 0;}.clui-message .clui-common-body .x-icon{float:left;}.clui-message .clui-common-content{margin-left:40px;margin-right:10px;line-height:25px;max-width:400px;word-wrap:break-word;max-height:100px;overflow-y:auto;}.clui-message .clui-common-footer{padding:0;text-align:center;border-top:1px solid rgb(139, 109, 109);padding-top:5px;}.x-icon{float:left;display:inline-block;font-size:20px;font-weight:700;font-family:Arial;text-align:center;height:22px;width:22px;overflow:hidden;line-height:1;-webkit-border-radius:2px;-moz-border-radius:2px;border-radius:2px;text-shadow:0 -1px 0 rgba(0,0,0,.25);border:1px solid transparent;cursor:inherit;}.x-icon-info,.x-icon-question{color:#fff;background-color:#5bc0de;border-color:#46b8da;}.x-icon-success{color:#fff;background-color:#5cb85c;border-color:#4cae4c;}.x-icon-warning{color:#fff;background-color:#f0ad4e;border-color:#eea236;}.x-icon-error{color:#fff;background-color:#d9534f;border-color:#d43f3a;}.x-icon-normal{text-shadow:none;color:#333;background-color:#fff;border-color:#ccc;}.clui-mask{width:100%;height:100%;position:fixed;left:0;top:0;background:#181515;opacity:0.5;z-index:999;}.clui-dialog .clui-common-footer .btn+.btn{margin-left:5px;margin-bottom:0;}');

});
define("cl-ued/dist/1.0.3/code-debug", [], function(require, exports, module){
/**
 * 错误码规范
 * 
 * 1：错误码结构： 
 * 		a、业务类以字母开头+4位数字 共5个数。 
 * 			①数字前两位表示自己的业务编号，后两位错误编号。如 00：打印功能 + 01 模板名称不能为空 
 * 		b、公共类以字母开头+3位数字 共4个数。
 * 2：首字母 S、I、W、E、Q 分别表示 success info warning error question
 * 
 */
module.exports = {
	//公共类
	'S000': 'success',
	'I000': 'info',
	'W000': 'warning',
	'E000': 'error',
	'Q000': 'question',
	
	'S001': '保存成功',
	'S002': '修改成功',
	'S003': '删除成功',
	
	'I001': '操作成功',
	
	'W001': '操作警告',
	
	'Q001': '确定操作？',
	'Q002': '确定删除？',
	
	'E001': '操作失败',
	'E002': '上传图片服务器异常！请稍后重试...',
	'E003': '上传失败，请重新上传。',
	
	//00打印业务
	'W0001': '模板名称不能为空',
	'W0002': '页高不能为空',
	'W0003': '页宽不能为空',
	'W0004': '打印字段不能为空',
	'W0005': '所属网点不能为空',
	'W0006': '请先上传面单模板',
	
	//01配载业务
	
}

});
define("cl-ued/dist/1.0.3/tab-debug", ["cl-ued/import-style/1.0.0/index-debug"], function(require, exports, module){
	
require("cl-ued/dist/1.0.3/tab-debug.css.js");
var Tab = {};

Tab.TabPanel = function(config){
	var _self = this;
	_self.$tabs = $(config.tabs);
	_self.$contents = $(config.contents);
	
	_self.$tabs.on('click',function(){
		var n = _self.$tabs.index($(this));
		_self.showItem(n);
		_self.changeTab && _self.changeTab.call(this,n);
	});
	
	_self.showItem(0);
}

Tab.TabPanel.prototype = {
	showItem: function(n){
		this.$preTab && this.$preTab.removeClass('active');
		this.$preTab = $(this.$tabs[n]);
		this.$preTab.addClass('active');
		
		this.$preContent && this.$preContent.hide();
		this.$preContent = $(this.$contents[n]);
		this.$preContent.show();
	}
}

module.exports = Tab;

});
define("cl-ued/dist/1.0.3/tab-debug.css.js", ["cl-ued/import-style/1.0.0/index-debug"], function(require, exports, module){
require("cl-ued/import-style/1.0.0/index-debug")('#tab:before,.clui-tabs:after{content:" ";display:table;}.clui-tabs:after,.clui-tabs:after{clear:both;}.clui-tabs{margin-bottom:0;padding-left:0;list-style:none;*zoom:1;border-bottom:1px solid #C5B6B6;}.clui-tabs > ul > li{position:relative;display:block;}.clui-tabs > ul > li > a{display:block;padding:5px 15px;}.clui-tabs > ul > li > a:hover,.clui-tabs > ul > li > a:focus{text-decoration:none;background-color:rgb(239, 239, 243);}.clui-tabs > ul > li{float:left;margin-bottom:-1px;}.clui-tabs > ul > li > a{margin-right:2px;line-height:20px;border-radius:4px 4px 0 0;color:#555555;background:rgb(220, 220, 222);}.clui-tabs > ul > li > a:hover,.clui-tabs > ul > li > a:focus{border-color:#eeeeee #eeeeee #dddddd;}.clui-tabs > ul > li.active > a,.clui-tabs > ul > li.active > a:hover,.clui-tabs > ul > li.active > a:focus{color:rgb(128, 128, 137);background-color:#E8E9EF;border:1px solid #C5B6B6;border-bottom-color:transparent;cursor:default;}.clui-panels{padding:8px 1px;}.clui-panel-content{display:none;}');

});
define("cl-ued/dist/1.0.3/contextmenu-debug", ["$","cl-ued/import-style/1.0.0/index-debug"], function(require, exports, module){

require("cl-ued/dist/1.0.3/contextmenu-debug.css.js");

var $ = require("$");

function ContextMenu(config) {
	var self = this;
	this.menu = config.menu;
	this.context = config.context;

	this.initMenu();
	
	$(document).on('contextmenu', this.context, function(e) {
		self.target = e.target;
		self.hideMenu();
		self.currentContext = this;
		self.currentContext.style.borderColor = '#08c'; 
		e.preventDefault();
		self.showMenu(e);
	}).on('click', function(e){
		self.hideMenu();
	});
}

$(document).on('click', '.contextMenu input', function(e){
	e.stopPropagation();
})

ContextMenu.prototype = {
	initMenu: function() {
		var self = this;
		this.contextMenu = $('<div class="contextMenu"></div>'), $ul = $('<ul></ul>');

		for(var i = 0, len = this.menu.length; i < len; i++) {
			var $li = $('<li><a href="javascript:;">' + this.menu[i].name + '</a></li>');
			!function(i) {
				$li.on('click', function() {
					self.menu[i].handler.call(this, self.target);
				})
			}(i)
			$ul.append($li);
		}

		this.contextMenu.append($ul);

		this.contextMenu.hide();

		$(document.body).append(this.contextMenu);
	},

	showMenu: function(e) {
		var left = e.pageX + 'px', top = e.pageY + 'px';
		this.contextMenu.css({left: left, top: top})
		this.contextMenu.show();
	},
	
	hideMenu: function() {
		this.contextMenu.hide();
		this.currentContext && (this.currentContext.style.borderColor = '#ccc');
	},

	addMenu: function() {

	}
}

return ContextMenu;



});
define("cl-ued/dist/1.0.3/contextmenu-debug.css.js", ["cl-ued/import-style/1.0.0/index-debug"], function(require, exports, module){
require("cl-ued/import-style/1.0.0/index-debug")('.contextMenu{position:absolute;top:100px;left:100px;background-color:#f5f5f5;border:1px solid #08c;z-index:9999;}.contextMenu > ul{list-style:none;margin:0;padding:0;border:1px solid #ccc;border-bottom:none;}.contextMenu > ul > li > a{display:block;padding:2px 15px 4px 15px;border-bottom:1px solid #ccc;border-top:0px solid #fff;text-decoration:none;}.contextMenu > ul > li > a:hover{color:#C5418C;}.contextMenu > ul > li > a:active{position:relative;top:1px;box-shadow:1px 1px 3px #ddd inset;}.contextMenu input{width:50px;}');

});
define("cl-ued/dist/1.0.3/overlay-debug", ["handlebars"], function(require, exports, module){
/**
 * Title: overlay 类
 * Author: honger.zheng
 * Date: 2015-02-3
 * */

var Handlebars = require("handlebars");

var Overlay = {Message:{},Dialog:{}};

Overlay.Message = {
		
	alert: function(msg,callback,type, delay){
		var $ret = this.render({content:msg,buttons:1,mask:true},type);
		this._prtBody.append($ret);
		this.center($($ret[0]));
		$ret.find('.btn-sure').focus().one('click',function(){
			$ret.remove();
			callback.call();
        });
		if(delay){
			setTimeout(function(){
				$ret.remove();
			}, delay);
		}			
	},
	
	confirm: function(msg,callbackSuc,callbackCan,type){
		var $ret = this.render({content:msg,buttons:2,mask:true},type);
		this._prtBody.append($ret);
		this.center($($ret[0]));
		$ret.find('.btn-sure').focus().one('click',function(){
			$ret.remove();
			callbackSuc.call();
        });
		$ret.find('.btn-cancle').one('click',function(){
			$ret.remove();
			callbackCan.call();
        });
	},
	
	show: function(config){
		var $ret = this.render({content:config.msg,buttons:false,mask:false},config.type);
		this._prtBody.append($ret);
		this.center($($ret[0]));
		if(config.delay){
			setTimeout(function(){
				$ret.remove();
			},config.delay);
		}
	},
	
	render: function(data,type){
		this._prtBody = $(document.body);
		var source = '<div class="clui-dialog clui-message"><div class="clui-common-body"><div class="x-icon x-icon-success"><i class="fa fa-info"></i></div><div class="clui-common-content">{{content}}</div></div>{{#if buttons}}<div class="clui-common-footer"><button class="btn btn-default btn-sm btn-sure">确定</button>{{#compare buttons 1}}<button class="btn btn-default btn-sm btn-cancle">取消</button>{{/compare}}</div>{{/if}}<a class="clui-close"><span class="x-icon x-icon-normal clui-ext-close-x">×</span></a></div>{{#if mask}}<div class="clui-mask"></div>{{/if}}';
		var template = Handlebars.compile(source);
		Handlebars.registerHelper('compare',function(v1,v2,options){
			if(v1>v2) return options.fn(this);
		    else return options.inverse(this);
		});
		var $result = $(template(data));
		this.whatType($($result[0]),type);
		$result.find('.clui-close').one('click',function(){
            $result.remove();
        });
		return $result;
	},
	
	exports: function(downURL, fileName){
		fileName = fileName || '';
		var _prtBody = $(parent.document.body).size() ? $(parent.document.body) : $(document.body);
		var source = $('<div class="clui-dialog clui-message"><div class="clui-common-body"><div class="x-icon x-icon-success"><i class="fa fa-info"></i></div><div class="clui-common-content">文件已生成！   <a id="aDown" href="'+downURL+'" download="'+fileName+'">[点我下载]</a></div></div><a class="clui-close"><span class="x-icon x-icon-normal clui-ext-close-x">×</span></a></div><div class="clui-mask"></div>');
		source.find('.clui-close').one('click',function(){
			source.remove();
        });
		source.find('#aDown').one('click',function(){
			source.remove();
        });
		_prtBody.append(source);
		this.center($(source[0]),_prtBody);
	},
	
	center: function(o,p){
		p = p || this._prtBody;
        var top = (p.height()-o.height())/2,
            left = ((p.width()-o.width()) / 2);
        o.css({'top':top,'left':left});
    },
    
    whatType: function(o,type){
        var $icon = o.find('div.x-icon'),
            $i = $icon.find('i');
        switch(type){
            case 'info':
                $i.removeClass().addClass('fa fa-info');
                $icon.removeClass().addClass('x-icon x-icon-info');
                break;
            case 'error':
                $i.removeClass().addClass('fa fa-times');
                $icon.removeClass().addClass('x-icon x-icon-error');
                break;
            case 'success':
                $i.removeClass().addClass('fa fa-check');
                $icon.removeClass().addClass('x-icon x-icon-success');
                break;
            case 'warning':
                $i.removeClass().addClass('fa fa-exclamation');
                $icon.removeClass().addClass('x-icon x-icon-warning');
                break;
            case 'question':
                $i.removeClass().addClass('fa fa-question');
                $icon.removeClass().addClass('x-icon x-icon-question');
                break;
            default :
        }
    }
    
};

module.exports = Overlay;
	

});
