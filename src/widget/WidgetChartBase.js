// WidgetChartBase
import React from 'react';

import Widget from './Widget';

import WidgetEvent from './WidgetEvent';
import WidgetComponent from './WidgetComponent';
import WidgetCondition from './WidgetCondition';

class WidgetChartBase extends WidgetComponent 
{
    constructor( props )
    {
        super( props );

        this.state = {
            chart : props.chart,
            data : undefined,
            schema : undefined,
            filters : {},
            indicator : undefined,
            schemaDimensionIndex : {},
            queryFlag : {},
            schemas : {},
            datas : {},
            preHandleEvent:props.preHandleEvent,
            loading : true
        };

        // 获取组件自身
        this.myRef = React.createRef();

        this.buildDimensions( props.chart.schemas );

        this.onEvent = this.onEvent.bind(this);
        this.onReportEvent = this.onReportEvent.bind(this);
        
        this.setFilter = this.setFilter.bind(this);
        this.updateData = this.updateData.bind(this);
        this.createSlice = this.createSlice.bind(this);
        this.updateSlice = this.updateSlice.bind(this);
        this.onHandleEventSelf = this.onHandleEventSelf.bind(this);
        this.updateIndicator = this.updateIndicator.bind(this);
        this.buildDimensions = this.buildDimensions.bind(this);

        this.initEvent = this.initEvent.bind(this);
        this.clickEvent = this.clickEvent.bind(this);

        this.drillEvent = this.drillEvent.bind(this);
        this.onDrillEvent = this.onDrillEvent.bind(this);

        this.backEvent = this.backEvent.bind(this);
        this.onBackEvent = this.onBackEvent.bind(this);

        this.testWaiting = this.testWaiting.bind(this);

        this.preHandleEvent = this.preHandleEvent.bind(this);
        
        // 初始化事件
        this.initEvent();
    }

    /**
     * 组件渲染之后再调用页面方法
     */
    componentDidMount()
    {
        const { chart } = this.state;
       
        this.preHandleEvent("chart");

        this.sendEvent('read.chart.schema', chart.schemas );
    }

    /**
     * 初始化事件
     */
    initEvent()
    {
        const { schemas, chart} = this.state;
        const { event } = chart;
        
        let eventContent = undefined;

        if( event!==undefined )
        {
            let isFirst = true;
            let name = "";
            
            for(let i in schemas)
            {
                if( isFirst )
                {
                    name = schemas[i].name;

                    isFirst = false;
                }
                else
                {
                    name += "_" + schemas[i].name;
                }
            }

            let eventId = "_event_" + name + "_" +  chart.type;

            this.state["eventId"] = eventId;

            if( this.state["widgetEvent"]===undefined )
            {
               
                this.state["widgetEvent"] = new WidgetEvent({ref:this.myRef,  eventId:eventId});
            }

            if( event.isClick===true )
            {
                eventContent = {'title':'', 'name':'_click_' + name, 'callback': this.clickEvent};
                this.state["widgetEvent"].addEvent(eventContent);
            }

            if( event.isDrill===true )
            {
                eventContent = {'title':'下钻', 'name':'_drill_' + name, 'callback': this.drillEvent};

                this.state["widgetEvent"].addEvent(eventContent);

                eventContent = {'title':'返回上一级', 'name':'_back_' + name, 'callback': this.backEvent};
                this.state["widgetEvent"].addEvent(eventContent);
            }

            if( event.others!==undefined && event.others.length>0 )
            {
                for( let k in event.others )
                {
                    this.state["widgetEvent"].addEvent(event.others[k]);
                }
            }
        }
    }

    /**
     * 点击事件回调函数
     * @param {*} params 
     */
    clickEvent( e, params )
    {
        let data;
        const widgetCondition = new WidgetCondition();

        if( params!==undefined )
        {
            if( params.xDimensionCode!==undefined )
            {
                data = params;
            }
            else if(params.data!==undefined && params.data.xDimensionCode!==undefined )
            {
                data = params.data;
            }
            else if(params.data!==undefined && params.data.data!==undefined && params.data.data.xDimensionCode!==undefined )
            {
                data = params.data.data;
            }
            else
            {
                data = {};
            }
        }

        let code = data.xDimensionCode.substring(0, 4);

        let expression = widgetCondition.createCondition(code, "point", {code:data.xDimensionCode, operator:"E", value:data.xDimensionValue});

        let content = {code:code, expression:expression};

        this.sendEvent("set.filter", content);
    }

