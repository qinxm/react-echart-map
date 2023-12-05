import React, { Component } from "react";
import { Popconfirm } from "antd";
import Widget from "./Widget";

class WidgetPopConfirm extends Component {
    constructor (props) {
        super(props)

        let divId = props.divId;
        if( !divId ) divId = Widget.randomString();

        this.state = {
            divId,
            visible: false,
            onConfirm: props.onConfirm
        }

        if( this.props.onRef ){
            this.props.onRef(this);
        }
    }

    open = () => {
        this.setState({visible: true});
    }

    onConfirm = () => {
        const {onConfirm} = this.state;
        if(onConfirm) this.props.onConfirm();
        this.setState({visible: false})
    }

    render() {
        const {visible, divId} = this.state;
        const {title = 'title', okText = '确定', cancelText = '取消', showCancel = true,} = this.props.options || {};

        return <div className="swd-popconfirm sfm-popconfirm spj-popconfirm spg-popconfirm">
            <Popconfirm 
                title={title} 
                visible={visible} 
                okText={okText}
                cancelText={cancelText}
                showCancel={showCancel}
                onConfirm={this.onConfirm} 
                onCancel={()=>{this.setState({visible: false})}}
                getPopupContainer={()=>document.getElementById(divId)}
            />
        </div>
    }
}

export default WidgetPopConfirm;