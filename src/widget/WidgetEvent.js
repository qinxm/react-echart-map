import React from 'react';
import ReactDOM from 'react-dom';

import Widget from './Widget'

import '../css/widget/widget.event.css' 

class WidgetEvent extends React.Component 
{
    constructor( props )
    {
        super(props);

        this.state = {
            event:[],
            backParam:[]
        }

        this.addEvent = this.addEvent.bind(this);
        this.clickEvent = this.clickEvent.bind(this);
        this.removeEvent = this.removeEvent.bind(this);
        this.canDrill = this.canDrill.bind(this);
        this.onClickEvent = this.onClickEvent.bind(this);
    }
    

    /**
     * 添加事件
     * @param {*} event 
     */
    addEvent( event )
    {
        this.state.event.push(event);
    }

    /**
     * 移除事件
     * @param {*} event 
     */
    removeEvent( event )
    {
        for(let i=0; i<this.state.event.length; i++ )
        {
            if( event.name===this.state.event[i].name )
            {
                this.state.event.splice(i, 1);
            }
        }
    }

    clickEvent(e, params, schemas )
    {
        let liChild = [];
        if( this.state.event!==undefined )
        {
            if(  this.state.event.length===1 )
            {
                if( this.state.event[0].title===undefined || this.state.event[0].title==="")
                {
                    return this.state.event[0].callback(e, params);
                }
                else
                { 
                    let child = React.createElement('span', { key:this.state.event[0].name, onClick:() => {this.onClickEvent(params, this.state.event[0].name) }, className:'event-css' }, this.state.event[0].title);

                    let item = React.createElement('div',{ key:this.state.event[0].name, className:'event-item'}, child);

                    liChild.push(item);
                }
            }
            else
            {
                for( let i in this.state.event )
                {
                    if( this.state.event[i].name.indexOf("_back_")!==-1 && this.state.backParam.length===0 )
                    {
                        continue ;
                    }
                    else if( this.state.event[i].name.indexOf("_drill_")!==-1 && this.canDrill(params, schemas)===false )
                    {
                        continue ;
                    }


                    let child = React.createElement('span', {key:this.state.event[i].name, onClick:() => {this.onClickEvent(params, this.state.event[i].name)}, className:'event-span' }, this.state.event[i].title);

                    let item = React.createElement('div', {key:this.state.event[i].name, className:'event-item'}, child);

                    liChild.push(item);
                }
            }

            let divChild = React.createElement('div', {className:'event-div'}, liChild);

            let dom = document.getElementById(this.props.eventId);
                     
            ReactDOM.render(
               divChild,
               document.getElementById(this.props.eventId)
            ); 

            let top = e.event.pageY;
            let left =  e.event.pageX
 
            dom.style.top = top + 'px';
            dom.style.left = left + 'px';
            dom.style.display = 'block';
        }       
    }
    
    canDrill( params, schemas )
    {
        let ret = false, code = undefined;

        if( params!==undefined )
        {
            if( params.xDimensionCode!==undefined )
            {
                code = params.xDimensionCode;
            }
            else if(params.data!==undefined && params.data.xDimensionCode!==undefined )
            {
                code = params.data.xDimensionCode;
            }
            else if(params.data!==undefined && params.data.data!==undefined && params.data.data.xDimensionCode!==undefined )
            {
                code = params.data.data.xDimensionCode;
            }
            else
            {
                code = "";
            }
        }

        for( let key in schemas )
        {
            let schema = schemas[key];

            if(schema.cube!==undefined && schema.cube.dimensions!==undefined )
            {
                let dimensions = schema.cube.dimensions;

                for( let i in dimensions)
                {
                    if( code!==undefined && dimensions[i].code.substring(0, 4)===code.substring(0, 4) )
                    {
                        let dimension = Widget.findDimension(dimensions[i], code);
    
                        if( dimension.subdimension!==undefined )
                        {
                            ret = true;
                            break;
                        }
                    }
                }
            }

            if(  ret === true)
            {
                break;
            }
        }

        return ret;
    }

    onClickEvent(params, name)
    {
        let param = undefined, filterParam = undefined;

        for(let i in this.state.event)
        {
            if( this.state.event[i].name===name )
            {
                if( this.state.event[i].name.indexOf( "_drill_")!==-1 )
                {
                    this.state.backParam.push(params); 

                    param = params;

                }
                else if( this.state.event[i].name.indexOf( "_back_")!==-1 )
                {
                    param = this.state.backParam.pop(); 

                    filterParam = this.state.backParam[this.state.backParam.length];
                }

                this.state.event[i].callback(param, filterParam);
            }
        }

        let dom = document.getElementById(this.props.eventId);

        dom.style.display = 'none';
    }
}

export default WidgetEvent