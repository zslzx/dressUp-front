import React, { Component } from 'react';
import eventProxy from './eventProxy'
import './Scene.css';

class CanvWrap extends Component{
  constructor(props){
  	super(props);
  	this.state={
  		img: null,
  		pX: 0,
  		pY: 0
  	}
  }
  shouldComponentUpdate(nextProps, nextState){
	    return false;
	}
  componentDidMount(){
  	function showImg(canvasName, img, pX, pY){
		var canv = document.getElementById(canvasName);
		var ctx = canv.getContext('2d');
		ctx.clearRect(0, 0, canv.width, canv.height);
		if(!img) return;
		var ratio = global.getPixelRatio(ctx);
		ctx.drawImage(img,pX*ratio,pY*ratio,ratio*64,ratio*64);
	}
	showImg(this.props.canvName, this.state.img,this.state.pX,this.state.pY);

	eventProxy.on('moveImg_'+this.props.canvName, (dx, dy)=>{
		this.setState({pX: this.state.pX+dx,pY: this.state.pY+dy},()=>{
			showImg(this.props.canvName, this.state.img,this.state.pX,this.state.pY);
		});
	});

	eventProxy.on('changeImg_'+this.props.canvName, (img)=>{
		this.setState({img: img},()=>{
			showImg(this.props.canvName, this.state.img,this.state.pX,this.state.pY);
		});
	});
  }
  ComponentWillUnmount(){
  	eventProxy.off('moveImg_'+this.props.canvName);
  	eventProxy.off('changeImg_'+this.props.canvName);
  }
  render(){
  	var cname;
  	if(this.props.back)cname = "scene sceneback";
  	else cname = "scene";
  	return (
  		<canvas id={this.props.canvName} className={cname} width={1200} height={800}></canvas>
  	);
  }
}


class Scene extends Component {
  constructor(props){
  	super(props);
  	this.state = {
  		activeLayer: 'canvas_top',
  		mouseX: 0,
  		mouseY: 0,
  		press: false
  	};
  }
  shouldComponentUpdate(nextProps, nextState){
	    return false;
	}
  componentDidMount(){
  	function inborder(nowX, nowY){
  		var canv = document.getElementById('canvas_top');
  		if(nowX<0||nowX>canv.width||nowY<0||nowY>canv.height)return false;
  		return true;
  	}
  	addEventListener('mousedown', function(e) {
  		if(e.which!==1)return;
	    if(inborder(e.clientX, e.clientY)){
	    	this.setState({
	    		press: true,
	    		mouseX: e.clientX,
	    		mouseY: e.clientY
	    	});
	    }
	    else this.setState({press: false});
	}.bind(this));
	addEventListener('mousemove', function(e){
		if(this.state.press){
			eventProxy.trigger('moveImg_'+this.state.activeLayer,e.clientX-this.state.mouseX,e.clientY-this.state.mouseY);
			this.setState({
	    		mouseX: e.clientX,
	    		mouseY: e.clientY
	    	});
		}
	}.bind(this));
	addEventListener('mouseup', function(e){
		if(e.which!==1)return;
		this.setState({press: false});
	}.bind(this));
	eventProxy.on('changeLayer',(layerName)=>{
		this.setState({activeLayer: layerName});
	});
  }
  ComponentWillUnmount(){
  	removeEventListener('mouseup');
  	removeEventListener('mousedown');
  	removeEventListener('mousemove');
  	eventProxy.off('changeLayer');
  }
  render() {
    return (
      <div>
	      <CanvWrap canvName="canvas_bottom" back={true}/>
	      <CanvWrap canvName="canvas_middle" back={false}/>
	      <CanvWrap canvName="canvas_top" back={false}/>
      </div>
    );
  }
}

export default Scene;