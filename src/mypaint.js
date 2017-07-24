const Mypaint = {
	hexToRgb: function(hex) {
	    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
	        return r + r + g + g + b + b;
	    });

	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	},
	paint: function(imgData,color,dx,dy){
		function Add(a,b){
			a+=b;
			if(a>255)a=255;
			if(a<0)a=0;
			return a;
		}
		var dstRGB = this.hexToRgb(color);
		if(dx !== null && dy !== null){
			let pos = (dy*imgData.width+dx)*4;
			dstRGB.r-=imgData.data[pos];
			dstRGB.g-=imgData.data[pos+1];
			dstRGB.b-=imgData.data[pos+2];
			for (let i=0;i<imgData.data.length;i+=4){
				if(imgData.data[i+3]===0)continue;
				//if(imgData.data[i]===0&&imgData.data[i+1]===0&&imgData.data[i+2]===0)continue;
				imgData.data[i]=Add(imgData.data[i],dstRGB.r);
				imgData.data[i+1]=Add(imgData.data[i+1],dstRGB.g);
				imgData.data[i+2]=Add(imgData.data[i+2],dstRGB.b);
			}
		}else{
			for (let i=0;i<imgData.data.length;i+=4){
				if(imgData.data[i+3]===0)continue;
				if(imgData.data[i]===0&&imgData.data[i+1]===0&&imgData.data[i+2]===0)continue;
				imgData.data[i]=dstRGB.r;
				imgData.data[i+1]=dstRGB.g;
				imgData.data[i+2]=dstRGB.b;
			}
		}
	},
	paint_horizontal: function(imgData,color1,color2,width,dx,dy){
		function Add(a,b){
			a+=b;
			if(a>255)a=255;
			if(a<0)a=0;
			return a;
		}
		var dstRGB1 = this.hexToRgb(color1);
		var dstRGB2 = this.hexToRgb(color2);
		var pos = 0;
		if(dx !== null && dy !== null){
			pos = (dy*imgData.width+dx)*4;
			dstRGB1.r-=imgData.data[pos];
			dstRGB1.g-=imgData.data[pos+1];
			dstRGB1.b-=imgData.data[pos+2];
			dstRGB2.r-=imgData.data[pos];
			dstRGB2.g-=imgData.data[pos+1];
			dstRGB2.b-=imgData.data[pos+2];
			pos = 0;
			for(let i=0;i<imgData.height;i++){
				for(let j=0;j<imgData.width;j++,pos +=4){
					let dstRGB = (Math.floor((i-dy)/width)%2) ? dstRGB1:dstRGB2;
					if(imgData.data[pos+3]===0)continue;
					//if(imgData.data[pos]===0&&imgData.data[pos+1]===0&&imgData.data[pos+2]===0)continue;
					imgData.data[pos]=Add(imgData.data[pos],dstRGB.r);
					imgData.data[pos+1]=Add(imgData.data[pos+1],dstRGB.g);
					imgData.data[pos+2]=Add(imgData.data[pos+2],dstRGB.b);
				}
			}
		}else{
			pos = 0;
			for(let i=0;i<imgData.height;i++){
				for(let j=0;j<imgData.width;j++,pos +=4){
					let dstRGB = (Math.floor(i/width)%2) ? dstRGB1:dstRGB2;
					if(imgData.data[pos+3]===0)continue;
					if(imgData.data[pos]===0&&imgData.data[pos+1]===0&&imgData.data[pos+2]===0)continue;
					imgData.data[pos]=dstRGB.r;
					imgData.data[pos+1]=dstRGB.g;
					imgData.data[pos+2]=dstRGB.b;
				}
			}	
		}
	},
	paint_vertical: function(imgData,color1,color2,width,dx,dy){
		function Add(a,b){
			a+=b;
			if(a>255)a=255;
			if(a<0)a=0;
			return a;
		}
		var dstRGB1 = this.hexToRgb(color1);
		var dstRGB2 = this.hexToRgb(color2);
		var pos = 0;
		if(dx !== null && dy !== null){
			pos = (dy*imgData.width+dx)*4;
			dstRGB1.r-=imgData.data[pos];
			dstRGB1.g-=imgData.data[pos+1];
			dstRGB1.b-=imgData.data[pos+2];
			dstRGB2.r-=imgData.data[pos];
			dstRGB2.g-=imgData.data[pos+1];
			dstRGB2.b-=imgData.data[pos+2];
			pos = 0;
			for(let i=0;i<imgData.height;i++){
				for(let j=0;j<imgData.width;j++,pos +=4){
					let dstRGB = (Math.floor((j-dx)/width)%2) ? dstRGB1:dstRGB2;
					if(imgData.data[pos+3]===0)continue;
					//if(imgData.data[pos]===0&&imgData.data[pos+1]===0&&imgData.data[pos+2]===0)continue;
					imgData.data[pos]=Add(imgData.data[pos],dstRGB.r);
					imgData.data[pos+1]=Add(imgData.data[pos+1],dstRGB.g);
					imgData.data[pos+2]=Add(imgData.data[pos+2],dstRGB.b);
				}
			}
		}else{
			pos = 0;
			for(let i=0;i<imgData.height;i++){
				for(let j=0;j<imgData.width;j++,pos +=4){
					let dstRGB = (Math.floor(j/width)%2) ? dstRGB1:dstRGB2;
					if(imgData.data[pos+3]===0)continue;
					if(imgData.data[pos]===0&&imgData.data[pos+1]===0&&imgData.data[pos+2]===0)continue;
					imgData.data[pos]=dstRGB.r;
					imgData.data[pos+1]=dstRGB.g;
					imgData.data[pos+2]=dstRGB.b;
				}
			}	
		}
	},
	paint_plaid: function(imgData,color1,color2,width,dx,dy){
		function Add(a,b){
			a+=b;
			if(a>255)a=255;
			if(a<0)a=0;
			return a;
		}
		var dstRGB1 = this.hexToRgb(color1);
		var dstRGB2 = this.hexToRgb(color2);
		var pos = 0;
		if(dx !== null && dy !== null){
			pos = (dy*imgData.width+dx)*4;
			dstRGB1.r-=imgData.data[pos];
			dstRGB1.g-=imgData.data[pos+1];
			dstRGB1.b-=imgData.data[pos+2];
			dstRGB2.r-=imgData.data[pos];
			dstRGB2.g-=imgData.data[pos+1];
			dstRGB2.b-=imgData.data[pos+2];
			pos = 0;
			for(let i=0;i<imgData.height;i++){
				for(let j=0;j<imgData.width;j++,pos +=4){
					let dstRGB = ( ( Math.floor((j-dx)/width)+Math.floor((i-dy)/width) )%2) ? dstRGB1:dstRGB2;
					if(imgData.data[pos+3]===0)continue;
					//if(imgData.data[pos]===0&&imgData.data[pos+1]===0&&imgData.data[pos+2]===0)continue;
					imgData.data[pos]=Add(imgData.data[pos],dstRGB.r);
					imgData.data[pos+1]=Add(imgData.data[pos+1],dstRGB.g);
					imgData.data[pos+2]=Add(imgData.data[pos+2],dstRGB.b);
				}
			}
		}else{
			pos = 0;
			for(let i=0;i<imgData.height;i++){
				for(let j=0;j<imgData.width;j++,pos +=4){
					let dstRGB = (( Math.floor(j/width) + Math.floor(i/width) )%2) ? dstRGB1:dstRGB2;
					if(imgData.data[pos+3]===0)continue;
					if(imgData.data[pos]===0&&imgData.data[pos+1]===0&&imgData.data[pos+2]===0)continue;
					imgData.data[pos]=dstRGB.r;
					imgData.data[pos+1]=dstRGB.g;
					imgData.data[pos+2]=dstRGB.b;
				}
			}	
		}
	}
}
export default Mypaint;
