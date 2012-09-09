/*
self.addEventListener('message',function(){
	log("不支持直接监听message");
});
onmessage = function(){
	log("不支持直接设置onmessage方法");
}
*/


var Guess = function(){};
Guess.prototype = {
	'onRequest':function(){
		this.handout(1);
	},
	'onResult':function(r){

	},
	handout:function(r){
		postMessage({'cmd':'handout','data':r,'id':id});
	},
	'rock':1,
	'paper':2,
	'knife':3
};

var g = new Guess();
var JsBattle = {
	onMessage:function(evt){
		log("【worker】got message from Main thread:",JSON.stringify(evt.data));
		var d = evt.data;
		if(!d || !d.cmd || !g)return;
		switch(d.cmd){
			case 'request':
				g.onRequest();
			break;
			case 'result':
				g.onResult(d.data);
			break;
			default:
				break;
		}
	}
};
log(typeof document);

