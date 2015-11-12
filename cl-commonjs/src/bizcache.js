
var $ = require("$");
require("$indexeddb");

var jslet = require("jslet-data");
var Utils = require("common").utils;

var BizCacheManager = function() {
	var self = this;
	// 定义列的表头属性
	var fldCfg = [
	  	{ name: 'productCode', type: 'S', length: 30},
		{ name: 'boCode', type: 'S', length: 50},
		{ name: 'verson', type: 'N', length: 10},
		{ name: 'updateAlone', type: 'N', length: 30}
	];
	var dsCachedBO = jslet.data.createDataset('cachedbo', fldCfg, {keyField: 'boCode'});

	this.openDB = function(){
		var user = Utils.getUser();
		var cacheDBName = 'cl-' + (user.tenantId) +'-'+ (user.userCode || 0);
		return $.indexedDB(cacheDBName, {
		    "schema": {
		        "2": function(tran){
		        	tran.createObjectStore('tempdb', {"keyPath": 'boCode'});
		        	tran.createObjectStore('cachedbo', {"keyPath": 'boCode'});
		        	tran.createObjectStore('cachedbometa', {"keyPath": 'boCode'});
		        }
		    }
		});
	}
	
	/**
	 * 存储临时数据
	*/
	this.saveSnapshot = function(dataset){
		newRec = dataset.exportSnapshot();
		var cachedBOStore = this.openDB().objectStore('tempdb');
		cachedBOStore.put({boCode:dataset.name(),dataset:newRec});
	}
	 
	/**
	 * 查询临时数据
	 */
	this.restoreSnapshot = function(dataset){
		var defer=$.Deferred();
    	var cachedBOStore = this.openDB().objectStore('tempdb');
		cachedBOStore.get(dataset.name())
		.done(function(result, event){
			if(!result){
				return;
			}
			dataset.importSnapshot(result.dataset);
			defer.resolve();
		})
		.fail(function(error, event){
			defer.reject(error);
		});
		return defer.promise();
	}
	
	/**
	 * 删除临时数据
	 */
	this.deleteSnapshot = function(dataset){
		var cachedBOStore = this.openDB().objectStore('tempdb');
		cachedBOStore.delete(dataset.name());
	}
	
	/**
	 * 刷新本地缓存
	 * 
	 * @param {String} productCode 产品编码
	 * @param {Boolean} refreshAll 是否全量更新缓存 true - 全量更新
	 * @param {Boolean} showTips 更新完成之后是否提示信息
	 */
	this.refresh = function(refreshAll, showTips, callback) {
		var productCode = Utils.getUser().productCode;
		jslet.Checker.test('Bizcache.refresh#productCode', productCode).required().isString();
		
		var clientBOList = [],
			promise;
		var cachedBOStore = this.openDB().objectStore('cachedbo');
		if(refreshAll) {
			promise = cachedBOStore.clear();
		} else { 
			promise = cachedBOStore.each(function(item){
				var record = item.value;
				if(!record.productCode) {
					cachedBOStore.delete(item.key);
				} else {
					clientBOList.push({productCode: record.productCode, boCode: record.boCode, version: record.version, updateAlone: record.updateAlone});
				}
			});
		}
		
		promise.done(function(result, event){
			dsCachedBO.dataList(clientBOList);
			dsCachedBO.filter('[productCode] == "' + productCode + '" || [productCode] == "PAAS" || ![productCode]');
			dsCachedBO.filtered(true);
			dsCachedBO.selectAll(true);
			dsCachedBO.submitSelected('../../../cl-restapi/cache/refresh.do').done(function(result){
				var serverBOList = result.main || [];
				compareAndUpdate(clientBOList, serverBOList, showTips, callback);
			});
		})
		.fail(function(e){
			alert('indexedDB 无法打开!');
			top.location.replace('../../../paas/view/login/login.html');
			console.error(e);
		});
	}
	
	/**
	 * 全量更新
	 */
	this.refreshAll = function() {
		this.refresh(true, true);
	}
	
	/**
	 * 查询缓存数据
	 * 
	 * @param {String} boCode 业务对象的编码
	 * @return {Promise} 返回为异步的promise，调用格式：queryData('xxx').done(function(boRecords){}).fail(function(error){});
	 */
	this.queryData = function(boCode) {
    	var defer=$.Deferred();
    	var cachedBOStore = this.openDB().objectStore('cachedbo');
		cachedBOStore.get(boCode)
		.done(function(result, event){
			defer.resolve(result ? result.records : null);
		})
		.fail(function(error, event){
			defer.reject(error);
		});
		return defer.promise();
	}

	/**
	 * 查询查询业务对象的配置信息
	 * 
	 * @param {String} boCode 业务对象的编码
	 * @return {Promise} 返回为异步的promise，调用格式：queryData('xxx').done(function(boRecords){}).fail(function(error){});
	 */
	this.queryMeta = function(boCode){
    	var defer=$.Deferred();
    	this.queryData('bo_bizobjectmeta')
    	.done(function(boMetaList){
    		if(!boMetaList) {
    			defer.reject('查不到数据集配置信息！');
    			return;
    		}
    		var boMeta = null, result = null;
    		for(var i = 0, len = boMetaList.length; i < len; i++) {
    			boMeta = boMetaList[i];
    			if(boCode == boMeta.boCode) {
    				result = boMeta
    				break;
    			}
    		}
    		defer.resolve(result);
    	})
    	.fail(function(error){
    		defer.reject(error);
    	});
    	return defer.promise();
	}

	/**
	 * 查询查询所有的业务对象的配置信息
	 * 
	 * @return {Promise} 返回为异步的promise，调用格式：queryData('xxx').done(function(boRecords){}).fail(function(error){});
	 */
	this.queryAllMeta = function(boCode){
    	var defer=$.Deferred();
    	this.queryData('bo_bizobjectmeta')
    	.done(function(boMetaList){
    		if(!boMetaList) {
    			defer.reject('查不到数据集配置信息！');
    			return;
    		}
    		defer.resolve(boMetaList);
    	})
    	.fail(function(error){
    		defer.reject(error);
    	});
    	return defer.promise();
	}
	
	/**
	 * 删除指定的缓存表
	 * @param {String} indexedName indexed对象名称
	 * @param {callback} callback 回调函数
	 */
	this.deleteDB = function(indexedName, callback){
		var deletePromise = $.indexedDB(indexedName).deleteDatabase();
		deletePromise.done(function(event){ 
			console.log(indexedName + '删除成功');
			// 删除成功之后调用回调函数
			if(callback) {
				callback(true);
			}
		});
		deletePromise.fail(function(error, event){ 
			console.log(indexedName + '删除失败');
			// 删除失败之后调用回调函数
			if(callback) {
				callback(false);
			}
		});
		deletePromise.progress(function(db, event){
			console.log(indexedName + '删除中');
		});
	}

	function compareAndUpdate(clientBOList, serverBOList, showTips,callback) {
		var clientBO, serverBO, found, 
			sLen = serverBOList.length, 
			cLen = clientBOList.length;
		var cachedBOStore = self.openDB().objectStore('cachedbo');
		for(var i = 0; i < sLen; i++) {
			(function(i){
				serverBO = serverBOList[i];
				found = false;
				for(var j = 0; j < cLen; j++) {
					clientBO = clientBOList[j];
					
					//本地能找到
					if(serverBO.boCode == clientBO.boCode) {
						//版本号不同，则更新到本地缓存
						if(clientBO.version != serverBO.version) {
							clientBO.productCode = serverBO.productCode;
							clientBO.version = serverBO.version;
							clientBO.records = serverBO.records;
							cachedBOStore.put(clientBO)
							.done(function(){
								console.log('版本号不同',i,sLen);
								if(i === sLen - 1){
									callback && callback.call();
								}
							})
							.fail(function(error){
								console.error(error);
							});
						}
						//版本号相同，如果是最后一个记录，则跳转.
						else{
							console.log('版本号相同',i,sLen);
							if(i === sLen - 1){
								callback && callback.call();
							}
						}
						found = true;
						break;
					}
					
				} //End for j
				
				if(!found) {
					var newRec = {productCode:  serverBO.productCode, boCode: serverBO.boCode, version: serverBO.version, updateAlone: serverBO.updateAlone, records: serverBO.records};
					cachedBOStore.add(newRec)
					.done(function(){
						if(i === sLen - 1){
							callback && callback.call();
						}
					})
					.fail(function(error){
						console.error(error);
					});
				}
			})(i);
		} //End for i
		
		//删除服务端不再需要缓存的数据
		for(var j = 0; j < cLen; j++) {
			clientBO = clientBOList[j];
			found = false;
			for(var i = 0; i < sLen; i++) {
				serverBO = serverBOList[i];
				if(serverBO.boCode == clientBO.boCode) {
					found = true;
				}
			}
			if(!found) { //如果服务端没有返回指定的boCode，则清除本地缓存
				cachedBOStore['delete'](clientBO.boCode).fail(function(error){
					console.error(error);
				});
			}
		}
		
	} //End function
}

module.exports = new BizCacheManager();
