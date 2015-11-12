var self=window;self.URL=self.URL||self.webkitURL;self.requestFileSystem=self.requestFileSystem||self.webkitRequestFileSystem;self.resolveLocalFileSystemURL=self.resolveLocalFileSystemURL||self.webkitResolveLocalFileSystemURL;navigator.temporaryStorage=navigator.temporaryStorage||navigator.webkitTemporaryStorage;navigator.persistentStorage=navigator.persistentStorage||navigator.webkitPersistentStorage;self.BlobBuilder=self.BlobBuilder||self.MozBlobBuilder||self.WebKitBlobBuilder;
var FileError;if(void 0===self.FileError){FileError=function(){};FileError.prototype.prototype=Error.prototype}else{FileError=self.FileError}
var Util={toArray:function(a){return Array.prototype.slice.call(a||[],0)},strToDataURL:function(a,b,c){return(void 0!=c?c:1)?"data:"+b+";base64,"+self.btoa(a):"data:"+b+","+a},strToObjectURL:function(a,b){for(var c=new Uint8Array(a.length),e=0;e<c.length;++e)c[e]=a.charCodeAt(e);c=new Blob([c],b?{type:b}:{});return self.URL.createObjectURL(c)},fileToObjectURL:function(a){return self.URL.createObjectURL(a)},fileToArrayBuffer:function(a,b,c){var e=new FileReader;e.onload=function(a){b(a.target.result)};
e.onerror=function(a){c&&c(a)};e.readAsArrayBuffer(a)},dataURLToBlob:function(a){if(-1==a.indexOf(";base64,")){var b=a.split(","),a=b[0].split(":")[1],b=b[1];return new Blob([b],{type:a})}for(var b=a.split(";base64,"),a=b[0].split(":")[1],b=window.atob(b[1]),c=b.length,e=new Uint8Array(c),i=0;i<c;++i)e[i]=b.charCodeAt(i);return new Blob([e],{type:a})},arrayBufferToBlob:function(a,b){var c=new Uint8Array(a);return new Blob([c],b?{type:b}:{})},arrayBufferToBinaryString:function(a,b,c){var e=new FileReader;
e.onload=function(a){b(a.target.result)};e.onerror=function(a){c&&c(a)};a=new Uint8Array(a);e.readAsBinaryString(new Blob([a]))},arrayToBinaryString:function(a){if("object"!=typeof a)return null;for(var b=a.length,c=Array(b);b--;)c[b]=String.fromCharCode(a[b]);return c.join("")},getFileExtension:function(a){var b=a.lastIndexOf(".");return-1!=b?a.substring(b):""}},MyFileError=function(a){this.prototype=FileError.prototype;this.code=a.code;this.name=a.name};FileError.BROWSER_NOT_SUPPORTED=1E3;
FileError.prototype.__defineGetter__("name",function(){for(var a=Object.keys(FileError),b=0,c;c=a[b];++b)if(FileError[c]==this.code)return c;return"Unknown Error"});
var Filer=new function(){function a(d){if(b=d||null)c=b.root,e=!0}var b=null,c=null,e=!1,i=function(d){return 0==d.indexOf("filesystem:")},k=function(d){i(d)||(d="/"==d[0]?b.root.toURL()+d.substring(1):0==d.indexOf("./")||0==d.indexOf("../")?"../"==d&&c!=b.root?c.toURL()+"/"+d:c.toURL()+d:c.toURL()+"/"+d);return d},j=function(d,a){var b=arguments[1],f=arguments[2],c=function(d){if(d.code==FileError.NOT_FOUND_ERR){if(f)throw Error('"'+b+'" or "'+f+'" does not exist.');throw Error('"'+b+'" does not exist.');
}throw Error("Problem getting Entry for one or more paths.");},l=k(b);if(3==arguments.length){var e=k(f);self.resolveLocalFileSystemURL(l,function(a){self.resolveLocalFileSystemURL(e,function(b){d(a,b)},c)},c)}else self.resolveLocalFileSystemURL(l,d,c)},o=function(d,a,c,f,h,l){if(!b)throw Error("Filesystem has not been initialized.");if(typeof d!=typeof a)throw Error("These method arguments are not supported.");var e=c||null,m=void 0!=l?l:!1;(d.isFile||a.isDirectory)&&a.isDirectory?m?d.moveTo(a,e,
f,h):d.copyTo(a,e,f,h):j(function(d,a){if(a.isDirectory)m?d.moveTo(a,e,f,h):d.copyTo(a,e,f,h);else{var b=Error('Oops! "'+a.name+" is not a directory!");if(h)h(b);else throw b;}},d,a)};a.DEFAULT_FS_SIZE=1048576;a.version="0.4.3";a.prototype={get fs(){return b},get isOpen(){return e},get cwd(){return c}};a.prototype.pathToFilesystemURL=function(d){return k(d)};a.prototype.init=function(d,a,g){if(!self.requestFileSystem)throw new MyFileError({code:FileError.BROWSER_NOT_SUPPORTED,name:"BROWSER_NOT_SUPPORTED"});
var d=d?d:{},f=d.size||1048576;this.type=self.TEMPORARY;if("persistent"in d&&d.persistent)this.type=self.PERSISTENT;var h=function(d){this.size=f;b=d;c=b.root;e=!0;a&&a(d)};this.type==self.PERSISTENT&&navigator.persistentStorage?navigator.persistentStorage.requestQuota(f,function(d){self.requestFileSystem(this.type,d,h.bind(this),g)}.bind(this),g):self.requestFileSystem(this.type,f,h.bind(this),g)};a.prototype.ls=function(d,a,g){if(!b)throw Error("Filesystem has not been initialized.");var f=function(d){c=
d;var b=[],f=c.createReader(),e=function(){f.readEntries(function(d){d.length?(b=b.concat(Util.toArray(d)),e()):(b.sort(function(d,a){return d.name<a.name?-1:a.name<d.name?1:0}),a(b))},g)};e()};d.isDirectory?f(d):i(d)?j(f,d):c.getDirectory(d,{},f,g)};a.prototype.mkdir=function(d,a,g,f){if(!b)throw Error("Filesystem has not been initialized.");var h=null!=a?a:!1,e=d.split("/"),n=function(a,b){if("."==b[0]||""==b[0])b=b.slice(1);a.getDirectory(b[0],{create:!0,exclusive:h},function(a){if(a.isDirectory)b.length&&
1!=e.length?n(a,b.slice(1)):g&&g(a);else if(a=Error(d+" is not a directory"),f)f(a);else throw a;},function(a){if(a.code==FileError.INVALID_MODIFICATION_ERR)if(a.message="'"+d+"' already exists",f)f(a);else throw a;})};n(c,e)};a.prototype.open=function(a,c,e){if(!b)throw Error("Filesystem has not been initialized.");a.isFile?a.file(c,e):j(function(a){a.file(c,e)},k(a))};a.prototype.create=function(a,e,g,f){if(!b)throw Error("Filesystem has not been initialized.");c.getFile(a,{create:!0,exclusive:null!=
e?e:!0},g,function(b){if(b.code==FileError.INVALID_MODIFICATION_ERR)b.message="'"+a+"' already exists";if(f)f(b);else throw b;})};a.prototype.mv=function(a,b,c,f,e){o.bind(this,a,b,c,f,e,!0)()};a.prototype.rm=function(a,c,e){if(!b)throw Error("Filesystem has not been initialized.");var f=function(a){a.isFile?a.remove(c,e):a.isDirectory&&a.removeRecursively(c,e)};a.isFile||a.isDirectory?f(a):j(f,a)};a.prototype.cd=function(a,e,g){if(!b)throw Error("Filesystem has not been initialized.");a.isDirectory?
(c=a,e&&e(c)):(a=k(a),j(function(a){if(a.isDirectory)c=a,e&&e(c);else if(a=Error("Path was not a directory."),g)g(a);else throw a;},a))};a.prototype.cp=function(a,b,c,e,h){o.bind(this,a,b,c,e,h)()};a.prototype.write=function(a,e,g,f){if(!b)throw Error("Filesystem has not been initialized.");var h=function(a){a.createWriter(function(b){b.onerror=f;if(e.append)b.onwriteend=function(){g&&g(a,this)},b.seek(b.length);else{var d=!1;b.onwriteend=function(){d?g&&g(a,this):(d=!0,this.truncate(this.position))}}if(e.data.__proto__==
ArrayBuffer.prototype)e.data=new Uint8Array(e.data);var c=new Blob([e.data],e.type?{type:e.type}:{});b.write(c)},f)};a.isFile?h(a):i(a)?j(h,a):c.getFile(a,{create:!0,exclusive:!1},h,f)};a.prototype.df=function(a,b){var c=function(b,c){a(b,c-b,c)};if(!navigator.temporaryStorage.queryUsageAndQuota||!navigator.persistentStorage.queryUsageAndQuota)throw Error("Not implemented.");self.TEMPORARY==this.type?navigator.temporaryStorage.queryUsageAndQuota(c,b):self.PERSISTENT==this.type&&navigator.persistentStorage.queryUsageAndQuota(c,
b)};return a};  module.exports = Filer;
