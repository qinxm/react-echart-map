import React from 'react';

import Widget from './Widget';

import WidgetComponent from './WidgetComponent';
import WidgetEchartMap from './echarts/WidgetEchartMap';
import WidgetEchartLine from './echarts/WidgetEchartLine';

// import WidgetEchartBar from './echarts/WidgetEchartBar';
import WidgetEchartColumn from './echarts/WidgetEchartColumn';

// import WidgetEchartBar from './echarts/widgetBar';
// import WidgetEchartColumn from './echarts/WidgetVerticalbar';

import WidgetEcharDualAxes from './echarts/WidgetEcharDualAxes';
import WidgetEchartPie from './echarts/WidgetEchartPie';
// import WidgetEcharScatter from './echarts/WidgetEcharScatter';
import WidgetEchartMapScatter from './echarts/WidgetEchartMapScatter';
// import WidgetEcharSunburst from './echarts/WidgetEcharSunburst';
// import WidgetEcharArea from './echarts/WidgetEcharArea';
import WidgetEchartTimeScatter from './echarts/WidgetEchartTimeScatter';
// import WidgetEchartBidirectionalBar from './echarts/WidgetEchartBidirectionalBar';
import WidgetEchartMapFlow from './echarts/WidgetEchartMapFlow';
// import WidgetEcharRadar from './echarts/WidgetEcharRadar';
// import WidgetEchartChord from './echarts/WidgetEchartChord';

import '../css/widget/widget.echart.css'
import { sort } from 'semver';

class WidgetChartEchart extends WidgetComponent 
{
    /**
     * 构造函数
     * @param {*} props 
     */
    constructor(props)
    {
        super(props);

        this.state = {
            dimensionIndex :{},
            measureIndex : {},
            exportColumns:[],
            exportData:[]
        };

        this.onEvent = this.onEvent.bind(this);

        this.sortData = this.sortData.bind(this);

        this.buildData = this.buildData.bind(this);
        this.buildOption = this.buildOption.bind(this);
        this.buildChordData = this.buildChordData.bind(this);
        this.buildNormalData = this.buildNormalData.bind(this);
        this.buildSunburstData = this.buildSunburstData.bind(this);
        this.formatSunburstData = this.formatSunburstData.bind(this);
        this.transformSunburstData = this.transformSunburstData.bind(this); 
        this.buildBidirectionalBarData = this.buildBidirectionalBarData.bind(this);

        this.buildTimeScatterData = this.buildTimeScatterData.bind(this);
        this.buildTimeScatterOption =  this.buildTimeScatterOption.bind(this);

        this.buildMapOption = this.buildMapOption.bind(this);
        this.buildMapFlowOption = this.buildMapFlowOption.bind(this);
        
        this.buildMeasureIndex = this.buildMeasureIndex.bind(this);  
        this.buildDimensionIndex = this.buildDimensionIndex.bind(this);   
        this.buildDimensionValueIndex = this.buildDimensionValueIndex.bind(this);

        this.tooltipFormatter = this.tooltipFormatter.bind(this);
        this.tooltipFormatterG2Plot = this.tooltipFormatterG2Plot.bind(this);

        this.mapFlowTooltipFormatter = this.mapFlowTooltipFormatter.bind(this);

        this.timeScatterTooltipFormatter = this.timeScatterTooltipFormatter.bind(this);

        this.buildExportData = this.buildExportData.bind(this);
        this.buildExportColumns = this.buildExportColumns.bind(this); 

        this.getExportColumns = this.getExportColumns.bind(this);
        this.getExportData = this.getExportData.bind(this);
    }


    /**
     * 排序 默认按主度量倒叙排序
     * @param {JSON} data 
     * @param {string} sortColumn 
     * @param {string} sortType DESC ASC
     * @returns 
     */
    sortData( data, sortColumn, sortType )
    {
        let index = 0, dimensionIndex = 0;
        if( sortColumn!==undefined )
        {
            if( data.columns!==undefined && data.columns.dimensions!==undefined )
            {
                dimensionIndex = data.columns.dimensions.length;

                for( let i=0; i<data.columns.dimensions.length; i++ )
                {
                    if( data.columns.dimensions[i].code===sortColumn )
                    {
                        index = i;
                        break;
                    }
                }
            }
    
            if( data.columns!==undefined && data.columns.measures!==undefined )
            {
                for( let i=0; i<data.columns.measures.length; i++ )
                {
                    if( data.columns.measures[i].code===sortColumn )
                    {
                        index = i + dimensionIndex;
                        break;
                    }
                }
            }
        }
        else
        {
            if( data.columns!==undefined && data.columns.dimensions!==undefined )
            {
                dimensionIndex = data.columns.dimensions.length;
            }

            index = dimensionIndex + 0; // 主度量索引
        }

        let results = [...data.results];

        results.sort((a, b) => {

            if( sortType==="ASC")
            {
                return a[index] - b[index]
            }
            else
            {
                return b[index] - a[index]
            }
        })

        data.results = results;
        
        return data;
    }

    /** 创建数据 */
    buildData(chart, data, schema)
    {    
        let chartData = undefined;

        if( data===undefined )
        {
            return  chartData;
        }

        if( data.results!==undefined && data.results.length===0 )
        {
            return [];
        }

        if( data!==undefined )
        {

            this.buildDimensionIndex(schema);
        
            this.buildMeasureIndex(schema);

            // 排序
            if( chart.properties!==undefined && chart.properties.sort!==undefined && chart.properties.sort.sortable===true )
            {
                let sortColumn = chart.properties.sort.column;
                let sortType = chart.properties.sort.type;

                data = this.sortData(data, sortColumn, sortType);
            }

            switch( chart.type )
            {
                case "map":
                case "mapScatter":
                {
                    chartData = this.buildNormalData(data, schema);
                    chartData["mapName"] = chart.mapName;
    
                    return chartData;
                }
                case "column" :
                case "line" :
                case "pie" :
                case "scatter":
                case "bar" : 
                case "dualAxes":
                case "bidirectionalBarMeasure":
                case "area":
                {
                    return this.buildNormalData(data, schema);
                }
                case "bidirectionalBar": 
                case "radar":        
                {
                    return this.buildBidirectionalBarData(data, schema);
                }
                case "sunburst" :
                {
                    return this.buildSunburstData(data, schema)
                }
                case "timeScatter" : 
                {
                    return this.buildTimeScatterData(data, schema);
                }
                case "chord" :
                {
                    return this.buildChordData(data, schema);
                }
                case "mapFlow" : 
                {
                    chartData = this.buildNormalData(data, schema);
                    chartData["mapName"] = chart.mapName;

                    return chartData;
                }
                default :
                    break;
            }
        }

        return chartData;
    }

