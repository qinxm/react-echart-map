
import React, { Component } from "react";
import { Tabs, } from 'antd';
import '../css/widget/widget.tab.css'

const {TabPane} = Tabs;

class WidgetTab extends Component 
{
    constructor (props) 
    {
        super(props);

        this.state = {
            pattern:props.value,
            tabPosition: props.tabPosition || 'top'
        }
    }

    active = (value) => {

        this.setState({pattern:value});

        if(this.props.onChange) this.props.onChange(value);
    }

    onEdit = (active,e) => {

        if(this.props.onEdit) this.props.onEdit(e,active);

    }

    render() 
    {
        const {pattern,tabPosition} = this.state;

        const {data=[], children,type,hideAdd} = this.props;

        return (
            <div className="sf-tab sd-tab sg-tab sf-page-tool-between ">
                <Tabs tabPosition={tabPosition} defaultActiveKey={String(pattern)} type={type} activeKey={String(pattern)} hideAdd={hideAdd} onChange={this.active} onEdit={this.onEdit}>
                { 
                    data.map((item)=>{
                        return <TabPane tab={item.name} key={item.value} />
                    })
                }
                </Tabs>
                
                {children}
            </div>
        )
    }
}

export default WidgetTab;