    /**
     * 钻取事件回调函数
     * @param {*} params 
     */
    drillEvent( params )
    {
        let data;

        const { schemas } = this.state;

        const widgetCondition = new WidgetCondition();

        if( params!==undefined )
        {
            if( params.xDimensionCode!==undefined )
            {
                data = params;
            }
            else if(params.data!==undefined && params.data.xDimensionCode!==undefined )
            {
                data = params.data;
            }
            else if(params.data!==undefined && params.data.data!==undefined && params.data.data.xDimensionCode!==undefined )
            {
                data = params.data.data;
            }
            else
            {
                data = {};
            }
        }

        let code = data.xDimensionCode.substring(0, 4);

        let expression = widgetCondition.createCondition(code, "point", {code:data.xDimensionCode, operator:"E", value:data.xDimensionValue});

        let content = {code:code, expression:expression};

        for(let i in schemas )
        {
            let ret = this.onDrillEvent(schemas[i].name, content);

            if( ret===true )
            {
                this.updateData( schemas[i].name );
            }            
        } 

        this.sendEvent("drill.event", content);
    }

    /**
     * 返回上一级回调函数
     * @param {*} params 
     * @param {*} filterParam 
     */
    backEvent( params, filterParam)
    {
        let data;

        const { schemas } = this.state;

        if( params!==undefined )
        {
            if( params.xDimensionCode!==undefined )
            {
                data = params;
            }
            else if(params.data!==undefined && params.data.xDimensionCode!==undefined )
            {
                data = params.data;
            }
            else if(params.data!==undefined && params.data.data!==undefined && params.data.data.xDimensionCode!==undefined )
            {
                data = params.data.data;
            }
            else
            {
                data = {};
            }
        }

        let code = data.xDimensionCode.substring(0, 4);

        let content = {code:code,  dimension:{code:data.xDimensionCode, value:data.xDimensionValue}, filterParam:filterParam};

        for( let i in schemas )
        {
            let ret = this.onBackEvent(schemas[i].name, content);

            if( ret===true )
            {
                this.updateData( schemas[i].name );
            }            
        }

        this.sendEvent("back.event", content);
    } 

   
    /**
     * 创建维度索引
     * @param {*} dimensions 
     */
    buildDimensions( schemas )
    {
        if( schemas!==undefined && schemas.length>0 )
        {
            let dimensionIndex = {};

            if( this.state["dimensionIndex"]===undefined )
            {
                this.state["dimensionIndex"] = {};
            }

            for( let i in schemas )
            {
                
                for( var j in schemas[i].dimensions )
                {
                    let code = schemas[i].dimensions[j].substring(0, 4);

                    dimensionIndex[code] = schemas[i].dimensions[j];
                }

                this.state["dimensionIndex"][schemas[i].name] = dimensionIndex;
            }
        }
    }

    /**
     * 图形事件
     * @param {*} e 
     * @param {*} params 
     */
    onEvent( e, params )
    {
        const { schemas } = this.state;

        if( this.state["widgetEvent"]!==undefined )
        {
            this.state["widgetEvent"].clickEvent(e, params, schemas);
        }
        else
        {
            return ;
        }
    }

    /**
     * 表格事件处理
     * @param {*} e 
     * @param {*} params 
     * @param {*} value 
     */
    onReportEvent(e, params, value)
    {
        const { schemas } = this.state;

        let xDimensionCode, event = {};

        if( params!==undefined )
        {
            for( let key in params )
            {
                if( params[key]===value )
                {
                    xDimensionCode = key;
                }
            }

            params["xDimensionCode"] = xDimensionCode;
            params["xDimensionValue"] = params[xDimensionCode+"_CODE"];
            params["name"] = params[xDimensionCode];
            params["value"] = params[xDimensionCode+"_CODE"];

            event["data"] = params;
            event["event"] = e;
            
            if( this.state["widgetEvent"]!==undefined )
            {
                this.state["widgetEvent"].clickEvent(event, params, schemas);
            }
            else
            {
                return ;
            }
            
        }
    }

