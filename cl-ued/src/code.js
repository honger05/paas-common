/**
 * 错误码规范
 * 
 * 1：错误码结构： 
 * 		a、业务类以字母开头+4位数字 共5个数。 
 * 			①数字前两位表示自己的业务编号，后两位错误编号。如 00：打印功能 + 01 模板名称不能为空 
 * 		b、公共类以字母开头+3位数字 共4个数。
 * 2：首字母 S、I、W、E、Q 分别表示 success info warning error question
 * 
 */
module.exports = {
	//公共类
	'S000': 'success',
	'I000': 'info',
	'W000': 'warning',
	'E000': 'error',
	'Q000': 'question',
	
	'S001': '保存成功',
	'S002': '修改成功',
	'S003': '删除成功',
	
	'I001': '操作成功',
	
	'W001': '操作警告',
	
	'Q001': '确定操作？',
	'Q002': '确定删除？',
	
	'E001': '操作失败',
	'E002': '上传图片服务器异常！请稍后重试...',
	'E003': '上传失败，请重新上传。',
	
	//00打印业务
	'W0001': '模板名称不能为空',
	'W0002': '页高不能为空',
	'W0003': '页宽不能为空',
	'W0004': '打印字段不能为空',
	'W0005': '所属网点不能为空',
	'W0006': '请先上传面单模板',
	
	//01配载业务
	
}