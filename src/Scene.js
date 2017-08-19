import React, { Component } from 'react';
import eventProxy from './eventProxy'
import CanvWrap from './CanvWrap'
import CanvWrapText from './CanvWrapText'
var co = require('co');

class Scene extends Component {
  constructor(props){
  	super(props);
  	this.state = {
  		activeLayer: global.layerNames[0],
  		mouseX: 0,
  		mouseY: 0,
  		press: false
  	};
    this.mode = "hand";
    this.selside = -1;
    this.moved = false;
    this.newLayerName = this.state.activeLayer;
    this.pointer = 'normal';
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
    var changeMode = (mode)=>{
      this.mode = mode;
      if(mode === 'show' || mode === 'pen' || mode === 'eraser' || mode === 'text'){
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
    function paint(mode, x2, y2, x1, y1){
      let asin = global.penRadius*Math.sin(Math.atan((y2-y1)/(x2-x1)));
      let acos = global.penRadius*Math.cos(Math.atan((y2-y1)/(x2-x1)))
      let x3 = x1+asin;
      let y3 = y1-acos;
      let x4 = x1-asin;
      let y4 = y1+acos;
      let x5 = x2+asin;
      let y5 = y2-acos;
      let x6 = x2-asin;
      let y6 = y2+acos;
      let canv = document.getElementById('paintLayer');
      let ctx = canv.getContext('2d');
      if(mode === 'pen'){
        co(function*(){
          let pColor = yield new Promise(function(resolve,reject){
            eventProxy.trigger('getColor1',resolve);
          });
          
          ctx.beginPath();
          ctx.arc(x2,y2,global.penRadius,0,2*Math.PI);
          ctx.fillStyle=pColor;
          ctx.fill();

          ctx.beginPath()
          ctx.moveTo(x3,y3);
          ctx.lineTo(x5,y5);
          ctx.lineTo(x6,y6);
          ctx.lineTo(x4,y4);
          ctx.closePath();
          ctx.fill();

        });
      }else if(mode === 'eraser'){
        ctx.save();
        ctx.beginPath();
        ctx.arc(x2,y2,global.penRadius,0,2*Math.PI);
        ctx.clip();
        ctx.clearRect(0,0,canv.width,canv.height);
        ctx.restore();

        ctx.save();
        ctx.beginPath()
        ctx.moveTo(x3,y3);
        ctx.lineTo(x5,y5);
        ctx.lineTo(x6,y6);
        ctx.lineTo(x4,y4);
        ctx.closePath();
        ctx.clip();
        ctx.clearRect(0,0,canv.width,canv.height);
        ctx.restore();
      }
      
    }
    var handPress =(layerName,pX,pY,newLayerName)=>{
      this.moved=false;
      this.setState({press:true, mouseX:pX, mouseY:pY});
      if(this.mode==='color'&&newLayerName!==0){
        changeActiveLayer(newLayerName,()=>{eventProxy.trigger('paintRect_'+newLayerName);});
      }
    }
    var penPress =(pX,pY)=>{
      this.setState({press:true, mouseX:pX, mouseY:pY});
      paint(this.mode,pX,pY,pX,pY);
    }
    var changePointer = (pX,pY)=>{
      let activeLayer = this.state.activeLayer;
      let changeto = (pointer)=>{
        this.pointer = pointer;
      }
      let changeselside = (selside)=>{
        this.selside = selside;
      } 
      if(this.mode === 'hand'){
        if(this.state.activeLayer === global.layerNames[0]){
          changeselside(-1);
          changeto('normal');
        }
        else{
          co(function*(){
            let selside = yield new Promise(function(resolve,reject){
              eventProxy.trigger('getSelSide_'+ activeLayer, pX, pY, resolve);
            });
            changeselside(selside);
            switch(selside){
              case 0:
                changeto('resize_ud');
                break;
              case 1:
                changeto('resize_lr');
                break;
              case 2:
                changeto('resize_ud');
                break;
              case 3:
                changeto('resize_lr');
                break;
              case -1:
              default:
                changeto('normal'); 
            }
          });
        }
      }else if(this.mode === 'color'){
        changeto('color');
      }else if(this.mode === 'pen' || this.mode === 'eraser'){
        changeto('pen');
      }else changeto('normal');
    }
    var drawPointer = (x, y)=>{
      let img = global.pointer.img[this.pointer];
      let canv = document.getElementById('pointerLayer');
      let ctx = canv.getContext('2d');
      ctx.clearRect(0, 0, canv.width, canv.height);
      if(this.pointer === 'pen'){
        ctx.beginPath();
        ctx.arc(x,y,global.penRadius,0,2*Math.PI);
        ctx.stroke();
      }
      if(this.pointer==='normal' || this.pointer==='pen'){
        ctx.drawImage(img, x, y);
      }
      else ctx.drawImage(img, x-32, y-32);
    }
    
  	addEventListener('mousedown', function(e) {
  		if(e.which!==1)return;
      let newLayerName = inborder(e.pageX, e.pageY);
	    if(newLayerName!==-1){
        if(this.mode === 'hand'){
          handPress(this.state.activeLayer,e.pageX, e.pageY, newLayerName);
          if(newLayerName===0)newLayerName=this.state.activeLayer;
          this.newLayerName = newLayerName;
        }else if(this.mode==='color'){
          if(newLayerName!==0){
            changeActiveLayer(newLayerName,(pageX,pageY)=>{eventProxy.trigger('getColorBase',pageX,pageY)},[e.pageX,e.pageY]);
          }
        }else if(this.mode==='pen'){
          penPress(e.pageX,e.pageY);
        }else if(this.mode==='eraser'){
          penPress(e.pageX,e.pageY);
        }else if(this.mode==='text'){
          this.setState({press:true, mouseX:e.pageX, mouseY:e.pageY});
        }
	    }
	    else this.setState({press: false});
  	}.bind(this));

  	addEventListener('mousemove', function(e){
      this.moved = true;
  		switch(this.mode)
      {
        case 'hand':
          if(this.state.press){
            if(this.selside !== -1) eventProxy.trigger('resizeTo_'+this.state.activeLayer,e.pageX,e.pageY,this.selside);
            else{
              eventProxy.trigger('moveImg_'+this.state.activeLayer,e.pageX-this.state.mouseX,e.pageY-this.state.mouseY);
              this.setState({
                  mouseX: e.pageX,
                  mouseY: e.pageY
                });
            }
          }
          else{
            changePointer(e.pageX,e.pageY);
          }
          break;
        case 'pen':
        case 'eraser':
          if(this.state.press){
            paint(this.mode,e.pageX,e.pageY,this.state.mouseX,this.state.mouseY);
            this.setState({
                  mouseX: e.pageX,
                  mouseY: e.pageY
                });
          }else{
            changePointer(e.pageX,e.pageY);
          }
          break;
        case 'text':
          if(this.state.press){
            eventProxy.trigger('moveText',e.pageX-this.state.mouseX,e.pageY-this.state.mouseY);
            this.setState({
                  mouseX: e.pageX,
                  mouseY: e.pageY
                });
          }else{
            changePointer(e.pageX,e.pageY);
          }
          break;
        default:
          changePointer(e.pageX,e.pageY);
        break;
      }
      drawPointer(e.pageX,e.pageY);
  	}.bind(this));

  	addEventListener('mouseup', function(e){
  		if(e.which!==1)return;
      if(this.mode==='hand' && this.moved){
        eventProxy.trigger('saveData_'+this.state.activeLayer);
      }
      if(this.mode!=='show' && this.state.press && !this.moved && this.newLayerName !== this.state.activeLayer){
        changeActiveLayer(this.newLayerName);
      }
  		this.setState({press: false});
  	}.bind(this));
  	eventProxy.on('changeLayer',changeActiveLayer);
    eventProxy.on('changeMode',changeMode)
  }
  ComponentWillUnmount(){
  	removeEventListener('mouseup');
  	removeEventListener('mousedown');
  	removeEventListener('mousemove');
  	eventProxy.off('changeLayer');
    eventProxy.off('changeMode');
  }
  render() {
    let items = [];
    for(let i = 0; i < global.layerNames.length; i ++){
      items.push(<CanvWrap key={i} canvName={global.layerNames[i]} back={i===0}/>);
    }
    return (
      <div style={{cursor:"none"}}>
        {items}
        <canvas id="paintLayer" className="scene" width={600} height={800} />
        <CanvWrapText />
        <canvas id="opLayer" className="scene" width={600} height={800} /> 
        <canvas id="pointerLayer" className="scene" width={600} height={800} />
      </div>
    );
  }
}

export default Scene;
