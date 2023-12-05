import React from "react";
import { message } from "antd";

export default class WidgetMessage 
{
    /**
     * 提示消息
     * @param {string} messageContent 
     */
    static info( messageContent ) 
    {
        message.info(messageContent);
    }

    /**
     * 成功消息
     * @param {string} messageContent 
     */
    static success( messageContent ) 
    {
        message.success(messageContent);
    }

    /**
     * 错误消息
     * @param {string} messageContent 
     */
    static error( messageContent )
    {
        message.error(messageContent);
    }

    /**
     * 告警消息
     * @param {string} messageContent 
     */
    static warning( messageContent )
    {
        message.warning(messageContent);
    }

    /**
     * 自定义消息
     * @param { json } options // 配置项和antd一致
     * @param { string } type // 消息类型 // info、 success、 error 、warning 、loading 、open
     */
    static customizeMessage( options={},  type) 
    {
        const { content, duration=3, icon='', style={} } = options || {};

        if( content!==undefined && content!==null && content!==""  )
        {
            let config = {
                content,
                duration,
                icon,
                style,
            }

            message[type](config);
        }
    }
}