    /** 创建图形数据 */
    buildNormalData( data, schema)
    {
        let min = 0, max = 0, dimensions, measures, dimensionIndex = 0, xData = [], sData = [], chartData = {};
        let itemDatas=[], xDataMap = {}, sDataMap = {}, xDimensionCode, sDimensionCode; 

        let dimensionValueIndex = this.buildDimensionValueIndex(data);

        let values = data.results;

        if( data.columns!==undefined && data.columns.dimensions!==undefined )
        {
            dimensions =  data.columns.dimensions;
            dimensionIndex = data.columns.dimensions.length;
        }

        if( data.columns!==undefined && data.columns.measures!==undefined )
        {
            measures =  data.columns.measures;
        }

        this.buildDimensionIndex(schema);
        
        this.buildMeasureIndex(schema);

        for( var i in values )
        {
            for( var j in dimensions)
            {
                if( dimensions[j].role==="main" )
                {
                    xDimensionCode = dimensions[j].code;

                    xDataMap[values[i][j]] = values[i][j];
                }
                else
                {
                    sDimensionCode = dimensions[j].code;

                    sDataMap[values[i][j]] = values[i][j];
                }
            }
        }
        
        if( xDataMap!==undefined && Object.values(xDataMap).length>0 )
        {
            for(let key in xDataMap)
            {
                if( xDataMap[key]!==undefined && xDataMap[key]!=="" && xDataMap[key]!=="undefined" )
                {
                    if( dimensionValueIndex[xDimensionCode][xDataMap[key]]!==undefined )
                    {
                        xData.push(dimensionValueIndex[xDimensionCode][xDataMap[key]]);
                    }
                    else
                    {
                        xData.push(xDataMap[key]);
                    }
                }
                else
                {
                    xData.push("其他");
                }
            }
        }

        if( sDataMap!==undefined && Object.values(sDataMap).length>0 )
        {
            for(let key in sDataMap)
            {
                if( sDataMap[key]!==undefined && sDataMap[key]!=="" && sDataMap[key]!=="undefined" )
                {
                    if( dimensionValueIndex[sDimensionCode][sDataMap[key]]!==undefined )
                    {
                        sData.push(dimensionValueIndex[sDimensionCode][sDataMap[key]]);
                    }
                    else
                    {
                        sData.push(sDataMap[key]);
                    }
                }
                else
                {
                    sData.push("其他");
                }  
            }
        }

        for( var k in values )
        {
            let itemData = {};

            if( values[k][dimensionIndex]>max )
            {
                max = values[k][dimensionIndex];
            }

            if( values.length>1 )
            {
                if( min===0 || values[k][dimensionIndex]<min )
                {
                    min = values[k][dimensionIndex];
                }
            }
            
            for( var n in dimensions)
            {
                var code = dimensions[n].code;

                let dimension = this.state.dimensionIndex[code.substring(0, 4)];

                itemData[dimension.title] = dimensionValueIndex[code][values[k][n]];

                if( dimensions[n].role==="main")
                {
                    itemData["name"] = dimensionValueIndex[code][values[k][n]];
                    itemData[code] = dimensionValueIndex[code][values[k][n]];

                    itemData["xDimensionCode"] = code;
                    itemData["xDimensionValue"] = values[k][n];
                }
                else
                {
                    
                    itemData["sname"] = dimensionValueIndex[code][values[k][n]];
                    itemData[code] = dimensionValueIndex[code][values[k][n]];
                    itemData["sDimensionCode"] = code;
                    itemData["sDimensionValue"] = values[k][n];
                } 
            }

            for(let n=0; n<measures.length; n++ )
            {
                let measure = this.state.measureIndex[measures[n].code];

                if( measures[n].role==="main" )
                {
                    itemData["value"] = values[k][dimensionIndex+n];
                }

                itemData[measure.title] = values[k][dimensionIndex+n];
                itemData[measure.code] = values[k][dimensionIndex+n];
            }

            itemDatas.push(itemData);
        }

        chartData["data"] = [];

        if( sData!==undefined && sData.length>0 )
        {
            for( let i in sData)
            {
                for( let j in xData )
                {
                    for( let k in itemDatas )
                    {
                        if( itemDatas[k].sname===sData[i] &&  itemDatas[k].name===xData[j])
                        {
                            chartData["data"].push(itemDatas[k]);
                        }
                    }
                }
            }
        }
        else if( xData!==undefined && xData.length>0 )
        {
            for( let i in xData )
            {
                for( let k in itemDatas )
                {
                    if( itemDatas[k].name===xData[i])
                    {
                        chartData["data"].push(itemDatas[k]);
                    }
                }
            }
        }
        else
        {
            chartData["data"].push(...itemDatas);
        }

        chartData["max"] = max;
        chartData["min"] = min;

        return chartData;
    }

