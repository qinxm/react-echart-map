
import React from "react";

import '../css/widget/widget.title.css'

class WidgetTitle extends React.Component
{ 
    render()
    {
        const { level, title, icon } = this.props;

        let className = "sf-widget-title sf-widget-title-" + level;

        return (
            <div className={className} >
                {
                    icon ? <img src={require(`../img/widget/title/${icon}.png`)} alt="" /> :  <> </>
                }
                <span className="sf-widget-title-content">{title}</span>
            </div>
        )
    }
}

export default WidgetTitle;