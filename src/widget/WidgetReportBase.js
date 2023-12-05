// WidgetReportBase
import React from 'react';
import WidgetComponent from '../widget/WidgetComponent';

class WidgetReportBase extends WidgetComponent 
{
    constructor( props )
    {
        super(props);

        this.state = {
            data : undefined,
            total: undefined,
            page : 1,
            records : 10,
            report : props.report,  
            schemas : {},
            columns : {},
            datas : {},
            totals : {},
            filters : {},
            options : {},
            schemaDimensionIndex : {},
            queryFlag : {},
            width : 0,
            height : 0,
            loading : true,
            preHandleEvent:props.preHandleEvent,
            isHeightAuto : props.isHeightAuto!==undefined ? props.isHeightAuto : false
        };

        // 获取组件自身
        this.myRef = React.createRef();

        this.pageTurning = this.pageTurning.bind(this);
        this.onEvent = this.onEvent.bind(this);
       
        this.setFilter = this.setFilter.bind(this);
        this.updateData = this.updateData.bind(this);
        this.setColumns = this.setColumns.bind(this);
        this.buildColumn = this.buildColumn.bind(this);
        this.buildOption = this.buildOption.bind(this);
        this.createSchema = this.createSchema.bind(this);
        this.createColumn = this.createColumn.bind(this);
        
        this.setReportFilter = this.setReportFilter.bind(this);

        this.buildDimensions = this.buildDimensions.bind(this);
        this.onHandleEventSelf = this.onHandleEventSelf.bind(this);
    }

    /**
     * 组件渲染之后再调用页面方法
     */
    componentDidMount()
    {
        const { report } = this.props;

        this.buildOption();

        this.buildDimensions(report.schemas);

        this.sendEvent('read.report.schema', report.schemas );

        this.updateRect();
    }

    componentDidUpdate()
    {
        this.updateRect();
    }

    updateRect()
    {
        if( this.myRef!==undefined )
        {
            if( this.myRef.current!==null )
            {
                const { isHeightAuto } = this.state;

                let height = this.myRef.current.parentElement.clientHeight;
                const width = this.myRef.current.parentElement.clientWidth;

                if( height===0 || height===null || isHeightAuto===true )
                {
                    let e = this.myRef.current.getElementsByClassName("rs-table-row");

                    if(  e!==undefined && e.length>0 )
                    {
                        for( let i=0; i<e.length; i++ )
                        {
                            height += e[i].offsetHeight;
                        }
                    }
                
                    height += 44;
                }

                if (this.state.width !== width || this.state.height !== height)
                {
                    this.setState({width, height});
                }
            }   
        }
    }
  
    /**
     * 表格事件调用
     * @param {*} type 
     * @param {*} data 
     * @param {*} value 
     * @param {*} event 
     */
    onEvent(type, data, value, event)
    {
        let ret = false;
        
        if( this.props.notify!==undefined )
        {
            ret = this.props.notify( type, data, value, event )
        }

        return ret;
    }

    /**
     * 翻页
     * @param {*} page 
     */
    pageTurning( page )
    {
        const { schemas } = this.state;

        for(let key in schemas )
        {
            this.updateData(schemas[key].name, page);
        }
    }
    
    /**
     * 创建 table option
     */
    buildOption()
    {
        let options = {};

        const { report } = this.state;

        options = {...options, ...report.properties};

        this.state["options"] = options;

        if( report.properties!==undefined && report.properties.records!==undefined )
        {
            this.state["records"] = report.properties.records;
        }
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
                    dimensionIndex[schemas[i].dimensions[j]] = schemas[i].dimensions[j];
                }

                this.state["dimensionIndex"][schemas[i].name] = dimensionIndex;
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
                case "report.schema" :
                {
                    let schemas = preHandleEvent(this.state.schemas, type);

                    this.state["schemas"] = schemas;

                    break;
                }
                case "report.filter":
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