    /**
     * 响应事件 之前处理 chart
     */
    preHandleEvent( type )
    {
        let { preHandleEvent } = this.state;

        if( preHandleEvent!==undefined )
        {
            switch( type )
            {
                case "chart" :
                {
                    let chart = preHandleEvent(this.state.chart, type);

                    this.state["chart"] = chart;

                    break;
                }
                case "schema":
                {
                    let schemas = preHandleEvent(this.state.schemas, type);

                    this.state["schemas"] = schemas;

                    break

                }
                case "filter" :
                {
                    let schemas = preHandleEvent(this.state.schemas, type);

                    this.state["schemas"] = schemas;

                    break
                }
                case "set.filter" :
                {
                    let schemas = preHandleEvent(this.state.schemas, type);

                    this.state["schemas"] = schemas;

                    break
                }
                default :
                    break;
            }
           
        }
    }


    /**
     * 处理组件本身事件
     * @param {*} event 
     * @returns 
     */
    onHandleEventSelf( event )
    {
        const { chart, schemas } = this.state;

        let ret = false;

        if( ret===false )
        {
            switch( event.type )
            {
                case "set.chart.data" :
                {
                    for( let i in schemas )
                    {                       
                        let queryFlag = schemas[i].name + "_" + chart.type + "_" +  this.state.queryFlag[schemas[i].name];

                        if( event.content.schema===schemas[i].name && event.content.params!==undefined 
                            && JSON.stringify(event.content.params.assist_measures)=== JSON.stringify(schemas[i].slice.assist_measures)
                            && JSON.stringify(event.content.params.filters)=== JSON.stringify(schemas[i].slice.filters)
                            && JSON.stringify(event.content.params.main_dimension)=== JSON.stringify(schemas[i].slice.main_dimension)
                            && JSON.stringify(event.content.params.main_measure)=== JSON.stringify(schemas[i].slice.main_measure)
                            && queryFlag === event.content.params.queryFlag )
                        {
                            this.state.datas[schemas[i].name] = event.content.data;

                            if( Object.keys(schemas).length===Object.keys(this.state.datas).length )
                            {
                                //TODO 判断数据是否相同，不相同重新画图，相同不渲染页面
                                this.setState({data: this.state.datas, loading:false});
                            }
                        } 
                    }   
                    break;
                }
                case "set.chart.schema":
                {  
                    if( JSON.stringify(this.props.chart.schemas)===JSON.stringify(event.content.schemas) )
                    {
                        for( let j in event.content.data )  
                        {
                            this.createSlice( event.content.data[j] );

                            this.preHandleEvent( "schema" );

                            let schema = this.state.schemas[event.content.data[j].name];
                            
                            // 更新 filter 
                            if( this.state.filters!==undefined && Object.keys(this.state.filters).length>0 )
                            {
                                for( let i in this.state.filters )
                                {
                                    this.setFilter(schema.name, this.state.filters[i]);
                                }
                            }

                            // 更新indicator
                            if( this.state.indicator!==undefined )
                            {
                                this.updateIndicator(schema.name, this.state.indicator);  
                            }

                            this.updateData(schema.name);
                        } 
                    }
                    break;
                }
                case "set.filter":
                {  

                    const { dimensionIndex } = this.state;
                   
                    let code = event.content.code.substring(0, 4);

                    for( let i in chart.schemas )
                    {
                        // 判断是否绑定 filter对应的dimension
                        //  产生一个 read.chart.data 事件
                        if( dimensionIndex[chart.schemas[i].name][code]!==undefined )
                        {
                            let ret = this.setFilter(chart.schemas[i].name, event.content );

                            if( ret===true )
                            {
                                this.updateData(chart.schemas[i].name);
                            }
                        }
                    }
                    break;
                }
                case "update.slice":
                {  
                    //TODO 判断 schema 是否相同
                    let content = {};

                    this.sendEvent('read.chart.data', content);

                    break;
                }
                case "set.indicator":
                {
                    for( let j in chart.schemas )
                    {
                        for( var i in event.content.schemas )
                        {
                            if( chart.schemas[j].name===event.content.schemas[i].schema )
                            {
                                this.state.indicator = undefined;

                                let ret = this.updateIndicator(chart.schemas[j].name, event.content.schemas[i]);

                                if( ret===true )
                                {
                                    this.updateData(chart.schemas[j].name);
                                }

                                break;
                            }
                        }
                    }
                    
                    break;
                }
                case "drill.event" : 
                {
                    const { dimensionIndex } = this.state;

                    let code = event.content.code.substring(0, 4);

                    for( let i in chart.schemas )
                    {
                        if( dimensionIndex[chart.schemas[i].name][code]!==undefined )
                        {
                            let ret = this.onDrillEvent(chart.schemas[i].name, event.content);

                            if( ret===true )
                            {
                                this.updateData(chart.schemas[i].name);
                            }
                        }
                    }
                    break;
                }
                case "back.event" :
                {
                    const { dimensionIndex } = this.state;
                   
                    let code = event.content.code.substring(0, 4);

                    for( let i in chart.schemas )
                    {
                        if( dimensionIndex[chart.schemas[i].name][code]!==undefined )
                        {
                            let ret = this.onBackEvent(chart.schemas[i].name, event.content);

                            if( ret===true )
                            {
                                this.updateData(chart.schemas[i].name);
                            }
                        }
                    }
                    break;
                }
                case "" :
                {

                    break;
                }
                default:
                    break;
            }
        }

        return ret;
    }

