import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Scene from './Scene'
import LibBox from './LibBox'
import DownloadBox from './DownloadBox'
import {Tabs,Radio,Input,Button} from 'antd'
import 'antd/dist/antd.css'
import eventProxy from './eventProxy'
import Stripe from './stripe'
import TextEditor from './TextEditor'
import ajaxget from './ajaxget'

//从后端读取图片目录
global.contents = ajaxget('/Interfaces/loadImg',{});


global.contents.canvas_bag2 = global.contents.canvas_bag;
global.contents.canvas_bag3 = global.contents.canvas_bag;
global.contents.canvas_scarf2 = global.contents.canvas_scarf;

//准备指针图片，避免多次重复载入
global.pointer = {
	normal: require('./img/pointer/normal.png'),
	resize_lr: require('./img/pointer/resize_lr.png'),
	resize_ud: require('./img/pointer/resize_ud.png'),
	color: require('./img/pointer/color.png'),
	pen: require('./img/pointer/pen.png'),
	img: {
		normal: new Image(),
		resize_ud: new Image(),
		resize_lr: new Image(),
		color: new Image(),
		pen: new Image()
	}
};
function init(){
    global.pointer.img['normal'].src = global.pointer['normal'];
    global.pointer.img['resize_lr'].src = global.pointer['resize_lr'];
    global.pointer.img['resize_ud'].src = global.pointer['resize_ud'];
    global.pointer.img['color'].src = global.pointer['color'];
    global.pointer.img['pen'].src = global.pointer['pen'];
}
init();


//确定图层顺序，越靠前越底层
global.layerNames = ['canvas_model','canvas_repair','canvas_pants','canvas_shirt','canvas_dress','canvas_scarf','canvas_coat','canvas_waistcoat','canvas_mask','canvas_scarf2','canvas_glasses','canvas_hair','canvas_hat','canvas_bag','canvas_bag2','canvas_bag3','canvas_box','canvas_shoesL','canvas_shoesR']
global.layerNames_show = ['模特','自定义','裤子','衬衫等','吊带/连衣裙','围巾/领带(内)','外套','马甲','口罩/面罩','围巾/领带(外)','眼镜','头发','帽子','包','包2','包3','箱子','左鞋','右鞋'];

//global.action = 'move'; 
global.modelName = '';//当前模特名字
global.modelX = 0;//当前模特位置
global.modelY = 0;//当前模特位置


global.getPixelRatio = function(context) {
    var backingStore = context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1;

    return (window.devicePixelRatio || 1) / backingStore;
};

global.penRadius = 10;//画笔半径


global.lastmode = "hand";
function changeMode(e){
    let value = e.target.value;
    eventProxy.trigger('changeMode',value);
    if(global.lastmode==='text' && value!=='text'){
        eventProxy.trigger('paintText');
    }
    global.lastmode=value;
}




const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

ReactDOM.render(
	<div style={{height: "100%"}}>
		<TextEditor /> {/*文字输入窗口*/}
  		<div id='page-wrap' style={{height: "100%", width: "100%", minWidth: 905}}>
		  	<Scene /> {/*主画板*/}
		  	<div style={{height: "100%"}}>
		  		<div className="sidebar" style={{height: "100%"}}>
		  			<div className="box">
		  				<Stripe /> {/*条纹等信息及调整面板*/}
		  			</div>
		  			<div className="box_center">
		  				<RadioGroup defaultValue="hand" size="large" onChange={changeMode}>
					      <RadioButton value="hand">手</RadioButton>
					      <RadioButton value="color">上色</RadioButton>
					      <RadioButton value="show">显示</RadioButton>
					      <RadioButton value="pen">画笔</RadioButton>
					      <RadioButton value="eraser">橡皮</RadioButton>
					      <RadioButton value="text">文字</RadioButton>
					    </RadioGroup>
		  			</div>{/*切换模式按钮*/}
		  			<DownloadBox />{/*下载面板*/}
		  			<LibBox />{/*素材库面板*/}
 				</div>
			</div>
		</div>
  	</div>,
  document.getElementById('root')
);
