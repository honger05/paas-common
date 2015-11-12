define("cl-ued/dist/1.0.3/clui",["css-bui","css-main","css-resetui","$","common","bui/overlay","handlebars","cl-ued/import-style/1.0.0/index"],function(e,t,i){e("cl-ued/dist/1.0.3/css");var n=e("$"),o=e("common").utils;window.$=window.jQuery=n;var a=e("cl-ued/dist/1.0.3/code"),s=function(){};s.C=a,s.createTabPanel=function(t){return n.Deferred(function(i){var a=e("cl-ued/dist/1.0.3/tab");t=n.extend({tabs:".clui-tab-item",contents:".clui-panel-content"},t);var s=new a.TabPanel(t);s.changeTab=function(){o.checkLay()},i.resolve(s)})},s.createContextMenu=function(t){return n.Deferred(function(i){var o=e("cl-ued/dist/1.0.3/contextmenu");t=n.extend({context:".target",menu:[{name:"\u6253\u5370\u6807\u7b7e",handler:function(e){console.log(e)}},{name:"\u6253\u5370\u5e38\u91cf",handler:function(e){console.log(e)}}]},t);var a=new o(t);i.resolve(a)})},s.createDialog=function(t){var i=e("bui/overlay");t=n.extend({title:"\u516c\u5171\u4e1a\u52a1",contentId:"",width:500,height:250,buttons:[{text:"\u4fdd\u5b58",elCls:"btn",handler:function(){this.saveHandler&&this.saveHandler()}},{text:"\u53d6\u6d88",elCls:"btn",handler:function(){this.closeHandler&&this.closeHandler(),this.close()}}]},t);var o=new i.Dialog(t);return o},s.alert=function(t,i,o,a){return n.Deferred(function(n){var s=e("cl-ued/dist/1.0.3/overlay");o=o||"success",s.Message.alert(t,function(){i&&i.call(),n.resolve()},o,a)})},s.info=function(e,t,i){return s.alert(e,t,"info",i)},s.error=function(e,t,i){return s.alert(e,t,"error",i)},s.confirm=function(t,i,o,a){return n.Deferred(function(n){var s=e("cl-ued/dist/1.0.3/overlay");a=a||"question",s.Message.confirm(t,function(){i&&i.call(),n.resolve()},function(){o&&o.call(),n.reject()},a)})},jslet.showInfo=function(e,t,i){s.info(e,t,i)},jslet.showError=function(e,t,i){s.error(e,t,i)},s.show=function(t,i){return n.Deferred(function(n){var o=e("cl-ued/dist/1.0.3/overlay");i=i||"info",config={msg:t,type:i,delay:2e3},o.Message.show(config),n.resolve()})},s.createNoticeDialog=function(t){return n.Deferred(function(i){e.async("bui/overlay",function(e){t=n.extend({title:"\u516c\u544a",width:500,height:250,bodyContent:"",bodyContents:[],indexNew:0,buttons:[{text:"\u5df2\u9605\u8bfb",elCls:"btn btn-default el-center",handler:function(){this.callback(this.indexNew);var e=this.bodyContents.length;return this.indexNew>=e?void this.close():(this.changeBdyCnt(this.indexNew),void this.indexNew++)}}]},t),e.Dialog.prototype.changeBdyCnt=function(e){var t=this.bodyContents.length;e>=t||n(".bui-dialog .bui-stdmod-body").html(this.bodyContents[e].bulletinContent)};var o=new e.Dialog(t);i.resolve(o)})})},s.previewImage=function(t){return n.Deferred(function(i){e.async("bui/overlay",function(e){var o=n.extend({title:"\u56fe\u7247\u9884\u89c8",width:600,height:450,bodyContent:'<img src="'+t+'">',buttons:[]}),a=new e.Dialog(o);a.show(),i.resolve(a)})})},s.imageAreaSelect=function(t){return n.Deferred(function(i){e.async("$imgareaselect",function(){function e(e,t,i,n){var o={top:0,left:0,width:i,height:n};return e&&(rateWidth=i/e,rateHeight=n/t,rateWidth>rateHeight?(o.width=e,o.height=Math.round(n/rateWidth),l=rateWidth):(o.width=Math.round(i/rateHeight),o.height=t,l=rateHeight)),o}function o(e,t){if(t.width&&t.height){var i=(n("#view_imageArea"),n("#preview").width()/t.width),o=n("#preview").height()/t.height;n("#preview img").css({width:Math.round(i*n("#imageArea").width()),height:Math.round(o*n("#imageArea").height()),marginLeft:-Math.round(i*t.x1),marginTop:-Math.round(o*t.y1)}),n("#startX").val(Math.round(t.x1*l)),n("#startY").val(Math.round(t.y1*l)),n("#width").val(Math.round(t.width*l)),n("#height").val(Math.round(t.height*l))}}function a(){n("#imageArea").width(),n("#imageArea").height();c=n("#imageArea").imgAreaSelect({aspectRatio:"1:1",handles:!0,instance:!0,enable:!0,disable:!1,onSelectChange:o}),i.resolve(c)}var r=1,l=1,c=null,d=n("#imageArea");d.load(function(){if(c.isDisable)return c.cancelSelection(),c.setOptions({enable:!1,disable:!0}),!0;var t=n("#imageArea"),i=t[0].naturalWidth,a=t[0].naturalHeight,s=e(300,300,i,a);t.width()>t.height()?t.removeAttr("height").attr("width",s.width):t.removeAttr("width").attr("height",s.height),n("#preview").width(t.width()/3),n("#preview").height(t.width()/3*r);var l=s.width/2/2,d=l+100,u=s.height/2/2,f=u+100;c.setSelection(l,u,d,f,!1),c.setOptions({enable:!0,disable:!1,show:!0}),c.update();var h={width:100,height:100,x1:l,y1:u,x2:d,y2:f};o(null,h)});var u=1024e3;n("#uploadImgArea").on("change",function(){c.isDisable=!1,c.cancelSelection(),n("#startX").val(""),n("#startY").val(""),n("#width").val(""),n("#height").val("");var e=this,t=e.files?e.files:[];if(t[0].size>u)return s.alert("\u6587\u4ef6\u4e0d\u53ef\u4ee5\u5927\u4e8e1M.",null,"error"),!1;if(d.show(),t.length&&window.FileReader){var i=new FileReader;i.readAsDataURL(t[0]),i.onloadend=function(){d.attr("src",this.result),n("#view_imageArea").attr("src",this.result)}}}),n(function(){a()}),n("#imageForm").submit(function(){var e=new FormData(n("#imageForm")[0]);return t.data=e,t.contentType=!1,t.processData=!1,t.type="POST",n.ajax(t),!1})})})},s.createCusUpload=function(t){return n.Deferred(function(i){e.async("plupload",function(e){var r=o.getUser(),l=r.ofsserver+"/imageUpload.do",c=r.ofsserver+"/delete/file.do",d={authtoken:r.sessionId};t=n.extend({runtimes:"gears,html5,flash",browse_button:"pickfiles",container:"container",filelist:"filelist",max_file_size:"10mb",headers:d,unique_names:!0,url:l,multipart:!0,multipart_params:{},file_data_name:"file",resize:{width:320,height:240,quality:90},flash_swf_url:"plupload.flash.swf",filters:[{title:"Image files",extensions:"jpg,gif,png,bmp,BMP,JPG,JPEG,PNG,GIF"},{title:"Zip files",extensions:"zip,rar,7z"},{title:"word files",extensions:"word,excel,doc,docx"}],deletes:function(){},limits:100,isImportFile:!1},t);var u=new e.Uploader(t);u.bind("Init",function(){n("#"+t.filelist).html('<span class="describ">\u6700\u5927\u4e0a\u4f20'+t.max_file_size+"\uff0c\u9650\u5236\u6570\u91cf"+t.limits+"</span>")}),u.init(),u.bind("FilesAdded",function(e,i){for(var o=0;t.limits<e.files.length;)i.pop(),e.files.pop(),o=1;if(1===o)return s.show("\u6587\u4ef6\u4e0a\u4f20\u4e2a\u6570\u5df2\u8fbe\u4e0a\u9650\uff0c\u8bf7\u9009\u62e9\u5c11\u4e8e\u9650\u5236\u6570\u91cf\u6216\u8005\u5220\u9664\u540e\u91cd\u8bd5\uff01","warning"),o=0,void(e.files.length=0);var a=n("#"+t.filelist);return plupload.each(i,function(e,t){0==t&&a.find(".describ").remove(),a.append('<span class="fn-mr5" id="'+e.id+'"><a target="_blank" data-filename="'+e.name+'">'+e.name+"</a> ("+plupload.formatSize(e.size)+") <b></b></span>")}),u.start(),!1}),u.bind("UploadProgress",function(e,t){n("#"+t.id).find("b").html("<span>"+t.percent+"%</span>&nbsp;&nbsp;")}),u.bind("Error",function(e,t){t?s.alert(t.message,null,"error"):s.alert(a.E002);var i=e.files.pop();i&&n("#"+i.id).remove()}),u.bind("FileUploaded",function(e,i,a){var l,d={};if(a.response&&(d=n.parseJSON(a.response)),"6666"===d.errorCode&&top.relogin)return void top.relogin();if(!t.isImportFile){d.errorCode,l=o.getImageURL(r,i.target_name),t.fileUploaded&&t.fileUploaded(i.target_name,i.name);var u=["jpg","gif","png","bmp","jpeg"],f=i.name.substring(i.name.lastIndexOf(".")+1).toLowerCase(),h=n("#"+i.id).find("a");-1!==n.inArray(f,u)?h.on("click",function(){s.previewImage(l)}).data("dhref",l):(h.attr("href",l).data("dhref",l),h.attr("download","download"));var p=n('<a href="javascript:void(0);" class="delupload" title="\u5220\u9664"><i class="fa fa-times"></i></a>');n("#"+i.id).find("b").after(p).remove(),p.on("click",function(i){return function(){var a=n(this),s=a.prev().attr("data-filename"),r=o.getUser().sessionId;o.ajax({url:c,data:{authtoken:r,fileName:i},successHandler:function(o){console.log(o),a.parent().remove();for(var r in e.files)if(e.files[r].name==s){e.files.splice(r,1);break}0==e.files.length&&n("#"+t.filelist).html('<span class="describ" style="color:rgb(203, 197, 197)">\u6700\u5927\u4e0a\u4f20'+t.max_file_size+"\uff0c\u9650\u5236\u6570\u91cf"+t.limits+"</span>"),t.deletes.call(this,i,s)}})}}(i.target_name)),n(".delupload").on("del.upload",function(){n(this).parent().remove(),e.files=[]})}}),u.bind("moniupload",function(e){var i=e.files[0].url,a=e.files[0].filename,s=o.getUser().sessionId,r=e.files[0].url;e.del.on("click",function(){$this=n(this),o.ajax({url:c,data:{authtoken:s,fileName:r},successHandler:function(o){console.log(o),$this.parent().remove();for(var s in e.files)e.files[s].url==i&&e.files.splice(s,1);0==e.files.length&&n("#"+t.filelist).html('<span class="describ" style="color:rgb(203, 197, 197)">\u6700\u5927\u4e0a\u4f20'+t.max_file_size+"\uff0c\u9650\u5236\u6570\u91cf"+t.limits+"</span>"),t.deletes.call(this,i,a)}})}),n(".delupload").on("del.upload",function(){n(this).parent().remove(),e.files=[]})}),i.resolve(u)})})},s.createQueUpload=function(t){return n.Deferred(function(i){e.async(["queue","plupload"],function(){t=n.extend({runtimes:"html5,flash",url:"../upload.do",max_file_size:"10mb",chunk_size:"1mb",unique_names:!0,flash_swf_url:"plupload.flash.swf",filters:[{title:"Image files",extensions:"jpg,gif,png"},{title:"Zip files",extensions:"zip,rar"}],resize:{width:320,height:240,quality:90}},t),n("#"+t.browse_button).pluploadQueue(t),i.resolve()})})},s.exports=function(t,i){return n.Deferred(function(n){var o=e("cl-ued/dist/1.0.3/overlay");o.Message.exports(t,i),n.resolve()})},s.createTabNav=function(t){return n.Deferred(function(i){e.async("bui/tab",function(e){var o=n(window).height()-98;t=n.extend({autoRender:!0,render:"#tab",height:o,listeners:{itemclick:function(){}}},t);var a=new e.NavTab(t);a.on("activedchange",function(e){e.item.updated&&e.item.bizEvents.call()}),i.resolve(a)})})},i.exports=s}),define("cl-ued/dist/1.0.3/css",["css-bui","css-main","css-resetui","cl-ued/import-style/1.0.0/index"],function(e){if(e("css-bui"),e("css-main"),e("css-resetui"),e("cl-ued/dist/1.0.3/clui.css.js"),window.localStorage.clTheme)switch(window.localStorage.clTheme){case"black":e.async("css-black");break;case"blue":e.async("css-blue");break;default:e.async("css-default")}else e.async("css-default")}),define("cl-ued/dist/1.0.3/clui.css.js",["cl-ued/import-style/1.0.0/index"],function(e){e("cl-ued/import-style/1.0.0/index")('.bui-dialog .bui-stdmod-footer .btn+.btn{margin-left:5px;margin-bottom:0;}.clui-dialog{background-color:#fff;border:1px solid #999;border:1px solid rgba(0,0,0,.2);border-radius:6px;-webkit-box-shadow:0 3px 9px rgba(0,0,0,.5);box-shadow:0 3px 9px rgba(0,0,0,.5);background-clip:padding-box;outline:0;position:absolute;z-index:1070;}.clui-dialog .clui-common-header{padding:15px;font-family:ff-tisa-web-pro-1,ff-tisa-web-pro-2,"Lucida Grande","Helvetica Neue",Helvetica,Arial,"Hiragino Sans GB","Hiragino Sans GB W3","Microsoft YaHei UI","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;font-size:14px;font-weight:500;color:#333;border-bottom:1px solid #e5e5e5;cursor:move;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}.clui-dialog .clui-common-body{padding:15px;}.clui-dialog .clui-common-footer{padding:15px;text-align:right;border-top:1px solid #e5e5e5;}.clui-dialog a.clui-close{display:block;width:22px;height:22px;position:absolute;right:15px;top:15px;outline:0;overflow:hidden;cursor:pointer;text-decoration:none;z-index:1;}.clui-dialog .clui-ext-close-x{display:block;font-size:22px;line-height:1;cursor:pointer;border:none;}.clui-message{padding:10px 12px;}.clui-message .clui-common-header{padding:0;border-bottom:none;}.clui-message .clui-common-body{padding:10px 30px 15px 0;}.clui-message .clui-common-body .x-icon{float:left;}.clui-message .clui-common-content{margin-left:40px;margin-right:10px;line-height:25px;max-width:400px;word-wrap:break-word;max-height:100px;overflow-y:auto;}.clui-message .clui-common-footer{padding:0;text-align:center;border-top:1px solid rgb(139, 109, 109);padding-top:5px;}.x-icon{float:left;display:inline-block;font-size:20px;font-weight:700;font-family:Arial;text-align:center;height:22px;width:22px;overflow:hidden;line-height:1;-webkit-border-radius:2px;-moz-border-radius:2px;border-radius:2px;text-shadow:0 -1px 0 rgba(0,0,0,.25);border:1px solid transparent;cursor:inherit;}.x-icon-info,.x-icon-question{color:#fff;background-color:#5bc0de;border-color:#46b8da;}.x-icon-success{color:#fff;background-color:#5cb85c;border-color:#4cae4c;}.x-icon-warning{color:#fff;background-color:#f0ad4e;border-color:#eea236;}.x-icon-error{color:#fff;background-color:#d9534f;border-color:#d43f3a;}.x-icon-normal{text-shadow:none;color:#333;background-color:#fff;border-color:#ccc;}.clui-mask{width:100%;height:100%;position:fixed;left:0;top:0;background:#181515;opacity:0.5;z-index:999;}.clui-dialog .clui-common-footer .btn+.btn{margin-left:5px;margin-bottom:0;}')}),define("cl-ued/dist/1.0.3/code",[],function(e,t,i){i.exports={S000:"success",I000:"info",W000:"warning",E000:"error",Q000:"question",S001:"\u4fdd\u5b58\u6210\u529f",S002:"\u4fee\u6539\u6210\u529f",S003:"\u5220\u9664\u6210\u529f",I001:"\u64cd\u4f5c\u6210\u529f",W001:"\u64cd\u4f5c\u8b66\u544a",Q001:"\u786e\u5b9a\u64cd\u4f5c\uff1f",Q002:"\u786e\u5b9a\u5220\u9664\uff1f",E001:"\u64cd\u4f5c\u5931\u8d25",E002:"\u4e0a\u4f20\u56fe\u7247\u670d\u52a1\u5668\u5f02\u5e38\uff01\u8bf7\u7a0d\u540e\u91cd\u8bd5...",E003:"\u4e0a\u4f20\u5931\u8d25\uff0c\u8bf7\u91cd\u65b0\u4e0a\u4f20\u3002",W0001:"\u6a21\u677f\u540d\u79f0\u4e0d\u80fd\u4e3a\u7a7a",W0002:"\u9875\u9ad8\u4e0d\u80fd\u4e3a\u7a7a",W0003:"\u9875\u5bbd\u4e0d\u80fd\u4e3a\u7a7a",W0004:"\u6253\u5370\u5b57\u6bb5\u4e0d\u80fd\u4e3a\u7a7a",W0005:"\u6240\u5c5e\u7f51\u70b9\u4e0d\u80fd\u4e3a\u7a7a",W0006:"\u8bf7\u5148\u4e0a\u4f20\u9762\u5355\u6a21\u677f"}}),define("cl-ued/dist/1.0.3/tab",["cl-ued/import-style/1.0.0/index"],function(e,t,i){e("cl-ued/dist/1.0.3/tab.css.js");var n={};n.TabPanel=function(e){var t=this;t.$tabs=$(e.tabs),t.$contents=$(e.contents),t.$tabs.on("click",function(){var e=t.$tabs.index($(this));t.showItem(e),t.changeTab&&t.changeTab.call(this,e)}),t.showItem(0)},n.TabPanel.prototype={showItem:function(e){this.$preTab&&this.$preTab.removeClass("active"),this.$preTab=$(this.$tabs[e]),this.$preTab.addClass("active"),this.$preContent&&this.$preContent.hide(),this.$preContent=$(this.$contents[e]),this.$preContent.show()}},i.exports=n}),define("cl-ued/dist/1.0.3/tab.css.js",["cl-ued/import-style/1.0.0/index"],function(e){e("cl-ued/import-style/1.0.0/index")('#tab:before,.clui-tabs:after{content:" ";display:table;}.clui-tabs:after,.clui-tabs:after{clear:both;}.clui-tabs{margin-bottom:0;padding-left:0;list-style:none;*zoom:1;border-bottom:1px solid #C5B6B6;}.clui-tabs > ul > li{position:relative;display:block;}.clui-tabs > ul > li > a{display:block;padding:5px 15px;}.clui-tabs > ul > li > a:hover,.clui-tabs > ul > li > a:focus{text-decoration:none;background-color:rgb(239, 239, 243);}.clui-tabs > ul > li{float:left;margin-bottom:-1px;}.clui-tabs > ul > li > a{margin-right:2px;line-height:20px;border-radius:4px 4px 0 0;color:#555555;background:rgb(220, 220, 222);}.clui-tabs > ul > li > a:hover,.clui-tabs > ul > li > a:focus{border-color:#eeeeee #eeeeee #dddddd;}.clui-tabs > ul > li.active > a,.clui-tabs > ul > li.active > a:hover,.clui-tabs > ul > li.active > a:focus{color:rgb(128, 128, 137);background-color:#E8E9EF;border:1px solid #C5B6B6;border-bottom-color:transparent;cursor:default;}.clui-panels{padding:8px 1px;}.clui-panel-content{display:none;}')}),define("cl-ued/dist/1.0.3/contextmenu",["$","cl-ued/import-style/1.0.0/index"],function(e){function t(e){var t=this;this.menu=e.menu,this.context=e.context,this.initMenu(),i(document).on("contextmenu",this.context,function(e){t.target=e.target,t.hideMenu(),t.currentContext=this,t.currentContext.style.borderColor="#08c",e.preventDefault(),t.showMenu(e)}).on("click",function(){t.hideMenu()})}e("cl-ued/dist/1.0.3/contextmenu.css.js");var i=e("$");return i(document).on("click",".contextMenu input",function(e){e.stopPropagation()}),t.prototype={initMenu:function(){var e=this;this.contextMenu=i('<div class="contextMenu"></div>'),$ul=i("<ul></ul>");for(var t=0,n=this.menu.length;n>t;t++){var o=i('<li><a href="javascript:;">'+this.menu[t].name+"</a></li>");!function(t){o.on("click",function(){e.menu[t].handler.call(this,e.target)})}(t),$ul.append(o)}this.contextMenu.append($ul),this.contextMenu.hide(),i(document.body).append(this.contextMenu)},showMenu:function(e){var t=e.pageX+"px",i=e.pageY+"px";this.contextMenu.css({left:t,top:i}),this.contextMenu.show()},hideMenu:function(){this.contextMenu.hide(),this.currentContext&&(this.currentContext.style.borderColor="#ccc")},addMenu:function(){}},t}),define("cl-ued/dist/1.0.3/contextmenu.css.js",["cl-ued/import-style/1.0.0/index"],function(e){e("cl-ued/import-style/1.0.0/index")(".contextMenu{position:absolute;top:100px;left:100px;background-color:#f5f5f5;border:1px solid #08c;z-index:9999;}.contextMenu > ul{list-style:none;margin:0;padding:0;border:1px solid #ccc;border-bottom:none;}.contextMenu > ul > li > a{display:block;padding:2px 15px 4px 15px;border-bottom:1px solid #ccc;border-top:0px solid #fff;text-decoration:none;}.contextMenu > ul > li > a:hover{color:#C5418C;}.contextMenu > ul > li > a:active{position:relative;top:1px;box-shadow:1px 1px 3px #ddd inset;}.contextMenu input{width:50px;}")}),define("cl-ued/dist/1.0.3/overlay",["handlebars"],function(e,t,i){var n=e("handlebars"),o={Message:{},Dialog:{}};o.Message={alert:function(e,t,i,n){var o=this.render({content:e,buttons:1,mask:!0},i);this._prtBody.append(o),this.center($(o[0])),o.find(".btn-sure").focus().one("click",function(){o.remove(),t.call()}),n&&setTimeout(function(){o.remove()},n)},confirm:function(e,t,i,n){var o=this.render({content:e,buttons:2,mask:!0},n);this._prtBody.append(o),this.center($(o[0])),o.find(".btn-sure").focus().one("click",function(){o.remove(),t.call()}),o.find(".btn-cancle").one("click",function(){o.remove(),i.call()})},show:function(e){var t=this.render({content:e.msg,buttons:!1,mask:!1},e.type);this._prtBody.append(t),this.center($(t[0])),e.delay&&setTimeout(function(){t.remove()},e.delay)},render:function(e,t){this._prtBody=$(document.body);var i='<div class="clui-dialog clui-message"><div class="clui-common-body"><div class="x-icon x-icon-success"><i class="fa fa-info"></i></div><div class="clui-common-content">{{content}}</div></div>{{#if buttons}}<div class="clui-common-footer"><button class="btn btn-default btn-sm btn-sure">\u786e\u5b9a</button>{{#compare buttons 1}}<button class="btn btn-default btn-sm btn-cancle">\u53d6\u6d88</button>{{/compare}}</div>{{/if}}<a class="clui-close"><span class="x-icon x-icon-normal clui-ext-close-x">\xd7</span></a></div>{{#if mask}}<div class="clui-mask"></div>{{/if}}',o=n.compile(i);n.registerHelper("compare",function(e,t,i){return e>t?i.fn(this):i.inverse(this)});var a=$(o(e));return this.whatType($(a[0]),t),a.find(".clui-close").one("click",function(){a.remove()}),a},exports:function(e,t){t=t||"";var i=$($(parent.document.body).size()?parent.document.body:document.body),n=$('<div class="clui-dialog clui-message"><div class="clui-common-body"><div class="x-icon x-icon-success"><i class="fa fa-info"></i></div><div class="clui-common-content">\u6587\u4ef6\u5df2\u751f\u6210\uff01   <a id="aDown" href="'+e+'" download="'+t+'">[\u70b9\u6211\u4e0b\u8f7d]</a></div></div><a class="clui-close"><span class="x-icon x-icon-normal clui-ext-close-x">\xd7</span></a></div><div class="clui-mask"></div>');n.find(".clui-close").one("click",function(){n.remove()}),n.find("#aDown").one("click",function(){n.remove()}),i.append(n),this.center($(n[0]),i)},center:function(e,t){t=t||this._prtBody;var i=(t.height()-e.height())/2,n=(t.width()-e.width())/2;e.css({top:i,left:n})},whatType:function(e,t){var i=e.find("div.x-icon"),n=i.find("i");switch(t){case"info":n.removeClass().addClass("fa fa-info"),i.removeClass().addClass("x-icon x-icon-info");break;case"error":n.removeClass().addClass("fa fa-times"),i.removeClass().addClass("x-icon x-icon-error");break;case"success":n.removeClass().addClass("fa fa-check"),i.removeClass().addClass("x-icon x-icon-success");break;case"warning":n.removeClass().addClass("fa fa-exclamation"),i.removeClass().addClass("x-icon x-icon-warning");break;case"question":n.removeClass().addClass("fa fa-question"),i.removeClass().addClass("x-icon x-icon-question")}}},i.exports=o});