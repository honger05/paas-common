/**
 * Title: 用户个性化数据保存和查询
 * 
 * Author: Tony.Tong
 * Date: 2015-10-08
 */

var $ = require("$"),
	Utils = require('common').utils;

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
