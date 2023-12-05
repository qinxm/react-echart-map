// WidgetInterfaceTable
import React from 'react';

import Widget from './Widget';
import WidgetAjax from './WidgetAjax';
import WidgetTable from './WidgetTable';

import './../css/widget/widget.table.css';
import Title from '../pages/comps/Title';

class WidgetInterfaceTable extends React.Component
{
    constructor( props )
    {
        super( props );

        let params = {...props.params};

        this.state = {
            options : props.options!==undefined ? props.options : undefined,
            columns : props.columns,
            params : params,
            page : 1,
            total:undefined,
            isPage : false,
            data : [],
            flag : 0,
        }

        // 获取组件自身
        this.myRef = React.createRef();

        this.loadData = this.loadData.bind(this);
        this.buildData = this.buildData.bind(this);
        this.onLoadData = this.onLoadData.bind(this);
        this.page = this.page.bind(this);
        this.notify = this.notify.bind(this);
    }

    loadData()
    {
        let  { options, page, params, flag } = this.state;

        let newParams = {...params};

        if( newParams ===undefined )
        {
            newParams = {...this.props.params};
        }
        
        if( options===undefined )
        {
            return ;
        }

        if( newParams===undefined )
        {
            return ;
        }

        flag ++;

        this.state["flag"] = flag;

        this.state["isPage"] = false;

        newParams["records"] = options.records!==undefined ? options.records : 5;

        newParams["page"] = page!==undefined ? page : 1;

        WidgetAjax.ajax({url : options.url, params : newParams, callback : this.onLoadData, backParam:{params:newParams, flag:flag} });
    }

    onLoadData( result, params, backParam)
    {  
        let { page, flag } = this.state;

        if( result.status===0 )
        {
            let {records } = params;

            if( flag!==backParam.flag )
            {
                return ;
            }

            this.state["total"] = result.total;

            if( result.total>records && result.results.length<result.total && page<Math.ceil(result.total/records) )
            {
                this.state["isPage"] = true;
            }
            else
            {
                this.state["isPage"] = false;
            }

            this.buildData( result.results );

        }
    }

    buildData( results )
    {
        let { data, page } = this.state;

        if( page===1 || data===undefined )
        {
            data = [];
        }

        if( this.props.buildData!==undefined )
        {
            results = this.props.buildData(results);
        }

        if( results!==undefined )
        {
            data.push(...results);
        }
        else
        {
            data.push(...[]);
        }

        this.setState({data:data});
    }

    page()
    {
        this.state["page"]++;

        this.loadData();
    }

    updateRect()
    {
        if( this.myRef!==undefined )
        {
            let height = 0;

            if( this.myRef.current!==null )
            {
                const width = this.myRef.current.clientWidth;

                let e = this.myRef.current.getElementsByClassName("rs-table-row");

                if(  e!==undefined && e.length>0 )
                {
                    for( let i=0; i<e.length; i++ )
                    {
                        height += e[i].offsetHeight;
                    }
                }

                // height += 10;
            
                if (this.state.width !== width || this.state.height !== height)
                {
                    this.setState({width, height});
                }
            }
        }
    }

    /**
     * 点击事件
     * @param {*} type 
     * @param {*} data 
     * @param {*} value 
     */
    notify(type, data, value)
    {
        if( this.props.notify!==undefined )
        {
            this.props.notify(type, data, value);
        }
        switch(type){
            case 'transform':
                // if(data.SUBCONPROP === 1) {
                    return `${data.SUBCONPROP * 100}%`
                // }else{
                    return data.SUBCONPROP;
                // }
            default:
                break;
        }
    }   

    componentDidMount()
    {
        this.loadData();
        this.updateRect();
    }

    componentDidUpdate()
    {
        this.updateRect();
    }

    componentWillReceiveProps( nextProps )
    {
        const { params } = this.state;

        if( Widget.ObjectIsSame(nextProps.params, params)!==true )
        {
            let newParams = {...nextProps.params};
            this.state.params = newParams;
            this.loadData();
        }
    }
    
    render()
    {
        const { columns, data, options, height, width, isPage, total} = this.state;

        // if( data===undefined )
        // {
        //     return (
        //         <div className="entity-baseInfo">
        //             <div className="content-title">
        //                 <div className="img">
        //                     <img src={require("../img/riskCompass/bt_left.svg")} alt="es-lint want to get"></img>
        //                 </div>
        //                 <div className="font">
        //                     <span>{options.title}</span>
        //                 </div>
        //                 <div className="total">
        //                     <span >{total}</span>
        //                 </div>
        //             </div>

        //             <div className="no-data" ref={this.myRef}>
                    
        //             </div>
        //         </div>
        //     )
        // }

        if( data!==undefined && data.length===0  )
        {
            return (
                <div className="entity-baseInfo">
                    <Title title={options.title} num={total} />
                    {/* <div className="content-title">
                        
                        <div className="font">
                            <span>{options.title}</span>
                        </div>
                        <div className="total">
                            <span >{total}</span>
                        </div>
                    </div> */}

                    <div className="no-data" ref={this.myRef}>
                        无该项数据
                    </div>
                </div>
            )
        }
    

        if( isPage )
        {
            return (
                <div className="entity-baseInfo">
                    <Title title={options.title} num={total} />
                    <div className="padding-top-btm-20 widget-report table-top" ref={this.myRef}>
                        <WidgetTable bordered={true} options={options} columns={columns} data={data} height={height} width={width} notify={this.notify} interPageSize={data.length}/>
                    </div>
                    <div className="sg-data-more"> <span onClick={()=>{ this.page() }}> 查看更多 </span> </div> 
                </div>
            )
        }
        else
        {
            return (
                <div className="entity-baseInfo">
                    <Title title={options.title} num={total} />
                    <div className="padding-top-btm-20 widget-report table-top" ref={this.myRef} >
                        <WidgetTable bordered={true} options={options} columns={columns} data={data} height={height} width={width} notify={this.notify} interPageSize={data.length}/>
                    </div>
                </div>
            )
        }
    }
}

export default WidgetInterfaceTable
