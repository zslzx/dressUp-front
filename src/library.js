import React, { Component } from 'react';
import eventProxy from './eventProxy'

class Library extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	nowLayer: this.props.layerName,
 		choosed: -1,
    	filter: this.props.filter
    };
    this.list = [];
  }
  componentWillReceiveProps(nextProps){
  	this.setState({filter: nextProps.filter});
  }
  render() {
  	var getContents = ()=>{
	  	var rechoose = (i)=>{
	  		let img = new Image();
	  		img.src = i !== -1 ? global.contents[this.state.nowLayer][this.list[i]].src : null;
	  		let imgname = i !== -1 ? global.contents[this.state.nowLayer][this.list[i]].name : '';
	  		if(this.state.nowLayer === global.layerNames[0])global.modelName = imgname;
	  		eventProxy.trigger('changeImg_'+this.state.nowLayer,img,imgname);
	  		if(this.state.nowLayer === global.layerNames[0]){
	  			for(let j in global.layerNames){
	  				if(j==0)continue;
	  				eventProxy.trigger('adjust_'+global.layerNames[j]);
	  			}
	  		}
	  		this.setState({choosed: i});

	  	};
	  	function isTransparent(ok){
	  		return {borderColor: ok?"#108EE9":"transparent"}
	  	}

	  	function analysis(str){
	  		let ret = {};
	  		ret.arms = (str.indexOf('-noarms') === -1);
	  		ret.legs = (str.indexOf('-nolegs') === -1);
	  		ret.back = (str.indexOf('-back') !== -1);
	  		return ret;
	  	}
	  	this.list = [];
	  	let filter = this.state.filter;
	  	for(let i=0;i<global.contents[this.state.nowLayer].length;i++){
	  		let res = analysis(global.contents[this.state.nowLayer][i].name);
	  		if(res.back === filter.back && (this.state.nowLayer !== global.layerNames[0] || (res.legs===filter.legs && res.arms===filter.arms) )){
	  			this.list.push(i);
	  		}
	  	}


	  	let ret = [];
	  	if(true){
	  		let i =-1;
	  		ret.push(
	  			<div key={i} className="item" onClick={()=>{rechoose(i);}} style={isTransparent(i===this.state.choosed)}>
	  				null
	  			</div>
	  			);
	  	}
	  	for(let i=0;i<this.list.length;i++){
	  		ret.push(<br />);
	  		ret.push(
	  			<div key={i} className="item" onClick={(e)=>{rechoose(i);}} style={isTransparent(i===this.state.choosed)}>
	  				<img src={global.contents[this.state.nowLayer][this.list[i]].src} alt={""} height={40} width={40}/>
	  			</div>
	  			);
	  	}
	  	return ret;
	}
  	var contents = getContents();
    return (
      <div>
      	{contents}
      </div>
    );
  }
}

export default Library;