    /**
     * 对比图数据组装
     * @param {*} data 
     * @param {*} schema 
     */
    buildBidirectionalBarData(data, schema)
    {
         let min = 0, max = 0, dimensions, measures, dimensionIndex = 0, xData = [], sData = [], chartData = {};
        let itemDatas=[], xDataMap = {}, sDataMap = {}, xDimensionCode, sDimensionCode; 

        let dimensionValueIndex = this.buildDimensionValueIndex(data);

        let values = data.results;

        if( data.columns!==undefined && data.columns.dimensions!==undefined )
        {
            dimensions =  data.columns.dimensions;
            dimensionIndex = data.columns.dimensions.length;
        }

        if( data.columns!==undefined && data.columns.measures!==undefined )
        {
            measures =  data.columns.measures;
        }

        this.buildDimensionIndex(schema);
        
        this.buildMeasureIndex(schema);

        for( var i in values )
        {
            for( var j in dimensions)
            {
                if( dimensions[j].role==="main" )
                {
                    xDimensionCode = dimensions[j].code;

                    xDataMap[values[i][j]] = values[i][j];
                }
                else
                {
                    sDimensionCode = dimensions[j].code;

                    sDataMap[values[i][j]] = values[i][j];
                }
            }
        }
         
        if( xDataMap!==undefined && Object.values(xDataMap).length>0 )
        {
            for(let key in xDataMap)
            {
                if( xDataMap[key]!==undefined && xDataMap[key]!=="" && xDataMap[key]!=="undefined" )
                {
                    if( dimensionValueIndex[xDimensionCode][xDataMap[key]]!==undefined )
                    {
                        xData.push(dimensionValueIndex[xDimensionCode][xDataMap[key]]);
                    }
                    else
                    {
                        xData.push(xDataMap[key]);
                    }
                }
                else
                {
                    xData.push("其他");
                }
            }
        }
 
        if( sDataMap!==undefined && Object.values(sDataMap).length>0 )
        {
            for(let key in sDataMap)
            {
                if( sDataMap[key]!==undefined && sDataMap[key]!=="" && sDataMap[key]!=="undefined" )
                {
                    if( dimensionValueIndex[sDimensionCode][sDataMap[key]]!==undefined )
                    {
                        sData.push(dimensionValueIndex[sDimensionCode][sDataMap[key]]);
                    }
                    else
                    {
                        sData.push(sDataMap[key]);
                    }
                }
                else
                {
                    sData.push("其他");
                }  
            }
        }

        for( var k in values )
        {
            let itemData = {};

            if( values[k][dimensionIndex]>max )
            {
                max = values[k][dimensionIndex];
            }

            if( min===0 || values[k][dimensionIndex]<min )
            {
                min = values[k][dimensionIndex];
            }

            for( var n in dimensions)
            {
                var code = dimensions[n].code;

                let dimension = this.state.dimensionIndex[code.substring(0, 4)];

                itemData[dimension.title] = dimensionValueIndex[code][values[k][n]];

                if( dimensions[n].role==="main")
                {
                    itemData["name"] = dimensionValueIndex[code][values[k][n]];
                    itemData[code] = dimensionValueIndex[code][values[k][n]];
                    itemData["xDimensionCode"] = code;
                    itemData["xDimensionValue"] = values[k][n];
                }
                else
                {
                    
                    itemData["sname"] = dimensionValueIndex[code][values[k][n]];
                    itemData[code] = dimensionValueIndex[code][values[k][n]];
                    itemData["sDimensionCode"] = code;
                    itemData["sDimensionValue"] = values[k][n];
                } 
            }

            for(let n=0; n<measures.length; n++ )
            {
                let measure = this.state.measureIndex[measures[n].code];

                if( measures[n].role==="main" )
                {
                    itemData["value"] = values[k][dimensionIndex+n];
                }

                itemData[measure.title] = values[k][dimensionIndex+n];
                itemData[measure.code] = values[k][dimensionIndex+n];
            }

            itemDatas.push(itemData);
        }

        chartData["data"] = [];

        if( sData!==undefined && sData.length>0 )
        {
            for( let i in sData)
            {
                let item = {};
                item["name"] = sData[i];

                for( let j in xData )
                {
                    for( let k in itemDatas )
                    {
                        if( itemDatas[k].sname===sData[i] && itemDatas[k].name===xData[j] )
                        {
                            item[xData[j]] = itemDatas[k].value
                        }
                    }
                }

                chartData["data"].push(item); 
            }
        }
        chartData["max"] = max;
        chartData["min"] = min;
 
        return chartData;
    }

    /**
     * 创建时间散点图数据
     * @param {*} data 
     * @param {*} schema 
     * @returns 
     */
    buildTimeScatterData(data, schema)
    {
        let chartData = {}, timeLine = [], legendData = [], dataMap = {}, xDataMap = {}, sDataMap = {};
        let dimensions, measures, xDimensionCode, sDimensionCode, dimensionIndex;

        let dimensionValueIndex = this.buildDimensionValueIndex(data);

        let values = data.results;

        this.buildDimensionIndex(schema);
        
        this.buildMeasureIndex(schema);

        if( data.columns!==undefined && data.columns.dimensions!==undefined )
        {
            dimensions =  data.columns.dimensions;
            dimensionIndex = data.columns.dimensions.length;
        }

        if( data.columns!==undefined && data.columns.measures!==undefined )
        {
            measures =  data.columns.measures;
        }

        for( var i in values )
        {
            for( var j in dimensions)
            {
                if( dimensions[j].role==="main" )
                {
                    xDimensionCode = dimensions[j].code;

                    xDataMap[values[i][j]] = values[i][j];
                }
                else
                {
                    sDimensionCode = dimensions[j].code;

                    sDataMap[values[i][j]] = values[i][j];
                }
            }
        }

        if( xDataMap!==undefined && Object.values(xDataMap).length>0 )
        {
            for(let key in xDataMap)
            {
                if( xDataMap[key]!==undefined && xDataMap[key]!=="" && xDataMap[key]!=="undefined" )
                {
                    if( dimensionValueIndex[xDimensionCode][xDataMap[key]]!==undefined )
                    {
                        timeLine.push(dimensionValueIndex[xDimensionCode][xDataMap[key]]);
                    }
                    else
                    {
                        timeLine.push(xDataMap[key]);
                    }
                }
                else
                {
                    timeLine.push("其他");
                }
            }
        }

        if( sDataMap!==undefined && Object.values(sDataMap).length>0 )
        {
            for(let key in sDataMap)
            {
                if( sDataMap[key]!==undefined && sDataMap[key]!=="" && sDataMap[key]!=="undefined" )
                {
                    if( dimensionValueIndex[sDimensionCode][sDataMap[key]]!==undefined )
                    {
                        legendData.push(dimensionValueIndex[sDimensionCode][sDataMap[key]]);
                    }
                    else
                    {
                        legendData.push(sDataMap[key]);
                    }
                }
                else
                {
                    legendData.push("其他");
                }  
            }
        }

        for( var k in values )
        {
            let itemData = [], key;

            for(let n=0; n<measures.length; n++ )
            {
                itemData.push(values[k][dimensionIndex+n]);
            }

            for( var n in dimensions)
            {

                var code = dimensions[n].code;

                if( dimensions[n].role==="main")
                {                    
                    key =  dimensionValueIndex[code][values[k][n]];
                }
                
                itemData.push(dimensionValueIndex[code][values[k][n]]);
            }

            if( dataMap[key]===undefined )
            {
                dataMap[key] = [];
            }

            dataMap[key].push(itemData);
        }

        chartData["timeLine"] = timeLine;
        chartData["legendData"] = legendData;
        chartData["data"] = dataMap;
        
        return  chartData;
    }