    onHandleEventSelf( event )
    {
        const { schemas } = this.state;
        const { report } = this.props;

        this.buildDimensions(report.schemas);

        let ret = false;

        if( ret===false )
        {
            switch( event.type )
            {
                case "set.report.schema":
                {
                    if( JSON.stringify(this.props.report.schemas)===JSON.stringify(event.content.schemas) )
                    {

                        for( let j in event.content.data )  
                        {
                            this.createSchema( event.content.data[j] );

                            this.preHandleEvent( "report.schema" );

                            let schema = this.state.schemas[event.content.data[j].name];
                            
                            // 更新 filter 
                            if( this.state.filters!==undefined && Object.keys(this.state.filters).length>0 )
                            {
                                for( let i in this.state.filters )
                                {
                                    this.setFilter(schema.name, this.state.filters[i]);
                                }
                            }

                            this.updateData(schema.name);
                        } 
                    }
                    break;
                }
                case "set.report.data" :
                {
                    for( let i in schemas )
                    {                       
                        let queryFlag = schemas[i].name + "_"  +  this.state.queryFlag[schemas[i].name];

                        if( event.content.schema===schemas[i].name && queryFlag===event.content.params.queryFlag )
                        {
                            this.state.datas[schemas[i].name] = event.content.data;
                            this.state.totals[schemas[i].name] = event.content.total;
                            
                            if( Object.keys(schemas).length===Object.keys(this.state.datas).length )
                            {
                                this.setState({data: this.state.datas, totals:this.state.totals, loading:false});
                            }
                        } 
                    }   
                    break;
                }
                case "set.filter":
                {
                    const { dimensionIndex } = this.state;
                   
                    let code = event.content.code.substring(0, 4);

                    for( let i in report.schemas )
                    {
                        // 判断是否绑定 filter对应的dimension
                        //  产生一个 read.report.data 事件
                        if( dimensionIndex[report.schemas[i].name]!==undefined && dimensionIndex[report.schemas[i].name][code]!==undefined )
                        {
                            let ret = this.setFilter(report.schemas[i].name, event.content );

                            if( ret===true )
                            {
                                this.updateData(report.schemas[i].name);
                            }
                        }
                    }
                    break;
                }
                case "set.report.column":
                {
                    for( let i in report.schemas )
                    {
                        if( report.schemas[i].name===event.content.schemaName )
                        {
                            let ret = this.setColumns(report.schemas[i].name, event.content.columns);

                            if( ret===true )
                            {
                                this.updateData(report.schemas[i].name);
                            }
                        }
                    }
                    break;
                }
                case "set.report.filter" : 
                {
                    for( let i in report.schemas )
                    {
                        if( report.schemas[i].name===event.content.schemaName )
                        {
                            let ret = this.setReportFilter(report.schemas[i].name, event.content.filters);

                            if(  ret===true )
                            {
                                this.updateData(report.schemas[i].name);
                            }
                        }
                    }
                    break; 
                }
                case "set.report.loading" : 
                {
                    for( let i in report.schemas )
                    {
                        if( report.schemas[i].name===event.content.schemaName )
                        {
                            this.setState({loading:true});
                        }
                    }
                    break;
                }
                case "update.report.data" :
                {
                    for( let i in report.schemas )
                    {
                        if( report.schemas[i].name===event.content.schemaName )
                        {
                            this.updateData(report.schemas[i].name)
                        } 
                    }
                    break;
                }
                default:
                    break;
            }
        }

        return ret
    }

    /**
     * 设置报表列
     * @param {*} schemaName 
     * @param {*} columns 
     */
    setColumns( schemaName, columns )
    {
        const { schemas } = this.state;

        let schema = schemas[schemaName];

        if( schema===undefined )
        {
            return false;
        }

        let reportColumns = [];

        if( columns!==undefined && columns.length>0 )
        {
            this.state["columns"][schemaName] = [];

            for( let i in columns )
            {
                let column = this.buildColumn(columns[i]);

                reportColumns.push(column);
            }
    
            this.state["columns"][schemaName].push(...columns);  

            return true;
        }
    }

    /**
     * 设置筛选项
     * @param {*} schemaName 
     * @param {*} filter 
     * @returns 
     */
    setFilter( schemaName, filter )
    {
        const { schemas } = this.state;

        let schema = schemas[schemaName];

        const code = filter.code.substring(0, 4);

        this.state.filters[code] = filter;

        if( schema===undefined )
        {
            this.sendEvent('error.set.filter', "schema not found in report");

            return false;
        }

        if( schema.filters===undefined || schema.filters===null )
        {
            schema.filters = {};
        }

        if( filter.expression!==undefined )
        {
            schema.filters[code] = filter.expression;
        }
        else if( schema.filters[code]!==undefined )
        {
            delete schema.filters[code];
        }
  
        this.state["schemas"][schemaName] = schema;

        return true;
    }

