"use strict";
(function(win){
	if(win.JsBattle)return;
	// utils
	function browserCompatible(objName){
		var objNameWithFirstCap = objName[0].toUpperCase() + objName.substr(1);
		window[objName] = window[objName] 
			|| window['webkit'	+ objNameWithFirstCap] 
			|| window["moz"    	+ objNameWithFirstCap]
			|| window["ms"		+ objNameWithFirstCap];
	}

	// 兼容浏览器
	var objectsToCompat = ["Worker","URL","createObjectURL"];
	objectsToCompat.forEach(function(item){ browserCompatible(item) });


	var importScriptsArray  = [];
	var workers 			= [];
	var blobUrls 			= [];
	var scriptBegin 		= "\n\
var log;\n\
\n\
(function(){\n\
	self.JsBattle = false;\n\
	var addEvent = self.addEventListener;\n\
	self.addEventListener = function(name,fn,bubble){\n\
		if(fn!=_onMessage)return;\n\
		addEvent.call(self,name,fn,bubble);\n\
	}\n\
	log = function(){\n\
		postMessage({'cmd':'log','data':Array.prototype.slice.apply(arguments)});\n\
	};\n\
	/* remove all listener */\n\
	onmessage = null;\n\
	self.removeEventListener('message');\n\
	self.addEventListener('message',_onMessage);\n\
	function _onMessage(e){\n\
		//[log('got message from main thread');\n\
		if(JsBattle && JsBattle.onMessage){\n\
			JsBattle.onMessage(e);\n\
		}\n\
	}\n\
	postMessage({'cmd':'ready'});\n\
\n\
}());\n\
onmessage=null;\n\
\n\
(function(){ \n\
	var postMessage;\n\
	var self;\n\
	var onmessage;\n\
	/* user script begin */\n";
	var scriptEnd = '\n/*user script end*/\n\
}());';
	function getScript(scriptContentStr){
		var imports = importScriptsArray.length>0?'importScripts("'+importScriptsArray.join('","')+'");':'';
		var s = [ scriptBegin ,imports , scriptContentStr , scriptEnd];
		//console.info(s.join(""));
		return s;
	}
	function addWorker(scriptContentStr){
		peddingCount++;
		var blob = new Blob( getScript(scriptContentStr)  );
		var blobUrl = URL.createObjectURL(blob);
		blobUrls.push(blobUrl);
		var worker = new Worker(blobUrl);
		//URL.revokeObjectURL(blobUrl);
		
		//var worker  = new Worker("../test.js");
		worker.onerror = JsBattle.onError;
		worker.onmessage = onMessage;
		workers.push(worker);
		return worker;
	}
	function addImports () {
		// importScripts in 
		var scripts = Array.prototype.slice.call(arguments);
		scripts.forEach(function(src){
			var href = location.href;
			var absPath = href.substr(0,href.lastIndexOf('/')+1);
			if(src.toLowerCase().substr(0,7)!='http://'){
				src = absPath+src;
			}
			importScriptsArray.push(src);
		});
	}

	var peddingCount = 0;
	function onMessage(event){
		event.stopImmediatePropagation();
		event.preventDefault();
		var d = event.data;
		if(d.cmd){
			switch(d.cmd){
				case 'ready':
				peddingCount--;
				//console.info("peddingCount = "+peddingCount);
				if(peddingCount ==0)JsBattle.onReady();
				return;
				break;
				case 'log':
				console.info.apply(console,d.data);
				return;
				break;
			}
		}
		if(JsBattle.onMessage != onMessage){
			JsBattle.onMessage(event);
		}

	}
	function removeAll(){
		workers.forEach(function(worker){
			worker.terminate();
		});
		blobUrls.forEach(function(url){
			URL.revokeObjectURL(url);
		});
	}
	win.JsBattle = {
		'addWorker'	: addWorker,
		'addImports': addImports,
		'onMessage'	: onMessage,
		'removeAll'	: removeAll,
		'onReady'	: function(){},
		'onError'	: function(e){console.warn("【user script error】",e.message,e);}
	}
})(window);