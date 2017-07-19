import React, { Component } from 'react';
import $ from 'jquery';
import './library.css'
import eventProxy from './eventProxy'

class Library extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	nowLayer: this.props.layerName,
    	choosed: {
    		canvas_top: -1,
    		canvas_middle: -1,
    		canvas_bottom: -1
    	}
    };
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
	  	function isTransparent(ok){
	  		return {borderColor: ok?"#33ccff":"transparent"}
	  	}
	  	let ret = [];
	  	if(true){
	  		let i =-1;
	  		let nextchoosed = {};
	  		$.extend(nextchoosed,this.state.choosed);
	  		nextchoosed[this.state.nowLayer]=i;
	  		ret.push(
	  			<div key={i} className="item" onClick={()=>{rechoose(i,this);}} style={isTransparent(i===this.state.choosed[this.state.nowLayer])}>
	  				null
	  			</div>
	  			);
	  	}
	  	for(let i=0;i<global.contents[this.state.nowLayer].length;i++){
	  		let nextchoosed = {};
	  		$.extend(nextchoosed,this.state.choosed);
	  		nextchoosed[this.state.nowLayer]=i;
	  		ret.push(
	  			<div key={i} className="item" onClick={(e)=>{rechoose(i,this);}} style={isTransparent(i===this.state.choosed[this.state.nowLayer])}>
	  				<img src={global.contents[this.state.nowLayer][i].src} alt={""} height={40} width={40}/>
	  			</div>
	  			);
	  	}
	  	return ret;
	}
  	var contents = getContents();
    return (
      <div>
      	<h1 style={{padding: 10}}>
      		{this.state.nowLayer+":"}
      	</h1>
      	{contents}
      </div>
    );
  }
}

export default Library;