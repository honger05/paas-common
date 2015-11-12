/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	config.skin = 'moono';
	config.uiColor = "";
	config.toolbar = "Basic";
	config.allowedContent = true;
	config.title="";
	config.dialog_backgroundCoverOpacity =0.5
	config.toolbar_Basic =
	[
		[ 'Bold', 'Italic', '-', 'NumberedList', 'BulletedList' ],
		[ 'FontSize', 'TextColor', 'BGColor' ],
	]
	config.toolbarLocation ='top';
};
