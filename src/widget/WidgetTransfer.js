import React, { Component } from "react";
import { Transfer } from "antd";

class WidgetTransfer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            targetKeys: props.selectedKeys || [],
            selectedKeys: [],
        }
    }

    onChange = (nextTargetKeys, direction, moveKeys) => {
        this.setState({targetKeys: nextTargetKeys})
        if(this.props.onChange) this.props.onChange(nextTargetKeys, direction)
    }

    render() {
        const {targetKeys} = this.state;
        const {data = [], } = this.props || {};
        return <div>
            <Transfer
                dataSource={data}
                targetKeys={targetKeys}
                onChange={this.onChange}
                render={(item) => item.title}
            />
        </div>
    }
}

export default WidgetTransfer;