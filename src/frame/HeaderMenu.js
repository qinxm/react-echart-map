// top.js
import React from 'react';
import { Menu, Icon} from 'antd';

import FrameUtils from './FrameUtils';

import 'antd/dist/antd.css';
import './../css/common.css';
import './../css/frame.css';


class HeaderMenu extends React.Component 
{
	constructor(props)
    {
		super();
	
		let active = null;

		if( props.titleNode!==undefined )
		{
			active = props.titleNode[0].name;

			for(var i in props.titleNode)
			{
				if(props.titleNode[i].exact === true )
				{
					active = props.titleNode[i].name;
				}
			}
		}

		this.state = {
			active: active,
			titleNode : props.titleNode,
			titleMenuItems : []
		};

		this.handleSelect = this.handleSelect.bind(this);

		// props.onSelect(active);
	}

	handleSelect( activeKey ) 
	{
		this.props.onSelect(activeKey);

		this.setState({ active: activeKey });
	}

	componentWillMount()
	{
		let titleMenuItems =  FrameUtils.buildMenuItems(this.props.titleNode);

		this.setState({titleMenuItems:titleMenuItems});
	}

	render() 
	{
		let { active, titleMenuItems} = this.state;

		const { activeKey } = this.props;
		
		if( activeKey!==undefined )
		{
			active = activeKey;
		}

		return (
			<div className="sf-system-menu sd-system-menu sg-system-menu">
				<Menu
					theme="light"
					mode="horizontal"
					selectedKeys={activeKey}
					defaultSelectedKeys={activeKey}
					items={titleMenuItems}
					onSelect={this.handleSelect}
				/>
			</div>
		);
	}      
}


export default HeaderMenu