import React, { Component } from "react";
import { Timeline } from "antd";
import NoData from "../pages/comps/NoData";
import '../css/widget/widget.time.line.css';

class WidgetTimeLine extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        const {data = [], mode = 'left', loading} = this.props;

        return <div className="sf-timeline sd-timeline sg-timeline">
            {
                loading && !data.length ? <NoData type="loading" /> : <Timeline mode={mode}>
                    {
                        data.map(item=>{
                            return <Timeline.Item label={item.time} color={item.color} dot={item.dot}>
                                <div className="time-line-content">
                                    <div className="time-line-title">{item.title}</div>
                                    <div className="time-line-type">{item.type}</div>
                                    <div className="time-line-item">{item.content}</div>
                                    <div className="time-line-description">{item.description}</div>
                                </div>
                            </Timeline.Item>
                        })
                    }
                </Timeline>
            }
        </div>
    }
}

export default WidgetTimeLine;