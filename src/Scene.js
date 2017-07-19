import React, { Component } from 'react';
import eventProxy from './eventProxy'

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
  		activeLayer: global.layerNames[0],
  		mouseX: 0,
  		mouseY: 0,
  		press: false
  	};
  }
  shouldComponentUpdate(nextProps, nextState){
	    return false;
	}
  componentDidMount(){
  	function inborder(nowX, nowY, lastLayer){
  		let canv = document.getElementById(global.layerNames[0]);
      if(nowX<0||nowX>canv.width||nowY<0||nowY>canv.height)return -1;
      for(let i=global.layerNames.length-1;i>=0;i--){
        let canv = document.getElementById(global.layerNames[i]);
        let ctx = canv.getContext('2d');
        let color = ctx.getImageData(nowX, nowY, 1, 1).data;
        if(color[3]!==0)return global.layerNames[i];
      }
  		return lastLayer;
  	}
  	addEventListener('mousedown', function(e) {
  		if(e.which!==1)return;
      let newLayerName = inborder(e.clientX, e.clientY, this.state.activeLayer);
	    if(newLayerName!==-1){
	    	this.setState({
          activeLayer: newLayerName,
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
    let items = [];
    for(let i = 0; i < global.layerNames.length; i ++){
      items.push(<CanvWrap canvName={global.layerNames[i]} back={i===0}/>);
    }
    return (
      <div>
	      {items}
      </div>
    );
  }
}

export default Scene;
