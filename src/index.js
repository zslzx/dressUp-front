import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Scene from './Scene'
import Menu from './Menu'
import Library from './library'
import {Tabs,Radio} from 'antd'
import 'antd/dist/antd.css'
import eventProxy from './eventProxy'
import Stripe from './stripe'

global.contents = {
	canvas_model:[{src:require('./img/model/man.png')}],
	canvas_shirt:[{
		src:require('./img/shirt/polo.png')
	},{
		src:require('./img/shirt/t-shirt.png')
	}
	],
	canvas_pants:[{
		src:require('./img/pants/短裤-front.png')
	}],
	canvas_coat:[{
		src:require('./img/coat/jacket-front.png')
	}]
};

global.layerNames = ['canvas_model','canvas_pants','canvas_shirt','canvas_coat']
global.layerNames_show = ['model','pants','shirt','coat'];
global.action = 'move';



global.getPixelRatio = function(context) {
    var backingStore = context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1;

    return (window.devicePixelRatio || 1) / backingStore;
};
var TabPane = Tabs.TabPane;
function changeLayer(key){
	eventProxy.trigger('changeLayer',key);
}
function changeHand(e){
	let value = e.target.value;
	eventProxy.trigger('changeHand',value)
}
var tabs=[];
function init(){
	for(let i = 0; i < global.layerNames.length; i ++){
		tabs.push( <TabPane tab={global.layerNames_show[i]} key={global.layerNames[i]}> <Library layerName={global.layerNames[i]} /> </TabPane> );
	}
}
init();
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

ReactDOM.render(
	<div style={{height: "100%"}}>
  		<div id='page-wrap' style={{height: "100%", width: "100%", minWidth: 1505}}>
		  	<Scene />
		  	<div style={{height: "100%"}}>
		  		<div className="sidebar" style={{height: "100%"}}>
		  			<div className="box">
		  				<Stripe />
		  			</div>
		  			<div className="box_center">
		  				<RadioGroup defaultValue="move" size="large" onChange={changeHand}>
					      <RadioButton value="move">move</RadioButton>
					      <RadioButton value="color">color</RadioButton>
					      <RadioButton value="resize">resize</RadioButton>
					    </RadioGroup>
		  			</div>
		  			<div className="box">
			  			<Tabs defaultActiveKey={global.layerNames[0]} onChange={changeLayer}>
			  				{tabs}
						</Tabs>
					</div>
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
