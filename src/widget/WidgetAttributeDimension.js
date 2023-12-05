
import React from 'react';

import Config from '../config/Config';
import WidgetComponent from './WidgetComponent';

import WidgetSelect from './WidgetSelect';
// import WidgetTreePicker from './WidgetTreeSelect';

// import '../css/analysis.css';
// import '../css/tag.css';

class WidgetAttributeDimension extends WidgetComponent
{
    constructor( props )
    {
        super(props);

        let basePath = Config.getBasePath();

        let options = {};

        if( props.attribute!==undefined )
        {
            options = {...options, ...props.attribute,type:'check'};
        }

        this.state = {
            attribute:props.attribute,
            independent : true,
            dimensionData : undefined,
            isTree : false,
            options : options,
            value:undefined
        }

        this.buildData = this.buildData.bind(this);
        this.buildFilterData = this.buildFilterData.bind(this);
        this.onHandleEventSelf = this.onHandleEventSelf.bind(this);

        this.onSelect = this.onSelect.bind(this);
        this.onTreeSelect = this.onTreeSelect.bind(this);
        this.buildConditions = this.buildConditions.bind(this);
        this.findDimensionValue = this.findDimensionValue.bind(this);

        this.buildValue = this.buildValue.bind(this);
        
        this.bindConsole(basePath);
    }


    componentDidMount()
    {
        let value;

        const { attribute, values } = this.props;

        this.sendEvent("read.dimension", attribute.content);

        if( values!==undefined )
        {
            value = this.buildValue(values, attribute);

            this.setState({value:value});
        }
    }

    componentWillReceiveProps( nextProps )
    {
        let value;

        const { attribute, values } = nextProps; 

        if( attribute!==undefined )
        {
            if( attribute.code!==this.props.attribute.code )
            {
                this.sendEvent("read.dimension", attribute.content);
            }
        }
        if( values!==undefined )
        {
            value = this.buildValue(values, attribute);
        }

        this.setState({value:value});
    }

    /**
     * 构建维度值
     * @param {*} values 
     * @param {*} attribute 
     * @returns 
     */
    buildValue(values, attribute)
    {

        if( attribute!==undefined )
        {
            switch( attribute.type )
            {
                case "SINGLE":
                {
                    return values.value;
                }
                default : 
                {
                    let value = [];

                    for(let key in values)
                    {
                        if( Object.prototype.toString.call(values[key])==='[object Array]' )
                        {
                            for(let item of values[key] )
                            {
                                value.push(item.value);
                            }
                        }
                        else
                        {
                            value.push(values[key].value);
                        }
                        
                        
                    }

                    return value;
                }
            }
        }
    }

    onHandleEventSelf( event )
    {
        const { attribute } = this.state;

        let ret = false;

        if( ret===false )
        {
            switch( event.type )
            {
                case "set.dimension" :
                {
                    if( event.content.dimension===attribute.content )
                    {
                        this.setState({ dimensionData: event.content.data}); 
                    }
                    break;
                }
                default : 
                    break;
            }
        }
    }

    buildData( dimensionData, parent)
    {
        let result = [];
        
        if( dimensionData!==undefined && dimensionData.length>0 )
        {
            for( let j in dimensionData)
            {
                let data = dimensionData[j];

                result = this.buildFilterData(data, parent);
            } 
        }

        this.state["data"] = result;

        return result;
    }

    buildFilterData(data, parent)
    {
        let items = [];

        for( let i=0; i<data.values.length; i++ )
        {
            let node = {};
            
            node.role = parent;
            node.label = data.values[i].name;
            node.code = data.code;

            node.value = data.values[i].value;

            if( data.values[i]!==undefined && data.values[i].subdimension !== undefined && data.values[i].subdimension.values.length > 0 )
            {
                this.state["isTree"] = true;
                node.children = this.buildFilterData(data.values[i].subdimension, data.values[i].value);
            }
            
            items.push(node);
        }

        return items;
    }

    /**
     * 单选框选中回调函数
     * @param {*} value 
     * @param {*} item 
     * @param {*} event 
     * @returns 
     */
    onSelect(value, item, event)
    {
        const { data, attribute} = this.state;
       
        if( data===undefined || data.length===0)
        {
            return ;
        }
        
        for(var i in data)
        {
            if( data[i].value===value )
            {
                item = data[i];
                break;
            }
        }

        if( this.props.notify!==undefined && this.props.notify!==null )
        {
            this.props.notify(item, attribute);
        }
        
    }

    /**
     * 树形条件的选择
     * @param {*} values 
     * @returns 
     */
    onTreeSelect( values,value, label )
    {
        // console.log( values,value, label);
        let conditions={};

        // conditions[values]=label
       
        const { data } = this.state; 
        
        const { attribute } = this.props;
       
        if( data===undefined || data.length===0 )
        {
            return ;
        }
        
        conditions = this.buildConditions(values);

        if( this.props.notify!==undefined && this.props.notify!==null )
        {
            this.props.notify( conditions, attribute);
        }
    }

    /** 创建条件 */
    buildConditions( values )
    {
        let conditions= {}, item;

        const { data } = this.state;

        for( var i in values)
        {
            item = this.findDimensionValue(data, values[i]);

            delete item["children"];
          
            let condition = conditions[item.code];

            if( condition===undefined || condition===null )
            {
                condition = [];
            }
            
            condition.push(item);

            conditions[item.code] = condition;
        }

        return conditions;
    }

    /** 找到维度值 */
    findDimensionValue(data, value)
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

    render()
    {
        const { isTree, dimensionData, options, value} = this.state;

        const { attribute } = this.props;

        let data = this.buildData(dimensionData);
        
        if( isTree )
        {
            switch( attribute.index )
            {
                case "MULTIPLE":
                    options["type"] = "check";
                    // return <WidgetTreePicker data={data} options={options} onSelect={this.onTreeSelect} defaultValue={ value } ></WidgetTreePicker>
                default :
                    // return <WidgetTreePicker data={data} options={options} onSelect={this.onTreeSelect} defaultValue={ value }/>
            }
        }
        else
        {
            switch( attribute.index )
            {
                case "SINGLE":
                    return <WidgetSelect data={data} options={options} onSelect={this.onSelect} defaultValue={ value }/>
                case "MULTIPLE":
                    options["type"] = "check";
                    // return <WidgetTreePicker  data={data} options={options} onSelect={this.onTreeSelect} defaultValue={ value } ></WidgetTreePicker>
                default :
                    return <WidgetSelect data={data} options={options} onSelect={this.onSelect} defaultValue={ value }/>
            }
        }
    }
}
export default WidgetAttributeDimension