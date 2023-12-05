
// WidgetChart
import React from 'react';

import {Checkbox} from 'antd'

const CheckboxGroup = Checkbox.Group;

class WidgetCheckBox extends React.Component 
{
    constructor( props )
    {
        super( props );
        this.state = {
            indeterminate:false,
            checkAll:false,
            checkedList:[],
            defaultValue:this.props.defaultValue,
            data:[]
        }
    }

    onCheckAllChange = (isCheck) =>
    {
      
        const {data} = this.props;

        let item=[];

        data.map(key=>{
            item.push(key.value)
        })

        if( isCheck.target.checked )
        {
            this.props.onChange(item,data);
        }
        else
        {
            this.props.onChange([],[]);
        }

        this.setState({checkAll:isCheck.target.checked,checkedList:isCheck.target.checked ? item : [],indeterminate:false})
    }

    onChange = (value,E) =>
    {
        const {data} = this.props
        this.setState({checkedList:value,indeterminate:!!value.length && value.length < data.length,checkAll:!!value.length && value.length === data.length})

        
        let check =[]
        data.map(item=>
        {
            value.map(key=>
            {
                if(item.value===key)
                {
                    check.push(item)
                }
            })
           
        })
        this.props.onChange(value,check)
        
    }

    componentWillReceiveProps (nextProps)
    {
        let {checkedList,defaultValue,data} = this.state;
        if(nextProps && nextProps.defaultValue !== defaultValue)
        {
            if( defaultValue.value )
            {
                let key=[]
                defaultValue.map(item=>{
                    key.push(item.value)
                })
                this.setState({checkedList:key})
            }
            else
            {
                this.setState({checkedList:nextProps.defaultValue})
            }
            
            if( data.length>(nextProps.defaultValue).length )
            {
                this.setState({indeterminate:true})
            }
            else if( nextProps.defaultValue.length===0 )
            {
                this.setState({indeterminate:false})
            }
        }
    }

    render()
    {
        /**
         * 选中值
         */
        let {  checkedList,indeterminate,checkAll } = this.state;
        /**
         * 默认值
         * 可选值
         */
        const { defaultValue, data, title } = this.props; 

        return (
            <div className='swd-checkbox spj-checkbox spg-checkbox'>
                <div className='swd-checkTitle'>
                    <Checkbox indeterminate={indeterminate} onChange={this.onCheckAllChange} checked={checkAll}>
                        {title}
                    </Checkbox>
                </div>
                <div className='swd-checkgroup'>
                    <CheckboxGroup options={data} defaultValue={checkedList} value={checkedList} onChange={this.onChange} />
                </div>
            </div>
        )
    }
}

export default WidgetCheckBox