    /**
     * 钻取事件的处理函数
     * @param {*} schemaName 
     * @param {*} content 
     * @returns 
     */
    onDrillEvent( schemaName, content )
    {
        let dimension;

        const widgetCondition = new WidgetCondition();

        const { schemas } = this.state;

        let schema = schemas[schemaName];

        if( schema===undefined )
        {
            this.sendEvent('error.drill.event', "schema '" + schemaName + "' not found");

            return false;
        }

        if(  schema.slice===undefined || schema.slice===null )
        {
            this.sendEvent('error.drill.event', "slice not found in schema '" + schema.name +"'");

            return false;
        }

        const code = content.code.substring(0, 4);

        let item = widgetCondition.createExpression(content.code, content.expression);

        // 修改维度
        if( schema.cube!==undefined && schema.cube.dimensions!==undefined )
        {
            let dimensions = schema.cube.dimensions;
            for( let i in dimensions)
            {
                if( dimensions[i].code.substring(0, 4)===code )
                {
                    dimension = Widget.findDimension(dimensions[i], item.code);
                }   
            }   
        }

        if( dimension!==undefined && dimension.subdimension!==undefined )
        {
            if( schema.slice.main_dimension!==undefined && schema.slice.main_dimension.substring(0, 4)===code )
            {
                schema.slice.main_dimension = dimension.subdimension.code;
            }
    
            if( schema.slice.assist_dimensions!==undefined )
            {
                for( let i in schema.slice.assist_dimensions )
                {
                    if( schema.slice.assist_dimensions[i].substring(0, 4)===code )
                    {
                        schema.slice.assist_dimensions[i] = dimension.subdimension.code;
                    }
                }
            }
        }
        
        // 修改filter 
        if( schema.slice.filters===undefined || schema.slice.filters===null )
        {
            schema.slice.filters = {};
        }

        if( content.expression!==undefined )
        {
            schema.slice.filters[code] = content.expression;
        }
        else if( schema.slice.filters[code]!==undefined )
        {
            delete schema.slice.filters[code];
        }
  
        this.state["schemas"][schemaName] = schema;

        return true;
    }

