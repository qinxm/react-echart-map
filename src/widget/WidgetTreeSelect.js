import React, {Component} from 'react';

import { TreeSelect, Button, Divider} from 'antd';

import Widget from './Widget';

const { SHOW_ALL, SHOW_PARENT } = TreeSelect;

class WidgetTreeSelect extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            data: props.data || [],
            options: props.options || {},
            placeholder: props.options && props.options.title || '请选择',
            type: props.options && props.options.type || 'check',
            maxTagCount:props.options && props.options.maxTagCount || 1,
            width: props.width || 180,
            dropdownMatchSelectWidth : props.dropdownMatchSelectWidth || true,
            divID : Widget.randomString(12),
        }
    }

    /**
     * 值变化的回调函数
     * @param {*} value 
     * @param {*} label 
     */
    handleChange = (values, label,extra) => 
    {
        console.log(values, 111232);
        const { type } = this.state;
        const {labelInValue} = this.props;

        let selectValues = [];

        if(!labelInValue) 
        {
            selectValues = values;
        }
        else
        {
            if( type==="check" )
            {
                for( let item of values )
                {
                    console.log(item, 22);
                    selectValues.push( item.value);
                }
            }
            else
            {
                selectValues.push(values.value);
            }
        }
        
        if( this.props.onSelect!==undefined )
        {
            console.log(selectValues, values, label);
            this.props.onSelect([...selectValues], [...values], label)
        }

             
        if( this.props.onChange!==undefined )
        {
            this.props.onChange([...selectValues], [...values], label)
        }


        this.setState({defaultValue:[...selectValues]})
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
                this.setState({value:[]});
            }
        }

        if( nextProps.data!==data  )
        {
            this.setState({data:nextProps.data});
        }
    }

    render()
    {
        const {data, value, width, placeholder, type, divID, maxTagCount, dropdownMatchSelectWidth,dropdownStyle} = this.state;

        let { defaultValue, allowClear=true, showSearch=true, labelInValue, treeDefaultExpandAll=false, open, showAll=false} = this.props;

        // function dropdownRender(menus) {
        //     return (
        //       <div>
        //         {menus}
        //         <Divider style={{ margin: 0 }} />
        //         <div style={{ padding: 8 }}>The footer is not very short.</div>
        //       </div>
        //     );
        //   }

        if( type==="check")
        {
            return <div id={divID } className='sf-select sd-select sg-select'>
                <TreeSelect 
                    placeholder={placeholder}
                    treeData={data}
                    style={{width}}
                    open={open}
                    defaultValue={defaultValue}
                    value={value}
                    allowClear={allowClear}
                    showSearch={showSearch}
                    labelInValue={labelInValue}
                    maxTagCount = {maxTagCount}
                    dropdownMatchSelectWidth = {dropdownMatchSelectWidth}
                    treeDefaultExpandAll={treeDefaultExpandAll}
                    // multiple
                    treeCheckable={true}
                    showCheckedStrategy={showAll ? SHOW_ALL : SHOW_PARENT}
                    treeNodeFilterProp='label'
                    onChange={this.handleChange}
                    getPopupContainer = { () => document.getElementById(divID) }
                    // dropdownRender = {(menus) => {
                    //     return (
                    //         <div style={{padding : 5}}>
                    //             {menus}
                    //             <Divider style={{ margin: 0 }} />
                    //             <div style={{ padding: 8 }}>
                    //                 <Button onClick={this.clear} type="default">清空</Button>
                    //                 <Button onClick={this.checkAll} type="default">全选</Button>
                    //                 <Button onClick={this.cancle} type="default">取消</Button>
                    //                 <Button onClick={this.confirm} type="primary">确认</Button>
                    //             </div>
                    //         </div>
                    //     )}
                    // }
                />
            </div>
        }
        else
        {
            let value = undefined;
            
            if( defaultValue!==undefined )
            {
                value = defaultValue[0];
            }

            return <div id={divID} className='sf-select sd-select sg-select'>
                <TreeSelect 
                    placeholder={placeholder}
                    treeData={data}
                    style={{width}}
                    open={open}
                    defaultValue={value}
                    allowClear={allowClear}
                    showSearch={showSearch}
                    labelInValue={labelInValue}
                    // multiple
                    treeCheckable={false}
                    showCheckedStrategy={showAll ? SHOW_ALL : SHOW_PARENT}
                    treeNodeFilterProp='label'
                    treeDefaultExpandAll={treeDefaultExpandAll}
                    onChange={this.handleChange}
                    getPopupContainer = { () => document.getElementById(divID) }
                />
            </div>
        }
       
    }
}

export default WidgetTreeSelect;