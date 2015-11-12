
function Drag(titleBar, dragDiv, config){
	titleBar = common.getById(titleBar),
	dragDiv = common.getById(dragDiv);
	
	this.moveable = false;
	this.dragArea = {maxLeft: 0,maxTop: 0,maxRight: common.getViewportSize.w - dragDiv.offsetWidth, maxBottom: common.getViewportSize.h - dragDiv.offsetHeight};
	
	if (config.area) {
        if (config.area.left && !isNaN(parseInt(config.area.left))) { this.dragArea.maxLeft = config.area.left };
        if (config.area.right && !isNaN(parseInt(config.area.right))) { 
        	this.dragArea.maxRight = config.area.right;
        }
        if (config.area.top && !isNaN(parseInt(config.area.top))) { this.dragArea.maxTop = config.area.top };
        if (config.area.bottom && !isNaN(parseInt(config.area.bottom))) { 
        	this.dragArea.maxBottom = config.area.bottom;
        }
    }
	
	dragObj = this;
	titleBar.onmousedown = function(ev){
		dragObj.mouseOffsetX = common.getMousePos(ev).x - dragDiv.offsetLeft;
		dragObj.mouseOffsetY = common.getMousePos(ev).y - dragDiv.offsetTop;
		dragObj.moveable = true;
		
		document.onmousemove = function(ev){
			if(dragObj.moveable){
				var moveX = common.getMousePos(ev).x - dragObj.mouseOffsetX,
					moveY = common.getMousePos(ev).y - dragObj.mouseOffsetY; 
				
				moveX = Math.min(Math.max(dragObj.dragArea.maxLeft,moveX),dragObj.dragArea.maxRight);
				moveY = Math.min(Math.max(dragObj.dragArea.maxTop,moveY),dragObj.dragArea.maxBottom);
				
				dragDiv.style.left = moveX + 'px';
				dragDiv.style.top = moveY + 'px';
			}
		}
		
		document.onmouseup = function(ev){
			if(dragObj.moveable){
				dragObj.moveable = false;
    			if( typeof dragObj.ondrop === 'function'){
                    dragObj.ondrop.call(dragDiv);
                }
			}
		}
	}
}

var common = {
     getById: function(id) {
          return typeof id === "string" ? document.getElementById(id) : id
     },
     getByClass: function(sClass, oParent) {
          var aClass = [];
          var reClass = new RegExp("(^| )" + sClass + "( |$)");
          var aElem = this.byTagName("*", oParent);
          for (var i = 0; i < aElem.length; i++) reClass.test(aElem[i].className) && aClass.push(aElem[i]);
          return aClass
     },
     getByTagName: function(elem, obj) {
          return (obj || document).getElementsByTagName(elem)
     },
     getMousePos: function(ev) {
    	 ev = ev || window.event;
    	 if(ev.pageX || ev.pageY){
    		 return {
    			 x: ev.pageX,
    			 y: ev.pageY
    		 }
    	 }
    	 var doc =document.documentElement,body =document.body;
    	 return {
    		 x: ev.clientX+(doc &&doc.scrollLeft||body &&body.scrollLeft||0)-(doc &&doc.clientLeft||body &&body.clientLeft||0),
	    	 y: ev.clientY+(doc &&doc.scrollTop||body &&body.scrollTop||0)-(doc &&doc.clientTop||body &&body.clientTop||0)
    	 }
      },
      getViewportSize: { 
    	  w: (window.innerWidth) ? window.innerWidth : (document.documentElement && document.documentElement.clientWidth) ? document.documentElement.clientWidth : document.body.offsetWidth, 
    	  h: (window.innerHeight) ? window.innerHeight : (document.documentElement && document.documentElement.clientHeight) ? document.documentElement.clientHeight : document.body.offsetHeight 
      }

}

module.exports = Drag;

