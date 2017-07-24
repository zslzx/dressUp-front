import React, { Component } from 'react';
import reactCSS from 'reactcss'
import eventProxy from './eventProxy'
import {Select,InputNumber,Switch,Button} from 'antd'
import {TwitterPicker as ColorChooser} from 'react-color'

var Option = Select.Option;
class Stripe extends Component{
	constructor(props){
		super(props);
		this.state={
			color1: "#ffffff",
			color2: "#ffffff",
			type: "pure",
			related: true,
			sWidth: 20,
			direction: "front",
			nowLayer: global.layerNames[0],
			color1Active: false,
			color2Active: false,
			width: 0,
			height: 0
		};
	}
	componentDidMount(){
		eventProxy.on('changeLayer_c',(newLayer)=>{
			this.setState({nowLayer:newLayer});
			eventProxy.trigger('querySize_' + newLayer);
		});
		eventProxy.on('getColorBase',(pX,pY)=>{
			eventProxy.trigger('changeColor2_'+this.state.nowLayer,this.state.type,this.state.color1,this.state.color2,this.state.sWidth,pX,pY);
		});
		eventProxy.on('getSize',(width,height)=>{
			this.setState({
				width:width,
				height:height
			});
		});
	}
	componentWillUnmount(){
		eventProxy.off('changeLayer_c');
		eventProxy.off('getColorBase');
		eventProxy.off('getSize');
	}
	render(){
		var handleChangeRelated = (value)=>{
			this.setState({
				related: value
			});
		}
		var handleChangeDirection = (value)=>{
			this.setState({
				direction: value
			});
		}
		var handleChangeType = (value)=>{
			this.setState({
				type: value
			});
		}
		var handleChangeSWidth = (value)=>{
			this.setState({
				sWidth: value
			});
		}
		var handleClickColor1 = ()=>{
			this.setState({
				color1Active: !this.state.color1Active
			});
		}
		var handleClickColor2 = ()=>{
			this.setState({
				color2Active: !this.state.color2Active
			});
		}
		var handleChangeColor1= (color)=>{
			this.setState({
				color1: color.hex
			});
		}
		var handleChangeColor2= (color)=>{
			this.setState({
				color2: color.hex
			});
		}
		var changeColor= ()=>{
			eventProxy.trigger('changeColor_'+this.state.nowLayer,this.state.type,this.state.color1,this.state.color2,this.state.sWidth);
		}
		var handleChangeWidth = (width)=>{
			this.setState({
				width:width
			});
		}
		var handleChangeHeight = (height)=>{
			this.setState({
				height:height
			});
		}
		var changeSize = ()=>{
			eventProxy.trigger('changeSize_'+this.state.nowLayer,this.state.width,this.state.height);
		}
		const styles = reactCSS({
	      'default': {
	        color1: {
	          width: '36px',
	          height: '15px',
	          borderRadius: '2px',
	          background: this.state.color1,
	          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
	          display: 'inline-block',
	          cursor: 'pointer'
	        },
	        color2: {
	          width: '36px',
	          height: '14px',
	          borderRadius: '2px',
	          background: this.state.color2,
	          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
	          display: 'inline-block',
	          cursor: 'pointer'
	        },
	        popover: {
	          left: "-5px",
	          top: "25px",
	          position: 'relative',
	          zIndex: '2',
	        },
	        center: {
	          margin: "auto",
	          padding: "10px"
	        }
	      },
	    });
		return (
			<div>
				<h2>stripe</h2>
				<div style={styles.center}>
				duixiang:{this.state.nowLayer} <br/>
				guanlian:<Switch defaultChecked={this.state.related} onChange={handleChangeRelated} /> &nbsp;&nbsp;
				<Select defaultValue={this.state.direction} style={{width:80}} onChange={handleChangeDirection} disabled={this.state.related}>
				    <Option value="front">zheng</Option>
				    <Option value="back">fan</Option>
				</Select>
				<br/>
				type:<Select defaultValue={this.state.type} style={{width:100}} onChange={handleChangeType}>
				    <Option value="pure">pure</Option>
				    <Option value="horizontal">horizontal</Option>
				    <Option value="vertical">vertical</Option>
				    <Option value="plaid">plaid</Option>
				</Select>
				<br/>
				sWidth/radius:<InputNumber min={5} max={500} defaultValue={this.state.sWidth} onChange={handleChangeSWidth} />
				<br/>
				<br/>
				&nbsp;color1:&nbsp;
				<div style={styles.color1} onClick={handleClickColor1}>
					{this.state.color1Active?(<div style={styles.popover}><ColorChooser width={205} color={this.state.color1} onChange={handleChangeColor1} /></div>):null}
				</div>
				<br/>
				<br/>
				&nbsp;color2:&nbsp;
				<div style={styles.color2} onClick={handleClickColor2}>
					{this.state.color2Active?(<div style={styles.popover}><ColorChooser width={205} color={this.state.color2} onChange={handleChangeColor2} /></div>):null}
				</div>
				<br/>
				width:<InputNumber min={0} max={1000} defaultValue={this.state.width} onChange={handleChangeWidth} />
				height:<InputNumber min={0} max={1000} defaultValue={this.state.height} onChange={handleChangeHeight} />
				{
				<div className="box_center">
					<Button type="primary" onClick={changeSize}>apply</Button>
				</div>
				}
				</div>
			</div>
			);
	}
}

export default Stripe;