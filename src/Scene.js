import React, { Component } from 'react';
import eventProxy from './eventProxy'
import Mypaint from './mypaint'
var co = require('co');
class CanvWrap extends Component{
  constructor(props){
  	super(props);
  	this.state={
  		img: null,
  		pX: 0,
  		pY: 0
  	}
    this.copy = null;
    this.oriImg = null;
    this.color1 = "#FFFFFF";
    this.color2 = "#FFFFFF";
    this.type = "pure";
    this.sWidth = "20";
    this.dx = null;
    this.dy = null;
    this.width = 600;
    this.height = 800;
  }
  shouldComponentUpdate(nextProps, nextState){
	    return false;
	}
  componentDidMount(){
    this.state.img = document.createElement("canvas");
    this.state.img.width=this.width;
    this.state.img.height=this.height;
  	function showImg(canvasName, img, pX, pY){
  		var canv = document.getElementById(canvasName);
  		var ctx = canv.getContext('2d');
  		ctx.clearRect(0, 0, canv.width, canv.height);
  		if(!img) return;
  		var ratio = global.getPixelRatio(ctx);
  		ctx.drawImage(img,pX*ratio,pY*ratio);
  	}
  	showImg(this.props.canvName, this.state.img,this.state.pX,this.state.pY);

  	eventProxy.on('moveImg_'+this.props.canvName, (dx, dy)=>{
  		this.setState({pX: this.state.pX+dx,pY: this.state.pY+dy},()=>{
  			showImg(this.props.canvName, this.state.img,this.state.pX,this.state.pY);
        paintRect();
  		});
  	});
    let updateImg = (reColor)=>{
      let canvasBuffer = this.state.img;
      let contextBuffer = this.state.img.getContext("2d");
      canvasBuffer.width=this.width;
      canvasBuffer.height=this.height;
      contextBuffer = this.state.img.getContext("2d");
      contextBuffer.clearRect(0, 0, canvasBuffer.width, canvasBuffer.height);
      if(this.oriImg!==null){
        
        contextBuffer.drawImage(this.oriImg,0,0,this.width,this.height);
      }
      if(reColor &&this.props.canvName !== global.layerNames[0]){
        let imgData = contextBuffer.getImageData(0,0,canvasBuffer.width,canvasBuffer.height);
        switch(this.type){
          case 'pure':
            Mypaint.paint(imgData,this.color1,this.dx,this.dy);
            break;
          case 'horizontal':
            Mypaint.paint_horizontal(imgData,this.color1,this.color2,this.sWidth,this.dx,this.dy);
            break;
          case 'vertical':
            Mypaint.paint_vertical(imgData,this.color1,this.color2,this.sWidth,this.dx,this.dy);
            break;
          case 'plaid':
            Mypaint.paint_plaid(imgData,this.color1,this.color2,this.sWidth,this.dx,this.dy);
            break;
          default:
            Mypaint.paint(imgData,this.color1,this.dx,this.dy);
        }
        contextBuffer.putImageData(imgData,0,0);
      }
      showImg(this.props.canvName, this.state.img,this.state.pX,this.state.pY);
      this.dx = null;
      this.dy = null;
    }
    let updateSize = (width,height)=>{
      console.log(width+' '+height)
      this.width = width;
      this.height = height;
      let canv = document.createElement('canvas');
      canv.width = width;
      canv.height = height;
      let ctx = canv.getContext('2d');
      ctx.clearRect(0, 0, canv.width, canv.height);
      let ratio = global.getPixelRatio(ctx);
      ctx.drawImage(this.copy,0,0,width*ratio,height*ratio);
      console.log('last:'+this.state.img.width+' '+this.state.img.height)
      this.state.img = canv;
      showImg(this.props.canvName, this.state.img,this.state.pX,this.state.pY);
    }
    var paintRect = ()=>{
      console.log("??");
      let canv = document.getElementById('opLayer');
      let ctx = canv.getContext('2d');
      ctx.clearRect(0,0,canv.width,canv.height);
      ctx.strokeRect(this.state.pX, this.state.pY, this.width, this.height);
    }
    var prepareCopy = ()=>{
      let canv = document.createElement('canvas');
      canv.width = this.width;
      canv.height = this.height;
      let ctx = canv.getContext('2d');
      ctx.clearRect(0, 0, canv.width, canv.height);
      let ratio = global.getPixelRatio(ctx);
      ctx.drawImage(this.state.img,0,0,this.width*ratio,this.height*ratio);
      this.copy = canv;
    }
    eventProxy.on('changeColor_'+this.props.canvName,(type,color1,color2,sWidth)=>{
      this.type = type;
      this.color1 = color1;
      this.color2 = color2;
      this.sWidth = sWidth;
      updateImg(true);
      paintRect();
    });
    eventProxy.on('changeColor2_'+this.props.canvName,(type,color1,color2,sWidth,dx,dy)=>{
      this.type = type;
      this.color1 = color1;
      this.color2 = color2;
      this.sWidth = sWidth;
      this.dx = dx-this.state.pX;
      this.dy = dy-this.state.pY;
      updateImg(true);
      paintRect();
    });
  	eventProxy.on('changeImg_'+this.props.canvName, (img)=>{
      this.oriImg = img;
      this.width = img.width;
      this.height = img.height;
      eventProxy.trigger('getSize',this.width,this.height);
      updateImg(false);
      paintRect();
  	});
    eventProxy.on('querySize_'+this.props.canvName, ()=>{
      eventProxy.trigger('getSize',this.width,this.height);
    });
    eventProxy.on('changeSize_'+this.props.canvName, updateSize);
    eventProxy.on('paintRect_'+this.props.canvName,paintRect);
    eventProxy.on('getSelSide_'+this.props.canvName,(x, y, resolve)=>{
      let disUp = Math.abs(y-this.state.pY);
      let disDown = Math.abs(y-(this.state.pY+this.height));
      let disLeft = Math.abs(x-this.state.pX);
      let disRight = Math.abs(x-(this.state.pX+this.width));
      let minval = Math.min(disUp,disDown,disLeft,disRight);
      if(minval > 5)resolve(-1);
      prepareCopy();
      if(disRight<=minval){
        resolve(1);
      }else if(disDown<=minval){
        resolve(2);
      }else if(disLeft<=minval){
        resolve(3);
      }else{
        resolve(0);
      }
    });
    eventProxy.on('resizeTo_'+this.props.canvName,(x, y, selside)=>{
      let newh,neww;
      switch(selside){
        case 0:
          if(y+10 >= (this.state.pY+this.height))break;
          newh = this.state.pY+this.height - y;
          this.state.pY = y;
          updateSize(this.width,newh);
          break;
        case 1:
          if(x-10 <= this.state.pX)break;
          neww = x-this.state.pX;
          updateSize(neww,this.height);
          break;
        case 2:
          if(y-10 <= this.state.pY)break;
          newh = y-this.state.pY;
          updateSize(this.width,newh);
          break;
        case 3:
          if(x+10 >= this.state.pX+this.width)break;
          neww = this.state.pX+this.width-x;
          this.state.pX = x;
          updateSize(neww,this.height);
          break;
        case -1:
          break;
        default:
          break;
      }
      if(selside !== -1)paintRect();
    });
  }
  ComponentWillUnmount(){
  	eventProxy.off('moveImg_'+this.props.canvName);
  	eventProxy.off('changeImg_'+this.props.canvName);
    eventProxy.off('changeColor_'+this.props.canvName);
    eventProxy.off('changeColor2_'+this.props.canvName);
    eventProxy.off('querySize_'+this.props.canvName);
    eventProxy.off('changeSize_'+this.props.canvName);
    eventProxy.off('getSelSide_'+this.props.canvName);
    eventProxy.off('resizeTo_'+this.props.canvName);
  }
  render(){
  	var cname;
  	if(this.props.back)cname = "scene sceneback";
  	else cname = "scene";
  	return (
  		<canvas id={this.props.canvName} className={cname} width={600} height={800}></canvas>
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
    this.mode = "move";
    this.selside = -1;
  }
  shouldComponentUpdate(nextProps, nextState){
	    return false;
	}
  componentDidMount(){
    var changeActiveLayer = (newLayerName,fn,args)=>{
      eventProxy.trigger('changeLayer_c',newLayerName);
      this.setState({activeLayer:newLayerName},
        ()=>{eventProxy.trigger('paintRect_'+newLayerName);},fn?fn.apply(this,args):null);
    }
    var changeHand = (mode)=>{
      this.mode = mode;
      if(mode === 'show'){
        let canv = document.getElementById('opLayer');
        let ctx = canv.getContext('2d');
        ctx.clearRect(0,0,canv.width,canv.height);
      }else{
        eventProxy.trigger('paintRect_'+this.state.activeLayer);
      }
      this.setState({press:false});
    }
  	function inborder(nowX, nowY){
  		let canv = document.getElementById(global.layerNames[0]);
      if(nowX<0||nowX>canv.width||nowY<0||nowY>canv.height)return -1;
      for(let i=global.layerNames.length-1;i>=0;i--){
        let canv = document.getElementById(global.layerNames[i]);
        let ctx = canv.getContext('2d');
        let color = ctx.getImageData(nowX, nowY, 1, 1).data;
        if(color[3]!==0)return global.layerNames[i];
      }
  		return 0;
  	}
    var doResize_sel =(layerName,pX,pY,newLayerName)=>{
      var press = (selside) =>{
        this.selside = selside;
        this.setState({press:true});
      }
      co(function*(){
        let selside = yield new Promise(function(resolve,reject){
          eventProxy.trigger('getSelSide_'+ layerName, pX, pY, resolve);
        });
        if(selside !== -1){
          press(selside);  
        }
        else if(newLayerName!==0){
          changeActiveLayer(newLayerName,()=>{eventProxy.trigger('paintRect_'+newLayerName);});
        }
      });
    }
    var changeRsizeHand = (pX,pY)=>{
      /*
      co(function*(){
        let selside = yield new Promise(function(resolve,reject){
          eventProxy.trigger('getSelSide_'+ layerName, pX, pY, resolve);
        });
        if(selside !== -1){
          press(selside);  
        }
        else if(newLayerName!==0){
          changeActiveLayer(newLayerName,()=>{eventProxy.trigger('paintRect_'+newLayerName);});
        }
      });
      */
    }
    var wirteHand = ()=>{

    }
  	addEventListener('mousedown', function(e) {
  		if(e.which!==1)return;
      let newLayerName = inborder(e.pageX, e.pageY);
	    if(newLayerName!==-1){
        console.log(this.mode);
        if(this.mode === 'move'){
          if(newLayerName===0)newLayerName=this.state.activeLayer;
          this.setState({
            press: true,
            mouseX: e.pageX,
            mouseY: e.pageY
          },changeActiveLayer(newLayerName));
        }else if(this.mode==='color'){
          if(newLayerName!==0){
            changeActiveLayer(newLayerName,(pageX,pageY)=>{eventProxy.trigger('getColorBase',pageX,pageY)},[e.pageX,e.pageY]);
          }
        }else if(this.mode==='resize'){
          doResize_sel(this.state.activeLayer,e.pageX, e.pageY, newLayerName);
        }
	    }
	    else this.setState({press: false});
  	}.bind(this));
  	addEventListener('mousemove', function(e){
  		switch(this.mode)
      {
        case 'move':
          if(this.state.press){
            eventProxy.trigger('moveImg_'+this.state.activeLayer,e.pageX-this.state.mouseX,e.pageY-this.state.mouseY);
            this.setState({
                mouseX: e.pageX,
                mouseY: e.pageY
              });
          }
          break;
        case 'resize':
          if(this.state.press){
            if(this.selside !== -1) eventProxy.trigger('resizeTo_'+this.state.activeLayer,e.pageX,e.pageY,this.selside);
          }
          else{
            changeRsizeHand(e.pageX,e.pageY);
          }
          break;
        default:
        break;
      }
      wirteHand();
  	}.bind(this));
  	addEventListener('mouseup', function(e){
  		if(e.which!==1)return;
  		this.setState({press: false});
  	}.bind(this));
  	eventProxy.on('changeLayer',changeActiveLayer);
    eventProxy.on('changeHand',changeHand)
  }
  ComponentWillUnmount(){
  	removeEventListener('mouseup');
  	removeEventListener('mousedown');
  	removeEventListener('mousemove');
  	eventProxy.off('changeLayer');
    eventProxy.off('changeHand');
  }
  render() {
    let items = [];
    for(let i = 0; i < global.layerNames.length; i ++){
      items.push(<CanvWrap key={i} canvName={global.layerNames[i]} back={i===0}/>);
    }
    return (
      <div>
        {items}
        <canvas id="opLayer" className="scene" width={600} height={800} /> 
        <canvas id="handLayer" className="scene" width={600} height={800} />       
      </div>
    );
  }
}

export default Scene;
