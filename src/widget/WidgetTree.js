
import React from "react";
import { Tree } from 'antd';

import 'antd/dist/antd.css';
import '../css/widget/widget.tree.css'
import WidgetInput from './WidgetInput'

import lodash from 'lodash'

class WidgetTree extends React.Component
{ 
    constructor( props )
    {
        super(props);

        this.state = {
            selectedKeys:[],
            expandedKeys:[],
            keyWord:undefined,
            treeData:props.treeData,
            checkStrictly: props.options.checkStrictly || false
        }
    }

    componentWillReceiveProps( nextProps )
    {
        const { treeData, selectedKeys, checkedKeys, checkStrictly } = this.state;
       
        if(!this.props.options.defaultExpandAll) this.formatExpandKeys(treeData);
        
        if(  nextProps.treeData!==undefined && nextProps.treeData!==null )
        {
            if( nextProps.treeData!==treeData )
            {
                this.setState({treeData:[...nextProps.treeData]});
            }
        }

        if( nextProps.defaultValue )
        {
            if( checkStrictly===true )
            {
                if(nextProps.defaultValue!==checkedKeys )
                {
                    let expandedKeys = [];

                    if( nextProps.defaultValue.checked )
                    {
                        expandedKeys = [...nextProps.defaultValue.checked];

                    }
                    this.setState({checkedKeys:{...nextProps.defaultValue}, expandedKeys:expandedKeys });
                }
            }
            else
            {
                if(nextProps.defaultValue!==selectedKeys )
                {
                    
                    this.setState({selectedKeys:[...nextProps.defaultValue], checkedKeys:[...nextProps.defaultValue], expandedKeys:[...nextProps.defaultValue]});
                }
            }
        }
    }

    /**
     * 
     * @param {*} key 选中节点key值
     * @param {*} value  node节点
     */
    onExpand = (key,value ) => {

        this.setState({expandedKeys:key});

        if( this.props.onClick ) this.props.onClick(key,value )
    }

    /**
     * 复选框选中
     * @param {*} key 
     * @param {*} e 
     */
    onCheck = (key, e) =>{

        this.setState({checkedKeys:key});

        if(this.props.onCheck) this.props.onCheck(key, e);
    }


    /**
     * 树节点点击
     * @param {*} key 
     * @param {*} e 
     */
    onSelect = async (key,e ) =>{

        this.setState({selectedKeys:key});

        if(this.props.onSelect) this.props.onSelect(key,e)
    }

     //键盘捕获事件
    keyWordKeyUp = (e, type) => {
        let { keyWord, dataListB } = this.state;
        const {treeData} = this.props;
        
        treeData.map(item=>{
            // if(item.checkable===false)
            // {
            //     dataListB=lodash.cloneDeep(item.children)
            // }else
            // {
                dataListB=lodash.cloneDeep(treeData)
            // }
        })

      
        if (e.keyCode === 13) {
            //列表搜索
           this.setState({treeData:this.mapTree(keyWord, dataListB)});
        }
    };

    /**
     * 标题渲染
     * @param {*} nodeData 
     */
    titleRender = ( nodeData ) => {

        if( this.props.titleRender )
        {
        return this.props.titleRender(nodeData);
        }
        else
        {
        return nodeData.label ? nodeData.label : nodeData.title;
        }
    }

    /**
     * 列表搜索
     */
    mapTree = (keyWord, dataListB) => {
        
        const {treeData} = this.props;
        if(keyWord)
        {
            let newarr = [];
            dataListB.map(item => {
             
                if( item.title.indexOf(keyWord) > -1 ) 
                { // 判断条件
                    newarr.push(item);
                } 
                else 
                {
                    if( item.children && item.children.length > 0 ) 
                    {
                        let redata = this.mapTree(keyWord, item.children);

                        if( redata && redata.length > 0 ) 
                        {
                            let obj = {
                                ...item,
                                children: redata
                            };
                            newarr.push(obj);
                        }
                    }
                }
                
            });

            return newarr;
        }
        else 
        {
            return treeData;
        }
    }

    formatExpandKeys = (data=[]) => {
        let {expandedKeys} = this.state;
        data.forEach(item=>{
            expandedKeys.push(item.key)
            if(item.children){
                this.formatExpandKeys(item.children)
            }
        })
        expandedKeys = expandedKeys.filter(item=>{return item !== undefined})
        this.setState({expandedKeys})
    }

    render ( )
    {
        const {expandedKeys, selectedKeys, checkedKeys, keyWord,treeData,dataListB, checkStrictly} = this.state;
        const {options} = this.props
        const {check,icon='',search = true, defaultExpandAll=true } = options;

        return (
            <div className="sf-tree sd-tree sg-tree">
            {
                search ?
                <div className="swg-Tree-Input">
                
                    <WidgetInput placeholder="请输入" suffix="frame/search.svg" onChange={e => { this.setState({keyWord:e.target.value})}} onKeyUp={(e) => this.keyWordKeyUp(e, "ListdataSource")} 
                        onClick={()=>this.setState({dataList:this.mapTree(keyWord,dataListB)})} />
                </div>
                :<></>
            }
                
            <div className="sf-tree-content">
                <Tree 
                    // defaultExpandParent={true} // 展开父节点
                    // autoExpandParent={true} // 默认展开父节点
                    defaultExpandAll={defaultExpandAll} // 展开所有节点
                    icon={icon}
                    showIcon={true}  // 是否展示icon
                    checkable={check} // 节点前是否添加复选框 
                    onExpand={this.onExpand} // 展开收起触发
                    expandedKeys={expandedKeys} // 展开指定树节点
                    onCheck = {this.onCheck} // 选中复选框触发
                    treeData={treeData} // 数据
                    selectedKeys={selectedKeys} //设置选中节点
                    checkedKeys = {checkedKeys} 
                    checkStrictly = {checkStrictly} // 是否级联
                   
                    onSelect ={this.onSelect} //点击树节点触发
                    selectable={this.props.onSelect ? true : false} //点击节点是否可选中
                    titleRender = {this.titleRender}
                />
            </div>
            </div>
        )
        
    }
}
export default WidgetTree