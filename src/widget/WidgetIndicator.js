// WidgetFilter
import React from 'react';

import WidgetSelect from './WidgetSelect';
import WidgetComponent from './WidgetComponent';

class WidgetIndicator extends WidgetComponent
{
    constructor( props )
    {
        super(props);

        let indicatorData = this.buildData( props.data );

        let defaultValue = null;

        if( props.data.defaultValue!==undefined )
        {
            defaultValue = props.data.defaultValue;
        }
        else
        {
            defaultValue = indicatorData[0].value;
        }

        this.state = {
            data : indicatorData,
            options: {title:'指标', cleanable:false},
            defaultValue : defaultValue
        }

        this.notify = this.notify.bind(this);
    }

    buildData( data )
    {   
        let indicatorData = [];

        for( var i in data.values )
        {
            let item = { ...data.values[i] };

            item['role'] = -1;
            item['label'] = item.name;

            indicatorData.push(item);
        }

        return indicatorData;
    }

    componentDidMount()
    {
        const { data } = this.state;

        if( data!==undefined && data.length>0 )
        {
            this.notify(data[0].value, data[0]);
        }
    }

    /**
     * 指标修改，通知事件
     * @param {*} value 
     * @param {*} item 
     * @param {*} event 
     */
    notify( value, item, event )
    {
        if( value!==undefined && item!==undefined )
        {
            let content = { schemas:item.schemas, measures:value, dimensions:item.dimensions};

            this.sendEvent('set.indicator', content);
        }
    }
    
    render()
    {
        const { data, options, defaultValue} = this.state;

        return <WidgetSelect data={data} options={options} onSelect={this.notify} defaultValue={ defaultValue }/>
    }

}
export default WidgetIndicator