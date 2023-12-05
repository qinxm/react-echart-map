import React from 'react';

import WidgetCondition from './WidgetCondition';
import WidgetFilterDatePicker from './WidgetFilterDatePicker';

class WidgetExpressionDatePicker extends React.Component
{ 
    constructor( props )
    {
        super( props );

        this.state = {
            options : props.options,
            data : props.data,
            defaultValue : props.defaultValue,
            isFirst:true,
            interval :  props.options.interval!==undefined ?  props.options.interval : 12
        }

        this.onSelect = this.onSelect.bind(this);
        this.buildValue = this.buildValue.bind(this);
        this.buildOption = this.buildOption.bind(this); 
    }

    componentDidMount()
    {
        const { defaultValue } = this.state;

        if( defaultValue!==undefined )
        {
            this.onSelect({start:defaultValue.dateStart, end:defaultValue.dateEnd, dateType:defaultValue.dateType});
        }
    }

    componentDidUpdate()
    {
        
        const { defaultValue } = this.state;
        
        if( defaultValue!==undefined )
        {
            this.onSelect({start:defaultValue.dateStart, end:defaultValue.dateEnd, dateType:defaultValue.dateType});
        }    
     }

    /**
     * 日期选择的回调函数
     * @param {*} content 
     */
    onSelect( content )
    {
        let filter = {}, code, expression;

        const { options} = this.state;
       
        const widgetCondition = new WidgetCondition();

        for( var i in options.dateTypes )
        {
            if( content.dateType===options.dateTypes[i].value )
            {
                code = options.dateTypes[i].code; 
            }
        }

        if( content!==undefined && content!==null )
        {
            expression = widgetCondition.createCondition(code, "range", {
                min:{code:code, operator:'BE', value:content.start},
                max:{code:code, operator:'SE', value:content.end}
            });
            
            filter = { code:code, expression:expression, dateType:content.dateType};

            this.props.notify( filter );
        }

    }

    /**
     * 创建日期option
     * @returns 
     */
    buildOption( data )
    {
        let { options, defaultValue } = this.state;
        const { interval } = this.state;

        if( options.dateTypes===undefined )
        {
            console.log('dateTypes is not in WidgetDatePicker');
            return ;
        }

        if( options.dateType===undefined )
        {
            options["dateType"] = options.dateTypes[0].value;
        }

        if( data!==undefined && JSON.stringify(data)!=='{}')
        {
            for( let j in options.dateTypes )
            {
                let maxDate = 0, minDate = 0, dateStart;

                let dimensionData = data[options.dateTypes[j].code]

                if( dimensionData!==undefined && dimensionData.length>0 )
                {
                    for( let i=0; i<dimensionData.length; i++ )
                    {
                        if( maxDate===0 || maxDate<dimensionData[i].value )
                        {
                            maxDate = dimensionData[i].value;
                        }
        
                        if( minDate===0 || minDate>dimensionData[i].value )
                        {
                            minDate = dimensionData[i].value;
                        }
        
                        if( parseInt(i)<interval )
                        {
                            dateStart = dimensionData[i].value;
                        }
                    }
                }
                
                options.dateTypes[j]["minDate"] = minDate;
                options.dateTypes[j]["maxDate"] = maxDate;

                options.dateTypes[j]["defaultValue"] = {};

                if( options.datePickerType==="range")
                {
                    options.dateTypes[j]["defaultValue"]["dateStart"] = dateStart;
                    options.dateTypes[j]["defaultValue"]["dateEnd"] = maxDate;
                }
                else
                {
                    options.dateTypes[j]["defaultValue"]["dateStart"] = maxDate;
                    options.dateTypes[j]["defaultValue"]["dateEnd"] = maxDate;
                }

                if( defaultValue===undefined &&  options.dateTypes[j].value===options["dateType"] )
                {
                    defaultValue = options.dateTypes[j]["defaultValue"];

                    this.state["defaultValue"] = {...{'dateType':options["dateType"]}, ...defaultValue}; 
                }
            }
        }

        return options;
    }

    /**
     * 创建默认选中的日期
     * @param {*} defaultValue 
     * @returns 
     */
    buildValue( defaultValue )
    {
        let value = {}, content;

        const widgetCondition = new WidgetCondition();

        if( defaultValue.expression!==undefined )
        {
            content = widgetCondition.createExpression(defaultValue.code, defaultValue.expression);
            value["dateStart"] = content.min.value;
            value["dateEnd"] = content.max.value;
        }

        value["dateType"] = defaultValue.dateType;

        this.state["defaultValue"] = value;

        return value;
    }

    render()
    {
        const { data } = this.props;

        let options = this.buildOption( data );

        let { defaultValue } = this.state;

        if( this.props.defaultValue!==undefined )
        {
            defaultValue = this.buildValue( this.props.defaultValue );
        }

        return <WidgetFilterDatePicker options={options} onSelect={this.onSelect} defaultValue={ defaultValue }></WidgetFilterDatePicker>
    }
}

export default WidgetExpressionDatePicker