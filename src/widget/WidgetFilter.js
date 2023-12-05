// WidgetFilter
import React from 'react';

import WidgetComponent from './WidgetComponent';
import WidgetCondition from './WidgetCondition';

import WidgetExpressionSelect from './WidgetExpressionSelect';
import WidgetExpressionTree from './WidgetExpressionTree';
import WidgetExpressionDatePicker from './WidgetExpressionDatePicker';

class WidgetFilter extends WidgetComponent
{
    constructor(props)
    {
        super(props);

        this.state = {
            data : undefined,
            dimension : props.filter.dimension,
            preHandleEvent : props.preHandleEvent,
            filter : props.filter,
            options : {},
            indicator:undefined
        }

        this.notify = this.notify.bind(this);

        this.buildData = this.buildData.bind(this);
        this.buildOption = this.buildOption.bind(this);
        this.buildFilterData = this.buildFilterData.bind(this);
        this.buildConditions = this.buildConditions.bind(this);
        this.buildDefaultValue = this.buildDefaultValue.bind(this);
        this.onHandleEventSelf = this.onHandleEventSelf.bind(this);
        this.testFilterDimension = this.testFilterDimension.bind(this);

        this.buildOption(); 
    }

    /**
     * 组件渲染之后再调用页面方法
     */
    componentDidMount()
    {
        let { dimension, preHandleEvent } = this.state;

        // 在read dimension 事件，处理事件
        if( preHandleEvent!==undefined )
        {
            dimension = preHandleEvent(dimension);

            this.state["dimension"] = dimension;

            this.state["filter"]["dimension"] = dimension;

            this.buildOption(); 
        }

        this.sendEvent('read.dimension', dimension);
    }

    /** 创建 filter options */
    buildOption()
    {
        let options = {};

        const { filter } = this.state;

        if( filter.type!=="WidgetDate")
        {
            options["title"] = filter.title;
            options["type"] = filter.type;
            options["dimension"] = filter.dimension;
        }
        else
        {
            options["title"] = filter.title;
            options["type"] = filter.type;

            let dateTypes = [];

            for( var i in filter.dimension)
            {  
                var item = { ...filter.dimension[i] };
                dateTypes.push(item);
            }

            options["dateTypes"] = dateTypes;

            if( filter.dateType!==undefined )
            {
                options["dateType"] = filter.dateType;
            }

            if( filter.datePickerType!==undefined )
            {
                options["datePickerType"] = filter.datePickerType;
            }   
        }

        if( filter.properties!==undefined )
        {
            options = {...options, ...filter.properties};
        }
      
        this.state["options"] = options;
    }

    /** 创建 filter data */
    buildData(results, parent)
    {
        let result = {};
        
        if( results!==undefined && results.length>0 )
        {
            for( let j in results)
            {
                let data = results[j];

                let items = this.buildFilterData(data, parent);

                result[results[j].code] =  items; 
            } 
        }

        return result;
    }

    buildFilterData( data, parent)
    {
        let items = [];

        for( let i=0; i<data.values.length; i++ )
        {
            let node = {};
            
            node.role = parent;
            node.key = data.values[i].value;
            node.label = data.values[i].name;
            node.title = data.values[i].name;
            node.code = data.code;

            node.value = data.values[i].value;

            if( data.values[i]!==undefined && data.values[i].subdimension !== undefined && data.values[i].subdimension.values.length > 0 )
            {
                node.children = this.buildFilterData(data.values[i].subdimension, data.values[i].value);
            }
            
            items.push(node);
        }

        return items;
    }

