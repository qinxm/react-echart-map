

/** 双柱图 */
import React from 'react';

import ReactEcharts from 'echarts-for-react';
import WidgetEchartConfig from './WidgetEchartConfig';


class EchartsBars extends React.Component
{
    constructor( props )
    {
        super(props);

        this.state = {
            data : props.data,
            option : props.option,
            width : '100%',
            height : this.props.height?props.height:0,
            rotate: props.rotate || 0,
            gridBtm: props.gridBtm || 0,
            onEvents: {
                'click': this.onClick.bind(this)
            },
            dataZoom:props.dataZoom
        } 

        this.buildOption = this.buildOption.bind(this);

        this.updateRect = this.updateRect.bind(this);

        // 获取组件自身
        this.myRef = React.createRef();
    }

    /**
     * 创建echart option
     * @param {*} options 
     * @returns 
     */
    buildOption( data, options={} )
    {
        let {gridBtm,dataZoom} = this.state
        let barConfig = WidgetEchartConfig.theme["default"].barConfig;

        if( options!==undefined && options.theme!==undefined )
        {
            barConfig = WidgetEchartConfig.theme[options.theme].barConfig;
        }

        let chartOption = {
                color: ['#0096FF', '#FFD024', '#C85273', '#7196F7', '#F4BB00', '#70B263', '#3659AD', '#70B263', '#C05DF2', '#62C7C9', '#9077F7'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: '',
                    },
               
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
            
                },
                grid:{
                    top:'50',
                    bottom:gridBtm?gridBtm:20
                },
                legend: {
                    ...options.legend,
                    show: true,
                    // right:0,
                    icon: "rect",
                    // left: 'auto',
                    // bottom: 10,
                },
                xAxis: {
                    type: options.xType || 'category',
                    axisLabel: {
                        show:options.axisLabel?false:true,
                        color: "#B3BBBF",
                        // interval: 0
                    },
                    axisLine: {
                        show: false,
                        color:'#cccccc',
                        type: options.axisLine ?? 'dashed'
                        },
                    splitLine: {
                        show: options.splitLine?false:true,
                        lineStyle:{
                            color:'#cccccc',
                            type: options.axisLine ?? 'dashed'
                        }
                        
                    },
                    data:data.xAxis,  
                    axisTick: {show:false }
                } ,
                yAxis: [
                    {
                        data:data.yAxis,
                        name:data.title,
                        type: options.yType || 'value',
                        splitLine: {
                            show:  options.YsplitLine?false:true,
                            // interval: 1,
                            lineStyle: {
                                type: options.axisLine ?? 'dashed',
                                color: "#1D4E66"
                            }
                        },
                        axisLabel: {
                            color: "#333333"
                        },
                        axisLine: {
                            show: options.lineShow?false:true,
                            color:'#cccccc',
                            type:  options.axisLine ?? 'dashed'
                        },
                        axisTick: {show:false },
                        position:'left'
                    },
                   
                ],
                series: [ ]
            
        }

        if(dataZoom)
        {
            dataZoom = [{
             type: 'slider', // 固定
             borderColor: '#019FFA', // 边框
             show: true,
             bottom: '0px',
             backgroundColor: 'transparent', // 滑轨颜色
             height: 10,
             zoomLock:true, // 锁定滚动条
             fillerColor: 'rgba(1,37,52)',//滚动条颜色
             maxValueSpan:5, // 最大显示值
             showDataShadow: false
            },]
        }
        chartOption['series'] = data.data.map(item=>{
            return {
                showBackground: options.showBackground,
                stack: options.stack,
                barWidth: 20,
                name: item.name,
                type: item.type || 'bar',
                smooth: true,
                barGap: data.barGap || 0,
                data:item.x1,
                itemStyle:item.itemStyle
                // emphasis: options.itemStyle
            }
        })
        if(options.format)
        {
            chartOption['tooltip']['formatter']= function (params) {
                let tar;
                if (params[1].value !== '-') {
                    tar = params[1];
                } else {    
                    tar = params[0];
                }
                return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
            }
        }
        
        if(options.Yright)
        {
            chartOption['yAxis'].push(
                {
                    data:options.YrightData,
                    name:data.title,
                    type: options.yType || 'value',
                    splitLine: {
                        show:  options.YsplitLine?false:true,
                        // interval: 1,
                        lineStyle: {
                            type: options.axisLine ?? 'dashed',
                            color: "#1D4E66"
                        }
                    },
                    axisLabel: {
                        color: "#333333"
                    },
                    axisLine: {
                        show:  options.lineShow?false:true,
                        color:'#cccccc',
                        type:  options.axisLine ?? 'dashed'
                    },
                    axisTick: {show:false },
                    position:'right'
                }
            )
        }

        chartOption = { ...barConfig,...chartOption,dataZoom};
        return chartOption;
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
        if( this.myRef!==undefined && this.myRef.current!==null && this.myRef.current!==undefined)
        {
            const width = this.myRef.current.ele;
                if (this.state.width !== width)
                {
                   this.setState({width:width,});
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
        let { height, chartOption, onEvents,width} = this.state;

        let { data, option} = this.props;

        if( data!==undefined )
        {
            chartOption = this.buildOption(data, option);
        }
       
        if( chartOption!==undefined && chartOption!==null )
        {
            return <ReactEcharts ref={this.myRef} option={ chartOption } lazyUpdate={true} style={{ height:height,width }} onEvents={onEvents}></ReactEcharts>
        }
        else
        {
            return null
            // return <div className="widget-echart" style={{position:'relative'}}><img className="load" src={require('./../../img/frame/loading.gif')} /> </div>;
        }
       
    }
}

export default EchartsBars;

