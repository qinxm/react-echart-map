import React, {Component} from 'react';

import "../css/widget/widget.tabBorder.css";
import "../css/frame.css";

class WidgetTabIndependence extends Component
{
    constructor( props )
    {
        super(props);

        this.state = {
            value:props.value!==undefined ? props.value : undefined,
        }

    }


    onClick = (value) =>{
        this.setState({value})
        this.props.onClick(value)
    }

    render()
    {
        const { value } = this.state;
        const { data } = this.props;

        return (
            <div className="sf-tab-Independence sfm-tab-button spj-tab-button spg-tab-button">
            {
                data.map((item, index) => {
                    return (
                       <span className={value===item.value?'sf-span sf-border cursor-pointer sf-marginLeft-10' :'sf-span cursor-pointer sf-Independence  sf-marginLeft-10'} onClick={()=>this.onClick(item.value)}>{item.name}</span>    
                    );
                })
            }
            </div>
        )
    }

}
export default WidgetTabIndependence;
