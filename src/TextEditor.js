import React, { Component } from 'react';
import eventProxy from './eventProxy'
import { Modal, Button, InputNumber, Input } from 'antd';

class TextEditor extends Component{
	constructor(props){
		super(props);
		this.state={
			visible: false,
			text: '',
			fontSize: 20
		}
	}
	componentDidMount(){
		eventProxy.on('changeMode',(mode)=>{
			if(mode === 'text')this.setState({
				visible: true,
			});
		});
	}
	componentWillUnmount(){
	}
	render(){
		var changeText = (e)=>{
			let value = e.target.value;
			this.setState({text: value});
		}
		var changeFontSize = (value)=>{
			this.setState({fontSize: value});
		}
		var handleCancel = (e)=>{
			this.setState({
		     	visible: false,
		    });
		}
		var handleOk = (e)=>{
			eventProxy.trigger('changeText',this.state.text,this.state.fontSize);
			this.setState({
				visible: false,
			});
		}
		return (
			<Modal
	          title="TextEditor"
	          visible={this.state.visible}
	          onOk={handleOk}
	          onCancel={handleCancel}
	        >
	          <div className="box2">
	            文字:<Input value={this.state.text} onChange={changeText}/>
	            文字大小:<InputNumber min={1} max={1000} value={this.state.fontSize} onChange={changeFontSize} />
	          </div>
	        </Modal>
        )
	}
}
export default TextEditor;
