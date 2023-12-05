import React, {Component} from 'react';
import { Container } from 'react-smooth-dnd';

class WidgetList extends Component 
{
    constructor ( props )
    {
        super(props);

        this.state = {

        }
    }

    /**
     * 获取子节点
     * @param {*} index 
     */
    getChildPayload = ( index ) => {

        if( this.props.notify )
        {
            this.props.notify(index, "getChildPayload");
        }
    }

    /**
     * 删除节点
     * @param {*} event 
     */
    onDrop = ( event ) => {
        
        if( this.props.notify )
        {
            this.props.notify( event, "onDrop" );
        }
    }

    render ()
    {
        const { options={} } = this.props;
        return (
            <>
                <Container groupName="1" behaviour={options.behaviour ? options.behaviour : 'drop-zone'} getChildPayload={this.getChildPayload} onDrop={ this.onDrop }>
                {
                    this.props.children
                }
                </Container>
            </>
        );
    }
}

export default WidgetList;