    /**
     * 弦图数据组装
     * @param {*} data 
     * @param {*} schema 
     */
    buildChordData( data, schema )
    {
        let min = 0, max = 0, dimensions, measures, dimensionIndex = 0, chartData = {};
        let itemDatas=[]; 

        let dimensionValueIndex = this.buildDimensionValueIndex(data);

        let values = data.results;

        if( data.columns!==undefined && data.columns.dimensions!==undefined )
        {
            dimensions =  data.columns.dimensions;
            dimensionIndex = data.columns.dimensions.length;
        }

        if( data.columns!==undefined && data.columns.measures!==undefined )
        {
            measures =  data.columns.measures;
        }

        this.buildDimensionIndex(schema);
        
        this.buildMeasureIndex(schema);

        for( var k in values )
        {
            let itemData = {};

            if( values[k][dimensionIndex]>max )
            {
                max = values[k][dimensionIndex];
            }

            if( min===0 || values[k][dimensionIndex]<min )
            {
                min = values[k][dimensionIndex];
            }

            for( var n in dimensions)
            {
                var code = dimensions[n].code;

                let dimension = this.state.dimensionIndex[code.substring(0, 4)];

                itemData[dimension.title] = dimensionValueIndex[code][values[k][n]];

                if( dimensions[n].role==="main")
                {
                    itemData["name"] = dimensionValueIndex[code][values[k][n]];
                    itemData[code] = dimensionValueIndex[code][values[k][n]];

                    itemData["xDimensionCode"] = code;
                    itemData["xDimensionValue"] = values[k][n];
                }
                else
                {
                    
                    itemData["sname"] = dimensionValueIndex[code][values[k][n]];
                    itemData[code] = dimensionValueIndex[code][values[k][n]];
                    itemData["sDimensionCode"] = code;
                    itemData["sDimensionValue"] = values[k][n];
                } 
            }

            for(let n=0; n<measures.length; n++ )
            {
                let measure = this.state.measureIndex[measures[n].code];

                if( measures[n].role==="main" )
                {
                    itemData["value"] = values[k][dimensionIndex+n];
                }

                itemData[measure.title] = values[k][dimensionIndex+n];
                itemData[measure.code] = values[k][dimensionIndex+n];
            }

            itemDatas.push(itemData);
        }

        chartData["data"] = [];

        chartData["data"].push(...itemDatas);

        chartData["max"] = max;
        chartData["min"] = min;

        return chartData;
    }

    /**
     * 旭日图数据组装
     * @param {*} data 
     * @param {*} schema 
     */
    buildSunburstData( data, schema )
    {
        let dimensions, measures, dimensionIndex = 0, chartData = {};

        let dimensionValueIndex = this.buildDimensionValueIndex(data);

        this.buildDimensionIndex(schema);
        
        this.buildMeasureIndex(schema);

        let values = data.results;

        if( data.columns!==undefined && data.columns.dimensions!==undefined )
        {
            dimensions =  data.columns.dimensions;
            dimensionIndex = data.columns.dimensions.length;
        }

        if( data.columns!==undefined && data.columns.measures!==undefined )
        {
            measures =  data.columns.measures;
        }

        let dateTemp = this.transformSunburstData(values, dimensionIndex);

        let itemData = this.formatSunburstData(dateTemp, null, dimensions, measures, dimensionValueIndex);

        chartData["data"] = itemData;

        return chartData;
    }

    /**
     * 旭日图数据转换
     * @param {*} input 
     * @param {*} n 
     * @returns 
     */
    transformSunburstData( input, n )
    {
        let root = {}
        for (let i = 0; i < input.length; i++)
        {
            let e = input[i];
            let r = root
            for (let j = 0; j < e.length; j++)
            {
                let d = e[j]
                
                if (j >= n)
                {
                    r["value_"+j] = d;
                    continue;
                }

                d  = d + "_" + j;
                if( d in r ) 
                {
                    r = r[d]
                }
                else
                {
                    let t = {}
                    r[d] = t
                    r = t
                }
            }
        }
        return root;
    }

    formatSunburstData( input, p, dimensions, measures, dimensionValueIndex )
    {
        let root = []
        for (let key in input)
        {
            let value = input[key];

            let d = {};

            if ( key.substr(0,6) === "value_" )
            {
                key = parseInt(key.substr(6));

                let n = key - dimensions.length;

                let measure = measures[n];

                if( key===dimensions.length)
                {
                    p['value'] = value;
                }
                p[measure.code] = value;

                continue;
            }
            else
            {
                let keys = key.split("_");

                key = keys[0];
               
                let code = dimensions[keys[1]].code;

                d["name"] = dimensionValueIndex[code][key];
                d["dimensionValue"] = key;
                d['dimensionCode'] = code;
               
                let children = this.formatSunburstData(value, d, dimensions, measures, dimensionValueIndex);

                if (children.length > 0)
                {
                    d["children"] = children;
                }
            }
            
            root.push(d);
        }

        return root;
    }

