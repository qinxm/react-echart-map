// Left.js
import React from 'react';
import { Menu, Button, } from 'antd';

import {MenuFoldOutlined, MenuUnfoldOutlined} from '@ant-design/icons';

import FrameUtils from './FrameUtils';
import Widget from '../widget/Widget';

import 'antd/dist/antd.css';
import './../css/frame.css';
import './../css/common.css';

class Left extends React.Component 
{
	constructor(props) 
	{
		super();

		this.state = {
			// 第一次加载的时候，Widget.getSessionStorage('_left_node_openKey_')为null
			openKey : [], //控制菜单的展开
			activeKey: props.activeKey ? props.activeKey : [],
			collapsed:false,
			preOpenKey:[]
		};

		this.findOpenKey = this.findOpenKey.bind(this);
		this.findNode = this.findNode.bind(this);

		this.handleSelect = this.handleSelect.bind(this);
		this.setActiveKey = this.setActiveKey.bind(this);
		this.findFirstNode = this.findFirstNode.bind(this);
	}
      
	/**
	 * 处置子菜单的选择
	 * @param {*} nodeKey 
	 */
	handleSelect( item ) 
	{  
		let { openKey }=this.state

		let keyPath = [];

		this.findOpenKey(openKey, this.props.leftNode, item.key);

		Widget.addSessionStorage("_left_node_activeKey_", item.key);

		this.setState({activeKey: item.key});

		keyPath.push(...item.keyPath);

		keyPath.reverse();

		if( this.props.leftOnSelect!==undefined )
		{
			this.props.leftOnSelect(item.key, item.item.props.path, keyPath, openKey);
		}
	}

	/**
	 * 展开跳转判断( 处理父级菜单的选择)
	 * @param {*} values 
	 */
	handleOpenChange = ( values ) =>
	{
		let isOpen = true;
		let { openKey, preOpenKey }=this.state

		openKey = [...values];

		let keyPath = [], nodeKey;

		for( let key of values )
		{
			let isExist = false;
			for( let openItem of preOpenKey )
			{
				if( key===openItem )
				{
					isExist = true;
				}
			}

			if( isExist===false )
			{
				nodeKey = key;
				break;
			}
		}

		if( nodeKey )
		{
			isOpen = true;
		}

		if( isOpen!==true )
		{
			if( nodeKey===undefined )
			{
				for( let preOpenItem of preOpenKey)
				{
					let isExist = false;
	
					for( let key of values )
					{
						if( preOpenItem===key )
						{
							isExist = true;
						}
	
					}
	
					if( isExist===false )
					{
						nodeKey = preOpenItem;
						break;
					}
				}
			}
		}

		if( nodeKey )
		{
			isOpen = false;
		}

		
		if( isOpen===true )
		{
			let item = {};

			item = this.findNode(nodeKey, this.props.leftNode);

			if( item!=null )
			{
				this.findOpenKey(openKey, this.props.leftNode, item.name);
	
				Widget.addSessionStorage("_left_node_activeKey_", item.name);
		
				this.setState({activeKey: item.name, openKey:openKey, preOpenKey:openKey});
		
				if( item.path!==undefined )
				{
					if( item.keyPath!==undefined )
					{
						keyPath.push(...item.keyPath);
		
						keyPath.reverse();
					}
			
					if( this.props.leftOnSelect!==undefined )
					{
						this.props.leftOnSelect(item.name, item.path, keyPath, values);
					}
				}
			}
			else
			{
				this.setState({openKey:values, preOpenKey:values});
			}
		}
		else
		{
			this.setState({openKey:openKey, preOpenKey:openKey});
		}
	}

	setActiveKey( key )
	{
		let openKey = [];
		// let {openKey}=this.state

		this.findOpenKey(openKey, this.props.leftNode, key);

		// this.findOpenKey(openKey, this.props.disposalData, key);

		this.setState({
			activeKey: key,
			openKey : openKey,
			isState : true
	 	});

		Widget.addSessionStorage("_left_node_activeKey_", key);
		Widget.addSessionStorage("_left_node_openKey_", openKey);
	}
   
	/**
	 * 找到第一个节点
	 * @param {*} leftNode 
	 * @returns 
	 */
	findFirstNode( leftNode )
	{
		for( let i=0; i<leftNode.length; i++)
		{
			if( leftNode[i].path!==undefined && leftNode[i].path!==null && leftNode[i].path!=="")
			{
				return leftNode[i];
			}

			if( leftNode[i].subcomponents!==undefined )
			{
				return this.findFirstNode(leftNode[i].subcomponents);
			}
		}
	}

