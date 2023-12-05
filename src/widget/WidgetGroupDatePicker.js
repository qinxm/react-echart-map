import React, { Component } from "react";
import { DatePicker } from "antd";
import moment from "moment";
import Widget from './Widget';
import '../css/widget/widget.dateGroupPicker.css';
const { RangePicker } = DatePicker;

class WidgetGroupDatePicker extends Component{
    constructor(props){
        super(props);

        let divId = props.divId;
        if( !divId ) divId = Widget.randomString();

        this.state = {
            divId,
            options: props.options || {},
            picker: props.picker || 'month',
            dateFormat: props.dateFormat || 'YYYY-MM',
            dateTypes: props.options && props.options.dateTypes || [{title:'月', value:'month'}],
            onChange: props.onChange || undefined,
            active: props.options && props.options.active || 'month'
        }
    }

    handleChange = (value, type) => {
        const {dateFormat, onChange} = this.state;
        let vals = [];
        if(type){
            vals = value && value.map(item=> {return moment(item).format(dateFormat)}) || []
        }else{
            vals = value && [moment(value).format(dateFormat)] || []
        }
        if(onChange) onChange(vals);
    }

    formatDateFormat = (item) => () => {
        const {dateTypes, picker} = this.state;
        let format = '', datePicker = '';
        switch(item.value){
            case 'month':
                datePicker = 'month';
                format = 'YYYY-MM';
                break;
            case 'quarter':
                datePicker = 'quarter';
                format = 'YYYY-QQ';
                break;
            case 'year':
                datePicker = 'year';
                format = 'YYYY';
                break;
            default:
                datePicker = '';
                format = 'YYYY-MM-DD';
                break;
        }
        this.setState({dateFormat: format, picker: datePicker, active: item.value})

    }

    render(){
        const {options, dateFormat, divId, dateTypes, picker, active} = this.state;
        const {defaultValue, allowClear=true, } = this.props;
        return <div className="sf-group-picker sd-group-picker sg-group-picker">
            {
                options.type ? 
                <div id={divId}>
                    <RangePicker 
                        getPopupContainer={()=>document.getElementById(divId)}
                        allowClear={allowClear}
                        defaultValue={[defaultValue[0] && moment(defaultValue[0], dateFormat), defaultValue[1] && moment(defaultValue[1], dateFormat)]}
                        dateFormat={dateFormat}
                        picker={picker}
                        onChange={(value)=>{this.handleChange(value, options.type)}}
                        renderExtraFooter={() => {
                            return(
                                dateTypes.map(item=>{
                                    return <span className={active === item.value ? 'sf-active-date' : ''} onClick={this.formatDateFormat(item)}>{item.title}</span>
                                })
                            )
                        }}
                    /> 
                </div> : 
                <div id={divId}>
                    <DatePicker
                        getPopupContainer={()=>document.getElementById(divId)}
                        allowClear={allowClear}
                        defaultValue={defaultValue[0] && moment(defaultValue[0], dateFormat)}
                        dateFormat={dateFormat}
                        picker={picker}
                        showToday={false}
                        onChange={(value)=>{this.handleChange(value, options.type)}}
                        renderExtraFooter={() => {
                            return(
                                dateTypes.map(item=>{
                                    return <span className={active === item.value ? 'sf-active-date' : ''} onClick={this.formatDateFormat(item)}>{item.title}</span>
                                })
                            )
                        }}
                    />
                </div>
            }
        </div>
    }
}

export default WidgetGroupDatePicker;