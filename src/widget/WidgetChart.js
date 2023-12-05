// WidgetChart
import React from 'react';

import WidgetChartBase from './WidgetChartBase';
import WidgetChartReport from './WidgetChartReport';
import WidgetChartEchart from './WidgetChartEchart';

class WidgetChart extends WidgetChartBase
{
    constructor( props )
    {
        super( props );
    }

    render()
    {
        let { schemas, datas, eventId, loading } = this.state;

        const { chart } = this.props; 

        if( Object.keys(schemas).length!==0 && Object.keys(chart.schemas).length===1 )
        {
            let key = chart.schemas[0].name;

            if( eventId!==undefined && eventId!=="" )
            {
                switch( chart.type )
                {
                    case "report" :
                    {
                        return (
                            <div style={{height:'100%', width:'100%'}}>
                                <WidgetChartReport schema={schemas[key]} chart={chart} data={datas[key]} onEvent={this.onReportEvent} loading={loading}/>
                                <div id={eventId} className="event"></div>
                            </div>
                        );  
                    }
                    default :
                    {
                        return (
                        <div style={{height:'100%', width:'100%'}}>
                            <WidgetChartEchart schema={schemas[key]} chart={chart} data={datas[key]} onEvent={this.onEvent} loading={loading}/>
                            <div id={eventId} className="event"></div>
                        </div>
                        );  
                    }
                }
            }
            else
            {
                switch( chart.type )
                {
                    case "report" :
                    {
                        return <WidgetChartReport schema={schemas[key]} chart={chart} data={datas[key]} onEvent={this.onEvent} loading={loading}/>
                    }
                    default :
                    {
                        return <WidgetChartEchart schema={schemas[key]} chart={chart} data={datas[key]} onEvent={this.onEvent} loading={loading}/>  
                    }
                }
            }
        }
        else
        {
            return <div></div>
        }
          
    }
}

export default WidgetChart