import React, { Component } from "react";
import { Button, Drawer } from "antd";

class WidgetDrawer extends Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            options: props.options || {},
        }

        if( this.props.onRef ){
            this.props.onRef(this);
        }
    }

    open = () => {
        this.setState({visible: true});
    }

    onOkClick = (type) => () => {
        
        if(this.props[type]) this.props[type]();

        this.setState({visible: false});
    }

    render() 
    {
        const {visible, options} = this.state;
        const { isFooter=true, } = this.props;
        const {title,width} = options
        
        return (
            <div>
                <Drawer
                    visible={visible}
                    title={title}
                    size={options.size || 'large'}
                    onClose={this.onOkClick()}
                    closable={false}
                    width={width}
                    footer={isFooter && <>
                        <Button style={{marginRight: '10px'}} onClick={this.onOkClick()}>取消</Button>
                        <Button type="primary" onClick={this.onOkClick('onOk')}>确定</Button>
                    </>}
                    footerStyle={{textAlign: 'center'}}
                >
                    {this.props.children}
                </Drawer>
            </div>
        )
    }
}

export default WidgetDrawer;