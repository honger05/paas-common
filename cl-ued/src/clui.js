/**
 * Title: 系统UI入口 工厂模式
 * Author: honger.zheng
 * Date: 2015-01-14
 * */
require('./css');
var $ = require('$'),
	Utils = require('common').utils;
	
window.$ = window.jQuery = $;

var C = require('./code');

var Clui = function(){};

Clui.C = C;

/**
 * tab 选项卡
 * @param config
 */
Clui.createTabPanel = function(config){
	return $.Deferred(function(dfd){
    	var Tab = require('./tab');
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
		var ContextMenu = require('./contextmenu');
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
	var Overlay = require('bui/overlay');
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
    	var Olay = require('./overlay');
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
		var Olay = require('./overlay');
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
		var Olay = require('./overlay');
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
		var Olay = require('./overlay');
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

