// WidgetPageTable.js
import React from 'react';
import {Checkbox, Pagination, Popover} from "antd";
import "antd/dist/antd.css";
import moment from 'moment';

import '../css/widget/widget.page.table.css';
import '../css/widget/widget.table.css';

class WidgetPageTable extends React.Component
{
    constructor( props )
    {
        super(props);

        this.state = {
            data : this.props.data,
            columns : this.props.columns,
            options : this.props.options,
            page : this.props.page ? this.props.page : 1,
            records : this.props.options.records!==undefined ? this.props.options.records : 10, 
            total : this.props.total,
            pageFlag : this.props.pageFlag===true,
            componentHeight : this.props.height,
            tableHeight:0,
            disabled : false, 
            checkedKeys :[],
            keyWord : "",
            loading:false
        }

        this.onOperate = this.onOperate.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);    

        this.buildTableHeight = this.buildTableHeight.bind(this);    

        this.handleCheck = this.handleCheck.bind(this);    
        this.handleCheckAll = this.handleCheckAll.bind(this);
        
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
        if( event!==undefined )
        {
            event.stopPropagation();
        }
        
        if( this.props.notify!==undefined )
        {
            return this.props.notify(type, data, value, event);
        }
    }

    handleChangePage(page, pageSize)
    {
        if( this.props.pageTurning!==undefined )
        {
            const { total } = this.props;

            const { records } = this.state;

            let totalPage =  Math.ceil(total / records);
            
            if( page>0 && page<=totalPage )
            {
                this.props.pageTurning(page, pageSize);

                this.setState({page:page, loading:true, isFromState:true});
            }
        }
    }

    /**
     * 表格多选框选择
     * @param {*} value 
     * @param {*} checked 
     */
    handleCheck(item)
    {
        const { data, options} = this.props;

        let { checkedKeys } = this.state, isExit = false;

        for( let i=0; i<checkedKeys.length; i++ )
        {
            if( item[options.checkedKey]===checkedKeys[i] )
            {
                checkedKeys.splice(i, 1);
                isExit = true;
            }
        }

        if( isExit===false )
        {
            checkedKeys.push(item[options.checkedKey]);
        }

        if( this.props.onCheck!==undefined && this.props.onCheck!==null )
        {
            let checkData = [];

            for( let item of data )
            {
                for( let checkedKey of checkedKeys )
                {
                    if( item[options.checkedKey]===checkedKey )
                    {
                        checkData.push(item[options.checkedKey]);
                        break;
                    }
                }
            }

            this.props.onCheck(checkData);
        }

        this.setState({ checkedKeys: checkedKeys});
    }
 
     /**
      * 表格多选框全选择
      * @param {*} value 
      * @param {*} checked 
      */
    handleCheckAll() 
    {
        const { data, options} = this.props;

        let { checkedKeys } = this.state;;

        if( data.length!==checkedKeys.length )
        {
            checkedKeys = [];
            checkedKeys = data.map(item => item[options.checkedKey]);
        }
        else
        {
            checkedKeys = [];
        }

        console.log(checkedKeys);
        
        if( this.props.onCheck!==undefined && this.props.onCheck!==null )
        {
            if( checkedKeys!==undefined && checkedKeys.length>0 )
            {
                this.props.onCheck(checkedKeys,data);
            }
            else
            {
                this.props.onCheck(checkedKeys);
            }            
        }

        this.setState({checkedKeys:checkedKeys});
    }

    /**
     * 计算表格高度
     * @param {*} data 
     * @returns 
     */
    buildTableHeight( data )
    {
        let tableHeight = 0;

        if( data!==undefined && data.length>0 )
        {
            tableHeight += data.length * 120;
        }
        else
        {
            // page-table-column
            tableHeight += 120;
        }
        
        return tableHeight;
    }

    /**
     * 组件渲染之后再调用页面方法
     */
    componentDidMount()
    {
        setTimeout(() => {
            this.updateRect();
        }, 0);
    }

    componentDidUpdate()
    {
        this.updateRect();
    }


    componentWillReceiveProps( nextProps )
    {
        if( nextProps.total!==this.props.total || nextProps.checkedKeys!==this.props.checkedKeys )
        {
            let records = 10, { checkedKeys }  = this.state;

            if( nextProps.options.records!==undefined && nextProps.options.records!==0 )
            {
                records = nextProps.options.records;
            }

            if( nextProps.checkedKeys!==undefined )
            {
                checkedKeys = nextProps.checkedKeys;
            }

            this.state['checkedKeys']=checkedKeys
            this.setState({
                page:nextProps.page, total:nextProps.total, options:nextProps.options,
                records:records })
        }
    }
  
    updateRect()
    {
        if( this.myRef!==undefined )
        {
            if( this.myRef.current )
            {
                let height = 0;

                const width = this.myRef.current && this.myRef.current.clientWidth;

                let e = this.myRef.current && this.myRef.current.getElementsByClassName("sf-page-table-column");
                let operationWidth = this.myRef.current.querySelector('.sf-operations') && this.myRef.current.querySelector('.sf-operations').clientWidth

                if(  e!==undefined && e.length>0 )
                {
                    for( let i=0; i<e.length; i++ )
                    {
                        height += e[i].offsetHeight;
                    }
                }

                const componentHeight = this.myRef.current.parentElement.clientHeight;
            
                if( this.state.width !== width || this.state.tableHeight !== height )
                {
                    this.setState({width:width, tableHeight:height, componentHeight:componentHeight, isFromState:true, operationWidth});
                }
            }

            // if( this.myRef.current!==null )
            // {
            //    
            //     if (this.state.componentHeight !== height)
            //     {
            //         this.setState({componentHeight:height});
            //     }
            // }   
        }
    }
    /**
     * 数字转换
     * @param {*} number 
     * @returns 
     */
    formatNumber = (number) =>{
        let num = 0, unit = '';
        let stringNum = String(number);
        if(stringNum.length < 5) return number;

        if(stringNum.length >= 5 && stringNum.length < 9){
            num = 10000;
            unit = '万'
        }else if(stringNum.length >= 9){
            num = 100000000;
            unit = '亿'
        }
        
        return `${Math.floor(number / num)}${unit}+`
    }

    render()
    {
        let { componentHeight, page, records, checkedKeys, disabled, keyWord, loading, tableHeight, isFromState, operationWidth} = this.state, pageFlag = false;

        let { data, columns, options, height, total,PageTables, isHeader=true } = this.props;

        if( options.disabled!==undefined )
        {
            disabled = options.disabled;
        }

        if( options.keyWord!==undefined )
        {
            keyWord = options.keyWord;
        }

        if( isFromState===false && this.props.loading!==undefined )
        {
            loading = this.props.loading;
            this.state["loading"] = loading;
        }
        
        if( isFromState===false && this.props.page!==undefined )
        {
            page = this.props.page;
            this.state["page"] = page;
        }

        if( options.reverse!==undefined && options.reverse===true)
        {
            data.reverse();
        }

        if( options.isAutoHeight===true )
        {
            componentHeight = tableHeight+40;
        }
        else
        {
            if( height!==undefined && height!==0 )
            {
                componentHeight = height;
            }

            if( tableHeight>(componentHeight-40) )
            {
                tableHeight = componentHeight - 40;
            }
        }
        
     
        // {
        //     tableHeight = this.buildTableHeight( data );

        //     if( tableHeight>componentHeight-40 )
        //     {
        //         tableHeight = componentHeight - 40;
        //     }
        // }

        if( data!==undefined && total>data.length )
        {
            pageFlag = true;
        }

        this.state["isFromState"] = false;
        const isIndustryphy = columns.some(item=>{
            return item.some(i=>{
                return i.name === 'INDUSTRYPHY'
            })
        })

        const operation = columns.some(item=>{
            return item.some(i=>{
                return i.name === 'operation'
            })
        })

        if( data===undefined || loading===true )
        {
            return (
                <div ref={this.myRef} className="sf-widget-report" style={{position:'relative'}}>
                    <p className="sf-widget-report-loading"><img className="load" src={require('./../img/frame/loading.gif')} alt="es-lint want to get"/></p> 
                </div>
            );
        }
        else if( data.length>0 && columns!==undefined && columns.length>0 )
        {
            return(
                <div ref={this.myRef} className="sf-page-table" style={{height:componentHeight}}>
                    {
                        isHeader && <div className='sf-table-header'>
                            <div>
                                {
                                    options.check && <div className="sf-check-all">
                                        <Checkbox onClick={this.handleCheckAll}> 全选</Checkbox>
                                    </div>
                                }
                                <div>共有<span className='sf-header-total'>{this.formatNumber(total)}</span>家企业</div>
                            </div>
                            <div>
                                {isIndustryphy && <div className={operation?'sf-head-industry':'sf-head-isIndustry'}>行业</div>}
                                {operation && <div style={{width: operationWidth}}>操作</div>}
                            </div>
                        </div>
                    }
                    
                    <div className="sf-page-table-content" style={{height:tableHeight}}>
                    {
                        data.map((item, index) => {

                            if( options.check!==undefined && options.check===true )
                            {

                                let className = "sf-page-table-column sf-no-check";
                                
                                let checked = false;

                                for(let checkValue of checkedKeys)
                                {
                                    if( checkValue===item[options.checkedKey] )
                                    {
                                        className = className.replace("sf-no-check", "sf-check");
                                        checked = true;
                                        break;
                                    }
                                }

                                return (
                                    <div key={index} className={className}>
                                        <div className="sf-table-check">
                                            <Checkbox key={item[options.checkedKey]} defaultChecked={checked} checked={checked} onChange={ ()=>this.handleCheck(item) }></Checkbox>
                                        </div>
                                       
                                        <TableColumn data={item} columns={columns} options={options} checkedKeys={checkedKeys} onChange={this.onOperate} keyWord={keyWord}/>
                                    </div>
                                )
                            }
                            else
                            {
                                return (
                                    <div key={index} className="sf-page-table-column">
                                        <TableColumn data={item} columns={columns} options={options} PageTables={PageTables} checkedKeys={checkedKeys} onChange={this.onOperate}  keyWord={keyWord}/>
                                    </div>
                                )
                            }
                           

                        })
                    }         
                    </div>
                    <PageTableFooter 
                        pageFlag={pageFlag} 
                        page={page} 
                        total={total} 
                        records={records} 
                        handleChangePage={this.handleChangePage} 
                        disabled={disabled} 
                        options={options}
                    /> 
                </div>
            )
        }
        else
        {
            return (
                <div ref={this.myRef} className="sf-widget-report" style={{position:'relative'}}>
                    <img src={require('../css/widget/img/no-data.svg')}></img>
                </div>
            );
        }
        
    }
}

