import React from 'react';
import ReactEcharts from 'echarts-for-react'  
import WidgetEchartConfig from './WidgetEchartConfig'

class WidgetEchartPie extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            height:props.height ?props.height : 0,
            width:'100%'
        }
        this.myRef = React.createRef();
    }

    buildConfig = (option={}, data) => {
        // delete option.yAxis;
        let config = {
            color: ['#8DBAED', '#A6DD8E', '#F4B26E', '#3889CD', '#12A09D', '#6770C0'],
            graphic:{
                elements:[
                  {
                    type: 'image',
                    style: {
                        image: option.img,
                        width: 150,
                        height: 150
                    },
                    width: '300',
                    left: '75',
                    top: 'middle',
                    origin: [75, 75], //中心点
                  }
                ]
            },
            tooltip:{
                show:true,
            },
            legend:{
                show: option.legend === false ? option.legend : true,
                right: option.right || '10%',
                icon: "rect"
            },
            series: [
                {
                    type: 'pie',
                    width: option.width || '300',
                    height: option.height || '100%',
                    radius: option.radius || ['0', '75%'],
                    center: option.center || ['center', 'center'],
                    label: {
                        show: false,
                    },
                    selectedMode: option.selectedMode || '',
                    itemStyle: option.itemStyle || {},
                    data: option.selectedMode ? data.data.map((item,index,arr)=>{if(arr[0]) {return {...item, selected: true}} else {return {...item}}}) : data.data
                }
            ]
        };

        if( option.theme!==undefined )
        {
            config = {...WidgetEchartConfig.theme[option.theme].pieConfig, ...option, ...config};
        }
       
        if(config.legend) config.legend = {...config.legend, ...option.legend, orient: option.orient || '', bottom: option.bottom, top: option.bottom ? '' : 'center' }
        // if(config.title) config.title = {...WidgetEchartConfig.theme['default'].pieConfig.title, text: option.title || '',}
     
        return config;
    }
    updateRect =async () =>
    {
        if( this.myRef!==undefined && this.myRef.current!==null && this.myRef.current!==undefined)
        {
            const width = this.myRef.current.ele;
                if (this.state.width !== width)
                {
                   await this.setState({width:width,});
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
        let { option, data ,} = this.props; 

        let { height,config,width } = this.state;

        if( data!==undefined)
        {
            config = this.buildConfig(option, data);
        }
          
        if( config!==undefined && config!==null )
        {
            return <div>
                <ReactEcharts  ref={this.myRef} option={ config } lazyUpdate={true} style={{ height:height,width}}></ReactEcharts>
            </div>
        } else
        {
            return null
        
        }
    }
}

export default WidgetEchartPie;