
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';

class WidgetBreadCrumb extends Component {
    constructor (props) {
        super(props);

        this.state = {
            pattern:props.value,
        }
    }

    active = (value) =>{
        this.setState({pattern:value})
        this.props.onChange(value)
    }

    render() {
        const {data,separator='/'} = this.props;
        return <div className="sf-tab-pane sd-tab-pane sg-tab-pane">
            <Breadcrumb>
            {
                data.map((item,index)=>{
                    if(item.path)
                    {
                        return  <Breadcrumb.Item key={index} separator={separator} >
                        <Link to={{pathname:item.path}}>{item.title}</Link>
                    </Breadcrumb.Item>
                    }
                    else
                    {
                    return  <Breadcrumb.Item key={index} separator={separator}>
                        {item.title}
                    </Breadcrumb.Item>
                   }
                })
            }
               
            </Breadcrumb>
        </div>
    }
}

export default WidgetBreadCrumb;