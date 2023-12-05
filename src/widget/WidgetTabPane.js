
import React, { Component } from "react";
import { Tabs, } from 'antd';

import '../css/widget/widget.tabPane.css'

const {TabPane} = Tabs;

class WidgetTabPane extends Component {
    constructor (props) {
        super(props);

        this.state = {
            value:props.value,
            tabPosition: props.tabPosition || 'top'

        }
    }

    /**
     * 值变化的回调函数
     * @param {*} value 
     */
    onChange = (value) => {


        const {data=[],that} = this.props;
        this.setState({value:value})
     
        if(this.props.onChange) this.props.onChange(value)
        data.map(item=>
        {
            if(item.value===Number(value) && item.path) {
                if(that.props.history.push){
                    that.props.history.push({ pathname: item.path})
                }
                if(that.props.history.history.push){
                    that.props.history.history.push({ pathname: item.path})
                }
            }
        })
    }

    /**
     * 编辑的回调函数
     * @param {*} active 
     * @param {*} e 
     */
    onEdit = (target, type) =>
    {
        if( this.props.onEdit )
        {
            this.props.onEdit(target, type);
        }
    }

    componentWillReceiveProps( nextProps )
    {
        const { value } = this.state;

        if( nextProps.value!==value )
        {
            this.setState({value:nextProps.value});
        }
    }

    render() {
        
        const { value } = this.state

        const { data=[], children, type, hideAdd, tabPosition = "top"} = this.props;

        return (
            <div className={`sf-tab-pane sd-tab-pane sg-tab-pane sf-page-tool-between  sf-flex1 ${tabPosition === 'left' ? 'sf-tab-left-pane' : ''}`}>
                <Tabs tabPosition={tabPosition} defaultActiveKey={String(value)} type={type || 'line'} 
                activeKey={String(value)} 
                    hideAdd={hideAdd} onChange={this.onChange} onEdit={this.onEdit}>
                { 
                    data.map((item) => {
                        return <TabPane tab={item.name} key={item.value} closable={item.closable} />
                    })
                }
                </Tabs>
                {children}
            </div>
        )
    }
}

export default WidgetTabPane;