    /**
     * 返回事件的处理函数
     * @param {*} schemaName 
     * @param {*} content 
     */
    onBackEvent( schemaName, content )
    {
        let dimension;

        const widgetCondition = new WidgetCondition();

        const { schemas } = this.state;

        let schema = schemas[schemaName];

        if( schema===undefined )
        {
            this.sendEvent('error.drill.event', "schema '" + schemaName + "' not found");

            return false;
        }

        if( schema.slice===undefined || schema.slice===null )
        {
            this.sendEvent('error.back.event', "slice not found in schema '" + schema.name +"'");

            return false;
        }

        let code = content.code.substring(0, 4);

        // 修改维度
        if( schema.cube!==undefined && schema.cube.dimensions!==undefined )
        {
            let dimensions = schema.cube.dimensions;

            for( let i in dimensions)
            {
                if( dimensions[i].code.substring(0, 4)===code )
                {
                    dimension = Widget.findParentDimension(dimensions[i],  content.dimension.code);
                }   
            }   
        }

        if( dimension!==undefined )
        {
            if( schema.slice.main_dimension!==undefined && schema.slice.main_dimension.substring(0, 4)===code )
            {
                schema.slice.main_dimension = dimension.code;
            }
    
            if( schema.slice.assist_dimensions!==undefined )
            {
                for( let i in schema.slice.assist_dimensions )
                {
                    if( schema.slice.assist_dimensions[i].substring(0, 4)===code )
                    {
                        schema.slice.assist_dimensions[i] = dimension.code;
                    }
                }
            }
        }
        
        // 修改filter 
        if( schema.slice.filters===undefined || schema.slice.filters===null )
        {
            schema.slice.filters = {};
        }

        if( content.filterParam!==undefined )
        {
            code = content.filterParam.xDimensionCode.substring(0, 4);

            let expression = widgetCondition.createCondition(code, "point", {code:content.filterParam.xDimensionCode, operator:"E", value:content.filterParam.xDimensionValue});

            schema.slice.filters[code] = expression;
        }
        else
        {
            delete schema.slice.filters[code];
        }
  
        this.state["schemas"][schemaName] = schema;

        return true;
    }

    /**
     * 测试更新数据是否需要等待
     * @param {*} slice 
     * @param {*} name schema名称
     * @returns 
     */
    testWaiting( slice, name)
    {
        let ret = false;

        for( let code in this.state.dimensionIndex[name] )
        {
           let dimension = this.state.schemaDimensionIndex[name][code];

           if( dimension!==undefined && (dimension.type==="TREE_YEAR" || dimension.type==="TREE_QUARTER" || dimension.type==="TREE_MONTH") )
           {
               if( slice.filters!==undefined )
               {
                    let isExit = false;
                    for( let key in slice.filters )
                    {
                        if( key.substring(0,4)===code.substring(0, 4) )
                        {
                            isExit = true;
                            break;
                        }
                    }

                    if( isExit===false )
                    {
                        ret = true;
                    }
               }
               else
               {
                    ret = true;
                    break;
               }
           }
        }

        return ret;
    }

    /**
     * 创建 chart schema
     * @param {*} schema 
     */
    createSlice( schema )
    {
        const { chart } = this.props;

        let schemaDimensionIndex = {}, chartSchema;

        for( let i=0; i<chart.schemas.length; i++ )
        {
            if( chart.schemas[i].name===schema.name )
            {
                chartSchema = chart.schemas[i]; 
                break;
            }
        }

        if( chartSchema.slice!==undefined )
        {
            schema['slice'] = chartSchema.slice;
        }
        else
        {
            schema['slice'] = schema['default_slices'][0]['slice'];
        }

        if( schema!==undefined )
        {
            let dimensions = schema.cube.dimensions;

            for( let i in dimensions )
            {
                schemaDimensionIndex[dimensions[i].code.substring(0, 4)] = dimensions[i];
            }
        }

        this.state.schemaDimensionIndex[schema.name] = schemaDimensionIndex; 

        this.state["schemas"][schema.name] = schema;
    }

    /**
     * 更新chart 数据
     */
    /**
     * 更新chart 数据
     * @param {*} schemaName 名称
     */
    updateData( schemaName )
    {
        this.preHandleEvent( "filter" );
        
        const { chart } = this.props;

        const {schemas} = this.state; 

        let schema = schemas[schemaName];

        if( schema===undefined )
        {
            this.sendEvent('error.set.indicator', "schema not found in chart");

            return false;
        }

        let content = {
            schema : schema.name,
        };

        content = {...content, ...schema.slice};
        
        if( this.testWaiting( schema.slice, schema.name)===false  )
        {
            if( this.state.queryFlag[schema.name]===undefined )
            {
                this.state.queryFlag[schema.name] = 0;
            }

            this.state.queryFlag[schema.name]++;

            content["queryFlag"] = schema.name + "_" + chart.type + "_" + this.state.queryFlag[schema.name];

            this.setState({loading:true});

            this.sendEvent('read.chart.data', content);
        }
    }

    /**
     * 更新 slice
     * @param {*} slice 
     */
    updateSlice( slice )
    {
        let { schema } = this.state;

        //TODO 更新 slice

        this.setState({schema:schema});
    }

