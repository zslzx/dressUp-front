import React, { Component } from 'react';
import eventProxy from './eventProxy'

class CanvWrapText extends Component{
	constructor(props){
		super(props);
		this.text='';
		this.pX=0;
		this.pY=0;
		this.fontSize=1;
	}
	componentDidMount(){
		var update = ()=>{
			let canv = document.getElementById('textLayer');
			let ctx = canv.getContext('2d');
			ctx.clearRect(0,0,canv.width,canv.height);
			ctx.font = this.fontSize+"px serif";
			ctx.fillText(this.text,this.pX,this.pY+this.fontSize);
		}
		eventProxy.on('changeText',(text,fontSize)=>{
			this.text = text;
			this.fontSize = fontSize;
			this.pX = this.pY = 0;
			update();
		})
		eventProxy.on('moveText',(dx,dy)=>{
			this.pX+=dx;
			this.pY+=dy;
			update();
		});
		eventProxy.on('paintText',()=>{
			let canv = document.getElementById('textLayer');
			let ctx = document.getElementById('paintLayer').getContext('2d');
			ctx.drawImage(canv,0,0);
			console.log('?');
			ctx = canv.getContext('2d');
			ctx.clearRect(0,0,canv.width,canv.height);
		});
	}
	render(){
		return (<canvas id="textLayer" className="scene" width={600} height={800}></canvas>)
	}
}
export default CanvWrapText;