    buildOption( chart, schema, chartData)
    {
        let option = {}; let yFieldData = []; let xname = "";

        if( schema!==undefined )
        {  
            if( chart.type==="bidirectionalBar" )
            {
                if( schema.slice["assist_dimensions"]!==undefined )
                {
                    option["isGroup"] = true; 

                    let sCode = schema.slice["assist_dimensions"][0].substring(0, 4);

                    xname = this.state.dimensionIndex[sCode].title;

                    option["xField"] = {name: "name"}; 

                    Object.keys(chartData.data[0]).forEach(function(k) 
                    {
                        if( "name"!==k )
                        {
                           var yField = {};
                           yField["name"] = k;
                           yFieldData.push(yField);
                        }
                    });

                    option["yField"] =yFieldData;
                }
            }
            else  if( chart.type==="radar")
            {
                if( schema.slice["assist_dimensions"]!==undefined )
                {
                    option["isGroup"] = true; 

                    let sCode = schema.slice["assist_dimensions"][0].substring(0, 4);

                    xname = this.state.dimensionIndex[sCode].title;

                    option["xField"] = {name: this.state.dimensionIndex[sCode].title}; 

                    Object.keys(chartData.data[0]).forEach(function(k) 
                    {
                        var reg=/^[\u4E00-\u9FA5]+$/;

                        if (!reg.test(k))
                        {
                            return false ;
                        }
                        else
                        {
                             if( xname!==k )
                             {
                                var yField = {};
                                yField["name"] = k;
                                yFieldData.push(yField);
                             }
                        }
                    });

                    option["yField"] =yFieldData;

                }

            }
            else
            {
                if( schema.slice["assist_dimensions"]!==undefined )
                {
                    option["isGroup"] = true; 

                    let sCode = schema.slice["assist_dimensions"][0].substring(0, 4);
                    let xCode = schema.slice["main_dimension"].substring(0, 4);

                    option["seriesField"] = {name: this.state.dimensionIndex[sCode].title}; 
                    option["xField"] = {name: this.state.dimensionIndex[xCode].title}; 

                }
                else if( schema.slice["main_dimension"]!==undefined )
                {
                    let xCode = schema.slice["main_dimension"].substring(0, 4);
                    option["xField"] = {name: this.state.dimensionIndex[xCode].title}; 
                }

                if( chart.type==="bar" || chart.type==="barStack" )
                {
                    let xAxis = [];
                    if( schema.slice["main_measure"]!==undefined )
                    {

                        let measure = this.state.measureIndex[schema.slice["main_measure"]];
                        
                        if( measure.unit!==undefined && measure.unit!=="")
                        {
                            let xItem = {
                                title:{
                                    text: measure.title + "("+ measure.unit +")"
                                }
                            }

                            xAxis.push(xItem);
                        }
                        else
                        {
                            let xItem = {
                                title:{
                                    text: measure.title
                                }
                            }

                            xAxis.push(xItem);
                        }

                        option["xAxis"] = xAxis;
                    }
                }
                else
                {
                    let yAxis = [];
                    if( schema.slice["main_measure"]!==undefined )
                    {

                        let measure = this.state.measureIndex[schema.slice["main_measure"]];
                        
                        let yItem = {
                            title:{
                                text: measure.title + "("+ measure.unit +")"
                            }
                        }

                        yAxis.push(yItem);
                    }

                    if( chart.type==="dualAxes" )
                    {
                        if(schema.slice["assist_measures"]!==undefined && schema.slice["assist_measures"].length>0 )
                        {
                            let measure = this.state.measureIndex[schema.slice["assist_measures"][0]];
                            let yItem = {
                                title:{
                                    text: measure.title + "("+ measure.unit +")",
                                }
                            } 

                            yAxis.push(yItem);
                        }
                    
                    }

                    option["yAxis"] = yAxis;
                }
            }

            if( chart.type!=="dualAxes" )
            {
                if( chart.type==="bidirectionalBar" )
                {
                    option["tooltip"] ={
                        shared: true,
                        showMarkers: false,
                    }
                }
                if( chart.type==="radar" )
                {
                    option["tooltip"] ={
                        show: false
                    }
                }
                else
                {
                    option["tooltip"] = {
                        customContent: (title, chartData) => 
                        // formatter: ( chartData) => 
                        {
                            let { schema:{slice={}} } = this.state;
    
                            if( chartData.length>0)
                            // if( chartData )
                            {
                                var tooltip = "<div style='padding:5px'>";
                                if( slice.assist_dimensions===undefined || slice.assist_dimensions===null || slice.assist_dimensions.length===0 )
                                // if( !slice.assist_dimensions || !slice.assist_dimensions || !slice.assist_dimensions )
                                {
                                    // let data = chartData[0].data;
                                    let data = (chartData[0] && chartData[0].data) || chartData.data;
    
                                    if( slice.main_dimension!==undefined )
                                    {
                                        tooltip+=`<div style="padding:5px">`+data[slice.main_dimension]+`:</div>`;
                                    }
    
                                    if( slice.main_measure!==undefined )
                                    {
                                        let measure = this.state.measureIndex[slice.main_measure];

                                        let value = data[slice.main_measure];
    
                                        if( value===undefined || value===null )
                                        {
                                            value = "--";
                                        }
                                        else
                                        {
                                            let valueBit = Widget.getValueBit(measure.precision);
                                            value = Widget.numberFormatter(value, valueBit);
                                        }
    
                                        tooltip+=`<div style="padding:5px">` + measure.title + `:` + value + measure.unit +`</div>`;
                                    }
    
                                    if( slice.assist_measures!==undefined && slice.assist_measures.length>0 )
                                    {
                                        for( let measureCode of slice.assist_measures )
                                        {
                                            let measure = this.state.measureIndex[measureCode];
    
                                            let value = data[measureCode];
    
                                            if( value===undefined || value===null )
                                            {
                                                value = "--";
                                            }
                                            else
                                            {
                                                let valueBit = Widget.getValueBit(measure.precision);

                                                value = Widget.numberFormatter(value, valueBit);
                                            }
    
                                            tooltip+=`<div style="padding:5px">` + measure.title + `:` + value + measure.unit +`</div>`;
                                        }
                                    }
                                }
                                else
                                {
                                    let xDimensionStr = "";
    
                                    let tooltipContent = "";
    
                                    for( let cdata of chartData )
                                    {
                                        let data = cdata.data;
    
                                        if( slice.main_dimension!==undefined )
                                        {
                                            xDimensionStr = `<div style="padding:5px">`+data[slice.main_dimension]+`:</div>` ;
                                        }
    
                                        if( slice.assist_dimensions!==undefined && slice.assist_dimensions.length>0 )
                                        {
                                            for( let dimensionCode of slice.assist_dimensions )
                                            {
                                                let dimension = this.state.dimensionIndex[dimensionCode.substring(0, 4)];
        
                                                tooltipContent+=`<div style="padding:5px">` + dimension.title + `:` + data[dimensionCode] +`</div>`;
                                            }  
                                        }
    
                                        if( slice.main_measure!==undefined )
                                        {
                                            let measure = this.state.measureIndex[slice.main_measure];
    
                                            let value = data[slice.main_measure];
    
                                            if( value===undefined || value===null )
                                            {
                                                value = "--";
                                            }
                                            else
                                            {
                                                let valueBit = Widget.getValueBit(measure.precision);

                                                value = Widget.numberFormatter(value, valueBit);
                                            }
    
                                            tooltipContent+=`<div style="padding:5px">` + measure.title + `:` + value + measure.unit +`</div>`;
                                        }
    
                                        if( slice.assist_measures!==undefined && slice.assist_measures.length>0 )
                                        {
                                            for( let measureCode of slice.assist_measures )
                                            {
                                                let measure = this.state.measureIndex[measureCode];
    
                                                let value = data[measureCode];
    
                                                if( value===undefined || value===null )
                                                {
                                                    value = "--";
                                                }
                                                else
                                                {
                                                    let valueBit = Widget.getValueBit(measure.precision);
    
                                                    value = Widget.numberFormatter(value, valueBit);
                                                }
    
                                                tooltipContent+=`<div style="padding:5px">` + measure.title + `:` + value + measure.unit +`</div>`;
                                            }
                                        }
                                    }
                                    tooltip += xDimensionStr;
                                    tooltip += tooltipContent;
                                }
    
                                tooltip+="</div>";
                            }
                            return tooltip;
                        }
        
                    }
                } 
            }
            else
            {
                option["tooltip"] = {
                    customContent: (title, chartData) => 
                    // formatter: ( chartData) => 
                    {
                        // let { schema } = this.state;
                        // let { slice } = schema;
                        let { schema:{slice={}} } = this.state;

                        if(chartData.length>0)
                        // if(chartData)
                        {                          
                            var tooltip = "<div style='padding:5px'>";
                            
                            // let data = chartData[0].data;
                            let data = (chartData[0] && chartData[0].data) || chartData.data;

                            if( slice.main_dimension!==undefined )
                            {
                                tooltip+=`<div style="padding:5px">`+data[slice.main_dimension]+`:</div>`;
                            }

                            if( slice.main_measure!==undefined )
                            {
                                let measure = this.state.measureIndex[slice.main_measure];

                                let value = data[slice.main_measure];

                                if( value===undefined || value===null )
                                {
                                    value = "--";
                                }

                                tooltip+=`<div style="padding:5px">` + measure.title + `:` + value + measure.unit +`</div>`;
                            }

                            if( slice.assist_measures!==undefined && slice.assist_measures.length>0 )
                            {
                                for( let measureCode of slice.assist_measures )
                                {
                                    let measure = this.state.measureIndex[measureCode];

                                    let value = data[measureCode];

                                    if( value===undefined || value===null )
                                    {
                                        value = "--";
                                    }

                                    tooltip+=`<div style="padding:5px">` + measure.title + `:` + value + measure.unit +`</div>`;
                                }
                            }

                            tooltip+="</div>";
                        }

                        return tooltip;
                    }
                }
            }

            let measure = this.state.measureIndex[schema.slice["main_measure"]];

            switch( chart.type )
            { 
                case "barStack":
                case "columnStack":
                {
                    option["isStack"] = true; 
                    option["isGroup"] = undefined; 
                    option["yField"] = { name: measure.title}; 
                    break;
                }
                case "bidirectionalBarMeasure":
                case "dualAxes":
                {
                    let assistMeasure = this.state.measureIndex[schema.slice["assist_measures"][0]];

                    option["yField"] = [{name:measure.title},{name:assistMeasure.title}];
                    break;
                }
                case "bidirectionalBar":
                case "radar":
                {
                    break;
                }
                case "area":
                case "column":
                {                  
                    option["yField"] = { name: measure.title}; 
                    break;  
                }
                default:
                {
                    break;
                }  
            }
        }
        
        option = {...option, ...chart.properties};

        return option;
    }

