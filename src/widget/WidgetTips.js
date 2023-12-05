
import React from "react";
import { Tooltip,  Button } from 'antd';

import 'antd/dist/antd.css';
import '../css/widget/widget.tip.css'

class WidgetTips extends React.Component
{ 
    constructor( props )
    {
        super(props);

        this.state = {
            title : props.title,
            tipContent : props.tipContent,
            position : props.position ? props.position : 'top',
            trigger : props.trigger!==undefined ? props.trigger : "hover",
            icon :  props.icon,
            isRequire : props.isRequire,
            source: props.source
        }
    }

    render ( )
    {
        const {title, tipContent, position, trigger, isRequire, source } = this.state;

        let { icon} = this.state, tooltip;

        if( isRequire===undefined || isRequire===null || isRequire===false )
        {
            // icon = source ? require('../img/project/icon/' + icon) : require("../img/tips/" + icon);
            icon = '';
        }

        if( icon!==undefined && icon!=="")
        {
            if( title!==undefined )
            {
                return (
                    <div className="swd-tips sfm-tips spj-tips spg-tips">
                        <Tooltip placement={position} trigger={trigger} title={tipContent}>
                            <Button><img src={icon} alt="es-lint want to get" />{title}</Button>
                        </Tooltip>
                    </div>
                )
            }
            else
            {
                return (
                    <div className="swd-tips sfm-tips spj-tips spg-tips">
                        <Tooltip placement={position} trigger={trigger} title={tipContent}>
                            <Button><img src={icon} alt="es-lint want to get" /></Button>
                        </Tooltip>
                    </div>
                )
            }
            
        }
        else
        {
            if( title!==undefined )
            {
                return (
                    <div className="swd-tips sfm-tips spj-tips spg-tips">
                        <Tooltip placement={position} trigger={trigger} title={tipContent}>
                            <Button>{title}</Button>
                        </Tooltip>
                    </div>
                )
            }
            else
            {
                return (
                    <div className="swd-tips sfm-tips spj-tips spg-tips">
                        <Tooltip placement={position} trigger={trigger} title={tipContent}>
                            <Button>{tipContent}</Button>
                        </Tooltip>
                    </div>
                )
            }   
        }
        
    }
}
export default WidgetTips