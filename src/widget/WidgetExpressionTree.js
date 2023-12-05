import React from 'react';

import WidgetTreeSelect from './WidgetTreeSelect';
import WidgetCondition from './WidgetCondition';

class WidgetExpressionTree extends React.Component
{ 
    constructor( props )
    {
        super( props );

        this.onSelect = this.onSelect.bind(this);

        this.state = {
            options : props.options,
            data : props.data,
            type : props.options.type!==undefined ? props.options.type : "select"
        }

        this.buildConditions = this.buildConditions.bind(this);
        this.findDimensionValue = this.findDimensionValue.bind(this);
    }
    
    /** 选中值 */
    onSelect = function( values )
    {
        let expression, filter, conditions={}, params=[];
       
        //TODO create expression
        const { data, options} = this.state;
       
        const widgetCondition = new WidgetCondition();

        if( data===undefined || data[options.dimension.code]===null || data[options.dimension.code].length===0 )
        {
            return ;
        }
        
        conditions = this.buildConditions(values);

        for( var code in conditions)
        {
            params.push({code : code, operator : 'IN', set : conditions[code]});
        }

        if( params.length>0 )
        {
            expression = widgetCondition.createCondition(options.dimension.code, "composite", params);
        }
        
        filter = { code:options.dimension.code, expression:expression };

        this.props.notify( filter );
    }

    /** 创建条件 */
    buildConditions = function( values )
    {
        let conditions= {}, item;

        const { data, options } = this.state;

        for( var i in values)
        {
            item = this.findDimensionValue(data[options.dimension.code], values[i])
          
            let condition = conditions[item.code];

            if( condition===undefined || condition===null )
            {
                condition = [];
            }
            
            condition.push(item.value);

            conditions[item.code] = condition;
        }

        return conditions;
    }

    /** 找到维度值 */
    findDimensionValue = function(data, value)
    {
        let item;

        for( var i in data )
        {
            if( data[i].value===value)
            {
                item = data[i];
                break;
            }

            if( data[i].children!==undefined && data[i].children!==null )
            {
                item = this.findDimensionValue(data[i].children, value);
            }

            if( item!==undefined && item!=null )
            {
                break;
            }
        }

        return item;
    }

    /** 创建默认值 */
    buildValues = function( defaultValue )
    {
        let content, widgetCondition, values=[];

        widgetCondition = new WidgetCondition();            

        if( defaultValue.expression!==undefined )
        {
            content = widgetCondition.createExpression(defaultValue.code, defaultValue.expression)
        
            if( content!==undefined && content.operator!==undefined && content.operator==="E")
            {
                values.push(content.value);
            }
            else
            {
                for(var i in  content)
                {
                    for(var j in content[i].set)
                    {
                        values.push(content[i].set[j]);
                    }
                }
            }
        }

        this.state["defaultValue"] = values;
        
        return values;
    }


    render()
    {
        const { data } = this.props;

        this.state["data"] = data;

        const { options } = this.state;

        let values = undefined;

        if( this.props.defaultValue!==undefined )
        {
            values = this.buildValues(this.props.defaultValue);
        }

        return <WidgetTreeSelect data={data[options.dimension.code]} options={options} 
                    labelInValue={true}
                    onSelect={this.onSelect} 
                    defaultValues={ values } >
                </WidgetTreeSelect>
    }
}

export default WidgetExpressionTree

