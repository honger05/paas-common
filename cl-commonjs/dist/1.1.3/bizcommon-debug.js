define("cl-commonjs/dist/1.1.3/bizcommon-debug", ["$","clui","$indexeddb","jslet-data","common"], function(require, exports, module){

/**
 * Title:  biz 公共业务定制方法 含有基础依赖 所以只能被业务功能依赖
 * Author: honger.zheng
 * Date: 2015-01-16
 */

module.exports = {
	
	bizutils: require("cl-commonjs/dist/1.1.3/bizutils-debug"),
	
	bizcache: require("cl-commonjs/dist/1.1.3/bizcache-debug"),
	
	datasetfactory: require("cl-commonjs/dist/1.1.3/datasetfactory-debug"),
	
	userPref: require("cl-commonjs/dist/1.1.3/userpref-debug")
	
}


});
define("cl-commonjs/dist/1.1.3/bizutils-debug", ["$","clui","$indexeddb","jslet-data","common"], function(require, exports, module){

/**
 * Title:  biz 公共业务定制方法  只能被业务功能依赖
 * Author: honger.zheng
 * Date: 2015-01-16
 */

var $ = require("$");
var Clui = require("clui");
var Cache = require("cl-commonjs/dist/1.1.3/bizcache-debug");
var Utils = require("common").utils;

var Biz = {
	
	//权限控制
    createAction: function(boCode,actions){
    	return $.Deferred(function(dfd){
        	//先给按钮绑定事件
        	for(var i = actions.length - 1; i >= 0; i--){
        		var a = actions[i];
        		if ($.isFunction(a.func)) {
        			$(document).on(a.evt, a.selector, a.func);
        		}
        	}
        	
        	// 初始化用户如果没有分配任何权限，不能进行任何
        	Cache.queryData("auth_permission").done(function(data){
    	    	if(data){
    	    		for(var i in actions){
    	        		var a = actions[i],flag = false;
    	        		if(a.actionCode == null || a.actionCode==''){
    	        			$(a.selector).show();
    	        			continue;
    	        		}
    	        		for(var j in data){
    	        			if(a.actionCode == data[j].actionCode && boCode == data[j].boCode){
    	        				flag = true;
        	        		}
    	        		}
    	        		if(flag){
    	        			$(a.selector).show();
    	        		}
    	        	}
    	    	}
    	    	dfd.resolve();
    	    });
    	})
    },
    
    // 单号规则校验公式验证
	checkRuleNo: function(tenantId,boCode,fieldCode,billNo){
	    return $.Deferred(function(dfd){
	    	console.log('开始校验单号...');
    		var reqData =  {'tenantId':tenantId,'boCode':boCode,'fieldCode':fieldCode};
    		Utils.ajax({
     		   url: '/cl-restapi/sequencerule/findcheckcode.do',
     		   data: reqData,
     		   successHandler: function(data) {
	 				var checkCode = data.extraInfo.checkCode;
	 				console.log('校验公式: ' + checkCode);
	 				
	 				if (!checkCode) {
	 					console.log("未找到校验公式!");
	 					dfd.reject();
	 				}
	 				
	 				if(checkCode.indexOf('=') < 0){
	 					console.log("校验公式错误!");
	 					dfd.reject();
	 				}
	 				
	 				if(billNo.length > 26){
	 					console.log("单号长度大于限制!");
	 					dfd.reject();
	 				}
	 				
	 				var indexObj ={'a':0, 'b':1, 'c':2, 'd':3, 'e':4, 'f':5, 'g':6, 'h':7, 'i':8, 'j':9, 'k':10, 'l':11,
	 						'm':12, 'n':13, 'o':14, 'p':15, 'q':16, 'r':17, 's':18, 't':19, 'u':20, 'v':21, 'w':22, 'x':23, 'y':24, 'z':25};
	 				
	 				var realExp = '';
	 				var realExpValue = 0;
	 				for(var i=0,len=checkCode.length;i<len;i++){
						var exp = checkCode.charAt(i);
						var index = indexObj[exp];
						if(index != null && index != undefined){
							var value = billNo.charAt(index);
	 						checkCode = checkCode.replace(new RegExp(exp,'ig'),value);
						}
	 				}
	 				console.log('checkCode = ' + checkCode);
	 				realExpValue = parseInt(checkCode.split('=')[1]);
	 				checkCode = checkCode.substring(0,checkCode.indexOf('='));
	 				console.log('checkCode = ' + checkCode);
	 				
	 				var calcResult = eval(checkCode);
	 				var result = calcResult == realExpValue ? true : false;
	 				
	 				dfd.resolve(result);
				}
	    	});
	    })
	},
	
	limitTextAreaLines: function(dataset,fieldName,skipTextareaChange,callback,maxCounter){
		console.log('计算textarea行数');
		maxCounter = maxCounter || 500;
   		var counter = 0; 
   		var newWayBillNos = "";
   		var wayBillNos = dataset.getFieldValue(fieldName);
   		if(wayBillNos != null && wayBillNos != ''){
   			var wayBillNosArr = wayBillNos.split("\n");
	   		for(i=0; i<wayBillNosArr.length; i++){
	   			if(wayBillNosArr[i] != ''){
	   				counter +=1;
	   				if(counter > maxCounter) {
	   		   			callback.call();
	   		   			skipTextareaChange = true;
	   		   			try{
	   		   				dataset.setFieldValue(fieldName,newWayBillNos.substring(0,newWayBillNos.length-1));
	   		   			}finally{
	   		   				skipTextareaChange = false;
	   		   			}
	   		   			return skipTextareaChange;
	   		   		}else{
	   		   			newWayBillNos += wayBillNosArr[i] + "\n";
	   		   		}
	   			}
	   		}
   		}
   		console.log('行数 = ' + counter);
   		return skipTextareaChange;
	},
	
	//套打
	printVoucher : function(dataset, orderType, templateId){
		if(window.CLCef){
			templateId = Number(templateId) || null;
			var reqData = {simpleCriteria:{'orderType':orderType,'isDefault':1,'templateId':templateId}};
			Utils.ajax({
     		   url: '/cl-restapi/printvoucher/findtemplet.do',
     		   dataJson: reqData,
     		   successHandler: function(data) {
					var template = {},main = data.main[0];
					if(!main){
						Clui.alert('请选择或创建打印模板');
						return;
					}
					var templetFields = main.templetFieldsList;
					template.fieldDefs = [];
					for(var i in templetFields){
						var tf = {
							x:templetFields[i].coordinateX,
							y:templetFields[i].coordinateY,
							type:templetFields[i].type,
							dataName:templetFields[i].fieldCode
						}
						if(templetFields[i].width && templetFields[i].height){
							tf.width = templetFields[i].width;
							tf.height = templetFields[i].height;
						}
						template.fieldDefs.push(tf);
					}
	    			template.version = main.interfaceVersion;
	    			template.pageWidth = main.pageWidth;
	    			template.pageHeight = main.pageHeight;
	    			template.isLabel = main.isLabel == 1 ? true : false;
	    			
	    			template.labelDef = {
						rows: main.rows,
						columns: main.columns,
	    				rowSpace: main.rowSpace,
	    				columnSpace: main.columnSpace,
	    				topMargin: main.topMargin,
	    				leftMargin: main.leftMargin,
	    				width: main.bWidth,
	    				height: main.bHeight
	    			};
	    			
	    			for (var y = 0, len = dataset.length; y < len; y++) {
	    				var dat = dataset[y];
	    				for (var x in dat) {
	        				var otype = Object.prototype.toString.call(dat[x]);
	        				if (otype !== '[object String]' && otype !== '[object Date]' && otype !== '[object Number]') {
	        					dat[x] = '';
	    					}
	        				if (otype === '[object Date]') {
	        					dat[x] = dat[x].toLocaleString();
	        				}
	        			}
	    			}
	    			
	    			var a = Utils.stringifyJSON({"data": dataset, "template": template});
	    			window.CLCef.printVoucher(a);
     		   }
			});
		}else{
			Clui.alert("请使用辰来极速浏览器完成此功能。");
		}
	},
	
	//电子称
	getWeight : function(callBack){
		if(window.CLCef){
			callBack(window.CLCef.getWeight());
		}else{
			return callBack(0, "请使用辰来极速浏览器完成此功能。");
		}
	},
	
	printReport : function(datasets, tenantId, templateName, isPrint){
		if(window.CLCef){
			tenantId = Number(tenantId) || null;
			var reqData =  {'tenantId': tenantId, 'templateName': templateName};
			Utils.ajax({
     		   url: '/cl-restapi/report/querytempalte.do',
     		   data: reqData,
     		   successHandler: function(data) {
	 				var currentSet = data.main[0];
	 				var template = {},detailDataset = [],temp = {};
	 				template.datasetDefs = [];
					for(var key in currentSet.tableAndColumsn){
						var datasetDef = {},
							value = currentSet.tableAndColumsn[key];
						datasetDef.datasetName = key;
						temp[key] = Utils.dataset2Array(datasets[key],value);
						datasetDef.fieldDefs = [];
						for(var i in value){
							datasetDef.fieldDefs.push({"fieldLen":value[i].fieldLength,"fieldType":value[i].fieldType,"fieldName":value[i].fieldName})
						}
						template.datasetDefs.push(datasetDef);
						
						if(currentSet.masterDataSet != key){
							detailDataset.push(key);
						}
					}
					
					template.variables = currentSet.userDefinedColums;
					
					template.relationDef = [];
					
					if (detailDataset.length > 0) {
						for (var d = detailDataset.length - 1; d >= 0; d--) {
	    					var relation = {};
	    					relation.masterDataset = currentSet.masterDataSet;
	    					relation.detailDataset = detailDataset[d];
	    					template.relationDef.push(relation);
	    				}
					} else {
						var relation = {};
						relation.masterDataset = currentSet.masterDataSet;
						relation.detailDataset = '';
						template.relationDef.push(relation);
					}
					
					for(var k in temp){
						template[k] = temp[k];
					}
					
					var dat = Utils.stringifyJSON(template);
					
					if(!currentSet.templateXml){
						Clui.alert('未设置报表模板')
					}
					
					if (isPrint) {
						window.CLCef.printReport(dat,currentSet.templateXml);
					} else {
						window.CLCef.previewReport(dat,currentSet.templateXml);
					}
     		   }
			});
		}else{
			Clui.alert("请使用辰来极速浏览器完成此功能。");
		}
	},
	
	//树的排序，传入数组数据,节点的名称，父节点的名称(比如companyArea表,nodeName = areaCode, parentNodeName = parentArea)
	sortTreeData: function(obj,nodeName,parentNodeName){
		
		//查找子节点
		var findChildNode = function(pnode){
			var childNode = [];
			for (var i = 0; i < obj.length; i++) {
				if(obj[i][parentNodeName] != obj[i][nodeName] && obj[i][parentNodeName] == pnode[nodeName]){	//当前网点的父节点不等于自己 (避免出现环)and 父节点code等于pnode
					childNode.push(obj[i]);
				}
			}
			return childNode;
		};
		
		//传入根节点进行排序
		var getNode = function(rootObj){
			var childNode = findChildNode(rootObj);
			for (var j = 0; j < childNode.length; j++) {
				tree.push(childNode[j]);
				getNode(childNode[j]);
			}
		};
		
		//查找根节点
		var findTopNodes = function(){
			var topNodes = {};
			var len = obj.length;
			for (var i = 0; i < len; i++) {
				var isRootNode = 1;	//用于判断是否为根节点，默认是
				for (var j = 0;j < len; j++) {
					if(obj[i][parentNodeName] == obj[j][nodeName]){
						isRootNode = 0;	//发现有父节点存在，就确认当前节点不是根节点
						break;
					}
				}
				if(isRootNode){
					topNodes[i] = obj[i];
				}
			}
			return topNodes;
		};
		
		//排序
		var tree = [];
		var topNodes = findTopNodes();
		$.each(topNodes, function (key,value) {
			tree.push(value);
			getNode(value);
		});
		return tree;
	},
	
	//将第一个参数的数据按innerCode进行过滤操作
	filterByInnerCode: function(sources, branchs, innerCode) {
		// 过滤后的数组
		var targets = [];
	
		if(branchs && branchs.length > 0){
			// 过滤网点
			var records = [];
			for(var i in branchs) {
				if(branchs[i].innerCode.indexOf(innerCode) > -1) {
					records.push(branchs[i]);
				}
			}
			
			if(sources && sources.length > 0){
				for(var i in sources) {
					for(var k in records) {
						if(sources[i].branchCode == records[k].branchCode) {
							targets.push(sources[i]);
							break;
						}
					}
				}
			}
		}
		
		return targets;
	}
}

module.exports = Biz;


});
define("cl-commonjs/dist/1.1.3/bizcache-debug", ["$","$indexeddb","jslet-data","common"], function(require, exports, module){

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

});
define("cl-commonjs/dist/1.1.3/datasetfactory-debug", ["jslet-data","$","$indexeddb","common"], function(require, exports, module){
/**
 * Title: 异步调用的同步器，用于协调各个异步调用的同步，某些异步都要完成后才能执行下一步动作
 * 
 * Author: Tony.Tong
 * Date: 2015-01-27
 */
var jslet = require("jslet-data");
var cacheManager = require("cl-commonjs/dist/1.1.3/bizcache-debug");

var DatasetBuilder = {},
	datasetLevels = {},
	creatingDatasets;

/**
 * 通过此方法，可以创建一个Dataset的相关的Lookup数据集和明细数据集
 * 
 * @param {String} dsName 需要创建的数据集名字
 * @param {String} dsCatalog 需要创建的数据集的类别，0 - 查找数据集， 1 - 明细数据集
 * @param {String} realDsName 来源数据集名字，要创建的数据集的结构和数据来自于此数据集。
 * @param {String} hostDatasetName 主数据集
 * 
 */
jslet.data.onCreatingDataset = function(dsName, dsCatalog, realDsName, hostDatasetName) {
	if(hostDatasetName) {
		var maxLevel = datasetLevels.maxLevel;
		//明细数据集的加载级别与主数据集一样，均为0级
		if(dsCatalog == jslet.data.DatasetType.DETAIL) {
			datasetLevels[dsName] = 0;
		} else {
			hostLevel = datasetLevels[hostDatasetName];
			if(hostLevel === maxLevel) {
				return;
			} else {
				datasetLevels[dsName] = hostLevel + 1;
			}
		}
	} else {
		datasetLevels[dsName] = 0;
	}
	
	var isLookupDs = (dsCatalog == jslet.data.DatasetType.LOOKUP);
	var dsObj = jslet.data.getDataset(dsName);
	if(!dsObj) {
		innerCreateDataset(dsName, isLookupDs, isLookupDs, realDsName);
	}
};

/**
 * 当所有数据集创建成功后，触发此事件
 */
DatasetBuilder.onAllDatasetCreated = null;

/**
 * 当数据加载成功后，触发此事件
 */
DatasetBuilder.onDatasetLoaded = null;

/**
 * 表示Bo的配置信息是否已加载
 */
var metaLoaded = false;

/**
 * 所有的业务对象配置信息
 */
var allBoMetas = null;
	

/**
 * 创建一个或者多个数据集
 * 
 * @param {String or String[]} boCodes 一个或者多个业务对象名字
 */
DatasetBuilder.createDataset = function(boCodes, level, loadData) {
	if(!boCodes) {
		return;
	}
	function innerFunc() {
		//如果没有指定嵌套级次，则缺省为创建嵌套1级的数据集
		if(level === undefined ||level === null) {
			level = 1;
		}
		creatingDatasets = [];
		datasetLevels = {maxLevel: level};
		var boCode;
		if(jslet.isArray(boCodes)) {
			for(var i = 0, len = boCodes.length; i < len; i++) {
				boCode = boCodes[i];
				datasetLevels[boCode] = 0;
				innerCreateDataset(boCode, loadData);
			}
		} else {
			boCode = boCodes;
			datasetLevels[boCode] = 0;
			innerCreateDataset(boCode, loadData);
		}
		var handler = window.setInterval(function() {
			var dsName;
			for(var i = creatingDatasets.length - 1; i >= 0; i--) {
				dsName = creatingDatasets[i];
				if(jslet.data.getDataset(dsName)) {
					creatingDatasets.splice(i, 1);
				}
			}

			if(creatingDatasets.length === 0) {
				window.clearInterval(handler);
				handler = null;
				if(DatasetBuilder.onAllDatasetCreated) {
					DatasetBuilder.onAllDatasetCreated();
				}
			}
		}, 10);
	} //end innerFunc
	
	if (!metaLoaded) {
		cacheManager.queryAllMeta().done(function(allMetas){
			allBoMetas = allMetas;
			metaLoaded = true;
			innerFunc();
		}).fail(function(e){
			throw new Error(e);
		});
	} else {
		innerFunc();
	}
}

var queryMeta = function(boCode) {
	var boMeta;
	for(var i = 0, len = allBoMetas.length; i < len; i++) {
		boMeta = allBoMetas[i];
		if(boMeta.boCode == boCode) {
			return boMeta;
		}
	}
	throw new Error('找不到[' + boCode +']数据集配置，请检查！');
}

var innerCreateDataset = function(boCode, loadData, isLookupDs, realDsName) {
	console.info('正在创建数据集：' + boCode + '->' + realDsName);
	if(!realDsName) {
		realDsName = boCode;
	}
	if(!creatingDatasets) {
		return;
	}
	creatingDatasets.push(boCode);
	var boMeta = queryMeta(realDsName);
	var queryDsName = null;
	if(!isLookupDs && boMeta.queryFields && boMeta.queryFields.length > 0) {
		queryDsName = boCode + '_criteria';
		creatingDatasets.push(queryDsName);
		datasetLevels[queryDsName] = datasetLevels[boCode];
	}
	var dsCfg = convertDatasetCfg(boMeta);
	//创建主数据集对象，主数据集的名字为boCode
	convertFieldObject(boMeta.fields, isLookupDs, dsCfg.codeField, dsCfg.nameField);
//		if(isLookupDs) {
		dsCfg.autoRefreshHostDataset = true; //查找数据集在异步获取数据后，自动刷新主数据集
//		}
	var dsBizObj = jslet.data.createDataset(boCode, boMeta.fields, dsCfg);
	if(isLookupDs) {
		//查找数据集要禁止掉上下文规则，可提高性能和避免不必要的错误。
		dsBizObj.disableContextRule();
	}
	
	//创建主数据集的查询条件所用的数据集对象，查询条件数据集名字为：boCode + '_criteria'
	if(queryDsName) {
		convertFieldObject(boMeta.queryFields);
		creatingDatasets.push(queryDsName);
		dsCfg.contextRules = boMeta.queryContextRules;
		jslet.data.createDataset(queryDsName, boMeta.queryFields, dsCfg);
	}
	
	if(loadData) {
		cacheManager.queryData(realDsName).done(function(dataList){
			if(dataList) {
				dsBizObj.dataList(dataList);
			} else {
				dsBizObj.queryUrl("/cl-restapi/dynamicentity/query.do");
				dsBizObj.query({bocode: realDsName});
			}
			
			if(DatasetBuilder.onDatasetLoaded){
				DatasetBuilder.onDatasetLoaded(boCode);
			}
		});
	}
};

function convertDatasetCfg(boMeta) {
	var dsCfg = {};
	
	function setPropValue(propName) {
		dsCfg[propName] = boMeta[propName] || boMeta[propName.toLowerCase()];
	}
	setPropValue('keyField');
	setPropValue('codeField');
	setPropValue('nameField');
	setPropValue('parentField');
	setPropValue('selectField');
	setPropValue('recordClass');

	setPropValue('queryUrl');
	setPropValue('submitUrl');
	setPropValue('pageNo');
	setPropValue('pageSize');
	setPropValue('fixedIndexFields');
	setPropValue('indexFields');
	setPropValue('filter');
	setPropValue('filtered');
	setPropValue('autoShowError');
	setPropValue('autoRefreshHostDataset');
	setPropValue('readOnly');
	setPropValue('logChanged');
	setPropValue('datasetListener');
	setPropValue('onFieldChange');
	setPropValue('onCheckSelectable');
	setPropValue('contextRules');
	
	return dsCfg;
}

function convertFieldObject(fields, isLookupDs, codeField, nameField) {
	if(!fields || fields.length === 0) {
		return;
	}
	var fldObj, name;

	for(var i = 0, len = fields.length; i < len; i++) {
		fldObj = fields[i];
		name = fldObj['fieldCode'];
		fldObj['name'] = name;
		fldObj['label'] = fldObj['fieldName'];
		if(fldObj['displayName']) {
			fldObj['label'] = fldObj['displayName'];
		}
		fldObj['type'] = fldObj['dataType'];
		fldObj['tip'] = fldObj['displayTip'];
		fldObj['unique'] = fldObj['uniqued'];
		fldObj['subDataset'] = fldObj['detailBoCode'];
		
		if(isLookupDs) {
			fldObj['visible'] = (name == codeField || name == nameField);
		}
	}
}

return DatasetBuilder;

});
define("cl-commonjs/dist/1.1.3/userpref-debug", ["$","common","jslet-data"], function(require, exports, module){
/**
 * Title: 用户个性化数据保存和查询
 * 
 * Author: Tony.Tong
 * Date: 2015-10-08
 */

var $ = require("$"),
	Utils = require("common").utils;

var jslet = require("jslet-data");

var UserPref = function() {
	var self = this;
	// 定义列的表头属性
	var fldCfg = [
		{ name: 'menuId', type: 'N'},
		{ name: 'prefType', type: 'N', defaultValue: 0},
		{ name: 'prefItemCode', type: 'S', length: 30},
		{ name: 'settings', type: 'S', length: 8000}
	];
	var dsUserPref = jslet.data.createDataset('userPref', fldCfg, {autoShowError: false});
	dsUserPref.recordClass("com.chenlai.cloud.paas.ui.userpref.entity.UserPref");
	dsUserPref.queryUrl('/cl-restapi/userpref/query.do');
	dsUserPref.submitUrl('/cl-restapi/userpref/save.do');
	
	var disabled = false;
	
	//{String[]} 还未刷新用户个性化数据的dataset name
	var pendingDatasets = null;
	
	/**
	 * 设置或者获取是否禁止用户个性化数据的操作
	 */
	this.disabled = function(flag) {
		if(flag === undefined) {
			return disabled;
		}
		disabled = flag;
		return this;
	}
	
	this.loaded = false;
	
	/**
	 * 根据菜单Id，复原用户喜好数据。
	 * 
	 */
	this.queryDatasetPref = function() {
		if(disabled) {
			return;
		}
		var menuId = this._getMenuId();
		if(!menuId) {
			return;
		}
		jslet.Checker.test('queryDatasetPref#menuId', menuId).required();
		var self = this;
		return dsUserPref.query({menuId: menuId}).done(function(){
			self.loaded = true;
			if(pendingDatasets) {
				for(var i = 0, len = pendingDatasets.length; i < len; i++) {
					self._updateDatasetPref(pendingDatasets[i]);
				}
			}
			pendingDatasets = null;
		});
	};
	
	/**
	 * 根据菜单Id，保存用户喜好数据。
	 * 
	 * @param {Integer} menuId - 菜单Id
	 * @param {Dataset} dataset - Dataset对象
	 * @param {String} fldName - 字段名
	 * @param {String} metaName - 属性名
	 */
	this.saveDatasetPref = function(dataset, fldName, metaName){
		if(disabled) {
			return;
		}
		var menuId = this._getMenuId();
		if(!menuId) {
			return;
		}
		jslet.Checker.test('saveDatasetPref#menuId', menuId).required().isNumber();
		jslet.Checker.test('saveDatasetPref#dataset', dataset).required();
		jslet.Checker.test('saveDatasetPref#metaName', metaName).required().isString();
		if(metaName != 'displayOrder') {
			jslet.Checker.test('saveDatasetPref#fldName', fldName).required().isString();
		}
		var dsName = dataset.name(), settings;
		//查找指定dataset的用户设置，如没有找到则新增
		if(!dsUserPref.findByField('prefItemCode', dsName)) {
			dsUserPref.appendRecord();
			dsUserPref.setFieldValue('menuId', menuId);
			dsUserPref.setFieldValue('prefItemCode', dsName);
			settings = {name: dsName, fields: []};
		} else {
			settings = dsUserPref.getFieldValue('settings');
			if(settings) {
				settings = jslet.JSON.parse(settings);
			} else {
				settings = {name: dsName, fields: []};
			}
		}
		//settings为json格式，格式为：
		//{name: 'dataset name',
		// fields:[{name: 'field name', visible: false, disabled: true, defaultValue: 12,displayOrder: 2 , displayWidth: 12,tabIndex: 1, valueFollow: true}]}
		function setSettingValue(fldName, metaName, fldObj) {
			var fldCfg = null, oldFldCfg, 
				fields = settings.fields;
			for(var i = 0, len = fields.length; i < len; i++) {
				oldFldCfg = fields[i];
				if(oldFldCfg.name == fldName) {
					fldCfg = oldFldCfg;
					break;
				}
			}
			if(!fldCfg) {
				fldCfg = {name: fldName};
				fields.push(fldCfg);
			}
			if(!fldObj) {
				fldObj = dataset.getField(fldName);
			}
			fldCfg[metaName] = fldObj[metaName]();
		} //End of 'setSettingValue'
		
		if(metaName != 'displayOrder') {//显示顺序的变化会导致其它字段的顺序发生变动，所以需要全部记录
			setSettingValue(fldName, metaName);
		} else {
			var fieldObjs = dataset.getNormalFields();
			for(var i = 0, len = fieldObjs.length; i < len; i++) {
				fldObj = fieldObjs[i];
				if(fldObj.visible()) {
					setSettingValue(fldObj.name(), metaName, fldObj);
				}
			}
		}
		dsUserPref.setFieldValue('settings', jslet.JSON.stringify(settings));
		dsUserPref.confirm();
		this._innerSave();
	}
	//300ms内如果有相同请求，则只发送一次保存请求
	this._innerSave = jslet.debounce(function() {
		if(dsUserPref.hasChangedData()) {
			dsUserPref.submit();
		}
	}, 500);

	/**
	 * 删除指定的菜单的用户个性化数据，如果指定了dataset参数，则只删除指定的dataset的个性化数据。
	 * 
	 * @param {Integer} menuId - 菜单Id
	 * @param {Dataset} dataset - Dataset对象
	 */
	this.deleteDatasetPref = function(dataset){
		if(!dataset) {
			dsUserPref.selectAll(true);
			dsUserPref.deleteSelected();
		} else {
			var dsName = dataset.name();
			if(dsUserPref.findByField('prefItemCode', dsName)) {
				dsUserPref.deleteRecord();
			}
		}
		if(dsUserPref.hasChangedData()) {
			dsUserPref.submit();
		}
	}
	
	/**
	 * @private
	 */
	this._addPendingDataset = function(dsName) {
		if(!pendingDatasets) {
			pendingDatasets = [];
		}
		pendingDatasets.push(dsName);
	}
	
	/**
	 * 根据用户的个性化数据更新指定的dataset
	 * 
	 * @param {String} dsName 数据集名称;
	 */
	this._updateDatasetPref = function(dsName) {
		jslet.Checker.test('_updateDatasetPref#dsName', dsName).required().isString();
		dsUserPref.iterate(function() {
			if(dsUserPref.getFieldValue('prefType')) {
				return;
			}
			var savedDsName = dsUserPref.getFieldValue('prefItemCode');
			if(dsName != savedDsName) {
				return;
			}
			var settings = null;
			try {
				settings = jslet.JSON.parse(dsUserPref.getFieldValue('settings'));
			} catch(e) {
				console.error(e);
			}
			if(!settings) {
				return;
			}
			
			function setFieldMeta(fldCfg, fldObj, metaName) {
				var metaValue = fldCfg[metaName];
				if(metaValue || metaValue === 0) {
					fldObj[metaName](metaValue);
				}
			}
			var dataset = jslet.data.getDataset(dsName);
			var fields = settings.fields, fldCfg, fldName, fldObj;
			for(var i = 0, len = fields.length; i < len; i++) {
				fldCfg = fields[i];
				fldName = fldCfg.name;
				fldObj = dataset.getField(fldName);
				if(!fldObj) {
					continue;
				}
				setFieldMeta(fldCfg, fldObj, 'displayOrder');
				setFieldMeta(fldCfg, fldObj, 'displayWidth');
				setFieldMeta(fldCfg, fldObj, 'visible');
				setFieldMeta(fldCfg, fldObj, 'tabIndex');
				setFieldMeta(fldCfg, fldObj, 'valueFollow');
				setFieldMeta(fldCfg, fldObj, 'disable');
				setFieldMeta(fldCfg, fldObj, 'readOnly');
				setFieldMeta(fldCfg, fldObj, 'defaultValue');
			}
			dataset.refreshDisplayOrder();
			var evt = jslet.data.RefreshEvent.changeMetaEvent('displayOrder', null);
			dataset.refreshControl(evt);

		});
	}
	
	this._getMenuId = function() {
		if(top.globalModule && top.globalModule.tabNav) {
			var activeItem = top.globalModule.tabNav.getActivedItem();
			if(activeItem) {
				var menuId = parseInt(activeItem.get('id'));
				return menuId !== NaN? menuId: null;
			}
		}
		return null;
	}
	
}

var userPref = new UserPref();
userPref.queryDatasetPref();
jslet.data.globalDataHandler.fieldMetaChanged(function(dataset, fieldName, metaName){
	userPref.saveDatasetPref(dataset, fieldName, metaName);
});
jslet.data.globalDataHandler.datasetCreated(function(dataset){
	var dsName = dataset.name();
	if(!userPref.loaded) {
		userPref._addPendingDataset(dsName);
	} else {
		userPref._updateDatasetPref(dsName);
	}
});

module.exports = userPref;

});
