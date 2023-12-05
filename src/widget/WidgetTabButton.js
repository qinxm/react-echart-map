import React, {Component} from 'react';

import "../css/widget/widget.tabButton.css";
import "../css/frame.css";

class WidgetTabButton extends Component
{
    constructor( props )
    {
        super(props);

        this.state = {
            value:props.value!==undefined ? props.value : undefined,
        }

        this.onSelect = this.onSelect.bind(this);
    }

    onSelect( value )
    {
        this.setState({value:value});

        if( this.props.onSelect!==undefined )
        {
            this.props.onSelect(value);
        }
    }

    componentWillReceiveProps( nextProps )
    {
        const { value } = this.state;
        
        if(  nextProps.value!==undefined && nextProps.value!==null )
        {
            if( nextProps.value!==value )
            {
                this.setState({value:nextProps.value});
            }
        }
        else
        {
            if( nextProps.data!==undefined && nextProps.data!==null )
            {
                this.setState({value:nextProps.data[0].value});
            }
        }
    }

    render()
    {
        const { value } = this.state;
        const { data, isColumn = false } = this.props;

        return (
            // <div className="sf-tab-button sfm-tab-button spj-tab-button spg-tab-button">
            <div className={`sf-tab-button sfm-tab-button spj-tab-button spg-tab-button ${isColumn ? 'sf-flex-column' : ''}`}>
            {
                data.map((item, index) => {
                    
                    let className = "sf-tab-button-item";
                    if( index===0 )
                    {
                        className += " sf-tab-button-left";
                    }

                    if( index===data.length-1 )
                    {
                        className += " sf-tab-button-right";
                    }

                    if( value===item.value )
                    {
                        className += " active";
                    }

                    return (
                        <span key={item.value+index} onClick={()=>this.onSelect(item.value)} className={className}>{item.name}</span>
                    );
                })
            }
            </div>
        )
    }

}
export default WidgetTabButton;
