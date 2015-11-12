
require('./contextmenu.css');

var $ = require('$');

function ContextMenu(config) {
	var self = this;
	this.menu = config.menu;
	this.context = config.context;

	this.initMenu();
	
	$(document).on('contextmenu', this.context, function(e) {
		self.target = e.target;
		self.hideMenu();
		self.currentContext = this;
		self.currentContext.style.borderColor = '#08c'; 
		e.preventDefault();
		self.showMenu(e);
	}).on('click', function(e){
		self.hideMenu();
	});
}

$(document).on('click', '.contextMenu input', function(e){
	e.stopPropagation();
})

ContextMenu.prototype = {
	initMenu: function() {
		var self = this;
		this.contextMenu = $('<div class="contextMenu"></div>'), $ul = $('<ul></ul>');

		for(var i = 0, len = this.menu.length; i < len; i++) {
			var $li = $('<li><a href="javascript:;">' + this.menu[i].name + '</a></li>');
			!function(i) {
				$li.on('click', function() {
					self.menu[i].handler.call(this, self.target);
				})
			}(i)
			$ul.append($li);
		}

		this.contextMenu.append($ul);

		this.contextMenu.hide();

		$(document.body).append(this.contextMenu);
	},

	showMenu: function(e) {
		var left = e.pageX + 'px', top = e.pageY + 'px';
		this.contextMenu.css({left: left, top: top})
		this.contextMenu.show();
	},
	
	hideMenu: function() {
		this.contextMenu.hide();
		this.currentContext && (this.currentContext.style.borderColor = '#ccc');
	},

	addMenu: function() {

	}
}

return ContextMenu;


