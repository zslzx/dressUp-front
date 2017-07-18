import React, { Component } from 'react';
import $ from 'jquery';
import './library.css'
import eventProxy from './eventProxy'

class Library extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	nowLayer: 'canvas_top',
    	choosed: {
    		canvas_top: -1,
    		canvas_middle: -1,
    		canvas_bottom: -1
    	}
    };
  }
  componentDidMount(){
  	eventProxy.on('changeLayer_1',(layerName)=>{
		this.setState({nowLayer: layerName});
	});
  }
  ComponentWillUnmount(){
  	eventProxy.off('changeLayer_1');
  }
  render() {
  	var getContents = ()=>{
	  	function rechoose(i,that){
	  		let nextchoosed = {};
	  		$.extend(nextchoosed,that.state.choosed);
	  		nextchoosed[that.state.nowLayer]=i;
	  		let img = new Image();
	  		if(i !== -1)img.src = global.contents[that.state.nowLayer][i].src;
	  		else img =null;
	  		eventProxy.trigger('changeImg_'+that.state.nowLayer,img);
	  		that.setState({choosed: nextchoosed});
	  	};
	  	let ret = [];
	  	if(true){
	  		let i =-1;
	  		let nextchoosed = {};
	  		$.extend(nextchoosed,this.state.choosed);
	  		nextchoosed[this.state.nowLayer]=i;
	  		ret.push(
	  			<div key={i} className="item" onClick={()=>{rechoose(i,this);}} style={{border: (i===this.state.choosed[this.state.nowLayer])?"1px solid":"0px solid"}}>
	  				null
	  			</div>
	  			);
	  	}
	  	for(let i=0;i<global.contents[this.state.nowLayer].length;i++){
	  		let nextchoosed = {};
	  		$.extend(nextchoosed,this.state.choosed);
	  		nextchoosed[this.state.nowLayer]=i;
	  		ret.push(
	  			<div key={i} className="item" onClick={(e)=>{rechoose(i,this);}} style={{border: (i===this.state.choosed[this.state.nowLayer])?"1px solid":"0px solid"}}>
	  				<img src={global.contents[this.state.nowLayer][i].src} alt={""} height={40} width={40}/>
	  			</div>
	  			);
	  	}
	  	return ret;
	}
  	var contents = getContents();
    return (
      <div>
      	<p style={{padding: 10}}>
      		{this.state.nowLayer+":"}
      	</p>
      	{contents}
      </div>
    );
  }
}

export default Library;