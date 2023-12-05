// WidgetComponent
import React from 'react';
import WidgetConsole from './WidgetConsole';

class WidgetComponent extends React.Component 
{
    constructor(props)
    {  
        super(props);

        this.children = [];

        if( this.props.onRef!==undefined )
        {
            this.props.onRef(this)
        }
          
        this.notifyEvent = this.notifyEvent.bind(this);
        this.bindConsole = this.bindConsole.bind(this);
        this.bindReportConsole = this.bindReportConsole.bind(this);
        this.bindChartConsole = this.bindChartConsole.bind(this);
        this.bindMapConsole = this.bindMapConsole.bind(this);
        this.bindDetailConsole = this.bindDetailConsole.bind(this);

        this.onHandleEvent = this.onHandleEvent.bind(this);
    }

    /**
     * 绑定控制台
     * 绑定控制台之后，该组件具备独立提交后台请求数据的能力
     * 当未绑定控制台时，该组件将向父组件传递数据请求
     * @param {*} baseUrl 
     */
    bindConsole(baseUrl)
    {
        if( baseUrl.endsWith('/')===false )
        {
            baseUrl = baseUrl + '/';
        }

        this.bindDimensionConsole(baseUrl + "widget/");
        this.bindReportConsole(baseUrl + "report/");
        this.bindChartConsole(baseUrl + "chart/");
        this.bindMapConsole(baseUrl + "map/");
        this.bindDetailConsole(baseUrl + "detail/");
    }

    bindDimensionConsole( dimensionBaseUrl )
    {
        if( this.state['console']===undefined )
        {
            this.state['console'] = new WidgetConsole( {ref: this} );
        }

        this.state['console'].bindDimension(dimensionBaseUrl);
    }

    bindReportConsole( reportBaseUrl )
    {
        if( this.state['console']===undefined )
        {
            this.state['console'] = new WidgetConsole( {ref: this} );
        }

        this.state['console'].bindReport(reportBaseUrl);
    }

    bindChartConsole(chartBaseUrl)
    {
        if( this.state['console']===undefined )
        {
            this.state['console'] = new WidgetConsole( {ref: this} );
        }

        this.state['console'].bindChart(chartBaseUrl);
    }

    bindMapConsole( mapBaseUrl )
    {
        if( this.state['console']===undefined )
        {
            this.state['console'] = new WidgetConsole( {ref: this} );
        }

        this.state['console'].bindMap(mapBaseUrl);
    }

    bindDetailConsole( detailBaseUrl )
    {
        if( this.state['console']===undefined )
        {
            this.state['console'] =new WidgetConsole( {ref: this} );
        }

        this.state['console'].bindDetail(detailBaseUrl);
    }

    /**
     * 设置独立事件域，当independent为true时，事件将不会向上传递，默认是false
     * @param {*} eventType 可以设置为*，表示所有，否则为特定的事件类型
     * @param {*} independent 
     */
    setIndependentEventRegion(eventType, independent)
    {
        if( eventType==='*' )
        {
            this.state['independent'] = {};
        }

        this.state['independent'][eventType] = independent;
    }

    /**
     * 判断事件是否需要传递
     * @param {*} eventType 
     * @returns 
     */
    testIndependent( eventType )
    {
        let ret = false;

        if( this.state['independent']!==undefined )
        {
            if( this.state['independent']['*']!==undefined )
            {
                ret = this.state['independent']['*'];
            }
            else if( this.state['independent'][eventType]!==undefined )
            {
                ret = this.state['independent'][eventType];
            }
        }

        return ret;
    }

   /**
    *  生成并发送事件
    * @param {*} eventType 
    * @param {*} eventContent 
    */
    sendEvent( eventType, eventContent )
    {
        let event = {};

        event["type"] = eventType;
        event["source"] = this;
        event["content"] = eventContent;

        this.notifyEvent( event );
    }

    /**
     * 通知事件
     * @param {*} event { type : 事件类型, source : 事件由谁产生, content ：事件内容 {} }
     */
    notifyEvent( event )
    {
        let ret = false;

        const { source } = event;

        // handle event - 更新图表数据、更新维度数据\
        ret = this.onHandleEvent( event );

        // notify parent
        if( ret===false )
        {
            // 1. 是否有父, 2. 是否independent，没有才传递, 3。来源是否是父
            if( this.props.parent!==undefined && this.props.parent!==source && this.props.notifyEvent!==undefined && this.testIndependent(event.type)===false )
            {
                event["source"] = this;
                ret = this.props.notifyEvent(event);
            }
        }

        if( ret===false )
        {
            // notify children
            for( var i in this.children )
            {
                // 1. 子不是来源
                if( this.children[i]!==source ) 
                {
                    event["source"] = this;
                    ret = this.children[i].notifyEvent( event );
                    if( ret===true ) break;
                }
            }
        }

        return ret;
    }

    /**
     * Component需要进行console处理
     * @param {*} event 
     * @return 返回true时，该事件不用再继续传递
     */
    onHandleEvent(event)
    {
        const { console } = this.state;

        let ret = false;

        if( console!==undefined )
        {
            switch( event.type )
            {
                case 'read.dimension':
                {
                    // console 调用 Component的 sendEvent方法，传递结果
                    ret = console.readDimension( event.content );
                    break;
                }
                case 'read.chart.schema':
                {
                    ret = console.readChartSchema( event.content );
                    break;
                }
                case 'read.chart.data':
                {
                    ret = console.readChartData( event.content );
                    break;
                }
                case 'read.report.schema':
                {
                    ret = console.readReportSchema( event.content );
                    break;
                }
                case 'read.report.data':
                {
                    ret = console.readReportData( event.content );
                    break;
                }
                case 'error.set.report.data':
                case 'set.report.data':
                case 'error.set.report.schema':
                case 'set.report.schema':
                case 'error.set.chart.data':
                case 'error.set.chart.schema': 
                case 'error.dimension':
                {
                    if( event.content.status===10 )
                    {
                        this.props.history.push('/login');
                        window.location.reload();
                        ret = true;
                    }
                    break;
                }
                default :
                    break;
            }
        }

        if( ret===false && this.onHandleEventSelf!==undefined )
        {
            ret = this.onHandleEventSelf(event);
        }

        return ret;
    }

    /**
     * 获取子组件句柄
     * @param {*} ref 
     */
    onRef = (ref) => {
        this.children.push( ref );
    }
}

export default WidgetComponent