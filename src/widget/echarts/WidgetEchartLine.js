import React from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';  
import WidgetEchartConfig from './WidgetEchartConfig';
import { options } from 'less';

class WidgetEchartLine extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            height : 0,
            width:'100%',
            gridBtm: props.gridBtm || 0
        }
        this.myRef = React.createRef();
    }

    buildConfig = (option={}, data={}) => {
        const {gridBtm} = this.state;
        let config = {
            color: ['#8DBAED', '#A6DD8E', '#F4B26E'],
            xAxis: {
                type: 'category',

                data: data.xAxis
            },
            yAxis: {
                type: 'value',
                name:option.Yname,
                nameGap:45,
                bottom: 0,
                nameTextStyle: {
                    fontWeight: "bold",
                    align:option.align,
                  }
            },
            series: [
             
            ],
            grid:{
                bottom:gridBtm ? gridBtm : 60
            },
            legend:{
                show:true,
                bottom:'10px',
                icon: "circle"
            },
            tooltip:{
                show:true,
                trigger: "axis"
            }
        };

        config['series']=data.data.map((item,index)=>
        {
            return {
                type: 'line',
                name: data.name && data.name[index] || [],
                smooth: true,
                label: {
                    show: false,
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: 'rgba(54,116,250,0.54)'
                      },
                      {
                        offset: 1,
                        color: 'rgba(54,116,250,0.00)'
                      }
                    ])
                },
                data: data.data[index]
            }
        
        })


        if( option.theme!==undefined ){
            config = {...WidgetEchartConfig.theme[option.theme].lineConfig, ...option, ...config};
        } 
        if(config.legend) config.legend = {...config.legend, ...option.legend,}
        if(config.title) config.title = {...WidgetEchartConfig.theme['default'].lineConfig.title, text: option.title || '', subtext: option.subtext || '',}

        return config;
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
    render(){
        const { option, data ,height} = this.props; 

        const {width } = this.state;
        
        let config = this.buildConfig(option, data);
    
        return <ReactEcharts ref={this.myRef} option={ config } lazyUpdate={true} style={{ height: height,width }}></ReactEcharts>;
    }
}

export default WidgetEchartLine;