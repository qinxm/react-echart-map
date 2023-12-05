// WidgetTreeTable.js
import React from 'react';
import { Table, Button, Icon, Checkbox } from 'rsuite';
import moment from 'moment';

import '../css/widget/widget.tree.table.css'
import 'rsuite/dist/styles/rsuite-default.css';

const { Column, HeaderCell, Cell } = Table;

class WidgetTreeTable extends React.Component
{    
    constructor( props )
    {
        super(props);

        const columnWidth =  this.buildColumnWidth(this.props.options, this.props.columns);

        this.state = {
               data : this.props.data,
            columns : this.props.columns,
            options : this.props.options,
               page : 1,
            records : this.props.options.records!==undefined ? this.props.options.records : 10, 
        columnWidth : columnWidth,
        componentHeight : this.props.height,
        checkedKeys : []    
        }

        this.onOperate = this.onOperate.bind(this);
        
        this.openData = this.openData.bind(this);
        this.buildData = this.buildData.bind(this);
        this.buildColumn = this.buildColumn.bind(this);
        
        this.handleCheck = this.handleCheck.bind(this);
        this.handleCheckAll = this.handleCheckAll.bind(this);

        this.buildColumnWidth = this.buildColumnWidth.bind(this);    
        this.buildTableHeight = this.buildTableHeight.bind(this);    
        
        // 获取组件自身
        this.myRef = React.createRef();
    }

    /**
     * 操作回调函数
     * @param {*} type 
     * @param {*} data 
     * @param {*} value 
     * @returns 
     */
    onOperate(type, data, value, event)
    {
        if( this.props.notify!==undefined )
        {
            return this.props.notify(type, data, value, event);
        }
    }

    /**
     * 表格多选框选择
     * @param {*} value 
     * @param {*} checked 
     */
    handleCheck(value, checked)
    {
        const { options } = this.props;
        const { checkedKeys, allData } = this.state;
        const nextCheckedKeys = checked ? [...checkedKeys, value] : checkedKeys.filter(item => item !== value);

        if( this.props.onCheck!==undefined && this.props.onCheck!==null )
        {
            let checkData = [];

            for( let checkedKey of nextCheckedKeys )
            {
                for( let item of allData )
                {
                    if( item[options.rowKey]===checkedKey )
                    {
                        checkData.push(item);
                        break;
                    }
                }
            }

            this.props.onCheck(checkData);
        }

        this.setState({ checkedKeys: nextCheckedKeys});
    }

    /**
     * 表格多选框全选择
     * @param {*} value 
     * @param {*} checked 
     */
    handleCheckAll( value, checked) 
    {
        const { options } = this.props;

        const { allData } = this.state;

        const checkedKeys = checked ? allData.map(item => item[options.rowKey]) : [];
        
        if( this.props.onCheck!==undefined && this.props.onCheck!==null )
        {
            this.props.onCheck(allData);             
        }

        this.setState({checkedKeys});
    }

    /**
     * 创建表格列
     * @param {*} columns 
     * @param {*} options 
     * @returns 
     */
    buildColumn(columns, options)
    {
        let tableColumns = [];

        if( options.check!==undefined && options.check!==null )
        {
            tableColumns.push({"name":options.check.name, "title":"", "type":"string", "properties":{"width":5, check:{name:""}}});
        }

        tableColumns.push(...columns);

        return tableColumns;
    }

    /**
     * 创建表格数据
     * @param {*} data 
     * @param {*} options 
     * @returns 
     */
    buildData(data, options)
    {
        if( data!==undefined && data.length>0 )
        {
            let allData =  this.openData(data);

            this.state["allData"] = allData;

        }

        return data;
    }

    /**
     * 平铺所有数据
     * @param {*} data 
     * @returns 
     */
    openData( data )
    {
        let allData = [];

        if( data!==undefined && data!==null )
        {
            for( let item of data )
            {
                if( item.children!==undefined && item.children!==null )
                {
                    let children = this.openData(item.children);

                    allData.push(...children);
                }

                allData.push(item);
            }
        }
        
        return allData;  
    }

    /**
     * 计算列宽度
     * @param {*} options 
     * @param {*} columns 
     * @returns 
     */
    buildColumnWidth(options, columns)
    {       
        let contentWidth= 100 , useWidth=0 , columnCount = 0, columnWidth = 0;

        if( options!==undefined && options.check!==undefined && options.check===true )
        {
            contentWidth = contentWidth - 3;
        }

        if( options!==undefined && options.isSerial!==undefined && options.isSerial===true )
        {
            contentWidth = contentWidth - 8;
        }
        
        if( columns!==undefined )
        {
            for( var i in columns )
            {
                if( columns[i].properties===undefined || 
                    ( columns[i].properties!==undefined && (columns[i].properties.hasOwnProperty("hidden")===false || columns[i].properties.hidden===false)) )
                {
                    if( columns[i].properties!==undefined && columns[i].properties.width!==undefined )
                    {
                        useWidth += parseFloat(columns[i].properties.width);
                    }
                    else
                    {
                        columnCount = columnCount + 1;
                    }
                }
            }
    
            columnWidth = (contentWidth-useWidth) / columnCount ;  
        }   
        
        return columnWidth;
    }

