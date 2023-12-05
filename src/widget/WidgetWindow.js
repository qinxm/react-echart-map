// WidgetWindow.js
import React from 'react';
import { Button, ButtonGroup, ButtonToolbar } from 'rsuite';

import 'rsuite/dist/styles/rsuite-default.css';
import '../css/widget/widget.window.css'

class WidgetWindow extends React.Component
{ 
    constructor(props)
    {
        super( props );

        this.state = {
            data : props.data,
            activeItem : undefined
        }

        this.onClick = this.onClick.bind(this);
    }

    onClick( item )
    {
        item = JSON.parse(item);

        if(this.props.onClick!==undefined )
        {
            this.props.onClick(item);
        }

        this.setState({activeItem:item})
    }

    render()
    {
        const { data } = this.state;
        const { activeItem } = this.state;

        if( data!==undefined )
        {
            return (
                <div className="widget-window">
                    <ButtonToolbar>
                        <ButtonGroup >
                        {
                            data.map((item, index) => {
                               
                                if( activeItem!==undefined )
                                {
                                    if( activeItem.name===item.name )
                                    {
                                        return <Button active classPrefix={item.icon} key={index} onClick={() => { this.onClick(JSON.stringify(item)) }}>{item.icon===undefined ? item.title : ""}</Button>
                                    }
                                }
                                else
                                {
                                    if( index===0 )
                                    {
                                        return <Button active classPrefix={item.icon} key={index} onClick={() => { this.onClick(JSON.stringify(item)) }}>{item.icon===undefined ? item.title : ""}</Button>
                                    }
                                }

                                return <Button key={index} classPrefix={item.icon} onClick={() => { this.onClick(JSON.stringify(item)) }}>{item.icon===undefined ? item.title : ""}</Button>  
                            })
                        }
                        </ButtonGroup>
                    </ButtonToolbar>
                </div>
            )
        }   
    }
}

export default WidgetWindow