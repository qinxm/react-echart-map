import React, {Component} from 'react';

import { Cascader } from 'antd';

import Widget from './Widget';

class WidgetSascaderSelect extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            data: props.data || [],
            options: props.options || {},
            placeholder: props.options && props.options.title || '请选择',
            width: props.width || 150,
            divID : Widget.randomString(12)
        }
    }

    /**
     * 选择内容变化的回调函数
     * @param { [string] } values 
     */
    handleChange = ( values ) => {

        const { data } = this.state;

        let items = [];

        for( let value of values )
        {
            let item = this.findItem(value, data);

            items.push(item);
        }
        
        this.setState({defaultValue:values});

        if( this.props.onSelect!==undefined )
        {
            this.props.onSelect(values, items);
        }
    }

    findItem = ( value, data ) => {

        for( let item of data )
        {
            if( item.value===value  )
            {
                delete item["children"];

                return item;
            }

            if( item.children!==undefined && item.children.length>0 )
            {
                return this.findItem(value, item.children);
            }
        }
    }

    componentWillReceiveProps( nextProps )
    {
        const { defaultValue, data } = this.state;

        if( nextProps.defaultValue!==defaultValue )
        {
            if( nextProps.defaultValue!==undefined )
            {
                this.setState({value:nextProps.defaultValue});
            }
            else
            {
                this.setState({value:""});
            }
        }

        if( nextProps.data!==data  )
        {
            this.setState({data:nextProps.data});
        }
    }

    render()
    {
        const { data, width, placeholder, defaultValue, divID} = this.state;

        const { allowClear=true, showSearch=true, labelInValue} = this.props;

        return <div className='widget_cascader' id={divID}>
            <Cascader 
                width = {width}
                options={data}
                onChange={this.handleChange} 
                defaultValue = {defaultValue}
                placeholder={placeholder}
                allowClear={allowClear}
                showSearch={showSearch}
                optionLabelProp="label"
                optionFilterProp="label"
                getPopupContainer = { () => document.getElementById(divID) }
            />
        </div>
    }
}

export default WidgetSascaderSelect;