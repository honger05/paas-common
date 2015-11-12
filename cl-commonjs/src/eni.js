/**
 * export and import (eni)
 */
var xlsx = require('xlsx');
var CSV = require('./csv');
var $ = require('$');
var filesaver = require('./filesaver');

var ENI = (function() {
	function ENI(config) {
		this.config = $.extend({
			pickfiles: 'pickfiles'
		}, config);
	}
	
	ENI.prototype.import = function() {
		$('#' + this.config.pickfiles).on('click', handleClick.bind(this));
	}
	
	ENI.prototype.exports = function(data, fileName) {
		var ws_data = CSV.parse(data);
		var ws_name = "SheetJS";
		var wb = new Workbook(), ws = sheet_from_array_of_arrays(ws_data);
		wb.SheetNames.push(ws_name);
		wb.Sheets[ws_name] = ws;
		var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
		filesaver(new Blob([s2ab(wbout)], {type:"application/octet-stream"}), fileName);
	}
	
	ENI.prototype._handleChange = function(e) {
		var files = e.target.files;
		readFiles.call(this, files);
	}
	
	ENI.prototype.onImport = function(output) {
		console.log(output);
	}
	
	return ENI;
})();

ENI.import = function(cb) {
	var eni = new ENI();
	eni.onImport = cb;
	eni.import();
};

ENI.exports = function(data, fileName) {
	new ENI().exports(data, fileName);
}

function s2ab(s) {
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
}

function Workbook() {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}

function get_header_row(sheet) {
    var headers = [];
    if (!sheet['!ref']) return;
    var range = XLSX.utils.decode_range(sheet['!ref']);
    var C, R = range.s.r; /* start in the first row */
    /* walk every column in the range */
    for(C = range.s.c; C <= range.e.c; ++C) {
        var cell = sheet[XLSX.utils.encode_cell({c:C, r:R})] /* find the cell in the first row */

        var hdr = "UNKNOWN " + C; // <-- replace with your desired default 
        if(cell && cell.t) hdr = XLSX.utils.format_cell(cell);

        headers.push(hdr);
    }
    return headers;
}

function sheet_from_array_of_arrays(data, opts) {
	var ws = {};
	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
	for(var R = 0; R != data.length; ++R) {
		for(var C = 0; C != data[R].length; ++C) {
			if(range.s.r > R) range.s.r = R;
			if(range.s.c > C) range.s.c = C;
			if(range.e.r < R) range.e.r = R;
			if(range.e.c < C) range.e.c = C;
			var cell = {v: data[R][C] };
			if(cell.v == null) continue;
			var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
			
			if(typeof cell.v === 'number') cell.t = 'n';
			else if(typeof cell.v === 'boolean') cell.t = 'b';
			else if(cell.v instanceof Date) {
				cell.t = 'n'; cell.z = XLSX.SSF._table[14];
				cell.v = datenum(cell.v);
			}
			else cell.t = 's';
			
			ws[cell_ref] = cell;
		}
	}
	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
	return ws;
}

function readFiles(files) {
	var that = this;
    var i, f, len;
    var reader = new FileReader();
    for (i = 0, len = files.length; i < len; ++i) {
  	    f = files[i];
		var name = f.name;
		var suffix = name.substring(name.lastIndexOf('.') + 1);
		reader.onload = function(e) {
			var data = e.target.result;
			switch(suffix){
				case 'csv':
					handleCSV(data, that);
					break;
				default:
					var workbook = XLSX.read(data, {type: 'binary'});
					handleWorkbook(workbook, that);
					break;
			}
		};
		reader.readAsBinaryString(f);
	}
}

function handleWorkbook(workbook, that) {
	var output = to_json(workbook);
	that.onImport(output);
}

function to_json(workbook) {
	var result = {};
	workbook.SheetNames.forEach(function(sheetName, index) {
		var sheet = workbook.Sheets[sheetName];
		var header = get_header_row(sheet);
		var roa = XLSX.utils.sheet_to_row_object_array(sheet);
		if (roa.length > 0) {
			result[index] = roa;
			result[index + '_header'] = header;
		}
	});
	return result;
}

function handleCSV(data, that) {
	var output = CSV.parse(data);
	that.onImport(output);
}

function handleClick() {
	this._inputFile = $('<input type="file">')
	.on('change', this._handleChange.bind(this));
	this._inputFile.click();
}

module.exports = ENI;
