// WidgetTable.js
import React from "react";
import { Table, Space, Tooltip, InputNumber, Input, Form} from "antd";
import moment from 'moment';
import "antd/dist/antd.css";
import "../css/widget/widget.table.css";
import "../css/frame.css";
import Icon from "@ant-design/icons/lib/components/Icon";
import ResizeObserver from "resize-observer-polyfill";
import WidgetMessage from "./WidgetMessage";
let myObserver = null
// const filterIcon = <img onClick={this.editClick} src={require('../img/frame/add_btn_line.svg')} />

class WidgetTable extends React.Component {

    constructor( props )
    {
        super(props);

        this.state = {
            data: undefined,
            columns:[],
            options:props.options,
            pagination: {
              current: props.page || 1,
              pageSize: props.options.records || 10,
              hideOnSinglePage: true,
                showSizeChanger: props.options.showSizeChanger === false ? false : true
            },
            loading: true,
            rowSelection:undefined,
            selectedRowKeys: props.selectedRowKeys ? props.selectedRowKeys : [],
            rowKey:undefined,
            locale:{
                selectionAll:"全选",
                selectInvert:"反选",
                selectNone:"清空"
            },
            // width:1500,
            // scroll:{
            //     x:1500
            // },
            editingKey: '',
            bordered: props.bordered === false ? false : true,
            expandedRowKeys: [],
        };

        // 获取组件自身
        this.myRef = React.createRef();

        this.buildColumns = this.buildColumns.bind(this);
        this.buildData = this.buildData.bind(this);
    }


    /**
     * 表格操作回调函数
     * @param {JSON} pagination 
     * @param {JSON} filters 
     * @param {JSON} sorter 
     * @param {JSON} event 
     */
     onChange = async (pagination, filters, sorter, event) => {
       
        if( event.action==="paginate" )
        {
            if( this.props.pageTurning!==undefined ) 
            {
                // this.props.pageTurning(pagination.current,pagination.pageSize,pagination);
                this.props.pageTurning(pagination);
            }

            await this.setState({pagination});
        }
        else if( event.action==="sort" )
        {
            if( this.props.notify!==undefined ) 
            {
                this.props.notify("sort", sorter);
            }
        }
        else if( event.action==="filter" )
        {
            if( this.props.notify!==undefined ) 
            {
                this.props.notify("filter", filters);
            }
        }
    }

    /**
     * 表格事件处理
     * @param {string} type 
     * @param {JSON} data 
     * @param {string} value 
     * @param {string} index 
     * @param {JSON} event 
     * @returns 
     */
    notify = (type, data, value, index, event) => {
        
        if( type==="paginate" )
        {
            if( this.props.pageTurning!==undefined ) 
            {
                this.props.pageTurning(data);
            }

            this.setState({pagination: data});
        }
        else 
        {
            if( this.props.notify!==undefined )
            {
                return this.props.notify(type, data, value, index, event, this.notify);
            }
        }
    }

    /**
     * 表格选择
     * @param {*} rowKeys 
     * @param {*} selectedRows 
     */
    onSelectChange = (selectedRowKeys, selectedRows) => {
              
        if( this.props.notify!==undefined )
        {
            this.props.notify("check", selectedRowKeys, selectedRows);
        }
        console.log(selectedRows,123);
        this.setState({selectedRowKeys:selectedRowKeys,selectedRows});
    };

    editClick = (record) => () => {
        let tableColumns = this.buildColumns();
        this.setState({editingKey: record.key, columns: tableColumns})
        
        // return record.isEdit = true
    }

    onEditChange = (type, data, value, event) => {
        console.log(type, data, value, event)
    }

    isEditing = (record) => {
        return record.key === this.state.editingKey
    }

    // 复制
    copyText = (val) => () => {
        navigator.clipboard.writeText(val);
        WidgetMessage.success('已复制到剪贴板');
    }

