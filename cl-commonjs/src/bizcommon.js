
/**
 * Title:  biz 公共业务定制方法 含有基础依赖 所以只能被业务功能依赖
 * Author: honger.zheng
 * Date: 2015-01-16
 */

module.exports = {
	
	bizutils: require('./bizutils'),
	
	bizcache: require('./bizcache'),
	
	datasetfactory: require('./datasetfactory'),
	
	userPref: require('./userpref')
	
}

