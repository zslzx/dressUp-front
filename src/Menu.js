import React from 'react';
import {slide as Menu} from 'react-burger-menu'
import './Menu.css'
import eventProxy from './eventProxy'


class myMenu extends React.Component {
  render () {
    function changelayer(layerName){
      //alert(window.choosedCanvas);
      //eventProxy.trigger('changeLayer',layerName);
      //eventProxy.trigger('changeLayer_1',layerName);
      return false;
    }
    return (
      <Menu>
        <h1>Choose Layer</h1>
        <a id="seltop" className="menu-item" href="javascript:void(0)" onClick={()=>changelayer('canvas_top')}>top</a>
        <a id="selmid" className="menu-item" href="javascript:void(0)" onClick={()=>changelayer('canvas_middle')}>middle</a>
        <a id="selbot" className="menu-item" href="javascript:void(0)" onClick={()=>changelayer('canvas_bottom')}>bottom</a>
      </Menu>
    );
  }
}

export default myMenu;