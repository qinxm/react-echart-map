import React, { Component } from "react";
import { DatePicker } from "antd";
import moment from "moment";
import Widget from './Widget';
const { RangePicker } = DatePicker;

class WidgetDatePicker extends Component 
{
    constructor(props)
    {
        super(props);

        let divId = props.divId;
        if( !divId ) divId = Widget.randomString();

        this.state = {
            divId,
            options: props.options || {},
            dateFormat: props.dateFormat || 'YYYY-MM-DD',
            onChange: props.onChange || undefined
        }
    }

    handleChange = (value, type) => {
        const {dateFormat, onChange} = this.state;
        let vals = [];

        if(type)
        {
            vals = value && value.map(item=> {return moment(item).format(dateFormat)}) || []
            if(onChange) onChange(vals);
        }
        else
        {
            vals = value && [moment(value).format(dateFormat)] || []
            if(onChange) onChange(vals[0]);
        }
     
    }

    render()
    {
        const {options, dateFormat, divId} = this.state;
        const {defaultValue=[], allowClear=true, picker='date' ,width='150px'} = this.props;
        
        return <div className="swd-picker sfm-picker spj-picker spg-picker">
            {
                options.type ? 
             
                <div id={divId}>
                    <RangePicker 
                        getPopupContainer={()=>document.getElementById(divId)}
                        allowClear={allowClear}
                        defaultValue={[defaultValue[0]?moment(defaultValue[0],dateFormat):'',defaultValue[1]?moment(defaultValue[1],dateFormat):'']}
                        value={[defaultValue[0]?moment(defaultValue[0],dateFormat):'',defaultValue[1]&&moment(defaultValue[1],dateFormat)]}
                        dateFormat={dateFormat}
                        picker={picker}
                        style={{width}}
                        onChange={(value)=>{this.handleChange(value, options.type)}}
                    /> 
                </div> 
                : 
                <div id={divId} >
                    <DatePicker
                        getPopupContainer={()=>document.getElementById(divId)}
                        allowClear={allowClear}
                        defaultValue={defaultValue[0] && moment(defaultValue[0], dateFormat)}
                        dateFormat={dateFormat}
                        picker={picker}
                        showToday={false}
                        style={{width}}
                        onChange={(value)=>{this.handleChange(value, options.type)}}
                    />
                </div>
            }
        </div>
    }
}

export default WidgetDatePicker;