import React from "react";

import { Input } from "antd";

import '../css/widget/widget.input.css'

const WidgetInput = ({placeholder = '请输入',prefix='', suffix = '搜索', onChange = () => {}, onKeyUp = () => {}, onClick = () =>{},width, defaultValue}) => {
    return (
        <div className="sf-input">
        {
            defaultValue ? <Input prefix={prefix && <img className="" src={require(`./../img/${prefix}`)} alt=""/>}  placeholder={placeholder} defaultValue={defaultValue} value={defaultValue} style={{width}} onChange={onChange} onKeyUp={onKeyUp} suffix={suffix && suffix === '搜索' ? <></> : <img className="click" src={require(`./../img/${suffix}`)} onClick={onClick}/>}/> :
                <Input placeholder={placeholder} style={{width}} onChange={onChange} onKeyUp={onKeyUp} 
                    suffix={suffix && suffix === '搜索' ? <></> : <img className="click" src={require(`./../img/${suffix}`)} onClick={onClick} alt=""/>}
                    addonAfter={suffix && suffix === '搜索' && <span className="cursor-pointer" style={{color: '#102A49'}} onClick={()=>{onClick(1)}}>搜索</span>}
                />
        }
        </div>
    )
}

export default WidgetInput;