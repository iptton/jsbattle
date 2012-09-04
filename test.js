self.addEventListener('message',function(){
	log("不支持直接监听message");
});
onmessage = function(){
	log("不支持直接设置onmessage方法");
}

var JsBattle = {
	onMessage:function(evt){
		log("【worker】got message from Main thread:",JSON.stringify(evt.data));
	}
};

var CodeTank = {
	'fire':function(){
		self.postMessage({'cmd':'fire','data':1});
	}
}