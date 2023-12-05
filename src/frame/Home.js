/** 经济监测 */
import React from 'react';
import { Redirect } from 'react-router';

import FrameUtils from './../frame/FrameUtils';

class Home extends React.Component
{
    constructor( props )
    {
        super(props);

        this.state = {
            
        };

    }

    render()
    {
        let children ;

        if( this.props.location.state!==undefined && this.props.location.state.children!==undefined )
        {
            children = this.props.location.state.children;
        }

        let node = FrameUtils.getFirstNode(children);

        if( node!==null )
        {
            if( node.subcomponents!==undefined && node.subcomponents!==null )
            {
                return <Redirect to={ {pathname:node.path, state:{children:node.subcomponents, node:node } } }></Redirect>  
            }
            else
            {
                return <Redirect to={ { pathname:node.path, state:{node:node, node:node} } }></Redirect>
            }
        }
        else
        {
            return "";
        }
    }
}

export default Home