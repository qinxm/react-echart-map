
import React, { Component } from "react";
import { Tabs, } from 'antd';
import '../css/widget/widget.tabPane.css'

const {TabPane} = Tabs;

class WidgetTabText extends Component {
    constructor (props) {
        super(props);

        this.state = {
            value:props.value,
        }
    }

    active = (value) =>{
        this.setState({value:value})
        if(this.props.onChange) this.props.onChange(value)
    }

    render() {
        const {value} = this.state
        const {data=[]} = this.props;
        return <div className="sf-tab-text sd-tab-text sg-tab-text">
            {
                data.map(item=>
                {
                    return <span onClick={()=>this.active(item.value)} className={value===item.value?'sg-filterColor':''}>{item.label}</span>
                })
            }
        </div>
    }
}

export default WidgetTabText;