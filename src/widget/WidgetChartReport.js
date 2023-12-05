import React from 'react';

import WidgetComponent from './WidgetComponent';
import WidgetTable from './WidgetTable'
import Widget from './Widget'

import '../css/widget/widget.echart.css'

class WidgetChartRport extends WidgetComponent 
{
    constructor(props)
    {
        super(props);

        let options = this.buildOption( props.chart );

        this.state = {
            chart:props.chart,
            options:options,
            width: 0,
            height: 0,
            exportColumns:[],
            exportData:[]
        };

        this.sortData = this.sortData.bind(this);

        this.buildData = this.buildData.bind(this);
        this.expandData = this.expandData.bind(this);
        this.buildOption = this.buildOption.bind(this);
        this.buildColumns = this.buildColumns.bind(this); 
        
        this.buildMeasureIndex = this.buildMeasureIndex.bind(this); 
        this.buildDimensionIndex = this.buildDimensionIndex.bind(this); 
        this.updateRect = this.updateRect.bind(this);

        this.onEvent = this.onEvent.bind(this);

        this.getExportColumns = this.getExportColumns.bind(this);
        this.getExportData = this.getExportData.bind(this);

        // 获取组件自身
        this.myRef = React.createRef();
    }

     /**
     * 创建表格列
     * @param {*} schema 
     * @param {*} data 
     */
    buildColumns( schema, data)
    {
        const { options } = this.state;

        let columns = [];

        if( data===undefined )
        {
            return columns;
        }

        this.buildDimensionIndex(schema);
        this.buildMeasureIndex(schema);

        if( options.expand!==undefined && options.expand.enable===true )
        {
            data = this.expandData(data, schema, options.expand);      
        }

        this.state['data'] = data;     

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

            if( options.event!==undefined && ( options.event.isClick===true ||  options.event.isDrill===true) )
            {

                if( data.columns.dimensions[i].role==="main")
                {
                    column["properties"] ={"click":"onEvent"}; 
                }
            }

            columns.push(column);

            if( options.showCode || ( options.event!==undefined && ( options.event.isClick===true ||  options.event.isDrill===true) ) )
            {
                let column = {};
                column["name"] = data.columns.dimensions[i].code+"_CODE";
                column["title"] = this.state["dimensionIndex"][data.columns.dimensions[i].code.substring(0, 4)].title;
                column["type"] ='string';
                column["properties"] ={"hidden":true};

                columns.push(column);
            }
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

        return columns;
    }

    /**
     * 创建维度索引
     * @param {*} schema 
     */
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

    /**
     * 创建度量索引
     * @param {*} schema 
     */
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
     * 展开数据
     * @param {*} data 
     * @param {*} expand 
     * @returns 
     */
    expandData( data, expand )
    {
        let expandData = {columns:{}, rerults:[]};

        expandData.columns.dimensions = [];
		expandData.columns.measures = [];

        let index = data.columns.dimensions.length;

        if( expand.dimensionIndex!==undefined )
        {
            let dimension = data.columns.dimensions[expand.dimensionIndex];

            if( dimension===undefined )
            {
                return data;
            }

            for( var key in data.columns.dimensions )
            {
                if( key!==expand.dimensionIndex )
                {
                    expandData.columns.dimensions.push(data.columns.dimensions[key]);
                }
            }

            this.state["measuresIndex"] = {};

            for( var i in dimension.values )
            {
                for( var n in data.columns.measures )
                {
                    var measureCode = dimension.values[i].value + data.columns.measures[n].code;
                    expandData.columns.measures.push({code:measureCode});
                    let measure = {};

                    measure = {...measure, ...this.state["measurendex"][data.columns.measures[n].code] };
                    measure.code = measureCode;
					measure.title = dimension.values[i].name + measure.title;

                    this.state["measuresIndex"][measureCode] = measure;
                }    
            }

            let resultsMap = {}, dataMap = {};

            for( let i in data.results )
            {
                let result = [];
                var rowKey = "";

                for( let j=0; j<data.columns.dimensions.length; j++ )
                {
                    if( j!==expand.dimensionIndex )
                    {
                        result.push(data.results[i][j]);
                        rowKey += data.results[i][j];
                    }
                }

                if( resultsMap[rowKey]===undefined )
                {
                    resultsMap[rowKey] = result;
                }

                let dataTemp = resultsMap[rowKey];

                if( dataTemp===undefined )
                {
                    dataTemp = {};
                }

                for(let n=index; n<data.results[i].length; n++)
                {
                    let dataKey = data.results[i][expand.dimensionIndex] +  data.columns.measures[n-index].code
                
                    dataTemp[dataKey] = data.results[i][n];
                }

                dataMap[rowKey] = dataTemp;
            }

            let results = [];

            for( let key in resultsMap )
            {
                let result = resultsMap[key];

                for( let i in expand.columns.measures )
                {
                    result.push(dataMap[key][expand.columns.measures[i].code]);
                }

                results.push(result);
            }

            expandData[results].push(...results);  

        }

        return expandData
    }

