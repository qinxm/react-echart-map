import React from 'react';
import ReactEcharts from 'echarts-for-react'  

import * as echarts from 'echarts';

import WidgetAjax from './../WidgetAjax'
import WidgetEchartConfig from './WidgetEchartConfig'

class WidgetEchartMap extends React.Component 
{
    constructor( props )
    {
        super(props);

        this.state = {
            data : props.data,
            option : props.option,
            width : 0,
            height : 0,
            mapName:undefined,
            onEvents: {
                'click': this.onClick.bind(this)
            }
        } 

        this.updateRect = this.updateRect.bind(this);

        this.buildOption = this.buildOption.bind(this);

        this.loadMap = this.loadMap.bind(this);
        this.onLoadMap = this.onLoadMap.bind(this);

        // 获取组件自身
        this.myRef = React.createRef();
    }

    loadMap( data )
    {
        const { mapName } = this.state;

        if( mapName!==data.mapName)
        {
            WidgetAjax.ajaxFile({url:'/app/map/' + data.mapName + ".json", callback:this.onLoadMap});
        }
    }

    onLoadMap( data )
    {
        
        if( data!==null )
        {
            let mapData = data;

            let option = this.buildOption(this.props.data, this.props.option, mapData);

            this.setState({chartOption:option, mapName:this.props.data.mapName});
        }
    }

    buildOption( data, chartOption, map)
    { 
        echarts.registerMap(data.mapName,  map); 

        let option = {
            visualMap: {
                min: data.min!==undefined ? data.min : 0,
                max: data.max,
                left: 'left',
                top: 'bottom',
                calculable: true,
                inRange:{
                   color: ['#68B0E8','#4796D3', '#2776B4', '#125B95', '#03467B']
                },
                textStyle: {
                    color: '#000000'
                }
            },
            tooltip:{
                trigger: 'item',
                backgroundColor:'#fff',
                padding: 10 ,
                textStyle: {
                    color: '#8d8d8d' ,
                    fontSize: 12 ,
                },
                formatter: function (params) {
                    if( chartOption!==undefined && chartOption.tooltipFormatter!==undefined )
                    {
                        return chartOption.tooltipFormatter(params);
                    }
                    else
                    {
                        return params.name + ":" + params.value;
                    }    
                }
            },
            series:[{
                type: 'map',
                name: data.mapName,
                mapType:data.mapName,
                roam: true,
                zoom: 1.2,
                scaleLimit : {
                    max:5,
                    min:1
                },
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        borderColor: '#ffffff',
                        areaColor: '#d9d9d9',
                    },
                    emphasis: {
                        areaColor: '#389BB7',
                        borderWidth: 0
                    }
                },
                animation: false,

                data:data.data
            }]
        };

        if( option.theme!==undefined )
        {
            option = {...WidgetEchartConfig.theme[option.theme].mapConfig, ...this.state.option, ...option};
        }
        else
        {
            option = {...WidgetEchartConfig.theme["default"].mapConfig, ...this.state.option, ...option};
        }
       
        return option;
    }

    /**
    * 点击事件
    * @param {*} param 
    */
    onClick( param )
    {
        console.log(param);
    }

    updateRect()
    {
        if( this.myRef!==undefined && this.myRef.current!==null && this.myRef.current.ele!==undefined )
        {
            const height = this.myRef.current.ele.parentElement.clientHeight;
            const width = this.myRef.current.ele.parentElement.clientWidth;
            
            if (this.state.width !== width || this.state.height !== height)
            {
                this.setState({width:width, height:height});
            }
        }
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
        const { height, chartOption, onEvents} = this.state;

        let { data } = this.props;

        this.loadMap(data);

       // this.buildOption(data, option);
        if( chartOption!==undefined && chartOption!==null )
        {
            return <ReactEcharts ref={this.myRef} option={ chartOption } lazyUpdate={true} style={{ height: height }} onEvents={onEvents}></ReactEcharts>
        }
        else
        {
            // return <div className="widget-echart" style={{position:'relative'}}><img className="load" src={require('./../../img/profiles/load.gif')} /> </div>;
        }
       
    }
}

export default WidgetEchartMap