    /**
     * 计算表格高度
     * @param {*} data 
     * @returns 
     */
    buildTableHeight( data )
    {
        let tableHeight = 40;

        if( data!==undefined && data.length>0 )
        {
            tableHeight += data.length * 46;
        }
        else
        {
            tableHeight += 46;
        }
        
        return tableHeight;
    }

    /**
     * 组件渲染之后再调用页面方法
     */
    componentDidMount()
    {
        this.updateRect();
    }
 
    componentDidUpdate()
    {
        this.updateRect();
    }

    updateRect()
    {
        if( this.myRef!==undefined )
        {
            if( this.myRef.current!==null )
            {
                const height = this.myRef.current.parentElement.clientHeight;
                const width = this.myRef.current.parentElement.clientWidth;

                if (this.state.componentWidth !== width || this.state.componentHeight !== height)
                {
                    this.setState({componentWidth:width, componentHeight:height});
                }
            }   
        }
    }

    render()
    {
        let { componentWidth, componentHeight, checkedKeys } = this.state, checked = false, indeterminate = false, defaultExpandAllRows = false;

        let { data, columns, options, width, height, checkData } = this.props;

        columns = this.buildColumn(columns, options);

        data = this.buildData(data, options);

        if( options.reverse!==undefined && options.reverse===true)
        {
            data.reverse();
        }

        if( options.defaultExpandAllRows!==undefined && options.defaultExpandAllRows!==null )
        {
            defaultExpandAllRows = options.defaultExpandAllRows;
        }

        if( checkData!==undefined && checkData.length>0 )
        {
            this.state["checkedKeys"] = checkData;
            checkedKeys = checkData;
        }
    
        if( width!==undefined && width!==0 )
        {
            componentWidth = width;
        }

        if( height!==undefined && height!==0 )
        {
            componentHeight = height;
        }

        let tableHeight = componentHeight -  34;

        const columnWidth =  this.buildColumnWidth(options, columns);

        if( data!==undefined && data!==null )
        {
            let isFirstColumn = true;

            if( checkedKeys.length === data.length ) 
            {
                checked = true;
            } 
            else if( checkedKeys.length===0 ) 
            {
                checked = false;
            } 
            else if( checkedKeys.length>0 && checkedKeys.length<data.length ) 
            {
                indeterminate = true;
            }

            if( data.length>0 && columns!==undefined && columns.length>0 )
            {
                return (
                    <div ref={this.myRef} className="widget-tree-table" >
                        <Table
                            isTree
                            readDepartmentLeader
                            defaultExpandAllRows = {defaultExpandAllRows}
                            rowKey={options.rowKey}
                            height={tableHeight}
                            data={data}
                            rowClassName="tree-table-row"
                            renderTreeToggle={(icon, rowData) => {
                                if (rowData && rowData.children && rowData.children.length === 0) 
                                {
                                    return <Icon icon="spinner" spin />;
                                }
                                return icon;
                            }}
                        >
                        {
                            columns.map(( item, index ) =>
                            {
                                let width = columnWidth;
                                let hidden = false;
        
                                if( item.properties!==undefined )
                                { 
                                    if( item.properties.width!==undefined )
                                    {
                                        width = parseFloat(item.properties.width);
                                    } 

                                    if( item.properties.hasOwnProperty("hidden")===true && item.properties.hidden===true )
                                    {
                                        width = 0;
                                    }
                                    
                                    hidden = item.properties.hidden;
                                }

                                if( hidden===undefined || hidden===false )
                                {
                                    let columnWidth = componentWidth * width / 100;

                                    if( item.properties.hasOwnProperty("check")===true )
                                    {
                                        return (
                                            <Column width={columnWidth} align="left" fixed key={index}>
                                                <HeaderCell>
                                                    <div style={{ lineHeight: '40px' }}>
                                                        <Checkbox
                                                            inline
                                                            checked={checked}
                                                            indeterminate={indeterminate}
                                                            onChange={this.handleCheckAll}
                                                        />
                                                        {item.title}
                                                    </div>
                                                </HeaderCell>
                                                <CheckCell dataKey={item.name} checkedKeys={checkedKeys} properties={item.properties} onChange={this.handleCheck} ></CheckCell>
                                            </Column>
                                        )
                                    }
                                    else
                                    {
                                        if( isFirstColumn )
                                        {
                                            isFirstColumn = false;
                                            return ( 
                                                <Column width={ columnWidth } align="left" fixed key={index}>
                                                    <HeaderCell>{item.title}</HeaderCell>
                                                    <TableCell dataKey={item.name} properties={item.properties} onChange={this.onOperate}></TableCell>
                                                </Column>
                                            )
                                        }
                                        else
                                        {
                                            return ( 
                                                <Column width={ columnWidth } align="center" fixed key={index}>
                                                    <HeaderCell>{item.title}</HeaderCell>
                                                    <TableCell dataKey={item.name} properties={item.properties} onChange={this.onOperate}></TableCell>
                                                </Column>
                                            )
                                        }
                                    }
                                }
                                else
                                {
                                    return "";
                                } 
                            })
                        }
                        </Table>
                    </div>
                )
            }
            else
            {
                return <div style={{textAlign: 'center', paddingTop: '50px'}} className="no-data">暂无数据！</div>
            } 
        }
        else
        {
            return (
                <div ref={this.myRef} className="widget-table" style={{position:'relative'}}>
                    <img className="load" src={require('./../img/frame/loading.gif')} alt="es-lint want to get"/> 
                </div>
            );
        } 
    }
}

