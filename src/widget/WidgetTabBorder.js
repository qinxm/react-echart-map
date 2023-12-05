/**
 * 选中有边框
 */
import React, {Component} from 'react';

import "../css/widget/widget.tabBorder.css";

class WidgetTabBorder extends Component
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
        const {value} = this.state;
        const { data=[] } = this.props;

        return (
            <div className="sf-tabBoder sd-tabBoder sg-tabBoder">
               {
                   data.map(item=>{
                     return  <span className={value===item.value?'sf-span sf-border cursor-pointer' :'sf-span cursor-pointer'} onClick={()=>this.onClick(item.value)}>{item.name}</span>    
                   })
               }
              
            </div>
        )
    }

}
export default WidgetTabBorder;

 