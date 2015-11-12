/**
 * Title: overlay 类
 * Author: honger.zheng
 * Date: 2015-02-3
 * */

var Handlebars = require('handlebars');

var Overlay = {Message:{},Dialog:{}};

Overlay.Message = {
		
	alert: function(msg,callback,type, delay){
		var $ret = this.render({content:msg,buttons:1,mask:true},type);
		this._prtBody.append($ret);
		this.center($($ret[0]));
		$ret.find('.btn-sure').focus().one('click',function(){
			$ret.remove();
			callback.call();
        });
		if(delay){
			setTimeout(function(){
				$ret.remove();
			}, delay);
		}			
	},
	
	confirm: function(msg,callbackSuc,callbackCan,type){
		var $ret = this.render({content:msg,buttons:2,mask:true},type);
		this._prtBody.append($ret);
		this.center($($ret[0]));
		$ret.find('.btn-sure').focus().one('click',function(){
			$ret.remove();
			callbackSuc.call();
        });
		$ret.find('.btn-cancle').one('click',function(){
			$ret.remove();
			callbackCan.call();
        });
	},
	
	show: function(config){
		var $ret = this.render({content:config.msg,buttons:false,mask:false},config.type);
		this._prtBody.append($ret);
		this.center($($ret[0]));
		if(config.delay){
			setTimeout(function(){
				$ret.remove();
			},config.delay);
		}
	},
	
	render: function(data,type){
		this._prtBody = $(document.body);
		var source = '<div class="clui-dialog clui-message"><div class="clui-common-body"><div class="x-icon x-icon-success"><i class="fa fa-info"></i></div><div class="clui-common-content">{{content}}</div></div>{{#if buttons}}<div class="clui-common-footer"><button class="btn btn-default btn-sm btn-sure">确定</button>{{#compare buttons 1}}<button class="btn btn-default btn-sm btn-cancle">取消</button>{{/compare}}</div>{{/if}}<a class="clui-close"><span class="x-icon x-icon-normal clui-ext-close-x">×</span></a></div>{{#if mask}}<div class="clui-mask"></div>{{/if}}';
		var template = Handlebars.compile(source);
		Handlebars.registerHelper('compare',function(v1,v2,options){
			if(v1>v2) return options.fn(this);
		    else return options.inverse(this);
		});
		var $result = $(template(data));
		this.whatType($($result[0]),type);
		$result.find('.clui-close').one('click',function(){
            $result.remove();
        });
		return $result;
	},
	
	exports: function(downURL, fileName){
		fileName = fileName || '';
		var _prtBody = $(parent.document.body).size() ? $(parent.document.body) : $(document.body);
		var source = $('<div class="clui-dialog clui-message"><div class="clui-common-body"><div class="x-icon x-icon-success"><i class="fa fa-info"></i></div><div class="clui-common-content">文件已生成！   <a id="aDown" href="'+downURL+'" download="'+fileName+'">[点我下载]</a></div></div><a class="clui-close"><span class="x-icon x-icon-normal clui-ext-close-x">×</span></a></div><div class="clui-mask"></div>');
		source.find('.clui-close').one('click',function(){
			source.remove();
        });
		source.find('#aDown').one('click',function(){
			source.remove();
        });
		_prtBody.append(source);
		this.center($(source[0]),_prtBody);
	},
	
	center: function(o,p){
		p = p || this._prtBody;
        var top = (p.height()-o.height())/2,
            left = ((p.width()-o.width()) / 2);
        o.css({'top':top,'left':left});
    },
    
    whatType: function(o,type){
        var $icon = o.find('div.x-icon'),
            $i = $icon.find('i');
        switch(type){
            case 'info':
                $i.removeClass().addClass('fa fa-info');
                $icon.removeClass().addClass('x-icon x-icon-info');
                break;
            case 'error':
                $i.removeClass().addClass('fa fa-times');
                $icon.removeClass().addClass('x-icon x-icon-error');
                break;
            case 'success':
                $i.removeClass().addClass('fa fa-check');
                $icon.removeClass().addClass('x-icon x-icon-success');
                break;
            case 'warning':
                $i.removeClass().addClass('fa fa-exclamation');
                $icon.removeClass().addClass('x-icon x-icon-warning');
                break;
            case 'question':
                $i.removeClass().addClass('fa fa-question');
                $icon.removeClass().addClass('x-icon x-icon-question');
                break;
            default :
        }
    }
    
};

module.exports = Overlay;
	
