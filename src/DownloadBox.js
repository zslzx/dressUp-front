import React, { Component } from 'react'
import {Input,Button} from 'antd'

class DownloadBox extends Component{
	constructor(props){
		super(props);
		this.filename = 'resout.png';
	}
	render(){
		function base64Img2Blob(code){
		    var parts = code.split(';base64,');
		    var contentType = parts[0].split(':')[1];
		    var raw = window.atob(parts[1]);
		    var rawLength = raw.length;

		    var uInt8Array = new Uint8Array(rawLength);

		    for (var i = 0; i < rawLength; ++i) {
		      uInt8Array[i] = raw.charCodeAt(i);
		    }

		    return new Blob([uInt8Array], {type: contentType}); 
		}
		function downloadFile(fileName, content){
		   
		    var aLink = document.createElement('a');
		    var blob = base64Img2Blob(content); //new Blob([content]);
		  
		    aLink.download = fileName;
		    aLink.href = URL.createObjectURL(blob);
		    var evt = document.createEvent('MouseEvents');
		    evt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

		    aLink.dispatchEvent(evt);
		    console.log('why?');
		}
		var changeFileName = (value )=>{
			value = value.target.value;
			if(value === '')this.filename = 'resout.png';
			else this.filename = value + '.png';
		}
		var download = ()=>{
			let canv = document.createElement('canvas');
			canv.width = 600;
			canv.height = 800;
			let ctx = canv.getContext('2d');
			for(let i = 0; i < global.layerNames.length; i++){
				let img = document.getElementById(global.layerNames[i]);
				ctx.drawImage(img,0,0);
			}
			let img = document.getElementById('paintLayer');
			ctx.drawImage(img,0,0);
			img = document.getElementById('textLayer');
			ctx.drawImage(img,0,0);
			downloadFile(this.filename, canv.toDataURL("image/png"));
		}

		return(
			<div className="box">
				<h2>输出</h2>
				<div style={{margin: "auto",padding: "10px"}}>
					文件名:<Input placeholder="resout" onChange={changeFileName}/>
					<div className="box_center" style={{paddingTop:"10px"}}>
						<Button type="primary" icon="download" size='default' onClick={download}>下载</Button>
					</div>
				</div>
			</div>
		)
	}
}

export default DownloadBox;
