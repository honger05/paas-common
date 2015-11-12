/**
 * Title: 异步调用的同步器，用于协调各个异步调用的同步，某些异步都要完成后才能执行下一步动作
 * 
 * Author: Tony.Tong
 * Date: 2015-01-27
 */

/**
 * Synchronizer类,usage:
 * 
 * synchronizer = new Synchronizer(2); //有两项任务需要执行
 * synchronizer.done(function(){ 
 * 		这里为两项任务执行后，需要的操作
 *  });
 * 
 * 在具体异步任务的onsuccess或者always方法中，加入代码：
 * synchronizer.endTask();
 * 
 * @param taskCount {Integer} 任务的个数
 */
var Synchronizer = function(taskCount) {
	var isValid = false;
	if(taskCount) {
		taskCount = parseInt(taskCount);
		if(!isNaN(taskCount) && taskCount > 0) {
			isValid = true;
		}
	}
	if(!isValid) {
		throw new Error('taskCount必须为大于0的整数！')
	}
	this._taskCount = taskCount;
	this._doneFn = null;
};

Synchronizer.prototype = {
	/**
	 * 具体异步任务完成时，调用此方法，一般加入到onsuccess或者always方法中
	 */
	endTask: function() {
		this._taskCount--;
		if(this._taskCount === 0 && this._doneFn) {
			this._doneFn();
		}
	},
	
	/**
	 * 用于注册所有任务完成时调用的方法
	 * 
	 * @param doneFn {Function} 所有任务完成时调用的方法
	 */
	done: function(doneFn) {
		if(doneFn === null || typeof doneFn !== "function") {
			throw new Error('doneFn 必须有值且为function!');
		}
		this._doneFn = doneFn;
	}
}
return Synchronizer;
