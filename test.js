self.addEventListener('message',function(){
	log("不支持直接监听message");
});
onmessage = function(){
	log("不支持直接设置onmessage方法");
}


var CodeTank = function(){};
CodeTank.prototype = {
	'fire':function(){
		self.postMessage({'cmd':'fire','data':1});
	},
	'onFoundTank':function(d){
		log("default found tank",d);
	}
};

var c = new CodeTank();
var JsBattle = {
	onMessage:function(evt){
		log("【worker】got message from Main thread:",JSON.stringify(evt.data));
		var d = evt.data;
		if(!d || !d.cmd || !c)return;
		switch(d.cmd){
			case 'foundTank':
				c.onFoundTank(d.data);
				c.test();
				break;
			default:
				break;
		}
	}
};

