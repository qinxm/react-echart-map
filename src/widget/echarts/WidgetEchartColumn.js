import React from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import WidgetEchartConfig from './WidgetEchartConfig'

class WidgetEchartColumn extends React.Component 
{
    constructor(props)
    {
        super(props);
        this.state = {
            // height:200,
            height: props.height ? props.height : 0,
            width: props.width ? props.width : '100%',
           
        }
        // this.onEvent = this.onEvent.bind(this);
        this.buildConfig = this.buildConfig.bind(this);
        this.myRef = React.createRef();
    }

    /** event */
    // onEvent(chart, event) 
    // {
    //     if( this.props.onEvent!==undefined )
    //     {
    //         if( event.type==="element:mousedown" )
    //         {
    //             this.props.onEvent( event, event.data.data );
    //         } 
    //     } 
    // }

    /** create config */
    buildConfig(option, data)
    {  
        delete option.xField;
        delete option.yAxis;
        delete option.xAxis;
      
        let config = {
            xAxis: {
                type: 'category',
                data: data.data.map(item => { return item.name })
            },
            yAxis: {
                type: 'value'
            },
            grid: {
                top: '5%',
                bottom: '2%',
                containLabel: true
              },
            series: [
                {
                    type: 'bar',
                    barWidth: 12,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                          { offset: 0, color: '#6F9BFB' },
                          { offset: 1, color: '#3674FA' }
                        ])
                    },
                    data: data.data,
                }
            ],
        };


        if( option.theme!==undefined )
        {
            config = {...WidgetEchartConfig.theme[option.theme].columnConfig, ...option, ...config};
        }
        else
        {
            config = {...WidgetEchartConfig.theme["default"].columnConfig, ...option, ...config};
        }
        if(config.title) config.title = {...WidgetEchartConfig.theme['default'].pieConfig.title, text: option.title || '', subtext: option.subtext || ''}

        return config;
    }

    updateRect()
    {
        if( this.myRef!==undefined && this.myRef.current!==null && this.myRef.current.ele!==undefined )
        {
            const height = this.myRef.current.ele.parentElement.clientHeight;
            const width = this.myRef.current.ele;
            
            if (this.state.width !== width )
            {
                this.setState({width:width});
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
        const { option, data, } = this.props; 
        const {height, width} = this.state
        
        let config = this.buildConfig(option, data);

        return <ReactEcharts ref={this.myRef} option={config}  lazyUpdate={true} style={{width, height: height }}></ReactEcharts> 
    }
}


export default WidgetEchartColumn;