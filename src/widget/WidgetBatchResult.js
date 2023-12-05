import React from "react";

import { Progress, Result }  from 'antd';

import WidgetTips from './WidgetTips';
import WidgetTable from './WidgetTable';


import '../css/widget/widget.batch.result.css'


class WidgetBatchResult extends React.Component 
{
    constructor( props )
    {
        super(props);

        this.state = {
            columns:props.columns,
            data:props.data || [],
        }
    }

    notify = (type, data, value, index, event, fun) => {

        switch( type )
        {
            case "result":
            {
                if( data.result==="success" )
                {
                    return <span className="sf-result">成功<Result status="success"></Result></span>
                }
                else if( data.result==="failed" )
                {
                    return <span className="sf-result">失败<Result status="error"></Result></span>
                }
                else
                {
                    return <></>
                }
            }
            case "detail":
            {
                if( data.result==="failed" )
                {
                    return <WidgetTips tipContent={data.detail} title="查看原因" position="bottom" isRequire={true}></WidgetTips>
                }
                else
                {
                    return <></>
                }
            }
            default:
            {
                if( this.props.nofity )
                {
                    return this.props.nofity(type, data, value, index, event, fun);
                }
            }
        }
    }

    buildProgress = ( data ) => {

        let completes = 0, percent;

        for( let item of data )
        {
            if( item.result==="success" ||  item.result==="failed" )
            {
                completes++;
            }
        }

        percent = completes/data.length * 100;

        this.setState({percent:percent, total:data.length});
    }

    componentWillReceiveProps(nextProps)
    {
        this.setState({columns:nextProps.columns, data:nextProps.data});

        this.buildProgress(nextProps.data);
    }

    render()
    {
        const { columns, data, options={}, total, percent } = this.state;
        const { description, strokeColor="#499F9C"} = this.props;

        return (
            <div className="sf-batch-result sd-batch-result sg-batch-result">
                <div className="sf-batch-result-progress">
                    <span className="sf-batch-result-description">{description}<span className="sf-batch-result-num">{total}</span> 个 </span>
                    <div className="sf-progress-item">
                        <Progress percent={percent} strokeColor={strokeColor} ></Progress>
                    </div>
                </div>

                <div className="sf-batch-result-table" >
                    <WidgetTable options={options} columns={columns} data={data} notify={this.notify} total={total} ></WidgetTable>
                </div>
            </div>
        );
    }
}

export default WidgetBatchResult;