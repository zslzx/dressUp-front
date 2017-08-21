import React, { Component } from 'react';
import eventProxy from './eventProxy'
import Mypaint from './mypaint'

var ajaxget = require('./ajaxget.js');

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
    this.distance = "50"
    this.dx = null;
    this.dy = null;
    this.width = 0;
    this.height = 0;
    this.imgname = '';
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
    
    //画出边框
    var paintRect = ()=>{
      let canv = document.getElementById('opLayer');
      let ctx = canv.getContext('2d');
      ctx.clearRect(0,0,canv.width,canv.height);
      ctx.strokeRect(this.state.pX, this.state.pY, this.width, this.height);
    }
  	eventProxy.on('moveImg_'+this.props.canvName, (dx, dy)=>{
      this.setState({pX: this.state.pX+dx,pY: this.state.pY+dy},()=>{
  			showImg(this.props.canvName, this.state.img,this.state.pX,this.state.pY);
        paintRect();
        if(this.props.canvName === global.layerNames[0]){
          global.modelX = this.state.pX;
          global.modelY = this.state.pY;
        }
  		});
  	});
    
    //更新图片
    let updateImg = (reColor)=>{
      let canvasBuffer = this.state.img;
      let contextBuffer = this.state.img.getContext("2d");
      canvasBuffer.width=this.width;
      canvasBuffer.height=this.height;
      contextBuffer = this.state.img.getContext("2d");
      contextBuffer.clearRect(0, 0, canvasBuffer.width, canvasBuffer.height);
      if(this.oriImg){
        
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
          case 'spot':
            Mypaint.paint_spot(imgData,this.color1,this.color2,this.sWidth,this.distance,this.dx,this.dy);
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

    //更改大小
    let updateSize = (width,height)=>{
      this.width = width;
      this.height = height;
      let canv = document.createElement('canvas');
      canv.width = width;
      canv.height = height;
      let ctx = canv.getContext('2d');
      ctx.clearRect(0, 0, canv.width, canv.height);
      let ratio = global.getPixelRatio(ctx);
      ctx.drawImage(this.copy,0,0,width*ratio,height*ratio);
      this.state.img = canv;
      showImg(this.props.canvName, this.state.img,this.state.pX,this.state.pY);
      eventProxy.trigger('getSize',this.width,this.height);
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

    //上色（已经没用了）
    eventProxy.on('changeColor_'+this.props.canvName,(type,color1,color2,sWidth)=>{
      this.type = type;
      this.color1 = color1;
      this.color2 = color2;
      this.sWidth = sWidth;
      updateImg(true);
      paintRect();
    });

    //上色加强版
    eventProxy.on('changeColor2_'+this.props.canvName,(type,color1,color2,sWidth,distance,dx,dy)=>{
      this.type = type;
      this.color1 = color1;
      this.color2 = color2;
      this.sWidth = sWidth;
      this.distance = distance;
      this.dx = dx-this.state.pX;
      this.dy = dy-this.state.pY;
      updateImg(true);
      paintRect();
    });

   //更改图片
    eventProxy.on('changeImg_'+this.props.canvName, (img,imgname)=>{
      this.oriImg = img;
      this.imgname = imgname;
      let szinfo = ajaxget('/Interfaces/Getszinfo',{modelname:global.modelName,imgname:imgname,width:img?img.width:0,height:img?img.height:0});
      szinfo.dx = parseInt(szinfo.dx);
      szinfo.dy = parseInt(szinfo.dy);
      szinfo.width = parseInt(szinfo.width);
      szinfo.height = parseInt(szinfo.height);
      this.width = szinfo.width;
      this.height = szinfo.height;
      eventProxy.trigger('getSize',this.width,this.height);//同时把info界面的显示改了
      if(this.props.canvName === global.layerNames[0]){
        global.modelX = szinfo.dx;
        global.modelY = szinfo.dy;
        this.setState({pX:szinfo.dx,pY:szinfo.dy},()=>{
          updateImg(false);
          paintRect();  
        });
      }
      else{
        this.setState({pX:szinfo.dx+global.modelX,pY:szinfo.dy+global.modelY},()=>{
          updateImg(false);
          paintRect();  
        });
      }
    });

    eventProxy.on('querySize_'+this.props.canvName, ()=>{
      eventProxy.trigger('getSize',this.width,this.height);
    });

    eventProxy.on('changeSize_'+this.props.canvName, updateSize);

    eventProxy.on('paintRect_'+this.props.canvName,paintRect);
    
    //检测鼠标是否处于方框边沿，并返回处于哪个边沿
    eventProxy.on('getSelSide_'+this.props.canvName,(x, y, resolve)=>{
      if(x > this.state.pX + this.width + 5 || x < this.state.pX - 5 || y < this.state.pY - 5 || y > this.state.pY + this.height + 5)resolve(-1);
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

    //通过拖动更改大小
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

    //保存信息
    eventProxy.on('saveData_'+this.props.canvName,()=>{
      if(this.props.canvName === global.layerNames[0]){
        ajaxget('/Interfaces/saveData',{modelname:global.modelName,imgname:this.imgname,dx:this.state.pX,dy:this.state.pY,width:this.width,height:this.height});
      }else{
        ajaxget('/Interfaces/saveData',{modelname:global.modelName,imgname:this.imgname,dx:this.state.pX-global.modelX,dy:this.state.pY-global.modelY,width:this.width,height:this.height});
      }
    })
    
   //更改模特时触发的衣物调整
    eventProxy.on('adjust_'+this.props.canvName,()=>{
      if(this.imgname === '')return;
      let szinfo=ajaxget('/Interfaces/adjust',{
        modelname:global.modelName,
        imgname:this.imgname,
        dx:this.state.pX-global.modelX,
        dy:this.state.pY-global.modelY,
        width:this.width,
        height:this.height        
      });
      szinfo.dx = parseInt(szinfo.dx);
      szinfo.dy = parseInt(szinfo.dy);
      szinfo.width = parseInt(szinfo.width);
      szinfo.height = parseInt(szinfo.height);
      this.setState({pX: szinfo.dx+global.modelX, pY: szinfo.dy+global.modelY},()=>{
        updateSize(szinfo.width,szinfo.height);
      });
    });
  }
  componentWillUnmount(){
    //移除事件
    eventProxy.off('moveImg_'+this.props.canvName);
    eventProxy.off('changeImg_'+this.props.canvName);
    eventProxy.off('changeColor_'+this.props.canvName);
    eventProxy.off('changeColor2_'+this.props.canvName);
    eventProxy.off('querySize_'+this.props.canvName);
    eventProxy.off('changeSize_'+this.props.canvName);
    eventProxy.off('getSelSide_'+this.props.canvName);
    eventProxy.off('resizeTo_'+this.props.canvName);
    eventProxy.off('saveData_'+this.props.canvName);
    eventProxy.off('adjust_'+this.props.canvName);
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

export default CanvWrap;