    /**
     * 创建表格列
     * @returns 
     */
    buildColumns()
    {
        let tableColumns = [];

        let { selectedRowKeys, options } = this.state;

        let { columns, fixedLeft = [] } = this.props;

        if( options.check!==undefined && options.check!==null && options.check.enable===true ) 
        {
            const rowSelection = {
                width: 80,
                selectedRowKeys,
                onChange: this.onSelectChange,
                selections: [
                    Table.SELECTION_ALL,
                    Table.SELECTION_INVERT,
                    Table.SELECTION_NONE
                ]
            };

            this.setState({rowSelection:rowSelection, rowKey: options.check.key});
        }

        if( options.isSerial!==false ) 
        {
            tableColumns.push({
                dataIndex: "serial",
                title: options.title?options.title:"序号",
                type: "integer",
                className:"table-serial",
                align:'center',
                width:80,
                fixed: 'left'
            });
        }

        for( let column of columns)
        {
            if( column.properties!==undefined && column.properties.hidden===true )
            {
                continue;
            }

            let tableColumn = {
                dataIndex : column.name,
                title : column.title,
                width: column.properties && column.properties.width || 150,
            };
            if(fixedLeft.includes(column.name)){
                tableColumn = {
                    ...tableColumn,
                    fixed: 'left'
                }
            }
            if(column.title === '操作') {
                tableColumn = {
                    ...tableColumn,
                    fixed: 'right'
                }
            }
            if(column.title.indexOf('时间') != -1 || column.title.indexOf('日期') != -1){
                tableColumn = {
                    ...tableColumn,
                    width: 200,
                }
            }
            if(column.render) {
                tableColumn['render']=column.render
            }

            if(column.properties && column.properties.showTitle === false) {
                tableColumn = {
                    ...tableColumn,
                    ellipsis: {
                        showTitle: false,
                    },
                    render: (address) => (
                        <Tooltip title={address} placement="topLeft">
                            {address}
                        </Tooltip>
                    ),
                }
            }

            if(column.properties && column.properties.width)
            {
                tableColumn["width"] =column.properties.width
            }

            if( column.properties!==undefined )
            {

                tableColumn = {...tableColumn, ...column.properties};

                // 固定列
                if( column.properties.fixed!==undefined )
                {
                    tableColumn["fixed"] = column.properties.fixed;
                }

                // 列样式
                if( column.properties.className!==undefined )
                {
                    tableColumn["className"] = column.properties.className;
                }

                // 排序
                if( column.properties.sorter!==undefined )
                {
                    tableColumn["sorter"] = column.properties.sorter;
                }
               
                // 可编辑
                if( column.properties.editable!==undefined )
                {
                    tableColumn["editable"] = column.properties.editable;
                    // tableColumn['filterDropdown'] = true
                    // tableColumn['filterIcon'] = <img className="sf-edit-icon" onClick={this.editClick} src={require('../css/widget/img/edit.png')} />
                    tableColumn["render"] = (text, record, index) => {
                        const isEdit = this.isEditing(record);
                        return <div className="sf-edit-cell">
                             
                            {
                                isEdit ? <Input defaultValue={text} onChange={(e) => {this.onEditChange("editing", JSON.stringify(record), e.target.value, { event:e})}}  /> : <span>{text}</span>
                            }
                            <p>
                                {
                                    isEdit ? <>
                                    <img src={require('../css/widget/img/save.png')} />
                                    <img src={require('../css/widget/img/cancel.png')} />
                                </> : <img className="sf-edit-icon" onClick={this.editClick(record)} src={require('../css/widget/img/edit.png')} />
                                }
                            </p>
                        </div>
                    }
                    // tableColumn["onHeaderCell"] = (column) => {
                    //     console.log(column, 11111)
                    //     // return <div ><span>{column.title}</span> <img src={require('../img/frame/add_btn_line.svg')} /></div>
                    //     // this.edit(column, "HeaderCell-edit", column.name);
                    //     tableColumn["render"] = (text, record) => {
                            
                    //         console.log(text, record,2222222)
                    //         return <div ><span>{column.title}</span> <img src={require('../img/frame/add_btn_line.svg')} /></div>
                    //     }
                    // };

                    // tableColumn["onCell"] = (column) => {
                        
                    //     // this.edit(column, "cell-edit", column.name);
                    // };

                    

                }

                if( column.properties.ellipsis )
                {
                    tableColumn["render"] = (text, record) => {
                        return (
                            <span title={text}>
                                {text}
                            </span>
                        )
                    }
                }

                // 显示提示
                if( column.properties.showTips!==undefined )
                {
                    tableColumn["render"] = (text, record) => {
                        return (
                            <Tooltip placement="topLeft" title={text}>
                                {text}
                            </Tooltip>
                        )
                    }
                }

                // 点击
                if( column.properties.click!==undefined )
                {
                    if(column.title === '标识' || column.title === '名称' ){
                        tableColumn["render"] = (text, record, index) => {
                            return <div className="sf-page-tool-between sg-copy">
                                {
                                    column.properties && column.properties.showTitle === false ? <Tooltip title={text}>
                                        <a className={column.properties && column.properties.showTitle === false ? 'ant-table-cell-ellipsis' : ''} key={index} onClick={()=>{this.notify( column.properties.click, record, text)}}>{text}</a>
                                    </Tooltip> : <a key={index} onClick={()=>{this.notify( column.properties.click, record, text)}}>{text}</a>
                                }
                                <span onClick={this.copyText(text)}>复制</span>
                            </div>
                        };
                    }else{
                        tableColumn["render"] = (text, record, index) => {
                            return  <a className={column.properties && column.properties.showTitle === false ? 'ant-table-cell-ellipsis' : ''} key={index} onClick={()=>{this.notify( column.properties.click, record, text)}}>{text}</a>
                        };
                    }
                }else{
                    if(column.title === '标识' || column.title === '名称' ){
                        tableColumn["render"] = (text, record, index) => {
                            return <div className="sf-page-tool-between sg-copy">
                                {
                                    column.properties && column.properties.showTitle === false ? <Tooltip title={text}>
                                        <span className={column.properties && column.properties.showTitle === false ? 'ant-table-cell-ellipsis' : ''} key={index}>{text}</span>
                                    </Tooltip> : <span  key={index}>{text}</span>
                                }
                                <span onClick={this.copyText(text)}>复制</span>
                            </div>
                        };
                    }
                }
               

                // if( column.properties.format!==undefined )
                // {
                //     tableColumn['render'] = (text, record, index) => {
                //         let vals = Object.values(record);
                //         let value = vals.filter(item=>{if(item && item.time) return item})
                //         let val  = value && value[0] && moment(value[0].time).format(column.properties.format);
                //         return <span>{val}</span>
                //     }
                // }

                // 操作
                if( column.properties.operations!==undefined &&  column.properties.operations.length>0 )
                {
                    tableColumn["render"] = ( text, record ) => {
                        if( column.properties.transform!==undefined )
                        {
                            return this.notify(column.properties.transform, record, text, undefined, column.properties.operations);
                            // return <Space size="middle">
                            //     {
                            //         column.properties.operations.map((item, index) => {
                            //             this.notify(column.properties.transform, record, text, undefined, column.properties.operations);
                            //             return <a key={index} onClick={()=>{ this.notify(item.click, record, text, undefined)}}>{item.name}</a>
                            //         })
                            //     }
                            //  </Space>
                        }
                        else
                        {
                            return (
                                <Space size="middle">
                                {
                                    column.properties.operations.map((item, index) => {
                                        if(item.img && item.img === item.click) {
                                            return <a key={index} onClick={()=>{this.notify( item.click, record, text)}}>
                                                <Tooltip title={item.name}><img src={require(`../img/table/${item.click}.svg`)} /></Tooltip>
                                            </a> 
                                        }
                                        return <a key={index} onClick={()=>{this.notify( item.click, record, text)}}>{item.name}</a>
                                    })
                                }
                                </Space>
                            )
                        }
                    }
                }
                else if( column.properties.transform!==undefined )
                {
                    tableColumn["render"] = ( text, record ) => {
                        return this.notify(column.properties.transform, record, text)
                    }
                   
                }
            }

            
            tableColumns.push(tableColumn);
        }

        return tableColumns;
    }

