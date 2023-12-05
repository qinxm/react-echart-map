// WidgetTreePicker.js
import React from 'react';
import { CheckTreePicker , TreePicker, ButtonToolbar, Button, Icon} from 'rsuite';

import 'rsuite/dist/styles/rsuite-default.css';
import '../css/widget/widget.tree.css'

class WidgetTreePicker extends React.Component
{ 
    constructor(props)
    {
        super();

        this.state = {
            options : props.options,
            loadingValues : [],
            isAsyncData : false,
            values : props.defaultValues!==undefined ? props.defaultValues : [],
            checkValues : props.defaultValues!==undefined ? props.defaultValues : [],
        }

        // 获取组件自身
        this.myRef = React.createRef();

        this.onSelect = this.onSelect.bind(this);
        this.onClean = this.onClean.bind(this);
        this.onClose = this.onClose.bind(this);

        this.clear = this.clear.bind(this);
        this.checkAll = this.checkAll.bind(this);
        this.cancle = this.cancle.bind(this);   
        this.confirm = this.confirm.bind(this); 

        this.buildData = this.buildData.bind(this);
        this.getChildren = this.getChildren.bind(this);
        this.renderTreeIcon = this.renderTreeIcon.bind(this);
        this.handleOnExpand = this.handleOnExpand.bind(this);
    }

    /** 
     * 清空 
     */
    clear()
    {
        this.setState({values:[], fromState:true})
    }

    /** 
     * 全选 
     */
    checkAll()
    {
        let values = [];

        for(var i in this.props.data)
        {
            values.push(this.props.data[i].value)
        }

        this.setState({values:values, fromState:true});  
    }

    /** 
     * 清除 
     */
    onClean()
    {
        this.setState({values:[], fromState:true});

        if( this.props.onSelect!==undefined )
        {
            this.props.onSelect([]);
        }
    }

     /** 
      * 点击控制之外关闭控件 
      */
    onClose()
    {
        const { checkValues } = this.state;

        // this.setState({values:checkValues, fromState:true});
    }

    /**
     * 选择
     * @param {*} item 
     * @param {*} selectValues 
     * @param {*} event 
     */
    onSelect(item, selectValues, event)
    {
        const { options } = this.state;

        let { values } = this.state;

        if( options.type!=="check" )
        {
            values = [];

            values.push(selectValues);

            this.setState({values:values});

            if( this.props.onSelect!==undefined )
            {
                this.props.onSelect(values);
            }
        }
        else
        {
            this.setState({values:selectValues, fromState:true});
        }
    }

    /**
     * 确定
     */
    confirm()
    {
         // 关闭控件
        this.myRef.current.close();

        const { values } = this.state;

        this.setState({checkValues:values, fromState:true});

        if( this.props.onSelect!==undefined )
        {
            this.props.onSelect(values);
        }
    }

    /**
     * 取消
     */
    cancle()
    {
        // 关闭控件
        this.myRef.current.close();

        const { checkValues } = this.state;

        this.setState({values:checkValues, fromState:true});
    }

    /**
     * 展开处理函数
     * @param {*} expandItemValues 
     * @param {*} activeNode 
     * @param {*} concat 
     */
    handleOnExpand(expandItemValues, activeNode, concat)
    {
        const { treeData, loadingValues } = this.state;

        if (activeNode.children.length === 0) 
        {            
            if ( !loadingValues.includes(activeNode.value)) 
            {
                this.setState({
                    loadingValues: [...loadingValues, activeNode.value]
                });
            }

            this.getChildren(activeNode).then(response => {
                const { activeNode: node, children } = response;

                this.setState(prevState => {
                    return {
                        treeData: concat(treeData, children),
                        loadingValues: prevState.loadingValues.filter(value => value !== node.value),
                        isAsyncData : true
                    };
                });
            });
        }
    }

    getChildren(activeNode) 
    {
        return new Promise(resolve => 
        {
            const { data } = this.props;

            setTimeout(() => {
                let treeData = this.buildData(data, activeNode)
                resolve({
                    activeNode,
                    children:treeData
                });
            }, 100);
        });
    }

    renderTreeIcon(node, expandIcon) 
    {
        const { loadingValues } = this.state;

        if ( loadingValues.includes(node.value) ) 
        {
            return <Icon style={{ verticalAlign: 'middle' }} icon="spinner" spin />;
        }

        return null;
    }