    buildMapOption()
    {
        let option = {};

        option["tooltipFormatter"] = this.tooltipFormatter;

        return option;
    }


    buildTimeScatterOption()
    {
        let option = {};

        option["tooltipFormatter"] = this.timeScatterTooltipFormatter;

        return option;
    }

    buildMapFlowOption()
    {
        let option = {};

        option["tooltipFormatter"] = this.mapFlowTooltipFormatter;

        return option;
    }

    /**
     * 地图流向图的tooltip
     * @param {*} params 
     * @returns 
     */
    mapFlowTooltipFormatter( params )
    {
        let ret = "";

        const { schema } = this.state;

        let { slice } = schema;

        if( params.data!==undefined )
        {
            ret = params.data.name + " -> " + params.data.sname + ":<br/>";

            if( slice.main_measure!==undefined )
            {
                let measure = this.state.measureIndex[slice.main_measure];

                ret += measure.title + ":" + params.data[measure.code] + measure.unit + "<br/>";
            }

            if( slice.assist_measures!==undefined && slice.assist_measures.length>0 ) 
            {
                for( let i in slice.assist_measures)
                {
                    let measure = this.state.measureIndex[slice.assist_measures[i]];

                    ret += measure.title + ":" + params.data[measure.code] + measure.unit + "<br/>";
                }
            }
        }
        return ret;
    }

    buildTooltipField( chart )
    {
        let fields = [];

        const { schema } = this.state;

        let { slice } = schema;

        switch( chart.type )
        {
            case "pie" :
            {
                if( slice.main_dimension!==undefined )
                {
                    let dimension = this.state.dimensionIndex[slice.main_dimension.substring(0, 4)];
        
                    fields.push(dimension.title);
                }

                break;
            }
            default:
                break;
        }

        if( slice.main_measure!==undefined )
        {
            let measure = this.state.measureIndex[slice.main_measure];

            fields.push(measure.title);

        }

        if( slice.assist_measures!==undefined && slice.assist_measures.length>0 ) 
        {
            for( let i in slice.assist_measures)
            {
                let measure = this.state.measureIndex[slice.assist_measures[i]];

                fields.push(measure.title);
            }
        }

        return fields;
    }


    /**
     * 轮播散点图tooltip回调函数
     * @param {*} params 
     * @returns 
     */
    timeScatterTooltipFormatter(params)
    {
        let ret = "", dimensionRet = "";

        const { schema } = this.state;

        const { slice } = schema;

        let index = 0;

        if( params.data!==undefined )
        {
            if( slice.main_measure!==undefined )
            {
                index = 0;

                let measure = this.state.measureIndex[slice.main_measure];

                ret += measure.title + ":" + params.data[index] + measure.unit + "<br/>";  
            }

            if( slice.assist_measures!==undefined && slice.assist_measures.length>0 ) 
            {
                for( let i in slice.assist_measures)
                {
                    index ++;

                    let measure = this.state.measureIndex[slice.assist_measures[i]];

                    ret += measure.title + ":" + params.data[index] + measure.unit + "<br/>";
                }
            }



            if( slice.main_dimension!==undefined )
            {
                index ++;

                //let dimension = this.state.dimensionIndex[slice.main_dimension];

                dimensionRet += params.data[index] + ":<br/>";
            }

            if( slice.assist_dimensions!==undefined && slice.assist_dimensions.length>0 )
            {
                for( let i in slice.assist_dimensions)
                {
                    index ++;

                   // let dimension = this.state.dimensionIndex[slice.main_dimension];

                   dimensionRet += params.data[index] + ":<br/>";
                }
            }

            ret =  dimensionRet + ret;
           
        }

        return ret
    }