	/**
	 * 根据节点key找到相应的节点
	 * @param {*} nodeKey 
	 * @param {*} leftNode 
	 */
	findNode(nodeKey, leftNode)
	{
		let node = null;

		if( leftNode!==undefined && leftNode!==null )
		{
			for( let i=0; i<leftNode.length; i++)
			{  
				// 查父级
				if( leftNode[i].name===nodeKey )
				{
					node = leftNode[i];
				}
	            //  若父级未找到，查子集
				if( node===null && leftNode[i].subcomponents!==undefined )
				{
					node = this.findNode(nodeKey, leftNode[i].subcomponents );
				}
	
				if( node!==null  )
				{
					break;
				}
			}
		}
		
		return node;
	}

	/**
	 * 根据点击节点找到需要展开的节点的key
	 * @param {*} leftNode 
	 * @param {*} activeKey 
	 */
	findOpenKey(openKey, leftNode, activeKey)
	{
		let isFind = false;
         
		if( leftNode!==undefined && leftNode!==null )
		{
			for( let i=0; i<leftNode.length; i++)
			{  
				// 查父级
				if( leftNode[i].name===activeKey )
				{
					isFind = true;
				}
	            //  若父级未找到，查子集
				if( isFind===false && leftNode[i].subcomponents!==undefined )
				{
					isFind = this.findOpenKey(openKey, leftNode[i].subcomponents, activeKey);
				}
	
				if( isFind===true )
				{
					openKey.push(leftNode[i].name);
					break;
				}
			}
		}
		
		return isFind;
	}

	/**
	 * 创建菜单数据
	 * @param {*} nodes 
	 */
	buildMenuItems = ( nodes ) => {
		
		return FrameUtils.buildMenuItems(nodes);
		
	}

	/**
	 * 设置菜单展开还是关闭
	 */
	toggleMenu = () => {

		let { collapsed } = this.state;

		let left = document.getElementById("-sf-left-id-");
		let body = document.getElementById("-sf-body-id-");
		
		if( !collapsed )
		{
			// 隐藏
			left.classList.add("sf-left-collapsed");
			body.classList.add("sf-body-collapsed");
			// left.style.width = '79px';
			// body.style.width = 'calc(100% - 79px)';
		}
		else
		{
			// 打开
			left.classList.remove("sf-left-collapsed");
			body.classList.remove("sf-body-collapsed");
		}

		this.setState({collapsed:!collapsed});
	}


	componentDidMount() 
	{
		let menuItems = this.buildMenuItems( this.props.leftNode );

		let nextPath = this.props.location.pathname && this.props.location.pathname.slice(6).split(',');

		let openKey = [];

		this.findOpenKey(openKey, this.props.leftNode, this.props.leftActiveKey);

		this.setState({menuItems:menuItems, openKey:openKey, activeKey: this.props.leftActiveKey || nextPath});
	}

	componentWillMount()
	{
		let menuItems = this.buildMenuItems(this.props.leftNode );

		this.setState({menuItems:menuItems});
	}

	componentWillReceiveProps( nextProps )
	{
		let menuItems = this.buildMenuItems( nextProps.leftNode );

		let nextPath = nextProps.location.pathname && nextProps.location.pathname.slice(6).split(',');

		let openKey = nextProps.openKey;

		if( !openKey )
		{ 
			openKey = [];
			this.findOpenKey(openKey, nextProps.leftNode, nextProps.leftActiveKey);
		}
		
		this.setState({ menuItems:menuItems, openKey:openKey, activeKey: nextProps.leftActiveKey || nextPath});
	}

	render() 
	{
		let { activeKey, openKey, menuItems, collapsed} = this.state;

		if( collapsed )
		{
			openKey = null;
		}

	  	return (
			<div id="-sf-left-id-" className="sf-left sd-left sg-left">
				<div className="sf-left-bg sd-left-bg sg-left-bg">
				<div className="sf-left-menu">
					<Menu
						defaultSelectedKeys={activeKey}
						defaultOpenKeys={openKey}
						selectedKeys={activeKey}
						openKeys={openKey}
						mode="inline"
						theme="light"
						inlineCollapsed={collapsed}
						items={menuItems}
						onOpenChange ={(values)=>this.handleOpenChange(values)}
						onSelect = { this.handleSelect }
					/>
				</div>
				<div className="sf-left-collapsed-button sd-left-collapsed-button sg-left-collapsed-button">
					<div className='cursor-pointer' onClick={this.toggleMenu} style={{borderTop: '1px solid #3C414E', padding: '10px 16px', color: '#fff', fontSize: '18px' }}>
						{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
					</div>
				</div>
				</div>
			</div>
		);
	}
}

export default Left