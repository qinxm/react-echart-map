// WidgetChart
import React from 'react';

import WidgetRportBase from './WidgetReportBase';
import WidgetTable from './WidgetTable';

class WidgetReport extends WidgetRportBase
{
    constructor( props )
    {
        super( props );
    }

    render()
    {
        const { columns, schemas, options, datas, eventId, height, width, totals, loading} = this.state;

        const { report } = this.props; 

        if( datas===undefined || loading===true )
        {
            return <div ref={this.myRef} className="widget-report" style={{position:'relative'}}>
                <img className="load" src={require('./../img/frame/loading.gif')} alt="es-lint want to get"/> 
            </div>;
        }
        else
        {
            if( Object.keys(schemas).length!==0 && Object.keys(report.schemas).length===1 )
            {
                let key = report.schemas[0].name;

                if( eventId!==undefined && eventId!=="" )
                {
                    return (
                        <div ref={this.myRef} style={{height:'100%', width:'100%'}}>
                            <WidgetTable options={options} columns={columns[key]} data={datas[key]} notify={this.onEvent} pageTurning={this.pageTurning} height={height} width={width} total={totals[key]} />
                            <div id={eventId} className="event"></div>
                        </div>
                    ); 
                }
                else
                {
                    return (
                        <div ref={this.myRef}  style={{height:'100%', width:'100%'}}>
                            <WidgetTable options={options} columns={columns[key]} data={datas[key]} notify={this.onEvent} pageTurning={this.pageTurning} height={height} width={width} total={totals[key]} />
                        </div>
                    )                
                }
            }
            else
            {
                return <div></div>;
            }
        }
        
          
    }
}

export default WidgetReport