import React, { Component } from 'react'
import Library from './library'
import {Tabs, Checkbox} from 'antd'
import eventProxy from './eventProxy'

class LibBox extends Component {
	constructor(props){
		super(props);
		this.state = {
			legs : true,
			arms: true,
			back: false
		};
	}
	render(){
		function changeLayer(key){
			eventProxy.trigger('changeLayer',key);
		}
		var TabPane = Tabs.TabPane;
		var tabs=[];
		for(let i = 0; i < global.layerNames.length; i ++){
			tabs.push( <TabPane tab={global.layerNames_show[i]} key={global.layerNames[i]}> <Library layerName={global.layerNames[i]} filter={this.state}/> </TabPane> );
		}
		var changeArms = (e)=>{
			this.setState({arms: e.target.checked});
		}
		var changeLegs = (e)=>{
			this.setState({legs: e.target.checked});
		}
		var changeBack = (e)=>{
			this.setState({back: e.target.checked});
		}
		return (
			<div>
				<div className="box_center" >
					<Checkbox checked={this.state.arms} onChange={changeArms}>手臂</Checkbox>
					<Checkbox checked={this.state.legs} onChange={changeLegs}>腿</Checkbox>
					<Checkbox checked={this.state.back} onChange={changeBack}>背面</Checkbox>
				</div>
				<div className="box" >
	  				<Tabs defaultActiveKey={global.layerNames[0]} onChange={changeLayer} tabPosition="left" size="small" type="card">
		  				{tabs}
					</Tabs>
				</div>
			</div>
		);
	}
}

export default LibBox;