    /**
     * 筛选数据
     * @param {*} filterData 
     */
    buildDefaultValue( filterData )
    {
        let { options, filter, defaultValue } = this.state;

        if( filterData!==undefined )
        {
            let data = filterData[options.dimension.code];

            if( data!==undefined )
            {
                const widgetCondition = new WidgetCondition();

                switch( filter.type )
                {
                    case "WidgetSelect":
                    {
                        let item = data[1];

                        let code = item.code.substring(0, 4);

                        let expression = widgetCondition.createCondition(item.code, "point", {code:item.code, operator:"E", value:item.value});

                        defaultValue = {code:code, expression:expression};

                        break;
                    }
                    case "WidgetTree":
                    {                        
                        let item = data[1];

                        let code = item.code.substring(0, 4);

                        let expression = widgetCondition.createCondition(item.code, "point", {code:item.code, operator:"E", value:item.value});

                        defaultValue = {code:code, expression:expression};

                        break;
                    }
                    case "WidgetTreeCheck":
                    {
                        let expression, values = [], conditions = {}, params = [];

                        if( options.choiceNumber!==undefined )
                        {
                            for( let i=0; i<data.length; i++)
                            {
                                if( i<options.choiceNumber )
                                {
                                    values.push(data[i].value);
                                }
                            }
                        }
                        else
                        {
                            values.push(data[0].value);
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
                        
                        defaultValue = { code:options.dimension.code, expression:expression };

                        break;
                    }
                    default:
                    {
                        let item = data[0];

                        let code = item.code.substring(0, 4);

                        let expression = widgetCondition.createCondition(item.code, "point", {code:item.code, operator:"E", value:item.value});

                        defaultValue = {code:code, expression:expression};

                        break;
                    }
                }

                this.sendEvent('set.filter', defaultValue);

                return defaultValue;
            }
        }
        
        return undefined;   
    }

    /** 创建条件 */
    buildConditions( values )
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

    /**
     * 筛选项变化通知
     * @param {*} filter 
     */
    notify( filter )
    {
        const { defaultValue, options } = this.state;

        if( JSON.stringify(filter)!==JSON.stringify(defaultValue) )
        {
            this.setState( {defaultValue: filter} );

            if( options.isSetFilter!==false )
            {
                this.sendEvent('set.filter', filter);
            }            
           
            if( this.props.notify!==undefined )
            {
                this.props.notify(filter);
            }
        }   
    }

    onHandleEventSelf( event )
    {
        const { dimension, filter, options } = this.state;

        let ret = false;

        if( ret===false )
        {
            switch( event.type )
            {
                case "set.dimension" :
                {
                    if( event.content.dimension===dimension )
                    {
                        this.setState({ data: event.content.data}); 
                    }
                    
                    break;
                }
                case "set.filter":
                {  
                    if( event.content.data!==undefined && event.content.data.code.substring(0, 4)===dimension.code.substring(0, 4) )
                    {
                        this.setState({ defaultValue: event.content});
                    }
                    break;
                }
                case "set.indicator":
                {
                    if( filter.type==="WidgetDate")
                    {
                        let isFind = false;

                        for( var i in event.content.dimensions )
                        {
                            for( var j in filter.dimension )
                            {  
                                if( filter.dimension[j].code.substring(0, 4)===event.content.dimensions[i].code.substring(0, 4) )
                                {
                                    isFind = true;

                                    let { options } = this.state;

                                    options["datePickerType"] = (event.content.dimensions[i].type!==undefined ? event.content.dimensions[i].type : "point");

                                    this.setState({options:options});

                                    break;
                                }
                            }

                            if( isFind )
                            {
                                break;
                            }
                        }
                    }
                }
                case "reset" :
                {
                    if( event.content.code!==undefined && event.content.code.substring(0, 4)===dimension.code.substring(0, 4) )
                    {
                        let { defaultValue } = this.state;
                        
                        if( defaultValue!==undefined )
                        {
                            defaultValue.expression = undefined;
                        }

                        this.setState({defaultValue:defaultValue});
                    }
                }
            }      
        } 
        
        return ret;
    }

    /**
     * 测试默认值对应的code是否是组件中存在的dimension
     */
    testFilterDimension( defaultValue )
    {
        let ret = false;

        const { filter, options } = this.state;

        if( defaultValue!==undefined )
        {
            
            if( filter.type!=="WidgetDate" )
            {
                if(  defaultValue.code.substring(0, 4)===options.dimension.code.substring(0, 4) )
                {
                    ret = true;
                }
            }
            else
            {
                for( let i in options.dateTypes )
                {
                    if( options.dateTypes[i].code.substring(0, 4)===defaultValue.code.substring(0, 4) )
                    {
                        ret = true;
                        break;
                    }
                }
            }
        }

        return ret;
    }

    render()
    {
        let { filter, options, defaultValue, data } = this.state;
       
        let filterData = this.buildData( data );

        if( defaultValue===undefined && options.isDefault===true )
        {
            defaultValue = this.buildDefaultValue(filterData);
        }

        if( defaultValue===undefined || this.testFilterDimension( defaultValue ) )
        {
            if( filter===undefined )
            {
                console.log("Can't find filter.");

                return "";
            }
            
            switch( filter.type )
            {
                case "WidgetSelect":
                    return <WidgetExpressionSelect options={options} data={filterData} defaultValue={defaultValue} notify={this.notify} />
                case "WidgetTree":
                    return <WidgetExpressionTree options={options} data={filterData} defaultValue={defaultValue} notify={this.notify} />
                case "WidgetTreeCheck":
                    options["type"] = "check";
                    return <WidgetExpressionTree options={options} data={filterData} defaultValue={defaultValue} notify={this.notify} />
                case "WidgetDate":
                    return <WidgetExpressionDatePicker options={options} data={filterData} defaultValue={defaultValue} notify={this.notify} />
                default :
                    return <WidgetExpressionSelect options={options} data={filterData} defaultValue={defaultValue} notify={this.notify} />
            }
        }
        else
        {
            return "";
        }
    }
}

export default WidgetFilter