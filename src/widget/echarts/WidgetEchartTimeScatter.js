/**时间散点图 */
import React from 'react';
import ReactEcharts from 'echarts-for-react'  

import WidgetEchartConfig from './WidgetEchartConfig'

class WidgetEchartTimeScatter extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            data : props.data,
            option : props.option,
            width : 0,
            height : 0
        } 

        this.onEvent = this.onEvent.bind(this);
        this.symbolSize = this.symbolSize.bind(this);
        this.buildConfig = this.buildConfig.bind(this);
        
        this.updateRect = this.updateRect.bind(this);

         // 获取组件自身
         this.myRef = React.createRef();
    }

    /** event */
    onEvent(chart, event) 
    {
        if( this.props.onEvent!==undefined )
        {
            if( event.type==="element:mousedown" )
            {
                this.props.onEvent( event, event.data.data );
            } 
        } 
    }

    /** create config */
    buildConfig(option, data)
    {
        let config = {};
        if( option.theme!==undefined )
        {
            config = {...WidgetEchartConfig.theme[option.theme].timeScatterConfig, ...config};
        }
        else
        {
            config = {...WidgetEchartConfig.theme["default"].timeScatterConfig, ...config};
        }

        config.baseOption.visualMap[0].categories = [];
        config.baseOption.timeline.data = [];
        config.options = [];

        config.baseOption.visualMap[0].categories = data.legendData;
        config.baseOption.visualMap[0].dimension = 4;

        let symbolSize = this.symbolSize;  

        if( config.baseOption.tooltip!==undefined )
        {
            config.baseOption.tooltip["formatter"] = function( params )
            {
                if( option.tooltipFormatter!==undefined )
                {
                    return option.tooltipFormatter( params );
                }
                else
                {
                    return params.name + ":" + params.value;
                }
            }
            
        }

        for( let key in data.data)
        {
            config.baseOption.timeline.data.push(key);
            config.options.push({
                series: {
                    name: key,
                    type: 'scatter',
                    itemStyle: {
                        opacity: 0.8
                    },
                    data: data.data[key],
                    symbolSize: function(val) {
                       return symbolSize( val );
                    }
                }
            });
        }
        
        return config;
    }

    symbolSize( datas )
    {
        let size = 20;

        if( datas[2]>0 )
        {
            var y = Math.sqrt( datas[2] / 9e4 ) + 0.1;

            size = y * 80;
        }

        if( size<20 )
        {
            size = 20;
        }
        else if( size>90 )
        {
            size = 90;
        }
        
        return size;
    }

    updateRect()
    {
        if( this.myRef!==undefined && this.myRef.current!==undefined && this.myRef.current.ele!==undefined)
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
        const { option, data } = this.props; 

        const { height } = this.state;
        
        let config = this.buildConfig(option, data);

        return <ReactEcharts ref={this.myRef} option={ config } lazyUpdate={true} style={{ height: height }}></ReactEcharts>;
    }
}

export default WidgetEchartTimeScatter;
