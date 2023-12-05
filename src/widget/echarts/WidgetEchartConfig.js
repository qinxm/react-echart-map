import React from 'react';

class WidgetEchartConfig extends React.Component 
{
    static theme = {
        'default':{
            pieConfig : {
                padding : 'auto',
                appendPadding: 10,                
                title: {
                    textStyle: {
                        fontSize: 16,
                        fontWeight: 500,
                        color: '#000',
                    }
                },
                color: ['#688FF7', '#ACD9FC', '#C85273', '#7196F7', '#F4BB00', '#70B263', '#3659AD', '#70B263', '#C05DF2', '#62C7C9', '#9077F7'],
                radius: 0.6,
                innerRadius: 0.5,
                legend: {
                    layout: 'horizontal',
                    position: 'bottom',
                    offsetY: -60,
                    itemName:{
                        style:{
                          fontSize:14,
                        }
                      },
                    pageNavigator: {
                        marker: {
                          style: {
                            // 非激活，不可点击态时的填充色设置
                            inactiveFill: '#000',
                            inactiveOpacity: 0.45,
                            // 默认填充色设置
                            fill: '#000',
                            opacity: 0.8,
                            size: 8,
                          },
                        },
                        text: {
                          style: {
                            fill: '#ccc',
                            fontSize: 8,
                          },
                        },
                      },
                    // textStyle: { fill: '#a3a9c1' }
                },
                label: undefined,
                interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
                statistic : undefined,
            },
            dualAxesConfig :{
                title: {
                    textStyle: {
                        fontSize: 16,
                        fontWeight: 500,
                        color: '#000'
                    }
                },
                legend: {
                    right: '10%',
                    top: '30',
                },
                grid: {
                    bottom: 20
                },
            },
            columnConfig: {
                title: {
                    textStyle: {
                        fontSize: 16,
                        fontWeight: 500,
                        color: '#000'
                    },
                    subtextStyle: {
                        fontSize: 12,
                        color: '#999',
                        lineHeight: '12px'
                    }
                },
            },
            lineConfig: {
                title: {
                    textStyle: {
                        fontSize: 16,
                        fontWeight: 500,
                        color: '#000'
                    },
                    subtextStyle: {
                        fontSize: 12,
                        color: '#999',
                    }
                },
            },

            scatterConfig:{
                appendPadding: 20,
                color: ['#c71e1d', '#ffca76', '#09bb9f'],
                size: [4, 30],
                yAxis: {
                    nice: true,
                    line: { style: { stroke: '#aaa' } },
                },
                xAxis: {
                grid: { line: { style: { stroke: '#eee' } } },
                line: { style: { stroke: '#aaa' } },
                },
                label: {},
                shape: 'circle',
                pointStyle: {
                    fillOpacity: 0.8,
                    stroke: '#bbb',
                },
            },
            mapScatterConfig:{
                geo: {
                    show: true,
                    roam: true,
                    label: {
                        emphasis: {
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: '#2776B4',
                            borderColor: '#fff',
                            shadowColor: '#1773c3',
                            shadowBlur: 20
                        }
                    }
                },
                series:[{
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    symbolSize: function (val) {
                        if( val[2] / 10 <= 5)
                        {
                            return 5;
                        }
                        return val[2] / 10;
                    },
                    tooltip:{
                        backgroundColor:'#fff',
                        padding: 10 ,
                        textStyle: {
                            color: '#8d8d8d' ,
                            fontSize: 12 ,
                        }
                    },
                    /*
                    label: {
                        show:true,
                        color:"#ED6F1A",
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    */
                    itemStyle: {
                        normal: {
                            color: '#ddb926'
                        }
                    },
                }]
            },
            timeScatterConfig: {
                baseOption: {
                    grid: {
                        bottom: 100,
                    },
                    timeline: {
                        axisType: 'category',
                        orient: 'horizontal',
                        autoPlay: true,
                        playInterval: 1000,
                        bottom: 20,
                        height: 55,
                        symbol: 'none',
                        checkpointStyle: {
                            borderWidth: 2
                        },
                        controlStyle: {
                            showNextBtn: false,
                            showPrevBtn: false
                        },
                        data: []
                    },
                    tooltip: {
                        padding: 5,
                        borderWidth: 1,
                    },
                    xAxis: {
                        type: 'value',
                        nameGap: 25,
                        nameLocation: 'middle',
                        nameTextStyle: {
                            fontSize: 18
                        },
                        splitLine: {
                            show: false
                        },
                        
                    },
                    yAxis: {
                        type: 'value',
                        scale:true,
                        nameTextStyle: {
                            fontSize: 18
                        },
                        splitLine: {
                            show: false
                        },
                    },
                    visualMap: [
                        {
                            show: false,
                            dimension: 3,
                            calculable: true,
                            precision: 0.1,
                            textGap: 30,
                            textStyle: {
                                color: '#ccc'
                            },
                            inRange: {
                                color: (function () {
                                    var colors = ['#51689b', '#ce5c5c', '#fbc357', '#8fbf8f', '#659d84', '#fb8e6a', '#c77288', '#786090', '#91c4c5', '#6890ba'];
                                    return colors.concat(colors);
                                })()
                            }
                        }
                    ],
                    series: [
                        {
                            type: 'scatter',
                            itemStyle: {
                                opacity: 0.8
                            },
                           
                        }
                    ],
                    animationDurationUpdate: 1000,
                    animationEasingUpdate: 'quinticInOut'
                },
                options: []
            },
            mapFlowConfig : {
                tooltip: {
                    triggerOn: "onmousemove",
                },
                geo: {
                    map: 'china',
                    roam: true,
                    zoom: 1.3,
                    //调整以下3个配置项与页面地图重合
                    // aspectScale: 1,			//echarts地图的长宽比（就是胖瘦）
                    // center: [104.29, 35.8], //设置可见中心坐标，以此坐标来放大和缩小
                    // zoom: 1.00, //放大级别
                    // roam:true,
                    label: {
                        show: false
                    },
                    itemStyle: {
                        normal: {
                            borderColor: '#BABABA',
                            borderWidth: 1,
                            areaColor: '#2675B3',
                        },
                        emphasis: {
                            areaColor: '#2675B3',
                            borderWidth: 0
                        }
                    },
                    emphasis: {
                        label: {
                            show: false,
                        }
                    }

                },
                series: [
                    {
                        type: 'lines',
                        zlevel: 2,
                        effect: {
                            show: true,
                            period: 3, //箭头指向速度，值越小速度越快
                            trailLength: 0.4, //特效尾迹长度[0,1]值越大，尾迹越长重
                            symbol: 'arrow', //箭头图标
                            symbolSize: 5, //图标大小
                        },
                        lineStyle: {
                            normal: {
                                color: {
                                    type: 'linear',
                                    x: 1,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0,
                                        color: 'rgba(255,67,67,0.1)' // 0% 处的颜色
                                    }, {
                                        offset: 1,
                                        color: 'rgba(255,67,67,1)' // 100% 处的颜色
                                    }],
                                    global: false // 缺省为 false
                                },
                                width: 1, //线条宽度
                                opacity: 0.1, //尾迹线条透明度
                                curveness: .3 //尾迹线条曲直度
                            },
                            emphasis: {
                                width: 3,
                                opacity: 0.5,
                            }
                        },
                        data: []
                    }
                ]
            }
        },
    }
}

export default WidgetEchartConfig