import React, {Component} from 'react';

import { Divider, Input, Select, Space, Typography } from 'antd';

import Widget from './Widget';
import '../css/widget/widget.select.css';
import WidgetMessage from './WidgetMessage';
import { options } from 'less';

const {Option} = Select;

class WidgetSelect extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            data: props.data || [],
            options: props.options || {},
            placeholder: ( props.options && props.options.title ) || '请选择',
            width: props.width || 150,
            divID : props.divID || Widget.randomString(12),
            addVal: '',
            defaultValue: props.defaultValue|| (props.mode ? [] : undefined)
        }
    }

    handleChange = (value, label) => {
        let item = this.findItem(value);
        let labels = null
        if(label){
            if(Array.isArray(label)){
                labels = label.map(item=>{return item.label})
            }else{
                labels = label.label
            }
        }
        

        this.setState({defaultValue:value});

        if( this.props.onSelect!==undefined )
        {
            this.props.onSelect(value, item, labels);
            // this.props.onChange(value, item, labels)
        }
        if( this.props.onChange!==undefined )
        {
            // this.props.onSelect(value, item, labels);
            this.props.onChange(value, item, labels)
        }

    }

    onSearch = (value) => {
        if( this.props.onSearch!==undefined )
        {
            this.props.onSearch(value);
        }
    }

    findItem = ( value ) => {

        const { data } = this.state;

        for( let item of data )
        {
            if( item.value===value  )
            {
                return item;
            }
        }
    }

    componentWillReceiveProps( nextProps )
    {
        const { defaultValue, data} = this.state;
        if( nextProps.defaultValue!==defaultValue )
        {
            if( nextProps.defaultValue!==undefined )
            {
                this.setState({defaultValue:nextProps.defaultValue});
            }
            else
            {
                this.setState({defaultValue: nextProps.mode ? [] : undefined});
            }
        }

        if( nextProps.data!==data  )
        {
            this.setState({data:nextProps.data});
        }
    }

    addItem = (e) => {
        e.preventDefault();
        const {data=[],addVal} = this.state;
        if(addVal)
        {
            let isArr=true
            data.map(item=>{
                console.log(item,addVal);
                if(item.label===addVal)
                {
                    isArr=false
                }
            })
            if(!isArr)
            {
                return WidgetMessage.info('该名称分组已存在')
            }
        }

        this.setState({addVal: ''})
        if(this.props.addItem) this.props.addItem(addVal)
    }

    render()
    {
        const { data = [], width, placeholder, defaultValue, divID, addVal,options} = this.state;
        const { allowClear=true, showSearch=false, dropdownRender=false, mode='',addtitle=' Add item' } = this.props;
        const {treeCheckable=false} = options
        if(options.type!=='form')
        {
            return <div className='sf-select sd-select sg-select' id={divID}>
            <Select 
                placeholder={placeholder}
                treeCheckable={treeCheckable}
                style={{width}}
                data={data}
                mode={mode}
                defaultValue={defaultValue}
                value={defaultValue}
                allowClear={allowClear}
                showSearch={showSearch}
                maxTagCount='responsive'
                optionLabelProp="label"
                optionFilterProp="label"
                onChange={(value, label)=>{this.handleChange(value, label)}}
                onSearch={this.onSearch}
                getPopupContainer = { () => document.getElementById(divID) }
                dropdownRender={ dropdownRender === true ? (menu) => {
                    return <>
                        {menu}
                        <Divider
                            style={{
                            margin: '8px 0',
                            }}
                        />
                        <Space
                            align="center"
                            style={{
                            padding: '0 8px 4px',
                            }}
                        >
                            <Input placeholder="请输入" value={addVal} onChange={(e)=>{this.setState({addVal: e.target.value})}} />
                            <Typography.Link
                            onClick={this.addItem}
                            style={{
                                whiteSpace: 'nowrap',
                            }}
                            >
                                {addtitle}
                            </Typography.Link>
                        </Space>
                    </> 
                } : null}
            >
                {
                    data.map(item=>{return <Option key={item.value} value={item.value} label={item.name ? item.name : item.label}>{item.label}</Option>})

                    // data.map(item=>{return <Option key={item.value} value={item.value} label={item.label}>{item.label}</Option>})
                }
            </Select>
        </div>
        }else
        {
        return <div className='sf-select sd-select sg-select' id={divID}>
            <Select 
                placeholder={placeholder}
                mode={mode}
                treeCheckable={treeCheckable}
                defaultValue={defaultValue}
                value={defaultValue}
                onChange={this.props.onChange}
                allowClear={allowClear}
                showSearch={showSearch}
                maxTagCount='responsive'
                optionLabelProp="label"
                optionFilterProp="label"
                getPopupContainer = { () => document.getElementById(divID) }
            >
                {
                    data.map(item=>{return <Option key={item.value} value={item.value} label={item.label}>{item.label}</Option>})
                    // data.map(item=>{return <Option key={item.value} value={item.value} label={item.label}>{item.label}</Option>})
                }
            </Select>
        </div>
        }
      
    }
}

export default WidgetSelect;