    /**
     * 根据父节点创建树形结构数据
     * @param {*} parentNode 
     */
    buildData(data, parentNode)
    {
        let treeData = [];

        if( parentNode!==undefined && parentNode!==null )
        {
            for( let i=0; i<data.length; i++ )
            {   
                if( data[i].value===parentNode.value )
                {
                    if( data[i].children!==undefined )
                    {
                        treeData = this.buildData( data[i].children, undefined );
                    }
                }
                else
                {
                    if( data[i].children!==undefined )
                    {
                        treeData = this.buildData(data[i].children, parentNode);
                    }
                }

                if( treeData.length>0 )
                {
                    return treeData;
                }
            }
        }
        else
        {
            for( let i=0; i<data.length; i++)
            {
                let item = {...data[i]};

                if( item.children!==undefined )
                {
                    item.children = [];
                }

                treeData.push(item);
            }
        }

        return treeData;
    }

    componentWillReceiveProps( nextProps )
    {
        let { values, fromState} = this.state;

        if( nextProps.defaultValues!==values && fromState!==true )
        {  
            let newValues = [];

            if( nextProps.defaultValues!==undefined )
            {
                newValues = [...nextProps.defaultValues];
            }
            this.setState({values:newValues});
        }
    }

    render()
    {
        let { data,pageWidth,basic } = this.props;

        let { treeData, isAsyncData} = this.state;

        if( isAsyncData!==true && data!==undefined && data.length>0 )
        {
                treeData = this.buildData(data, undefined);

                this.state["treeData"] = treeData;
            
        }

        const { type, title } =  this.props.options;

        let { values, fromState} = this.state;

        let  placeholder = ( title!==undefined ? title : "" );
  
        if( fromState!==true && this.props.defaultValues!==undefined && this.props.defaultValues!==null )
        {
            values = [];
            values.push(...this.props.defaultValues);
        }

        this.state["fromState"] = false;
        
        if( type==="check" )
        {
            return (                
                <div className="widget-tree-picker" >
                    <CheckTreePicker menuClassName={"widget-tree-picker"} cleanable={false} ref={this.myRef} 
                        data={treeData} value={values} defaultExpandAll={false} placeholder={placeholder} 
                        onClean={this.onClean} onSelect={this.onSelect} onClose={this.onClose} 
                        onExpand={this.handleOnExpand}
                        renderTreeIcon={this.renderTreeIcon}
                        style={{ width: 224 }} 
                        renderExtraFooter={
                        () => {
                            return (
                                <div style={{padding : 5}}>
                                    <ButtonToolbar>
                                        <Button onClick={this.clear} appearance="default">清空</Button>
                                        <Button onClick={this.checkAll} appearance="default">全选</Button>
                                        <Button onClick={this.cancle} appearance="default">取消</Button>
                                        <Button onClick={this.confirm} appearance="primary">确认</Button>
                                    </ButtonToolbar>
                                </div>
                            )
                        }
                    }/>
                </div>
            )  
        }
        else
        {
            let value = Array.isArray(values) ? values[0] : values;
            return (
                <div className="widget-tree-picker">

                    {this.props.flag?
                        <TreePicker menuClassName={"widget-tree-picker"} ref={this.myRef} 
                        data={treeData} value={value} defaultExpandAll={false} placeholder={placeholder} 
                        onClean={this.onClean} onSelect={this.onSelect} onClose={this.confirm} 
                        onExpand={this.handleOnExpand}
                        disabled
                        renderTreeIcon={this.renderTreeIcon}
                        style={this.props.widths?{width: "493px"}:{ width: "360px"}} />
                    :
                        <TreePicker menuClassName={"widget-tree-picker"} ref={this.myRef} 
                        data={treeData} value={value} defaultExpandAll={false} placeholder={placeholder} 
                        onClean={this.onClean} onSelect={this.onSelect} onClose={this.confirm} 
                        onExpand={this.handleOnExpand}
                        renderTreeIcon={this.renderTreeIcon}
                        style={this.props.widths?{width: "493px"}:pageWidth?{width: pageWidth}:basic?{width:"360px"}:{ width: "340px" }} />
                    }
                   
                </div>
            )  
        } 
    }

}

export default WidgetTreePicker