    /**
     * echarts 画图的tooltip回调函数
     * @param {*} params 
     * @returns 
     */
    tooltipFormatter(params)
    {
        let ret = "";

        const { schema } = this.state;

        let { slice } = schema;

        ret = params.name + ":<br/>";

        if( params.data!==undefined )
        {

            if( slice.main_measure!==undefined )
            {
                let measure = this.state.measureIndex[slice.main_measure];

                let valueBit = Widget.getValueBit(measure.precision);
                let value = Widget.numberFormatter(params.data[measure.code], valueBit);

                ret += measure.title + ":" + value + measure.unit + "<br/>";
            }

            if( slice.assist_measures!==undefined && slice.assist_measures.length>0 ) 
            {
                for( let i in slice.assist_measures)
                {
                    let measure = this.state.measureIndex[slice.assist_measures[i]];

                    let valueBit = Widget.getValueBit(measure.precision);
                    let value = Widget.numberFormatter(params.data[measure.code], valueBit);


                    ret += measure.title + ":" + value + measure.unit + "<br/>";
                }
            }
        }
        return ret;
    }

    buildTooltipField( chart )
    {
        let fields = [];

        const { schema } = this.state;

        let { slice } = schema;

        switch( chart.type )
        {
            case "pie" :
            {
                if( slice.main_dimension!==undefined )
                {
                    let dimension = this.state.dimensionIndex[slice.main_dimension.substring(0, 4)];
        
                    fields.push(dimension.title);
                }

                break;
            }
            default:
                break;
        }

        if( slice.main_measure!==undefined )
        {
            let measure = this.state.measureIndex[slice.main_measure];

            fields.push(measure.title);

        }

        if( slice.assist_measures!==undefined && slice.assist_measures.length>0 ) 
        {
            for( let i in slice.assist_measures)
            {
                let measure = this.state.measureIndex[slice.assist_measures[i]];

                fields.push(measure.title);
            }
        }

        return fields;
    }

    /**
     * G2plot画图的tooltip回调函数
     * @param {*} params 
     */
    tooltipFormatterG2Plot(params )
    {
        let ret = {};

        const { schema } = this.state;

        let { slice } = schema;

        if( params!==undefined )
        {   
            ret["name"] = params.name;

            if( slice.main_measure!==undefined )
            {
                let measure = this.state.measureIndex[slice.main_measure];

                ret[measure.title] =  params[measure.code] + measure.unit;
            }

            if( slice.assist_measures!==undefined && slice.assist_measures.length>0 ) 
            {
                for( let i in slice.assist_measures)
                {
                    let measure = this.state.measureIndex[slice.assist_measures[i]];

                    ret[measure.title] =  params[measure.code] + measure.unit;
                }
            }
        }

        ret["value"] = params.value;

        return ret;
    }

    /**
     * 创建维度值索引
     * @param {*} data 
     * @returns 
     */
    buildDimensionValueIndex( data )
    {
        let dimensionValueIndex = {};

        if( data.columns!==undefined && data.columns.dimensions!==undefined )
        { 
            var dimensions =  data.columns.dimensions;

            for( var i in dimensions )
            {
                if( dimensionValueIndex[dimensions[i].code]===undefined || dimensionValueIndex[dimensions[i].code]===null )
                {
                    dimensionValueIndex[dimensions[i].code] = {};
                }
                 
                for(var j in dimensions[i].values)
                {
                    dimensionValueIndex[dimensions[i].code][dimensions[i].values[j].value] = dimensions[i].values[j].name;
                }
            }
        }

        return dimensionValueIndex;  
    }

    buildDimensionIndex( schema )
    {
        this.state["dimensionIndex"]= {};

        if( schema!==undefined && schema.cube!==undefined && schema.cube.dimensions!==undefined &&  schema.cube.dimensions.length>0 )
        {
            for(var i in schema.cube.dimensions)
            {
                this.state["dimensionIndex"][schema.cube.dimensions[i].code.substring(0, 4)] = schema.cube.dimensions[i];
            }
        }
    }

    buildMeasureIndex( schema )
    {
        this.state["measureIndex"]= {};

        if( schema!==undefined && schema.cube!==undefined && schema.cube.measures!==undefined &&  schema.cube.measures.length>0 )
        {
            for(var i in schema.cube.measures)
            {
                this.state["measureIndex"][schema.cube.measures[i].code] = schema.cube.measures[i];
            }
        }
    }

    /**
     * 事件
     * @param {*} event 
     * @param {*} params 
    */
    onEvent(event, params)
    {
        const { chart } = this.state;
 
        if( event && this.props.onEvent!==undefined )
        {
            this.props.onEvent(event, params);
        }         
    }

    /**
     * 创建导出列
     * @param {*} schema 
     * @param {*} data 
     * @returns 
     */
    buildExportColumns(schema, data )
    {
        let columns = [];

        if( data===undefined )
        {
            return columns;
        }

        this.state['data'] = data;     

        this.buildDimensionIndex(schema);
        
        this.buildMeasureIndex(schema);

        for( var i in data.columns.dimensions )
        {
            let column = {};
            column["name"] = data.columns.dimensions[i].code;

            let dimension = null;
            if( this.state["dimensionIndex"][data.columns.dimensions[i].code.substring(0, 4)]!==undefined )
            {
                dimension = Widget.findDimension(this.state["dimensionIndex"][data.columns.dimensions[i].code.substring(0, 4)], data.columns.dimensions[i].code)
            }
            
            column["title"] = dimension.title;
            column["type"] ='string';

            columns.push(column);
        }

        for( var n in data.columns.measures )
        {
            let column = {};

            let measure = this.state["measureIndex"][data.columns.measures[n].code];

            column["name"] = measure.code;
            column["title"] = measure.title + "(" + measure.unit + ")";
            column["type"] = measure.type;

            columns.push(column);
        }

        this.state["exportColumns"] = [...columns];
    }

    /**
     * 创建导出数据
     * @param {*} data 
     * @param {*} chart 
     * @returns 
     */
    buildExportData(data, chart)
    {
        let exportData = [];

        if( data===undefined )
        {
            return undefined;
        }

        if( data.results.length===0 )
        {
            return [];
        }

        // 排序
        if( chart.properties!==undefined && chart.properties.sort!==undefined && chart.properties.sort.sortable===true )
        {
            let sortColumn = chart.properties.sort.column;
            let sortType = chart.properties.sort.type;

            data = this.sortData(data, sortColumn, sortType);
        }
       
        let dimensionValueIndex = this.buildDimensionValueIndex( data );

    	let index = data.columns.dimensions.length;

        for( let i in data.results )
        {
            let exportItemData = [];

            for( let j in data.results[i])
            {
                if( j<index )
                {
                    if( data.results[i][j]!==undefined && data.results[i][j]!=="")
                    {
                        exportItemData.push(dimensionValueIndex[data.columns.dimensions[j].code][data.results[i][j]]);
                    }
                    else
                    {                        
                        exportItemData.push(data.results[i][j]);
                    } 
                }
                else
                {
                    let measure = this.state.measureIndex[data.columns.measures[parseInt(j)-parseInt(index)].code];

                    let valueBit = this.getValueBit(measure.precision);

                    let valueTemp = Widget.numberFormatter(data.results[i][j], valueBit);

                    exportItemData.push(valueTemp);
                }
                
            }

            exportData.push(exportItemData);
        }

        this.state["exportData"] = exportData;
    }

