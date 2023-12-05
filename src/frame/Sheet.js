import React,{Component} from 'react';

import { Link } from "react-router-dom";

class Sheet extends Component 
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        const { sheet, active } = this.props;

        let { sheets, sheetPath } = sheet;

        return (
            <div className="sf-sheet sd-sheet sg-sheet">
            {
                sheets.map((item, index) => {
                    if( item.name===active )
                    {
                        return <Link key={index} to={{pathname:sheetPath, state:{sheetName:item.name, sheet:sheet, path:item.path}}}><label className="label_common label_active">{item.title}</label></Link>
                    }
                    else
                    {
                        return <Link key={index} to={{pathname:sheetPath, state:{sheetName:item.name, sheet:sheet, path:item.path}}}><label className="label_common">{item.title}</label></Link>
                    }
                })
            }
            </div>
        );
    }

}

export default Sheet