    /**
     * 设置报表筛选项
     * @param {*} schemaName 
     * @param {*} filters 
     */
    setReportFilter( schemaName, filters )
    {
        const { schemas } = this.state;

        let schema = schemas[schemaName];

        if( schema===undefined )
        {
            this.sendEvent('error.set.filter', "schema not found in report");

            return false;
        }

        if( schema.filters===undefined || schema.filters===null )
        {
            schema.filters = {};
        }

        if( filters!==undefined && filters!==null )
        {
            for( let key in filters )
            {
                if( key!=="undefined")
                {
                    if( filters[key]!==undefined )
                    {
                        schema.filters[key] = filters[key];
                    }
                    else if( schema.filters[key]!==undefined )
                    {
                        delete schema.filters[key];
                    }
                }
            }
        }

        this.state["schemas"][schemaName] = schema;

        return true;
    }

    /**
     * 
     * @param {*} schemaName 方案名称
     */ 
    updateData( schemaName, page)
    {
        this.preHandleEvent( "report.filter" );

        const { schemas, records } = this.state;

        let { options } = this.state;

        let schema = schemas[schemaName];

        if( schema===undefined )
        {
            this.sendEvent('error.read.report.data', "schema not found in report");

            return false;
        }

        if( page===undefined )
        {
            page = 1;
        }

        let content = {
            schema : schema.name,
            filters : schema.filters,
            page : page,
            records : records 
        };
        
        if( this.state.queryFlag[schema.name]===undefined )
        {
            this.state.queryFlag[schema.name] = 0;
        }

        this.state.queryFlag[schema.name]++;

        content["queryFlag"] = schema.name + "_" + this.state.queryFlag[schema.name];

        options = {...options, ...{page:page, records:records}};

        this.setState({loading:true, options:options});

        this.sendEvent('read.report.data', content);
    }

    /**
     * 创建 report schema
     * @param {*} schema 
     */
    createSchema( schema )
    {
        if( this.state["schemas"]===undefined )
        {
            this.state["schemas"] = {};
        }

        if( schema!==undefined )
        {
            this.state["schemas"][schema.name] = schema;
        }

        this.createColumn( schema.name );
    }

    /**
     * 创建表格列
     * @param {*} schemaName report schema name
     */
    createColumn( schemaName )
    {
        const { schemas, report } = this.state;

        let schema = schemas[schemaName];
        let columns = [];

        this.state["columns"][schemaName] = [];

        if( schema!==undefined )
        {
            for( let i in schema.columns )
            {
                let column = this.buildColumn(schema.columns[i]);

                columns.push(column);
            }
        }

        for(let i=0; i<report.schemas.length; i++ )
        {
            if( report.schemas[i].name===schemaName && report.schemas[i].properties!==undefined && report.schemas[i].properties["columns"]!==undefined && report.schemas[i].properties["columns"].length>0 )
            {
                columns.push(...report.schemas[i].properties["columns"]);
            }
        }
      
        this.state["columns"][schemaName].push(...columns);   
    }

    /**
     * 创建表格列
     * @param {*} content 
     * @returns 
     */
    buildColumn( content )
    {
        let column = {};
        
        column["name"] = content.name;
        column["title"] = content.title;
        column["type"] = content.type;

        let  properties = {};

        if( content.width!==undefined )
        {
            properties["width"] = content.width;
        }

        if( content.properties!==undefined )
        {
            if( content.properties["display"]!==undefined  )
            {
                properties["hidden"] = false;

                switch( content.properties["display"] )
                {
                    case "hide":
                    {
                        properties["hidden"] = true
                        break;
                    }
                    case "show":
                    {
                        properties["hidden"] = false
                        break;
                    }
                    case "option":
                    {
                        properties["hidden"] = true
                        break;
                    }
                    default:
                        break; 
                }
            }
        }

        properties = {...content.properties, ...properties}

        column["properties"] = properties;

        return column;
    }
}

export default WidgetReportBase