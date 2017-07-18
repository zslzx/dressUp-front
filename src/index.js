import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Scene from './Scene'
import Menu from './Menu'
import Library from './library'

global.contents = {
	canvas_top:[{
		src: require('./img/baseball.png')
	},{
		src: require('./img/badminton.png')
	}
	],
	canvas_middle:[{
		src: require('./img/baseball.png')
	},{
		src: require('./img/basketball.png')
	}],
	canvas_bottom:[{
		src: require('./img/baseball.png')
	},{
		src: require('./img/football.png')
	}]
};


global.getPixelRatio = function(context) {
    var backingStore = context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1;

    return (window.devicePixelRatio || 1) / backingStore;
};
/*
global.Pinfo = {};
global.Pinfo.canvas_bottom = {pX:0, pY:0, img: null};
global.Pinfo.canvas_middle = {pX:0, pY:0, img: null};
global.Pinfo.canvas_top = {pX:30, pY:30, img: null};
global.press = false;
global.lastX = 0;
global.lastY = 0;
global.choosedCanvas = 'canvas_top';
function addImg(canvasName, img){
	var canv = document.getElementById(canvasName);
	var ctx = canv.getContext('2d');
	global.Pinfo[canvasName].img = img;
	var ratio = getPixelRatio(ctx);

	ctx.drawImage(img,global.Pinfo[canvasName].pX*ratio,global.Pinfo[canvasName].pY*ratio,ratio*64,ratio*64);
}
function moveImg(canvasName, dX, dY)
{
	if(!global.Pinfo[canvasName].img)return;
	var canv = document.getElementById(canvasName);
	var ctx = canv.getContext('2d');
	global.Pinfo[canvasName].pX += dX;
	global.Pinfo[canvasName].pY += dY;	
	ctx.clearRect(0, 0, canv.width, canv.height);
	var ratio = getPixelRatio(ctx);
	ctx.drawImage(global.Pinfo[canvasName].img,global.Pinfo[canvasName].pX,global.Pinfo[canvasName].pY,ratio*64,ratio*64);
}
function loadimg(){
	var img = new Image();
	img.src=require('./img/baseball.png');
	img.onload = (()=>{
		addImg('canvas_bottom',img);
		addImg('canvas_middle',img);
		addImg('canvas_top',img);
	});
}

function inborder(){
	return true;
}
function changeLayer(){
	global.choosedCanvas = document.getElementById('layer').value;
	//alert(choosedCanvas);
}
document.addEventListener('mousedown', function(e) {
    if(inborder(e.clientX, e.clientY)){
    	global.press = true;
    	global.lastX = e.clientX;
    	global.lastY = e.clientY;
    }
    else global.press = false;
});
document.addEventListener('mousemove', function(e){
	if(global.press){
		moveImg(global.choosedCanvas,e.clientX-global.lastX,e.clientY-global.lastY);
		global.lastX = e.clientX;
		global.lastY = e.clientY;
	}
});
document.addEventListener('mouseup', function(e){
	global.press = false;
});

*/
ReactDOM.render(
	<div style={{height: "100%"}}>
  		<Menu />
  		<div id='page-wrap' style={{height: "100%", width: "100%", minWidth: 1505}}>
		  	<Scene />
		  	<div style={{height: "100%"}}>
		  		<div className="library" style={{height: "100%"}}>
					<Library />
 				</div>
			</div>
		</div>
  	</div>,
  document.getElementById('root')
);

/*
<main id='page-wrap'>
	  	<Scene />
	  	<p>
		  	<button onClick={loadimg}>load</button>
		  	&nbsp;&nbsp;layer:
		  	<select id='layer' onChange={changeLayer}>
			  <option value="canvas_top">top</option>
			  <option value="canvas_middle">middle</option>
			  <option value="canvas_bottom">bottom</option>
			</select>
		</p>
	</main>
*/
