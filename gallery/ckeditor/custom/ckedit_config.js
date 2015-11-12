CKEDITOR.editorConfig = function(config){
	config.language = "fr";
	config.uiColor = "#AADC6E";
	
	config.toolbar = "Basic";
	config.stylesCombo_stylesSet = 'my_styles';
	
	//自定义工具条
	config.toolbar_Full =
	[
    	['Source','-','Save','NewPage','Preview','-','Templates'],
    	['Cut','Copy','Paste','PasteText','PasteFromWord','-','Print', 'SpellChecker', 'Scayt'],
    	['Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat'],
    	['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
    	'/',
    	['Bold','Italic','Underline','Strike','-','Subscript','Superscript'],
    	['NumberedList','BulletedList','-','Outdent','Indent','Blockquote'],
    	['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
    	['Link','Unlink','Anchor'],
    	['Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak'],
    	'/',
    	['Styles','Format','Font','FontSize'],
    	['TextColor','BGColor'],
    	['Maximize', 'ShowBlocks','-','About']
	];

	config.toolbar_Basic =
	[
//    	['Styles','Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-', 'Link', 'Unlink','-','About'],
//    	['Maximize', 'ShowBlocks','-','About','Source']
		[ 'Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-', 'Link', 'Unlink' ],
		[ 'FontSize', 'TextColor', 'BGColor' ]
	];
}



