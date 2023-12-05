import React from 'react';

import Widget from './Widget';
import WidgetAjax from './WidgetAjax';
import Config from '../config/Config';

class WidgetConsole extends React.Component
{
    constructor( props )
    {
        super(props);

        let DBID = Config.getDBID();

        this.state = {
            dimensionBaseUrl : undefined,
            reportBaseUrl : undefined,
            chartBaseUrl : undefined,
            mapBaseUrl : undefined,
            detailBaseUrl : undefined, 
            DBID : DBID
        }

        this.bindDimension = this.bindDimension.bind(this);
        this.bindReport = this.bindReport.bind(this);
        this.bindChart = this.bindChart.bind(this);
        this.bindMap = this.bindMap.bind(this);
        this.bindDetail = this.bindDetail.bind(this);

        this.readDimension = this.readDimension.bind(this);
        this.onReadDimension = this.onReadDimension.bind(this);

        this.readChartSchema = this.readChartSchema.bind(this);
        this.onReadChartSchema = this.onReadChartSchema.bind(this);

        this.readChartData = this.readChartData.bind(this);
        this.onReadChartData = this.onReadChartData.bind(this);

        this.readReportSchema = this.readReportSchema.bind(this);
        this.onReadReportSchema = this.onReadReportSchema.bind(this);

        this.readReportData = this.readReportData.bind(this);
        this.onReadReportData = this.onReadReportData.bind(this);
    }

    /**
     * 绑定维度基础url
     * @param {*} dimensionBaseUrl 
     */
    bindDimension( dimensionBaseUrl )
    {
        this.state["dimensionBaseUrl"] = dimensionBaseUrl;
    }

    /**
     * 绑定报表基础url
     * @param {*} reportBaseUrl 
     */
    bindReport( reportBaseUrl )
    {
        this.state["reportBaseUrl"] = reportBaseUrl;
    }   

    bindChart( chartBaseUrl )
    {
        this.state["chartBaseUrl"] = chartBaseUrl;
    }

    bindMap( mapBaseUrl )
    {
        this.state["mapBaseUrl"] = mapBaseUrl;
    }

    bindDetail( detailBaseUrl )
    {
        this.state["detailBaseUrl"] = detailBaseUrl;
    }

    /**
     * 读取维度数据
     */
    readDimension( dimension )
    {
        const { dimensionBaseUrl, DBID } = this.state;

        let params = {};

        if( DBID!==undefined && DBID!==null )
        {
            params['DBID'] = DBID;
        }

        params["dimensions"] = [];

        if( dimension instanceof Array )
        {
            params["dimensions"].push(...dimension);
        }
        else
        {
            params["dimensions"].push(dimension);
        }

        // 到缓存请求数据
        let data = Widget.getSessionStorage(JSON.stringify(params));
    
        if( data!==undefined && data!==null  )
        {
            this.props.ref.sendEvent('set.dimension', {params:params, data:JSON.parse(data), dimension:dimension} );
        }
        else
        {
            WidgetAjax.ajax({url : dimensionBaseUrl+'dimension', params : params, callback : this.onReadDimension, backParam:{dimension:dimension} });
        }

        return true;
    }

    /**
     * 读取维度数据回调函数
     * @param {*} result 
     * @param {*} params 
     */
    onReadDimension(result, params, backParam)
    {
        if( result.status===0 )
        {
            // 把数据存入缓存
            Widget.addSessionStorage(JSON.stringify(params), JSON.stringify(result.results));

            let content =  { params:params , data:result.results};

            content = {...content, ...backParam};

            this.props.ref.sendEvent('set.dimension', content);
        }
        else
        {
            this.props.ref.sendEvent('error.dimension', { params:params, message:result.message, status:result.status});
        }
    }

    /**
     * 读取chart方案
     * @param {*} params 
     */
    readChartSchema( schema )
    {
        const { chartBaseUrl, DBID } = this.state;
        let params = {};

        if( DBID!==undefined && DBID!==null )
        {
            params['DBID'] = DBID;
        }

        params["schemas"] = [];

        if( Array.isArray(schema)===true )
        {
            for( let j in schema )
            {
                params["schemas"].push(schema[j].name);
            }
        }
        else
        {
            params["schemas"].push(schema);
        }

        let data = Widget.getSessionStorage( JSON.stringify(params) );
    
        if( data!==undefined && data!==null  )
        {
            this.props.ref.sendEvent('set.chart.schema', {data:JSON.parse(data), schemas:schema});
        }
        else
        {
            WidgetAjax.ajax({url : chartBaseUrl + "schema", params : params, callback : this.onReadChartSchema, backParam:{schemas:schema}});
        }

        return true;
    }