export default WidgetPageTable

export const PageTableFooter = ({ pageFlag, page, total, records, handleChangePage, disabled, options, ...props }) => 
{
    return <Pagination 
        current={page}
        total={total}
        hideOnSinglePage={true}
        pageSize={options.records}
        onChange={handleChangePage}
    />
}

export const TableColumn = ({ data, columns, onChange, options, checkedKeys, handleCheck, keyWord, PageTables, ...props }) => 
{
    return (
        <div className="sf-table-content">
        {
            columns.map((column, index) => {
                return (
                    <div key={index}  className="sf-table-column" style={PageTables?{right:"-29px"}:{}}>
                        <div key={index} className="sf-table-row" >
                            <TableRow item={data} column={column} onChange={onChange} keyWord={keyWord} options={options}/>
                        </div>
                    </div>
                )
            })
        }
        </div>
    )
}

export const TableRow = ({ item, column, onChange, keyWord, options, ...props }) => 
{
    return (
        <div >
        {
            column.map((cell, index) => {
                return (
                    <TableCell key={index} item={item} cell={cell} onChange={onChange} keyWord={keyWord} options={options}></TableCell>
                )
            })
        }
        </div>
    );
}

export const TableCell = ({ item, cell, onChange, keyWord, options, ...props }) => {

    let value = item[cell.name], properties = cell.properties, valueIsArray = false;

    const popContent = (vals) => {
        return vals.map(item=>{return <p>{item}</p>})
    } 

    if( properties!==undefined && properties.hidden===true )
    {
        return "";
    }

    if( typeof value == "object" || Array.isArray(value) )
    {
        valueIsArray = true;
    }

    if( valueIsArray!==true )
    {
        if( properties!==undefined && properties.format!==undefined )
        {
            value = moment(value.time).format(properties.format);
        }
    
        if( keyWord!=="" && options.keyWordColumnName===cell.name )
        {
            let word =new RegExp(keyWord,"g");
    
            value = value.replace(word, `<span class="keyword">${keyWord}</span>`)
        }
    }
    else 
    {
        if( Array.isArray(value)===true )
        {
            let newValue = ``;

            if( properties.type!==undefined && properties.type==="label")
            {
                for( let data of value )
                {
                    newValue += `<label>`+data+`</label>`;
                }
            }
            else
            {
                let isFirst = true;

                let vals = value.map(item=>Object.values(item)[0])
                
                if(vals.length>1){
                    const con = popContent(vals);
                    return <div className={cell.name} style={{float: 'left'}}>
                        {cell.title && <span className='sf-cell-title'>{cell.title}：</span>}
                        <Popover overlayClassName='sf-table-popover' placement='bottomRight' trigger="click" content={con}>
                            <span><label className='cursor-pointer'>{vals[0]}</label></span>
                            <span className='sf-label-point'></span>
                        </Popover>
                    </div>
                }else{
                    newValue = `<label>`+vals[0]+`</label>`;
                }
            }

            value = newValue;
        }
        else
        {
            let newValue = ``;

            if( properties.type!==undefined && properties.type==="label")
            {
                for( let key in value )
                {

                    newValue += `<label>`+value[key]+`</label>`;
                }
            }
            
            else
            {
                let isFirst = true;

                for( let key in value )
                {
                    if( isFirst )
                    {
                        newValue = `<label>`+value[key]+`</label>`;
                        isFirst = false;
                    }
                    else
                    {
                        newValue += `；<label>`+value[key]+`</label>`;
                    } 
                }
            }
        
            value = newValue;

        }
    }

    let cellClassName = cell.name;

    if( properties!==undefined && properties.className!==undefined)
    {
        cellClassName = properties.className[item[cell.name]];
    }

    let unit  = "";

    if( properties!==undefined && properties.unit!==undefined)
    {
        unit = properties.unit;
    }
    if(cellClassName === 'REGSTATE' || cellClassName === 'REGSTATE_CN'){
        if(value === '存续（在营、开业、在册）'){
            cellClassName = cellClassName += ' tag-green'
        }else if(value === '迁出' || value === '其他'){
            cellClassName = cellClassName += ' tag-blue'
        }else {
            cellClassName = cellClassName += ' tag-red'
        }
    }

    if( properties!==undefined && properties.transform!==undefined )
    {
        if( properties.click!==undefined )
        {
            cellClassName += " click";

            if( properties.img!==undefined )
            {
                if( cell.title!==undefined )
                {
                    if( (keyWord!=="" && options.keyWordColumnName===cell.name) || valueIsArray===true )
                    {
                        return (
                            <Transform rowData={item} dataKey={properties.transform} properties={properties} onChange={onChange}>
                                <div style={ {float:'left', cursor: 'pointer'} } className={cellClassName} onClick={ (e) => {onChange(properties.click, JSON.stringify(item), value, e)} } >
                                    {/* <img src={require('./../img/riskCompass/' + properties.img + '.png')}  alt="es-lint want to get" /> */}
                                    <img />
                                    {cell.title && <span className='sf-cell-title'>{cell.title}：</span>}
                                    <span dangerouslySetInnerHTML = {{ __html:value }}></span> {unit}
                                </div>
                            </Transform>
                        );
                    }
                    else
                    {
                        return (
                            <Transform rowData={item} dataKey={properties.transform} properties={properties} onChange={onChange}>
                                <div style={ {float:'left', cursor: 'pointer'} } className={cellClassName} onClick={ (e) => {onChange(properties.click, JSON.stringify(item), value, e)} } >
                                    {/* <img src={require('./../img/riskCompass/' + properties.img + '.png')} alt="es-lint want to get"  /> */}
                                    <img />
                                    {cell.title && <span className='sf-cell-title'>{cell.title}：</span>}
                                    <span  title={value}>{value}{unit}</span>
                                </div>
                            </Transform>
                        );
                    }
                    
                }
                else
                {
                    if( (keyWord!=="" && options.keyWordColumnName===cell.name) || valueIsArray===true )
                    {
                        return (
                            <Transform rowData={item} dataKey={properties.transform} properties={properties} onChange={onChange}>
                                <div style={ {float:'left', cursor: 'pointer'} } className={cellClassName} onClick={ (e) => {onChange(properties.click, JSON.stringify(item), value, e)} } >
                                    {/* <img src={require('./../img/riskCompass/' + properties.img + '.png')} alt="es-lint want to get"  /> */}
                                    <img />
                                    <span dangerouslySetInnerHTML = {{ __html:value }}></span>{unit}
                                </div>
                            </Transform>
                        );
                    }
                    else
                    {
                        return (
                            <Transform rowData={item} dataKey={properties.transform} properties={properties} onChange={onChange}>
                                <div style={ {float:'left', cursor: 'pointer'} } className={cellClassName} onClick={ (e) => {onChange(properties.click, JSON.stringify(item), value, e)} } >
                                    {/* <img src={require('./../img/riskCompass/' + properties.img + '.png')} alt="es-lint want to get"  /> */}
                                    <img />
                                    {value}{unit}
                                </div>
                            </Transform>
                        );
                    }
                }
            }
            else
            {
                if( cell.title!==undefined )
                {
                    if( (keyWord!=="" && options.keyWordColumnName===cell.name) || valueIsArray===true )
                    {
                        return (
                            <Transform rowData={item} dataKey={properties.transform} properties={properties} onChange={onChange}>
                                <div style={ {float:'left', cursor: 'pointer'} } className={cellClassName} onClick={ (e) => {onChange(properties.click, JSON.stringify(item), value, e)}} >
                                {cell.title && <span className='sf-cell-title'>{cell.title}：</span>}<span dangerouslySetInnerHTML = {{ __html:value }}></span>{unit}
                                </div>
                            </Transform>
                        );
                    }
                    else
                    {
                        return (
                            <Transform rowData={item} dataKey={properties.transform} properties={properties} onChange={onChange}>
                                <div style={ {float:'left', cursor: 'pointer'} } className={cellClassName} onClick={ (e) => {onChange(properties.click, JSON.stringify(item), value, e)}} >
                                {cell.title && <span className='sf-cell-title'>{cell.title}：</span>}<span  title={value}>{value}{unit}</span>
                                </div>
                            </Transform>
                        );
                    }  
                }
                else
                {
                    if( (keyWord!=="" && options.keyWordColumnName===cell.name) || valueIsArray===true )
                    {
                        return (
                            <Transform rowData={item} dataKey={properties.transform} properties={properties} onChange={onChange}>
                                <div style={ {float:'left', cursor: 'pointer'} } className={cellClassName} onClick={ (e) => {onChange(properties.click, JSON.stringify(item), value, e)}} >
                                    <span dangerouslySetInnerHTML = {{ __html:value }}></span>{unit}
                                </div>
                            </Transform>
                        );
                    }
                    else
                    {
                        return (
                            <Transform rowData={item} dataKey={properties.transform} properties={properties} onChange={onChange}>
                                <div style={ {float:'left', cursor: 'pointer'} } className={cellClassName} onClick={ (e) => {onChange(properties.click, JSON.stringify(item), value, e)}} >
                                    {value}{unit}
                                </div>
                            </Transform>
                        );
                    }
                }
            }
            
        }
        else if( properties.operations!==undefined )
        {
            return (
                <Transform rowData={item} dataKey={properties.transform} properties={properties} onChange={onChange} >
                <div className="sf-operations">
                {
                    properties.operations.map((operation, index) => 
                    {
                        if( operation.type==="icon" && operation.img!==undefined)
                        {
                            // let icon = require("../img/riskCompass/table/" + operation.img + '.svg'); ;

                            return (
                                <div style={ {float:'left', cursor: 'pointer'} } key={index} className={operation.click} onClick={ (e) => {onChange(operation.click, JSON.stringify(item), value, e)}} >
                                    {/* <WidgetTips isRequire={true} icon={icon} tipContent={operation.name} position="top"/> */}
                                </div>
                            )
                        }
                        else
                        {
                            if( operation.img!==undefined )
                            {
                                return (
                                    <div style={ {float:'left', cursor: 'pointer'} } key={index} className={operation.click} onClick={ (e) => {onChange(operation.click, JSON.stringify(item), value, e)}} >
                                        {/* <img src={require('./../img/riskCompass/table/' + operation.img + '.svg')} alt="es-lint want to get" /> */}
                                        <img />
                                        {operation.name}
                                    </div>
                                )
                            }
                            else
                            {
                                return (
                                    <div style={ {float:'left', cursor: 'pointer', borderColor: operation.color && '#3674fa', color: operation.color && '#3674fa'} } key={index} className={operation.click} onClick={ (e) => {onChange(operation.click, JSON.stringify(item), value, e)}} >
                                        {operation.name}
                                    </div>
                                )
                            }
                        }
                    })
                }
                </div>
                </Transform>
            )
        }
        else
        {
            value = onChange(properties.transform, JSON.stringify(item), value);

            if( properties.img!==undefined )
            {
                if( cell.title!==undefined )
                {
                    if( (keyWord!=="" && options.keyWordColumnName===cell.name) || valueIsArray===true )
                    {
                        return (
                            <div style={ {float:'left'} } className={cellClassName}>
                                {/* <img src={require('./../img/riskCompass/' + properties.img + '.svg')} alt="es-lint want to get" /> */}
                                <img />
                                {cell.title && <span className='sf-cell-title'>{cell.title}：</span>}
                                <span dangerouslySetInnerHTML = {{ __html:value }}></span>{unit}
                            </div>
                        );
                    }
                    else
                    {
                        return (
                            <div style={ {float:'left'} } className={cellClassName}>
                                {/* <img src={require('./../img/riskCompass/' + properties.img + '.svg')} alt="es-lint want to get" /> */}
                                <img />
                                {cell.title && <span className='sf-cell-title'>{cell.title}：</span>}<span  title={value}>{value}{unit}</span>
                            </div>
                        );
                    }                   
                }
                else
                {
                    if( (keyWord!=="" && options.keyWordColumnName===cell.name) || valueIsArray===true )
                    {
                        return (
                            <div style={ {float:'left'} } className={cellClassName}>
                                {/* <img src={require('./../img/riskCompass/' + properties.img + '.png')} alt="es-lint want to get" /> */}
                                <img />
                                <span dangerouslySetInnerHTML = {{ __html:value }}></span>{unit}
                            </div>
                        );
                    }
                    else
                    {
                        return (
                            <div style={ {float:'left'} } className={cellClassName}>
                                {/* <img src={require('./../img/riskCompass/' + properties.img + '.svg')} alt="es-lint want to get" /> */}
                                <img />
                                {value}{unit}
                            </div>
                        );
                    }                    
                }  
            }
            else
            {
                if( cell.title!==undefined )
                {
                    if( (keyWord!=="" && options.keyWordColumnName===cell.name) || valueIsArray===true )
                    {
                        return (
                            <div style={ {float:'left'} } className={cellClassName}>
                                 {cell.title && <span className='sf-cell-title'>{cell.title}：</span>}
                                 <span dangerouslySetInnerHTML = {{ __html:value }}></span>{unit}
                            </div>
                        );
                    }
                    else
                    {
                        return (
                            <div style={ {float:'left'} } className={cellClassName}>
                                 {cell.title && <span className='sf-cell-title'>{cell.title}：</span>}<span  title={value}>{value}{unit}</span>
                            </div>
                        );
                    }                    
                }
                else
                {
                    if( (keyWord!=="" && options.keyWordColumnName===cell.name) || valueIsArray===true )
                    {
                        return (
                            <div style={ {float:'left'} } className={cellClassName}>
                                <span dangerouslySetInnerHTML = {{ __html:value }}></span>{unit}
                            </div>
                        );
                    }
                    else
                    {
                        return (
                            <div style={ {float:'left'} } className={cellClassName}>
                                {value}{unit}
                            </div>
                        );
                    }                    
                }
            }
        }
    }
    else
    {
        if( properties!==undefined && properties.click!==undefined )
        {
            cellClassName += " click";

            if( properties.img!==undefined )
            {
                if( cell.title!==undefined )
                {
                    if( (keyWord!=="" && options.keyWordColumnName===cell.name) || valueIsArray===true )
                    {
                        return (
                            <div style={ {float:'left', cursor: 'pointer'} } className={cellClassName} onClick={ (e) => {onChange(properties.click, JSON.stringify(item), value, e)}} >
                                {/* <img src={require('./../img/riskCompass/' + properties.img + '.svg')} alt="es-lint want to get"  /> */}
                                <img />
                                {cell.title && <span className='sf-cell-title'>{cell.title}：</span>}
                                <span dangerouslySetInnerHTML = {{ __html:value }}></span>{unit}
                            </div>
                        )
                    }
                    else
                    {
                        return (
                            <div style={ {float:'left', cursor: 'pointer'} } className={cellClassName} onClick={ (e) => {onChange(properties.click, JSON.stringify(item), value, e)}} >
                                {/* <img src={require('./../img/riskCompass/' + properties.img + '.svg')} alt="es-lint want to get" /> */}
                                <img />
                                {cell.title && <span className='sf-cell-title'>{cell.title}：</span>}<span  title={value} >{value}{unit}</span>
                            </div>
                        )
                    }                    
                }
                else
                {
                    if( (keyWord!=="" && options.keyWordColumnName===cell.name) || valueIsArray===true )
                    {
                        return (
                            <div style={ {float:'left', cursor: 'pointer'} } className={cellClassName} onClick={ (e) => {onChange(properties.click, JSON.stringify(item), value, e)}} >
                                {/* <img src={require('./../img/riskCompass/' + properties.img + '.png')} alt="es-lint want to get" /> */}
                                <img />
                                <span dangerouslySetInnerHTML = {{ __html:value }}></span>{unit}
                            </div>
                        )
                    }
                    else
                    {
                        return (
                            <div style={ {float:'left', cursor: 'pointer'} } className={cellClassName} onClick={ (e) => {onChange(properties.click, JSON.stringify(item), value, e)}} >
                                {/* <img src={require('./../img/riskCompass/' + properties.img + '.svg')} alt="es-lint want to get"  /> */}
                                <img />
                                {value}{unit}
                            </div>
                        )
                    }                  
                }  
            }
            else
            {
                if( cell.title!==undefined )
                {
                    if( (keyWord!=="" && options.keyWordColumnName===cell.name) || valueIsArray===true )
                    {
                        return (
                            <div style={ {float:'left', cursor: 'pointer'} } className={cellClassName} onClick={ (e) => {onChange(properties.click, JSON.stringify(item), value, e)}} >
                                {cell.title && <span className='sf-cell-title'>{cell.title}：</span>}
                                <span dangerouslySetInnerHTML = {{ __html:value }}></span>{unit}
                            </div>
                        );
                    }
                    else
                    {
                        return (
                            <div style={ {float:'left', cursor: 'pointer'} } className={cellClassName} onClick={ (e) => {onChange(properties.click, JSON.stringify(item), value, e)}} >
                                {cell.title && <span className='sf-cell-title'>{cell.title}：</span>}
                                <span title={value} >{value}{unit}</span>
                            </div>
                        );
                    }
                }
                else
                {  
                    if( (keyWord!=="" && options.keyWordColumnName===cell.name) || valueIsArray===true )
                    {
                        return (
                            <div style={ {float:'left', cursor: 'pointer'} } className={cellClassName} onClick={ (e) => {onChange(properties.click, JSON.stringify(item), value, e)}} >
                                <span dangerouslySetInnerHTML = {{ __html:value }}></span>{unit}
                            </div>
                        );
                    }
                    else
                    {
                        return (
                            <div style={ {float:'left', cursor: 'pointer'} } className={cellClassName} onClick={ (e) => {onChange(properties.click, JSON.stringify(item), value, e)}} >
                                {value}{unit}
                            </div>
                        );
                    }
                } 
            }
            
        }
        else if( properties!==undefined && properties.operations!==undefined )
        {
            return (
                <div className="sf-operations">
                {
                    properties.operations.map((operation, index) => 
                    {
                        if( operation.type==="icon" && operation.img!==undefined)
                        {
                            // let icon = require("../img/riskCompass/table/" + operation.img + '.svg'); ;

                            return (
                                <div style={ {float:'left', cursor: 'pointer'} } key={index} className={operation.click} onClick={ (e) => {onChange(operation.click, JSON.stringify(item), value, e)}} >
                                    {/* <WidgetTips isRequire={true} icon={icon} tipContent={operation.name} position="top"/> */}
                                </div>
                            )
                        }
                        else
                        {
                            if( operation.img!==undefined )
                            {
                                return (
                                    <div style={ {float:'left', cursor: 'pointer'} } key={index} className={operation.click} onClick={ (e) => {onChange(operation.click, JSON.stringify(item), value, e)}} >
                                        {/* <img src={require('./../img/riskCompass/' + operation.img + '.svg')} alt="es-lint want to get" /> */}
                                        <img />
                                        {operation.name}
                                    </div>
                                )
                            }
                            else
                            {
                                return (
                                    <div style={ {float:'left', cursor: 'pointer'} } key={index} className={operation.click} onClick={ (e) => {onChange(operation.click, JSON.stringify(item), value, e)}} >
                                        {operation.name}
                                    </div>
                                )
                            }
                        }
                    })
                }
                </div>
            )
        }
        else
        {
            if( properties.img!==undefined )
            {
                if( cell.title!==undefined )
                {
                    if( (keyWord!=="" && options.keyWordColumnName===cell.name) || valueIsArray===true )
                    {
                        return (
                            <div style={ {float:'left'} } className={cellClassName}>
                                {/* <img src={require('./../img/riskCompass/' + properties.img + '.svg')} alt="es-lint want to get" /> */}
                                <img />
                                {cell.title && <span className='sf-cell-title'>{cell.title}：</span>}
                                <span dangerouslySetInnerHTML = {{ __html:value }}></span>{unit}
                            </div>
                        );
                    }
                    else
                    {
                        return (
                            <div style={ {float:'left'} } className={cellClassName}>
                                {/* <img src={require('./../img/riskCompass/' + properties.img + '.svg')} alt="es-lint want to get" /> */}
                                <img />
                                {cell.title && <span className='sf-cell-title'>{cell.title}：</span>}
                                <span title={value} >{value}{unit}</span>
                            </div>
                        );
                    }
                }
                else
                {
                    if( (keyWord!=="" && options.keyWordColumnName===cell.name) || valueIsArray===true )
                    {
                        return (
                            <div style={ {float:'left'} } className={cellClassName}>
                                {/* <img src={require('./../img/riskCompass/' + properties.img + '.svg')} alt="es-lint want to get" /> */}
                                <img />
                                <span dangerouslySetInnerHTML = {{ __html:value }}></span>{unit}
                            </div>
                        );
                    }
                    else
                    {
                        return (
                            <div style={ {float:'left'} } className={cellClassName}>
                                {/* <img src={require('./../img/riskCompass/' + properties.img + '.png')} alt="es-lint want to get" /> */}
                                <img />
                                {value}{unit}
                            </div>
                        );
                    }
                } 

                
            }
            else
            {
                if( cell.title!==undefined )
                {
                    if( (keyWord!=="" && options.keyWordColumnName===cell.name) || valueIsArray===true )
                    {
                        return (
                            <div style={ {float:'left'} } className={cellClassName}>
                                {cell.title && <span className='sf-cell-title'>{cell.title}：</span>}
                                <span dangerouslySetInnerHTML = {{ __html:value }}></span>{unit}
                            </div>
                        );
                    }
                    else
                    {
                        return (
                            <div style={ {float:'left'} } className={cellClassName}>
                                {cell.title && <span className='sf-cell-title'>{cell.title}：</span>}
                                <span >{value}{unit}
                                </span>
                            </div>
                        );
                    }
                }
                else
                {
                    if( (keyWord!=="" && options.keyWordColumnName===cell.name) || valueIsArray===true )
                    {
                        return (
                            <div style={ {float:'left'} } className={cellClassName}>
                                <span dangerouslySetInnerHTML = {{ __html:value }}></span>{unit}
                            </div>
                        );
                    }
                    else
                    {
                        return value ? (
                            <div style={ {float:'left'} } className={cellClassName}>
                                {value}{unit}
                            </div>
                        ) : null;
                    }

                    
                } 
            } 
        }
    } 
}

export const Transform = ({ rowData, dataKey, properties, onChange, ...props }) => 
{
    if( onChange!==undefined )
    {
        return onChange(dataKey, rowData, props.children)
    }
    else
    {
        return props.children;
    }
}
