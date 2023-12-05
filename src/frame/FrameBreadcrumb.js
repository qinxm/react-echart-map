// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from "antd";

import 'antd/dist/antd.css';

class FrameBreadcrumb extends React.Component 
{
	constructor( props )
    {
        super(props);

        this.state = {
            titleNodes : this.props.titleNodes,
            leftNodes : this.props.leftNodes,
            menuPaths : undefined,
            data : []
        }

        this.findNode = this.findNode.bind(this);

        this.buildBreadcrumbData = this.buildBreadcrumbData.bind(this);
    }


    componentDidMount()
    {
        const {titleNodes, leftNodes, menuPaths } = this.props;
        let nextPath = this.props.frameLocation.pathname && this.props.frameLocation.pathname.slice(6).split(',')
        let data = this.buildBreadcrumbData(titleNodes, leftNodes, menuPaths || nextPath);

        this.setState({ data:data });
    }

    formatPath = (leftNodes, currentPaths) => {
        let arr = []
        leftNodes.forEach(item=>{
            if(item.name === currentPaths[0]) arr.push(item.name)
            if(item.subcomponents){
                item.subcomponents.forEach(i=>{
                    if(i.name === currentPaths[0]){
                        arr.push(item.name)
                        arr.push(i.name)
                    }
                })
            }
        })
        return arr;
    }

    componentWillReceiveProps( nextProps )
    {
        let nextPath = nextProps.frameLocation.pathname && nextProps.frameLocation.pathname.slice(6).split(',')
        let subPaths = nextProps.menuPaths.length > 0 ? nextProps.menuPaths : this.formatPath(nextProps.leftNodes, nextPath)
        // if( nextProps.menuPaths !==undefined )
        if( subPaths.length > 0 )
        {
            let data = this.buildBreadcrumbData(nextProps.titleNodes, nextProps.leftNodes, subPaths);

            this.setState({
                titleNodes: nextProps.titleNodes,
                leftNodes: nextProps.leftNodes,
                menuPaths: subPaths,
                data:data
            });
        }
    }

    /**
     * 创建面包屑数据
     * @param {*} titleNodes 
     * @param {*} leftNodes 
     * @param {*} menuPaths 
     */
    buildBreadcrumbData( titleNodes, leftNodes, menuPaths )
    {
        // 查找顶部菜单节点
        let data = [];
        
        if( menuPaths!==undefined && menuPaths.length>0 )
        {
            for( let menuPath of menuPaths )
            {
                let node = null;

                if( titleNodes!==undefined && titleNodes.length>0 )
                {
                    node = this.findNode(menuPath, titleNodes);

                    if( node!==undefined && node!==null )
                    {
                        data.push(node);

                        continue;
                    }
                }

                if( leftNodes!==undefined && leftNodes.length>0 )
                {
                    node = this.findNode(menuPath, leftNodes);

                    if( node!==undefined && node!==null )
                    {
                        data.push(node);
                        continue;
                    }
                }
            }   
        }

        return data;
    }


    /**
     * 查找菜单路径的节点
     * @param {*} menuPath 
     * @param {*} nodes 
     * @returns 
     */
    findNode( menuPath,  nodes )
    {
        if( nodes!==undefined && nodes.length>0 && menuPath!==undefined )
        {
            for( let node of nodes )
            {
                if( menuPath===node.name )
                {
                    return node;
                }

                if( node.subcomponents!==undefined &&  node.subcomponents.length>0 )
                {
                    let retNode = this.findNode(menuPath, node.subcomponents);

                    if( retNode!==undefined && retNode!==null )
                    {
                        return retNode;
                    }
                }
            }
        }

        return null;
    }

    render()
    {
        const { data } = this.state;

        return (
            <div className="sf-breadcrumb sd-breadcrumb sg-breadcrumb" >
                <Breadcrumb separator=">">
                { data.length > 0 && 
                    <div className="sf-breadcrumb-img sd-breadcrumb-img sg-breadcrumb-img">
                        <img src={require('../img/frame/breadcrumb/breadcrumb.png')} style={{marginRight: '6px'}} alt=""/>
                    </div>}
                {
                    data.map((item, index) => {
                        if( item.path!==undefined )
                        {
                            return (
                                <Breadcrumb.Item key={item.path} >
                                    <Link to={{pathname:item.path, state:{node:item, item:item}}}>{item.title}</Link>
                                </Breadcrumb.Item>
                            )
                        }
                        else
                        {
                            return (
                                <Breadcrumb.Item key={item.path} >
                                   {item.title}
                                </Breadcrumb.Item>
                            )
                        }
                       
                    })
                }
                </Breadcrumb>
            </div>
        )
       
    }  
}

export default FrameBreadcrumb