    /**
     * 更新指标
     * @param {*} schemaName 
     * @param {*} measure 
     */
    updateIndicator( schemaName, chartSchema )
    {
        let { schemas } = this.state;

        let schema = schemas[schemaName];

        if( schema===undefined )
        {
            this.state.indicator = chartSchema;

            this.sendEvent('error.set.indicator', "schema not found in chart");

            return false;
        }

        if( schema.slice===undefined || schema.slice===null )
        {
            this.sendEvent('error.set.indicator', "slice not found in schema '" + schema.name +"'");

            return false;
        }

        if( chartSchema.main_measure!==undefined )
        {
            schema.slice.main_measure =  chartSchema.main_measure;
        }

        if( chartSchema.assist_measures!==undefined && chartSchema.assist_measures.length>0 )
        {
            schema.slice["assist_measures"] = [];

            schema.slice["assist_measures"].push( ...chartSchema.assist_measures );
        }

        if( chartSchema.filters!==undefined  )
        {
            if( schema.slice.filters===undefined || schema.slice.filters===null )
            {
                schema.slice.filters = {};
            }

            for( let code in chartSchema.filters )
            {
                if( chartSchema.filters[code].expression!==undefined )
                {
                    schema.slice.filters[code] = chartSchema.filters[code].expression;
                }
                else if( schema.slice.filters[code]!==undefined )
                {
                    delete schema.slice.filters[code];
                } 
            }           
        }

        this.state["schemas"][schemaName] = schema;

        return true;
    }

    /**
     * 更新schema filter
     * @param {*} schemaName 
     * @param {*} filter 
     */
    setFilter( schemaName, filter )
    {
        let { chart, schemas } = this.state;

        let schema = schemas[schemaName];

        const code = filter.code.substring(0, 4);

        this.state.filters[code] = filter;

        // schema
        if( schema===undefined )
        {
            return false;
        }

        if( schema.slice===undefined || schema.slice===null )
        {
            this.sendEvent('error.set.filter', "slice not found in schema '" + schema.name +"'");

            return false;
        }

        for( let i in schema.cube.dimensions )
        {
            if( schema.cube.dimensions[i].code.substring(0, 4)===code && ( schema.cube.dimensions[i].type.indexOf('YEAR')!==-1 
                || schema.cube.dimensions[i].type.indexOf('MONTH')!==-1 || schema.cube.dimensions[i].type.indexOf('QUARTER')!==-1 || schema.cube.dimensions[i].type.indexOf('DATE')!==-1 ) )
            { 
                if( schema.slice.main_dimension!==undefined && schema.slice.main_dimension.substring(0, 4)===code )
                {
                    schema.slice.main_dimension = filter.code;
                }
                
                let widgetCondition = new WidgetCondition();

                if( chart.properties!==undefined && chart.properties.dateInterval!==undefined )
                {
                    let content = widgetCondition.createExpression(filter.code, filter.expression);

                    if( content.max.value===content.min.value )
                    {
                        let formatter;

                        switch( filter.dateType )
                        {
                            case "year":
                            {
                                formatter = 'YYYY';
                                break;
                            }
                            case "quarter":
                            {
                                formatter = 'YYYYQ';
                                break;
                            }
                            case "month":
                            {
                                formatter = 'YYYYMM';
                                break;
                            }
                            case "date":
                            {
                                formatter = 'YYYYMMDD';
                                break;
                            }
                            default:
                                break;
                        }

                        let endDate = Widget.parseDate(content.max.value, formatter);

                        let startDate = Widget.computeDate(endDate, filter.dateType, 0-chart.properties.dateInterval+1);

                        content.min.value =  Widget.dateFormatter(startDate, formatter);

                    }
                    
                    let expression = widgetCondition.createCondition(filter.code, "range", {
                        min:content.min,
                        max:content.max
                    });

                    filter.expression = expression;
                }
            }
        }

        if( schema.slice.filters===undefined || schema.slice.filters===null )
        {
            schema.slice.filters = {};
        }

        if( filter.expression!==undefined )
        {
            schema.slice.filters[code] = filter.expression;
        }
        else if( schema.slice.filters[code]!==undefined )
        {
            delete schema.slice.filters[code];
        }
  
        this.state["schemas"][schemaName] = schema;

        this.preHandleEvent( "set.filter" );

        return true;
    }


}

export default WidgetChartBase