    /**
     * 创建数据
     */
    buildData( data, pagination)
    {
        const { options,width} = this.state;

        let tableData = [];

        
        if( options!==undefined )
        {
            for( let i=0; i<data.length; i++ )
            {
                let item = data[i];
                if( options.isSerial!==false && data!==undefined && data.length>0 )
                {
                    item["serial"] = ( pagination.current - 1 ) * pagination.pageSize + 1 + i;
                }

                if( options.check && options.check.enable  )
                {
                    item["key"] = item[options.check.key] 
                }
                tableData.push(item);
            }
        }
         
        if( tableData.length>0 )
        {
            return tableData;
        }
        else
        {
            return data;
        }
    }

    updateRect()
    {
        const {bordered} = this.state;
        if( this.myRef!==undefined )
        {
            if( this.myRef.current!==null )
            {
                const width = bordered ? this.myRef.current.clientWidth - 2 : this.myRef.current.clientWidth;
              

                if( this.state.width!==width )
                {
                    this.setState({width:width, scroll:{x:width}});
                }
                
            }   
        }
    }

    componentWillReceiveProps( nextProps )
    {
        const { page, total, selectedRowKeys, options={}, columns} = nextProps;

        let { loading, pagination } = this.state;

        pagination["current"] = page && page.current && page.current ||  page || 1;
        pagination['pageSize'] = options.records || 10;

        let column = this.buildColumns();
        let data = this.buildData(nextProps.data, pagination);

        if( data!==undefined )
        {
            loading = false;
        }
        
        this.setState({data:data, columns: column, total:total, pagination:pagination, loading:loading, selectedRowKeys:selectedRowKeys});
    }