    /**
     * 读取chart方案回调函数
     * @param {*} result 
     * @param {*} params 
     */
    onReadChartSchema( result, params, backParam )
    {
        if( result.status===0 )
        {
            Widget.addSessionStorage(JSON.stringify(params), JSON.stringify(result.results));
            
            let content =  {data:result.results};

            content = {...content, ...backParam};

            this.props.ref.sendEvent('set.chart.schema', content);
        }
        else
        {
            this.props.ref.sendEvent('error.set.chart.schema', {params:params, message:result.message, status:result.status});
        }
    }

    readChartData( params )
    {
        const { chartBaseUrl, DBID } = this.state;

        if( DBID!==undefined && DBID!==null )
        {
            params['DBID'] = DBID;
        }

        // console.log(JSON.stringify(params));
        let data = Widget.getSessionStorage( JSON.stringify(params) );
    
        if( data!==undefined && data!==null  )
        {
            this.props.ref.sendEvent('set.chart.data', {params:params, data:JSON.parse(data), schema:params.schema});
        }
        else
        {
            WidgetAjax.ajax({url : chartBaseUrl + "data", params : params, callback : this.onReadChartData, backParam:{schema:params.schema}});
        }

        return true;
    }

    onReadChartData(result, params, backParam)
    {
        if( result.status===0 )
        {
            Widget.addSessionStorage(JSON.stringify(params), JSON.stringify(result));
            
            let content =  {params:params, data:result};

            content = {...content, ...backParam};

            this.props.ref.sendEvent('set.chart.data', content);
        }
        else
        {
            this.props.ref.sendEvent('error.set.chart.data', {params:params, message:result.message, status:result.status});
        }
    }

    readReportSchema( schema )
    {
        let params = {};

        const { reportBaseUrl, DBID } = this.state;

        if( DBID!==undefined && DBID!==null )
        {
            params['DBID'] = DBID;
        }

        params["schemas"] = [];

        if( Array.isArray(schema)===true )
        {
            for( let j in schema )
            {
                params["schemas"].push(schema[j].name);
            }
        }
        else
        {
            params["schemas"].push(schema);
        }

        let data = Widget.getSessionStorage( JSON.stringify(params) );
    
        if( data!==undefined && data!==null  )
        {
            this.props.ref.sendEvent('set.report.schema', {data:JSON.parse(data), schemas:schema});
        }
        else
        {
            WidgetAjax.ajax({url : reportBaseUrl + "schema", params : params, callback : this.onReadReportSchema, backParam:{schemas:schema}});
        }

        return true;
    }

    onReadReportSchema( result, params, backParam)
    {
        if( result.status===0 )
        {
            Widget.addSessionStorage(JSON.stringify(params), JSON.stringify(result.results));
            
            let content =  {data:result.results};

            content = {...content, ...backParam};

            this.props.ref.sendEvent('set.report.schema', content);
        }
        else
        {
            this.props.ref.sendEvent('error.set.report.schema', {params:params, message:result.message, status:result.status});
        }
    }

    readReportData( params )
    {
        const { reportBaseUrl, DBID } = this.state;

        if( DBID!==undefined && DBID!==null )
        {
            params['DBID'] = DBID;
        }

        // console.log(JSON.stringify(params)); 

        let data = Widget.getSessionStorage( JSON.stringify(params) );
    
        if( data!==undefined && data!==null  )
        {
            data = JSON.parse(data);

            let content =  {params:params, data:data.results, total:data.total};

            content["schema"] = params.schema;

            this.props.ref.sendEvent('set.report.data',  content);
        }
        else
        {
            WidgetAjax.ajax({url : reportBaseUrl + "data", params : params, callback : this.onReadReportData, backParam:{schema:params.schema}});
        }

        return true;
    }

    onReadReportData(result, params, backParam)
    {
        if( result.status===0 )
        {
            Widget.addSessionStorage(JSON.stringify(params), JSON.stringify(result));

            let content =  {params:params, data:result.results, total:result.total};

            content = {...content, ...backParam};

            this.props.ref.sendEvent('set.report.data', content);
        }
        else
        {
            this.props.ref.sendEvent('error.set.report.data', {params:params, message:result.message, status:result.status});
        }
    }
}

export default  WidgetConsole;