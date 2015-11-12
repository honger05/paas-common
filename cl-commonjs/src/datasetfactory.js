/**
 * Title: 异步调用的同步器，用于协调各个异步调用的同步，某些异步都要完成后才能执行下一步动作
 * 
 * Author: Tony.Tong
 * Date: 2015-01-27
 */
var jslet = require('jslet-data');
var cacheManager = require('./bizcache');

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