export default WidgetTreeTable

export const TableCell = ({ rowData, dataKey, properties, onChange, ...props }) => 
{
    if( properties!==undefined  )
    {
        return (
            <Cell {...props} >
            {
                () => {
                    let value = rowData[dataKey];

                    if( properties.format!==undefined )
                    {
                        value = moment(value.time).format(properties.format);
                    }

                    if( properties.transform!==undefined )
                    {
                        if( properties.click!==undefined )
                        {
                            return (
                                <Transform >
                                    <Button appearance='link' onClick={ (e) => {onChange(properties.click, JSON.stringify(rowData), value, e)}} >{value}</Button>
                                </Transform>
                            );
                           
                        }
                        else if( properties.operations!==undefined )
                        {
                            return (
                                <div className="operations">
                                    <Transform onChange={onChange} properties={properties} dataKey={dataKey} rowData={rowData}>
                                    {
                                        properties.operations.map((item, index) => 
                                        {
                                            return (
                                                <Button appearance='link' onClick={(e) => { onChange(item.click, JSON.stringify(rowData), value, e) } } key={index}>{item.name}</Button>
                                            )
                                        })
                                    }
                                    </Transform>
                                </div>
                            )
                        }
                        else
                        {
                            value = onChange("transform", rowData, value);

                            return (<span>{ value }</span> );
                        }   
                    }
                    else 
                    {   
                        // console.log(value)
                        if( properties.click!==undefined )
                        {
                            return <Button appearance='link' onClick={ ( e ) => {onChange(properties.click, JSON.stringify(rowData), value, e)}} >{value}</Button>
                            
                        }
                        else if( properties.operations!==undefined )
                        {
                            return (
                                <div className="operations">
                                {
                                    properties.operations.map((item, index) => 
                                    {
                                        // 
                                        return (
                                            <Button appearance='link' onClick={(e) => {  onChange(item.click, rowData, value, e)} } key={index}>{item.name}</Button>
                                        )
                                    })
                                }
                                </div>
                            )
                        }
                        else
                        {
                            return ( <span>{value}</span> );
                        }
                    }
                }
            }
            </Cell>
        );
    }
    else
    {
        return (
            <Cell {...props} dataKey={dataKey}>
                <span>{rowData[dataKey]}</span>
            </Cell>
        );
    } 
}

/**
 * 多选框
 * @param {*} param0 
 * @returns 
 */
export const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => 
{
    const { properties } = props;

    const { check } = properties; 

    if( check.name!==undefined )
    {
        return (
            <Cell {...props} style={{ padding: 0 }}>
                <div style={{ lineHeight: '46px' }}>
                <Checkbox
                    value={rowData[dataKey]}
                    inline
                    onChange={onChange}
                    checked={checkedKeys.some(item => item === rowData[dataKey])}
                />
                {check.name}
                </div>
            </Cell>
        )
    }
    else
    {
        return (
            <Cell {...props} style={{ padding: 0 }}>
                <div style={{ lineHeight: '46px' }}>
                <Checkbox
                    value={rowData[dataKey]}
                    inline
                    onChange={onChange}
                    checked={checkedKeys.some(item => item === rowData[dataKey])}
                />
                </div>
            </Cell>
        )
    }
}

export const Transform = ({ rowData, dataKey, properties, onChange, ...props }) => 
{
    if( onChange!==undefined )
    {
        return onChange("transform", rowData, props.children)
    }
    else
    {
        return props.children;
    }
}
