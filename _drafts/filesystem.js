/**
 * Title: filer 文件系统
 * Author: honger.zheng
 * Date: 2015-02-10
 */
define(function(require,exports,module){
	var Filer = require('./filer');
	
	var filer = new Filer();
	
	var Filesystem = {
			
		init: function(persistent,size,callback){
			var _self = this;
			size = size || 1024 * 1024;
			persistent = persistent || false;
			filer.init({persistent: persistent, size: size}, function(fs) {
				var fsURL = filer.fs.root.toURL();
				console.log('文件系统注册成功: '+filer.size/(1024*1024) + 'G');
				filer.mkdir('exports', false, function(dirEntry) {
					_self.done.call(_self,fsURL+dirEntry.name);
				}, onError);
			}, onError);
		},
		
		writeFile: function(fileName,data,type){
			fileName = 'exports/' + fileName;
			data = data || '没有数据';
			type = type || 'text/csv';
			data = '\ufeff' + data.replace(/<\/?.*>/g,'');
			var blob = new Blob([data],{type: 'text/csv'});
			filer.write(fileName, {data: blob, type: type},function(fileEntry, fileWriter) {
				console.log('写入成功: ' +fileEntry.fullPath);
			},onError);
		},
		
		removeDir: function(dir){
			filer.rm(dir, function() {
				console.log('临时文件已删除');
			}, onError);
		},
		
		listFiles: function(dir){
			filer.ls(dir, function(entries) {
				console.log(entries);
			}, onError);
		}
	};
	
	
	//helper
	function onError(e) {
		console.log('Error: ' + e.name);
	};
	
	
	module.exports = Filesystem;
})