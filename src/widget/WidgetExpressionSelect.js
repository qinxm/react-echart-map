import React from 'react';

import WidgetSelect from './WidgetSelect';
import WidgetCondition from './WidgetCondition';

class WidgetExpressionSelect extends React.Component
{ 
    constructor( props )
    {
        super( props );

        this.state = {
            options : props.options,
            data : props.data
        }

        this.onSelect = this.onSelect.bind(this);
    }
    
    onSelect = function(value, item, e)
    {
        let expression, event, filter;

        const { data } = this.state;
        const { options } = this.state;
       
        const widgetCondition = new WidgetCondition();

        if( data===undefined || data[options.dimension.code]===undefined || data[options.dimension.code].length===0)
        {
            return ;
        }
        
        let items = data[options.dimension.code];

        for(var i in items)
        {
            if( items[i].value===value )
            {
                item = items[i];
                break;
            }
        }

        if( item!==undefined && item!==null )
        {
            expression = widgetCondition.createCondition(item.code, "point", {code:item.code, operator:"E", value:value});

            filter = {code:options.dimension.code, expression:expression};
        }
        else
        {
            filter = {code:options.dimension.code, expression:undefined};
        }

        this.props.notify( filter );
    }

    buildValue = function( defaultValue )
    {
        let content, widgetCondition, value;

        widgetCondition = new WidgetCondition();

        if( defaultValue.expression!==undefined )
        {
            content = widgetCondition.createExpression(defaultValue.code, defaultValue.expression);

            value = content.value;
        }
        
        this.state["defaultValue"] = value;

        return value; 
    }

    render()
    {
        const { data } = this.props;

        this.state["data"] = data;
        
        const { type } = this.props;
        const { options } = this.state;
        
        let value = undefined;
        
        if( this.props.defaultValue!==undefined )
        {
            value = this.buildValue(this.props.defaultValue);
        }

        return <WidgetSelect data={data[options.dimension.code]} type={type} options={options} onSelect={this.onSelect} defaultValue={ value }/>
    }
}

export default WidgetExpressionSelect

