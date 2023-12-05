import React from "react";
import { Tag, Space} from "antd";

class WidgetLabel extends React.Component 
{
    constructor( props )
    {
        super(props);

        this.state = {
            data:props.data || []
        }
    }

    onClose = ( e, item ) => {

        e.preventDefault();

        this.handleClose(item);

        if( this.props.notify )
        {
            this.props.notify(e, item);
        }
        
    }

    handleClose = (removedTag ) => {

        const {data} = this.state;

        const newData = data.filter((tag) => tag.name !== removedTag.name);
        
        this.setState({data:newData});
    };

    componentWillReceiveProps(nextProps)
    {
        this.setState({data:nextProps.data});
    }

    render()
    {
        const { options = {} } = this.props;

        const { data = [] } = this.state;

        return (
            <div className="sf-label">
               <Space size={[0, 8]} wrap>
                {
                    data.map((item, index) => {
                        return (
                            <Tag key={index} 
                                bordered={options.bordered ? options.bordered : true } 
                                closable={options.closable ? options.closable : false}
                                onClose={(e) => {
                                    this.onClose(e, item);
                                }}
                                color = {item.color ? item.color : ""}
                            >
                                {item.name}
                            </Tag>
                        )
                    })
                }
                </Space>
            </div>
        );
    }
}

export default WidgetLabel;