    /**
     * 创建 table option
     * @param {*} chart 
     * @returns 
     */
    buildOption( chart  )
    {
        let options = {};

        options["isCheck"] = false;

        options["isSerial"] = false;

        options["event"] = chart.event;

        options = {...options, ...chart.properties}

        return options;
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

    /**
     * 创建表格数据
     * @param {*} data 
     */
    buildData( data )
    {
        const { options, chart } = this.state;
        let tableData = [], exportData = [];

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
            let itemData = {}, exportItemData = [];

            for( let j in data.results[i])
            {
                if( j<index )
                {
                    if( data.results[i][j]!==undefined && data.results[i][j]!=="")
                    {
                        itemData[data.columns.dimensions[j].code] = dimensionValueIndex[data.columns.dimensions[j].code][data.results[i][j]];

                        exportItemData.push(dimensionValueIndex[data.columns.dimensions[j].code][data.results[i][j]]);

                        if( options.showCode || ( options.event!==undefined && ( options.event.isClick===true ||  options.event.isDrill===true)) )
                        {
                            itemData[data.columns.dimensions[j].code+"_CODE"] = data.results[i][j];

                            exportItemData.push(data.results[i][j]);
                        }
                    }
                    else
                    {
                        itemData[data.columns.dimensions[j].code] = data.results[i][j];
                        
                        exportItemData.push(data.results[i][j]);

                        if( options.showCode || (options.event!==undefined && ( options.event.isClick===true ||  options.event.isDrill===true)) )
                        {
                            itemData[data.columns.dimensions[j].code+"_CODE"] = data.results[i][j];

                            exportItemData.push(data.results[i][j]);
                        }
                    } 
                }
                else
                {
                    let measure = this.state.measureIndex[data.columns.measures[parseInt(j)-parseInt(index)].code];

                    let valueBit = this.getValueBit(measure.precision);

                    let valueTemp = Widget.numberFormatter(data.results[i][j], valueBit);

                    itemData[data.columns.measures[parseInt(j)-parseInt(index)].code] = valueTemp;

                    exportItemData.push(valueTemp);
                }
                
            }

            tableData.push(itemData);
            exportData.push(exportItemData);
        }

        this.state["exportData"] = exportData;

        return tableData;
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
 
            for( let i in dimensions )
            {
                if( dimensionValueIndex[dimensions[i].code]===undefined || dimensionValueIndex[dimensions[i].code]===null )
                {
                    dimensionValueIndex[dimensions[i].code] = {};
                }
                  
                for(let j in dimensions[i].values)
                {
                    dimensionValueIndex[dimensions[i].code][dimensions[i].values[j].value] = dimensions[i].values[j].name;
                }
            }
        }
 
        return dimensionValueIndex;  
    }

    /**
     * 通知
     * @param {*} type 
     * @param {*} event 
     * @param {*} item 
     * @param {*} value 
     */
    onEvent(type, item, value, event)
    { 
        event["eventType"] = type;
        
        if( item!==undefined && item!=="" )
        {
            let params = JSON.parse(item);

            if( event && this.props.onEvent!==undefined )
            {
                this.props.onEvent(event, params, value);
            } 
        }
    }

    updateRect()
    {
        if( this.myRef!==undefined && this.myRef!==null &&  this.myRef.current!==undefined &&  this.myRef.current!==null )
        {
            const height = this.myRef.current.parentElement.clientHeight;
            const width = this.myRef.current.parentElement.clientWidth;
            
            if (this.state.width !== width || this.state.height !== height)
            {
                this.setState({width, height});
            }
        }
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

    componentDidMount()
    {
        this.updateRect();
    }

    componentDidUpdate()
    {
        this.updateRect();
    }

    render()
    {
        const { options, width, height} = this.state;
        
        if( this.props.data===undefined || this.props.loading===true )
        {
            return <div ref={this.myRef} className="widget-report" style={{position:'relative'}}>
                {/* <img className="load" src={require('./../img/profiles/load.gif')} alt="es-lint want to get"/>  */}
            </div>;
        }
        else
        {
            let columns = this.buildColumns( this.props.schema, this.props.data);

            let data = this.buildData( this.state.data );

            if( data.length>0 )
            {
                return ( 
                    <div ref={this.myRef} className="widget-report">
                        <WidgetTable options={options} columns={columns} data={data} notify={this.onEvent} height={height} width={width} />
                    </div>
                ) 
            }
            else
            {
                return (
                    <div ref={this.myRef} className="widget-report">
                        <div className="no-data">暂无数据！</div>
                    </div>
                )
            }
        }  
    }
}

export default WidgetChartRport