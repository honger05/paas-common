
/**
 * Title:  biz 公共业务定制方法  只能被业务功能依赖
 * Author: honger.zheng
 * Date: 2015-01-16
 */

var $ = require('$');
var Clui = require('clui');
var Cache = require('./bizcache');
var Utils = require('common').utils;

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

