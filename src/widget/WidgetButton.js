import React, { useState } from "react";
import { Button } from "antd";

import './../css/widget/widget.button.css';

// 新增按钮
const AddButton = ({text = '新增', htmlType = '', icon = 'widget/button/text_add', onClick = () => {}, style = {}}) => {
    return (
        <span className="sf-button">
            <Button type="primary" htmlType={htmlType} onClick={onClick} icon={icon && <img src={require(`./../img/${icon}.svg`)}  alt=""/>} style={{ display: icon && 'flex', alignItems: icon && 'center', ...style }}>{text}</Button>
        </span>
    )
}
// const AddTextButton = ({text = '新增', htmlType = '', icon = 'lanxi/text_add', onClick = () => {}, style = {}}) => {
//     return (
//         <span className="sf-button">
//             <Button type="text" htmlType={htmlType} ghost onClick={onClick} 
//                 icon={icon && <img src={require(`./../img/${icon}.svg`)} />} 
//                 style={{ color: '#3889CD', display: icon && 'flex', alignItems: icon && 'center', ...style }}>
//                     {text}
//             </Button>
//         </span>
//     )
// }

// 常规按钮
const GeneralButton = ({text = '删除', icon = 'widget/button/text_remove', onClick = () => {}, style = {}}) => {
    
    const [isHover, setIsHover] = useState(false);

    if( icon!=="" && icon.indexOf(".")===-1 )
    {
        if( isHover )
        {
            icon += "1.svg"
        }
        else
        {
            icon += ".svg"
        }
       
    }

    return (
        <span className="sf-button">
            <Button type="general" onClick={onClick}  onMouseEnter={()=>{setIsHover(!isHover)}} onMouseLeave={()=>{setIsHover(false)}} 
                icon={icon && <img src={require(`./../img/${icon}`)}  alt=""/>} 
                style={{ display: icon && 'flex', alignItems: icon && 'center', ...style }}>{text}</Button> 
        </span>
    )
}

// 线型按钮新增
const AddLineButton = ({text = '新增', htmlType = '', icon = 'frame/add_btn_line', onClick = () => {}, style = {}}) => {
    
    if( icon!=="" && icon.indexOf(".")===-1 )
    {
        icon += ".svg"
    }
    
    return (
        <span className="sf-button sf-line-button">
            <Button type="general" htmlType={htmlType} ghost onClick={onClick} icon={icon && <img src={require(`./../img/${icon}`)}  alt=""/>} style={{ display: icon && 'flex', alignItems: icon && 'center', ...style }}>{text}</Button>
        </span>
    )
}


// 线型按钮常规
const  GeneralLineButton = ({text = '删除', icon = 'frame/del_btn_line', onClick = () => {}, style = {}}) => {
    return (
        <span className="sf-button">
            <Button type="general" ghost onClick={onClick} icon={icon && <img src={require(`./../img/${icon}.svg`)}  alt=""/>} style={{ display: icon && 'flex', alignItems: icon && 'center', ...style }}>{text}</Button>
        </span>
    )
}

// 文字新增按钮
const AddTextButton = ({text = '新增', htmlType = '', icon = 'widget/button/text_add', onClick = () => {}, style = {}}) => {
    return (
        <span className="sf-button">
            <Button type="text" htmlType={htmlType} ghost onClick={onClick} 
                icon={icon && <img src={require(`./../img/${icon}.svg`)} alt=""/>} 
                style={{ color: '#3889CD', display: icon && 'flex', alignItems: icon && 'center', ...style }}>
                    {text}
            </Button>
        </span>
    )
}

// 文字常规按钮
const GeneralTextButton = ({text = '删除', icon = 'widget/button/text_remove', onClick = () => {}, style = {}}) => {
    return (
        <span className="sf-button">
            <Button type="text" ghost onClick={onClick} 
                icon={icon && <img src={require(`./../img/${icon}.svg`)}  alt=""/>} 
                style={{ display: icon && 'flex', alignItems: icon && 'center', ...style }}>
                    {text}
            </Button>
        </span>
    )
}

export {
    AddButton,
    GeneralButton,
    AddLineButton,
    GeneralLineButton,
    AddTextButton,
    GeneralTextButton
}

