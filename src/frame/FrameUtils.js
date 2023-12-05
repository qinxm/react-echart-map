import React from "react";
import { Button, message, notification } from "antd";

export default class FrameUtils 
{
    static getFirstNode( nodes )
    {
        if( nodes!==undefined && nodes.length>0 )
        {
            for(let i=0; i<nodes.length; i++)
            {
                if( nodes[i].path!==undefined && nodes[i].path!==null)
                {
                    return nodes[i];
                }
                
                if( nodes[i].subcomponents!==undefined )
                {
                    return this.getFirstNode(nodes[i].subcomponents);
                }
            }

            return null;
        }

        return null;
    }

    /**
     * 创建菜单
     * @param {*} nodes 
     * @returns 
     */
    static buildMenuItems( nodes ) 
    {
		if( nodes!==undefined && nodes.length>0 )
		{
			let menuItems = [];
			
			for( let item of nodes )
			{
                if( item.type!=="SHEET" && item.type!=="POPUP" )
                {
                    let menuItem = {
                        label : item.title!==undefined ? item.title : item.name,
                        key : item.name,
                        path : item.path,
                        keyPath : item.path,
                        disabled: item.disabled,
                        icon:undefined,
                        type:undefined,
                    }
    
                    if( menuItem.properties!==undefined && menuItem.properties.icon!==undefined )
                    {
                        menuItem["icon"] = menuItem.properties.icon;
                    }
    
                    if( item.subcomponents!==undefined && item.subcomponents.length>0 )
                    {
                        let children = this.buildMenuItems(item.subcomponents);

                        if( children && children.length>0 )
                        {
                            menuItem["children"] = [...children];
                        }
                      
                    }
                   
                    menuItems.push(menuItem);
                }
			}

			return menuItems;
		}
		
		return null;
	}

    static messageInfo(options={}) {
        // type: info/success/error/warning/loading/open
        const { content='message', duration=3, icon='', style={}, type='success'} = options || {};

        let config = {
            content,
            duration,
            icon,
            style,
        }
        message[type](config);
    }

    static notificationInfo(options={}){
        const key = `open${Date.now()}`;
        const {message='notification', description='', duration=3, placement='top', icon='', className='', style={}, type='success', showBtn=false, onClick=()=>{}} = options || {};
        const btn = (<>
            {/* <Button size="small" style={{marginRight: '10px'}} onClick={()=>{notification.close(key)}}>取消</Button> */}
            <Button type="primary" size="small" onClick={()=>{ onClick(); notification.close(key)}}>确定</Button>
        </>)
        let config = {
            message,
            description,
            duration,
            placement,
            className,
            btn: showBtn && btn,
            icon,
            key,
            style,
        }
        notification[type](config)
    }

    static formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    }
}
