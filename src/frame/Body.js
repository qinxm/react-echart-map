import React, { Fragment } from 'react';

import FrameBreadcrumb from './FrameBreadcrumb';

class Body extends React.Component 
{
    render() 
	{
        const { leftNode=[], titleNodes=[], menuPaths=[], location={}, isBreadcrumb } = this.props;

        if( isBreadcrumb===true )
        {
            return (
                <div id="-sf-body-id-" className="sf-body sd-body sg-body page-overflow"> 
                    <FrameBreadcrumb titleNodes={titleNodes} leftNodes={leftNode} menuPaths={menuPaths} frameLocation={location}></FrameBreadcrumb>
                    <Fragment>
                        {this.props.children}
                    </Fragment>
                </div>
            );
        }
        else
        {
            return (
                <div id="-sf-body-id-" className="sf-body sd-body sg-body page-overflow"> 
                    <Fragment>
                        {this.props.children}
                    </Fragment>
                </div>
            );
        } 
    }
}

export default Body