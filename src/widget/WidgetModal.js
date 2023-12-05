import React, { Component } from "react";
import { Button, message, Modal } from "antd";

import '../css/widget/widget.modal.css';

class WidgetModal extends Component {
    constructor(props){
        super(props);

        this.state = {
            visible: false,
            wrapClassName:props.wrapClassName || props.options.wrapClassName || "sf-model-warp",
            className:props.className || "sf-model",
            options: props.options || {},
        }

        if( this.props.onRef )
        {
            this.props.onRef(this);
        }
    }

    open = () => {
        this.setState({visible: true});
    }

    onOkClick = (type) => () => {
        if( this.props[type] ) this.props[type]();
  
        if( this.props.isHide && type === 'onOk') return this.props.onOk();
        
        this.setState({visible: false});
    }

    onClose = () => this.setState({visible: false})
    
    render(){
       
        const {visible, options, wrapClassName, className} = this.state;
        const {title, okText = '确定', cancelText = '取消', isOk = true, isCancel = true, modalType = false, width, 
             type = '', message = '',bodyStyle={}, isNext = false, nextText='下一步',} = this.props.options || {};

        return <div className="swd-modal sfm-modal spj-modal spg-modal">
            <Modal
                // getContainer={false}
                visible={visible}
                title={title}
                width={width}
                height='500px'
                wrapClassName={wrapClassName}
                className = {className}
                bodyStyle={{...bodyStyle}}
                destroyOnClose={true}
                onOk={this.onOkClick('onOk')}
                onCancel={this.onClose}
                footer={modalType === 'form' ? null : [
                    isNext &&<Button type="back" onClick={()=>this.props.onOkClick('isNext')}>{nextText}</Button>,
                    isCancel && <Button type="back" onClick={this.onOkClick('onCancel')}>{cancelText}</Button>,
                    isOk && <Button type='primary' onClick={this.onOkClick('onOk')}>{okText}</Button>,
                ]}
            >
                {
                    type === 'message' ? <div>{message}</div> : this.props.children
                }
            </Modal>
        </div>
    }
}

export default WidgetModal;