    componentDidMount()
    {
        let { loading, pagination } = this.state;

        let { data, total } = this.props;

        let tableColumns = this.buildColumns();

        data = this.buildData(data, pagination);

        if( data!==undefined )
        {
            loading = false;
        }
        
        this.setState({data:data, total:total, pagination:pagination, loading:loading, columns:tableColumns});

        myObserver = new ResizeObserver((entries, observer)=>{
            // for (let entrie of entries) {
            //     let {width} = entrie;
            // }
            this.updateRect();
        })

        if(document.querySelector('.sd-right')) myObserver.observe(document.querySelector('.sd-right'))
    }

    componentWillUnmount() {
        if(document.querySelector('.sd-right')) myObserver.unobserve(document.querySelector('.sd-right'))
    }

    componentDidUpdate()
    {
        this.updateRect();
    }

    render()
    {
        const { columns, data, pagination, loading, total, rowSelection, rowKey, selectedRowKeys, locale, scroll, bordered, expandedRowKeys = []} = this.state;
        const {chilidColumn, options={},} = this.props;

        pagination["total"] = total;
        pagination["showTotal"] = () => {return <>共（{total}）条记录</>};

        if( rowSelection!==undefined )
        {
            rowSelection["selectedRowKeys"] = selectedRowKeys;
        }
        return (
            <div ref={this.myRef} className={`sf-table sd-table sg-table`}>
                {
                    !(chilidColumn && chilidColumn.length > 0) ? <Table
                        locale = {locale}
                        bordered={bordered}
                        showHeader={options.showHeader}
                        rowSelection = {rowSelection}
                        columns={columns}
                        // rowKey={record => record[rowKey] }
                        dataSource={data}
                        pagination={pagination}
                        loading={this.props.loading}
                        scroll = {scroll}
                        onChange={this.onChange}
                    /> : <Table
                        locale = {locale}
                        bordered={bordered}
                        showHeader={options.showHeader}
                        rowSelection = {rowSelection}
                        columns={columns}
                        // rowKey={record => record[rowKey] }
                        dataSource={data}
                        pagination={pagination}
                        loading={this.props.loading}
                        scroll = {scroll}
                        onChange={this.onChange}
                        expandIconColumnIndex={1}
                        expandedRowKeys={expandedRowKeys}
                        onExpand={ (expanded, record) => {
                            if(expanded)
                            {
                                this.setState({expandedRowKeys: record.ID ? [record.ID] : []})
                            }
                            else
                            {
                                this.setState({expandedRowKeys: []})
                            }
                        }}
                        expandable={{
                            childrenColumnName: 'chlidTable',
                            expandedRowRender: chilidColumn && chilidColumn.length > 0 ? (record, index, indent, expanded)=>{
                                let childData = data[index] && data[index].children || []
                                if(childData.length > 0)
                                {
                                    return <Table columns={chilidColumn} dataSource={childData} pagination={false} />
                                }
                                else 
                                {
                                    return null
                                }
                            }:'',
                        }}
                    />
                }
            </div>
        )
    }
}

export default WidgetTable;
