import React from "react";
import { Button, notification } from "antd";

import Widget from './Widget';

export default class WidgetNotification 
{
    /**
     * 提示消息
     * @param {string} title 
     * @param {string} notificationContent 
     */
    static info( title, notificationContent, placement = 'top' ) 
    {
        notification.info({
            message : title,
            description : notificationContent,
            placement
        });
    }

    /**
     * 成功消息
     * @param {string} title 
     * @param {string} notificationContent 
     */
    static success( title, notificationContent, placement = 'top' ) 
    {
        notification.success({
            message : title,
            description : notificationContent,
            placement
        });
    }

    /**
     * 错误消息
     * @param {string} title 
     * @param {string} notificationContent 
     */
    static error( title, notificationContent, placement = 'top' )
    {
        notification.error({
            message : title,
            description : notificationContent,
            placement
        });
    }

    /**
     * 告警消息
     * @param {string} title 
     * @param {string} notificationContent 
     */
    static warning( title, notificationContent, placement = 'top' )
    {
        notification.warning({
            message : title,
            description : notificationContent,
            placement
        });
    }

    /**
     * 带确定按钮的通知
     * @param { string } title
     * @param { string } notificationContent
     * @param { string } divID
     * @param { funtion } comfirmFun 确认的回调函数，可为空
     * @param { string } comfirmTitle 确认按钮标题，可为空
     * @param { funtion } cancelFun 取消的回调函数，可为空
     * @param { string } cancelTitle 取消按钮标题，可为空
     * @param { funtion } closeFun 点 × 关闭的回调函数，可为空
     */
    static customWarning( {title, notificationContent, divID, comfirmFun, comfirmTitle, cancelFun, cancelTitle, closeFun, duration = null})
    {

        const key = `${Date.now()}` + Widget.randomString(12);

        let ret

        const comfirm = (key) => { 

            if( comfirmFun!==undefined )
            {
                ret = comfirmFun();
            }

            if( ret!==true )
            {
                notification.close(key);
            }
        }

        const cancel = (key) => { 

            if( cancelFun!==undefined )
            {
                ret = cancelFun();
            }

            if( ret!==true )
            {
                notification.close(key);
            }
        }

        const close = () => { 

            if( closeFun!==undefined )
            {
                ret = closeFun();
            }
        }

        const btn = (
            <div className="widget-notification">

                <Button type="cancel" size="small" onClick={() => cancel(key)} style={{marginRight: '10px'}}>
                    {cancelTitle ? cancelTitle : "取消"} 
                </Button>

                <Button type="primary" size="small" onClick={() => comfirm(key)}>
                    {comfirmTitle ? comfirmTitle : "确定"}
                </Button>
            </div>
           
        );

        if( divID!==undefined && divID!==null && divID!=="" )
        {
            notification.open({
                message: title,
                description: notificationContent,
                placement:'top',
                duration,
                getContainer: () => document.getElementById(divID),
                btn,
                key,
                onClose: close,
            });
        }
        else
        {
            notification.open({
                message: title,
                description: notificationContent,
                placement:'top',
                duration,
                btn,
                key,
                onClose: close,
            });
        }
        
    }
     
}