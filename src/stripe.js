/*
  info栏的一堆东西
*/
import React, { Component } from 'react';
import reactCSS from 'reactcss'
import eventProxy from './eventProxy'
import {Select,InputNumber,Switch,Button} from 'antd'
import {SketchPicker as ColorChooser} from 'react-color'


import { Slider, Row, Col } from 'antd';

class IntegerStep extends React.Component {
  state = {
    inputValue: 5,
  }
  onChange = (value) => {
  	global.penRadius = value;
    this.setState({
      inputValue: value,
    });
  }
  render() {
    return (
      <Row>
      	<Col span={8}>
      		笔刷大小:
      	</Col>
        <Col span={8}>
          <Slider min={1} max={50} onChange={this.onChange} value={this.state.inputValue} />
        </Col>
        <Col span={4}>
          <InputNumber
            min={1}
            max={50}
            style={{ marginLeft: 12 }}
            value={this.state.inputValue}
            onChange={this.onChange}
          />
        </Col>
      </Row>
    );
  }
}






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
			height: 0,
			distance: 50
		};
	}
	componentDidMount(){
		eventProxy.on('changeLayer_c',(newLayer)=>{
			this.setState({nowLayer:newLayer});
			eventProxy.trigger('querySize_' + newLayer);
		});
		eventProxy.on('getColorBase',(pX,pY)=>{
			eventProxy.trigger('changeColor2_'+this.state.nowLayer,this.state.type,this.state.color1,this.state.color2,this.state.sWidth,this.state.distance,pX,pY);
		});
		eventProxy.on('getSize',(width,height)=>{
			this.setState({
				width:width,
				height:height
			});
		});
		eventProxy.on('getColor1',(resolve)=>{
			resolve(this.state.color1);
		});
	}
	componentWillUnmount(){
		eventProxy.off('changeLayer_c');
		eventProxy.off('getColorBase');
		eventProxy.off('getSize');
		eventProxy.off('getColor1');
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
				color1: color.hex,
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
		var handleChangeDistance = (dis)=>{
			this.setState({
				distance:dis
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
	        colorborder: {
	          width: '36px',
	          height: '15px',
	          display: 'inline-block',
	          	
	        },
	        color1: {
	          width: '36px',
	          height: '15px',
	          borderRadius: '2px',
	          background: this.state.color1,
	          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
	          cursor: 'pointer'
	        },
	        color2: {
	          width: '36px',
	          height: '15px',
	          borderRadius: '2px',
	          background: this.state.color2,
	          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
	          cursor: 'pointer'
	        },
	        popover: {
	          left: "-5px",
	          top: "10px",
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
				<h2>info</h2>
				<div style={styles.center}>
				layer:{this.state.nowLayer} <br/>
				{/*both side:<Switch defaultChecked={this.state.related} onChange={handleChangeRelated} /> &nbsp;&nbsp;
				<Select defaultValue={this.state.direction} style={{width:80}} onChange={handleChangeDirection} disabled={this.state.related}>
				    <Option value="front">front</Option>
				    <Option value="back">back</Option>
				</Select>
				<br/>*/}
				条纹样式:<Select defaultValue={this.state.type} style={{width:100}} onChange={handleChangeType}>
				    <Option value="pure">纯色</Option>
				    <Option value="horizontal">横条</Option>
				    <Option value="vertical">竖条</Option>
				    <Option value="plaid">格子</Option>
				    <Option value="spot">斑点</Option>
				</Select>
				<br/>
				宽度/半径:<InputNumber min={5} max={500} defaultValue={this.state.sWidth} onChange={handleChangeSWidth} />
				<br/>
				圆心距离:<InputNumber min={5} max={500} defaultValue={this.state.distance} onChange={handleChangeDistance} />
				<br/>
				<br/>
				颜色1:&nbsp;
				<div style={styles.colorborder}>
					<div style={styles.color1} onClick={handleClickColor1} />
					{this.state.color1Active?(<div style={styles.popover}><ColorChooser disableAlpha="true" width={205} color={this.state.color1} onChange={handleChangeColor1} /></div>):null}
				</div>
				<br/>
				颜色2:&nbsp;
				<div style={styles.colorborder}>
					<div style={styles.color2} onClick={handleClickColor2} />
					{this.state.color2Active?(<div style={styles.popover}><ColorChooser disableAlpha="true" width={205} color={this.state.color2} onChange={handleChangeColor2} /></div>):null}
				</div>
				<br/>
				宽:{this.state.width}&nbsp;&nbsp;&nbsp;&nbsp;
				高:{this.state.height}
				<br/>
				<br/>
				<IntegerStep />
				</div>
			</div>
			);
	}
}

export default Stripe;
