
import React, { Component } from "react";
import { Popover } from 'antd';
import '../css/widget/widget.porver.css'
class WidgetPorver extends Component {
    constructor (props) {
        super(props);

        this.state = {
            clicked:false
        }
    }

    render() {
        const {clicked} = this.state;
        const {options} = this.props;
        const {trigger='hover',content,btn,title='',placement="bottomRight" } = options;
        return <div className="sf-porver sd-porver sg-porver">
                <Popover title={title} placement={placement} content={content} trigger={trigger} onVisibleChange={(e)=>this.setState({clicked:e})}  visible={clicked}>
                    <span onClick={()=>this.setState({clicked:!clicked})}>{btn }</span>
                </Popover>
            </div>
    }
}

export default WidgetPorver;