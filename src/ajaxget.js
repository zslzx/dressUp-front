module.exports = function(url,para){
	var ajax = new XMLHttpRequest();
	if(para){
		url = url+'?';
		let first = true;
		for(let key in para){
			if(!first)url = url + '&';
			url = url + key + '=' + para[key];
			first = false;
		}
	}
	ajax.open('GET',url,false);
	ajax.send();
	return eval('('+ajax.responseText+')');
}