    /**
	 * 获取小数位数
	 */
    getValueBit( precision )
    {
        var valueBit = 0;
        if( precision<1 )
        {
            let s = precision.toString();
            valueBit = s.substr(s.indexOf(".")+1).length;
        }
        return valueBit;
    }
   
     /**
     * 获取导出数据列
     * @returns 
     */
    getExportColumns()
    {
        const { exportColumns } = this.state;

        return exportColumns;
    }

    /**
     * 获取导出数据
     * @returns 
     */
    getExportData()
    {
        const { exportData } = this.state;

        return exportData;
    }

    render()
    {
        const { chart, data, schema, loading}  = this.props;

        let option;

        this.state["schema"] = schema;

        let chartData = this.buildData(chart, data, schema);

        this.buildExportColumns(schema, data);

        this.buildExportData(data, chart);

        if( chartData===undefined || loading===true)
        {
            return (
                <div className="widget-echart" style={{position:'relative'}}>
                    {/* <img className="load" src={require('./../img/profiles/load.gif')} alt="es-lint want to get" />  */}
                </div>
            );
        }
        else if( Object.values(chartData).length>0 && chartData.data!==undefined && ((chartData.data.length!==undefined && chartData.data.length>0 ) || Object.values(chartData.data).length>0) )
        {
            switch( chart.type )
            {
                case "map":
                case "mapScatter": 
                {
                    option = this.buildMapOption(chart, schema);
                    break;
                }
                case "timeScatter":
                {
                    option = this.buildTimeScatterOption(chart, schema);
                    break;
                }
                case "mapFlow" :
                {
                    option = this.buildMapFlowOption(chart, schema);
                    break;
                }
                default:
                {
                    option = this.buildOption(chart, schema, chartData);
                    break;
                }     
            }

            switch( chart.type )
            {
                case "map" :
                {
                    return (
                        <div className="widget-echart">
                            <WidgetEchartMap data={chartData} onEvent={this.onEvent} option={option}></WidgetEchartMap>
                        </div>
                    )
                }
                case "line" :
                {
                    return (
                        <div className="widget-echart">
                            <WidgetEchartLine data={chartData} option={option} onEvent={this.onEvent} ></WidgetEchartLine>
                            {/* <WidgetEcharArea data={chartData} option={option} onEvent={this.onEvent} type='line'></WidgetEcharArea> */}
                        </div>
                    )
                }
                case "bar" :
                case "barStack" :
                {
                    return (
                        <div className="widget-echart">
                            {/* <WidgetEchartBar data={chartData} option={option} onEvent={this.onEvent} ></WidgetEchartBar> */}
                        </div>
                    )
                }
                case "dualAxes":
                {
                    return (
                        <div className="widget-echart">
                            <WidgetEcharDualAxes data={chartData} option={option} onEvent={this.onEvent}></WidgetEcharDualAxes>
                        </div>
                    )
                }
                case "sunburst":
                {
                    return (
                        <div className="widget-echart">
                            {/* <WidgetEcharSunburst data={chartData} option={option} onEvent={this.onEvent}></WidgetEcharSunburst> */}
                        </div>
                    )
                    
                }
                case "scatter":
                {
                    return (
                        <div className="widget-echart">
                            {/* <WidgetEcharScatter data={chartData} option={option} onEvent={this.onEvent}></WidgetEcharScatter> */}
                        </div>
                    )
                }    
                case "pie":
                {
                    return (
                        <div className="widget-echart">
                            <WidgetEchartPie data={chartData} option={option} onEvent={this.onEvent}></WidgetEchartPie>
                        </div>
                    )
                }    
                case "column" :
                {
                    return (
                        <div className="widget-echart">
                            <WidgetEchartColumn data={chartData} option={option} onEvent={this.onEvent} ></WidgetEchartColumn>
                        </div>
                    )
                }
                case "area" :
                {
                    return (
                        <div className="widget-echart">
                            {/* <WidgetEcharArea data={chartData} option={option} onEvent={this.onEvent} ></WidgetEcharArea> */}
                        </div>
                    )
                }
                case "mapScatter" :
                {
                    return (
                        <div className="widget-echart">
                            <WidgetEchartMapScatter data={chartData} option={option} onEvent={this.onEvent} ></WidgetEchartMapScatter>
                        </div>
                    )
                }
                case "timeScatter" :
                {
                    return (
                        <div className="widget-echart">
                            <WidgetEchartTimeScatter data={chartData} option={option} onEvent={this.onEvent} ></WidgetEchartTimeScatter>
                        </div>
                    )
                }  
                case "bidirectionalBarMeasure" :
                case "bidirectionalBar" :
                {
                    return (
                        <div className="widget-echart">
                            {/* <WidgetEchartBidirectionalBar data={chartData} option={option} onEvent={this.onEvent} ></WidgetEchartBidirectionalBar> */}
                        </div>
                    )
                }
                case "radar" :
                {
                    return (
                    <div className="widget-echart">
                        {/* <WidgetEcharRadar data={chartData} option={option} onEvent={this.onEvent} ></WidgetEcharRadar> */}
                    </div>
                    )
                }
                case "mapFlow" :
                {
                    return (
                        <div className="widget-echart">
                            <WidgetEchartMapFlow data={chartData} option={option} onEvent={this.onEvent} ></WidgetEchartMapFlow>
                        </div>
                    )
                } 
                case "chord" :
                {
                    return (
                        <div className="widget-echart">
                            {/* <WidgetEchartChord data={chartData} option={option} onEvent={this.onEvent} ></WidgetEchartChord> */}
                        </div>
                    )   
                }
                
                
            } 
        }
        else
        {
            return (
                <div className="widget-echart">
                    <div className="no-data">暂无数据！</div>
                </div>
            )
        }

        
    }
}

export default WidgetChartEchart