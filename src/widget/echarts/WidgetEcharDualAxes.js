import React from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import WidgetEchartConfig from './WidgetEchartConfig';

class WidgetEcharDualAxes extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            height: 0
        }
        this.myRef = React.createRef();
    }

    buildConfig = (option, data) => {
        const types = option.types || ['bar','line']
        let yAxis = {}, min = 0, max = data.max;
        if( option.isScale===true )
        {
            if( data.min!==data.max )
            {
                if( data.min===0 )
                {
                    min = data.min;
                }
                else
                {
                    min = Math.trunc(data.min - (data.max - data.min) / 2);
                }
               
                max = Math.trunc(data.max + (data.max - data.min) / 2);
            }
        }

        let config = {
            color: option.color || ['#FFA902'],
            tooltip: {
                trigger: 'axis',
            },
            xAxis: [{
                type: 'category',
                data: data.data.map(item => { return item.name })
            }],
            yAxis: option.yAxis.map((item,index)=>{
                if(types[index] === 'line'){
                    return {
                        type: 'value',
                        show: true,
                        // name: item.title.text,
                        alignTicks: true,
                        position: types[index] === 'line'? 'right': ''
                    }
                }
                return {
                    type: 'value',
                    show: true,
                    // min,
                    // max,
                    // interval: 1000,
                    // name: item.title.text,
                    alignTicks: true,
                    position: types[index] === 'line'? 'right': ''
                }
            })
        };
        delete config.yField;
        delete config.xField;

        if( option.theme!==undefined )
        {
            config = {...WidgetEchartConfig.theme[option.theme].dualAxesConfig, ...option, ...config};
        }
        else
        {
            config = {...WidgetEchartConfig.theme['default'].dualAxesConfig, ...option, ...config};
        }

        if(config.legend) config.legend = {...config.legend, data: option.yField.map(item=>{return item.name}),}
        if(config.title) config.title = {...WidgetEchartConfig.theme['default'].dualAxesConfig.title, text: option.title || '',}
        const arr = types.map(item=>{
            return {
                type: item,
            }
        })
       
        const arr1 = option.yField.map(item=>{
            return {
                name:item.name,
                data: data.data.map(i=>{ return {...i,value:i[item.name]}})
            }
        })
        config.series = arr.map((item,index)=>{
            if(item.type === 'line') {
                return {...item,...arr1[index], yAxisIndex: 1}
            }else{
                return {
                    ...item,...arr1[index],
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                          { offset: 0, color: '#6F9BFB' },
                          { offset: 1, color: '#3674FA' }
                        ])
                    },
                }
            }
        })

        return config;
    }

    updateRect() {
        if( this.myRef!==undefined && this.myRef.current!==null  && this.myRef.current.ele!==undefined)
        {
            const height = this.myRef.current.ele.parentElement.clientHeight;
            const width = this.myRef.current.ele.parentElement.clientWidth;
            
            if (this.state.width !== width || this.state.height !== height)
            {
                this.setState({width:width, height:height});
            }
        }
    }

    componentDidMount() {
        this.updateRect();
    }

    componentDidUpdate() {
        this.updateRect();
    }

    render(){
        const { option, data } = this.props; 

        const { height } = this.state;
        
        let config = this.buildConfig(option, data);
    
        return <ReactEcharts ref={this.myRef} option={ config } lazyUpdate={true} style={{ height: height }}></ReactEcharts>;
    }
}

export default WidgetEcharDualAxes;