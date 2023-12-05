import React,{useState,useEffect} from 'react';

import moment from 'moment';
import { DatePicker, Button} from 'antd';

import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';

import Widget from './Widget';

import 'antd/dist/antd.css';
import '../css/widget/widget.datePicker.css';

class WidgetFilterDatePicker extends React.Component 
{
    constructor(props)
    {
        super(props);

        let divId = props.divId;

        if( divId===undefined )
        {
            divId = Widget.randomString();
        }

        this.state = { 
            title: '请选择日期',
            divId : divId,
            dateStart : undefined,
            dateEnd : undefined,
            status : 'none',
            options : (props.options!==undefined ?  props.options :{}),
            defaultValue : (props.defaultValue!==undefined ?  props.defaultValue :{}),
            fromState:false,
            changeFlag:undefined,
            className:"",
            x:0,
            y:0
        }

        this.state['dateType'] = this.props.options.dateType!==undefined ? this.props.options.dateType : 'month';
        this.state['dateTypes'] = this.props.options.dateTypes!==undefined ? this.props.options.dateTypes : [{title:'月', value:'month'}];
        this.state['datePickerType'] = this.props.options.datePickerType!==undefined ? this.props.options.datePickerType : 'point';

        // 获取组件自身
        this.dateTitleRef = React.createRef();
        this.dateContentRef = React.createRef();

        this.buildDate = this.buildDate.bind(this);
        this.onChangeEnd = this.onChangeEnd.bind(this);
        this.disabledStartDate = this.disabledStartDate.bind(this);
        this.disabledEndDate = this.disabledEndDate.bind(this);

        this.onChangeStart = this.onChangeStart.bind(this);
        this.changeDateType = this.changeDateType.bind(this);
        this.formatDateTitle = this.formatDateTitle.bind(this);

        this.cancle = this.cancle.bind(this);
        this.confirm = this.confirm.bind(this);
        
        this.changeStatus = this.changeStatus.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this)

        // this.fast = this.fast.bind(this)
    }

    componentDidMount() 
    {
        document.addEventListener('mousedown', (e)=>this.handleClickOutside(e), false);
    }

    componentWillUnmount() 
    {
        document.removeEventListener('mousedown', (e)=>this.handleClickOutside(e), false);
    }

    handleClickOutside(e) 
    {
        const target = e.target;

        if(this.dateContentRef.current){
        // 组件已挂载且事件触发对象不在div内
            let result=(this.dateContentRef.current).contains(target);
            // console.log(result)
            if( !result ) {
                this.setState({
                    status:"none"
                });
            }  
        }
    }

    changeStatus()
    {
        let { status, datePickerType } = this.state;

        let titleLeft =  this.dateTitleRef.current.offsetLeft;
        let titleWidth = this.dateTitleRef.current.offsetWidth ;
        let htmlWidth = document.querySelector('body').offsetWidth;
        
        if(  htmlWidth-titleLeft < 375 || ( datePickerType==="range" && htmlWidth-titleLeft<680 ) )
        {
            if( this.dateContentRef.current!==null )
            {
                this.dateContentRef.current.style.right = (htmlWidth-titleLeft-titleWidth) + 'px';
            }
        }

        if( status==='none' )
        {
            this.setState({status:'block', changeFlag:'changeStatus'});
        }
        else
        {
            this.setState({status:'none', changeFlag:'changeStatus'});
        }
    }
    onChangeStart(date, dateString)
    {
        let dateStart = dateString.replaceAll('-', '');
        let dateStartTitle = this.formatDateTitle(date);

        this.setState({dateStart:dateStart, dateStartTitle:dateStartTitle, fromState:true, changeFlag:'onChangeStart'});
    }

    onChangeEnd(date, dateString)
    {
        let dateEnd = dateString.replaceAll('-', '');
        let dateEndTitle = this.formatDateTitle(date);

        this.setState({dateEnd:dateEnd, dateEndTitle:dateEndTitle, fromState:true, changeFlag:'onChangeEnd'});
    }

    changeDateType( dateType )
    {
        this.setState({dateType:dateType, changeFlag:'changeDateType', fromState:true});
    }

    confirm()
    {
        // 关闭控件
        let { dateStart, dateEnd, datePickerType, dateType, title, dateEndTitle, dateStartTitle, defaultValue} = this.state;
        const { options } = this.state;

        if( datePickerType==="point" )
        {
            dateStart = dateEnd;
            
            title = dateEndTitle;
        }
        else
        {
            title = dateStartTitle + "-" + dateEndTitle;
        }

        if( this.state.confirmCallBack!==undefined  )
        {
            this.state.confirmCallBack({start:dateStart, end:dateEnd});  
        }
        
        let value = {start:dateStart, end:dateEnd, dateType:dateType, options:options};

        this.setState({status:'none', defaultValue:value, title:title, fromState:true, changeFlag:'confirm'});
        
        if( defaultValue.start!==value.start || defaultValue.end!==value.end || dateType.end!==value.dateType  )
        {
            if( this.props.onSelect!==undefined )
            {
                this.props.onSelect(value);
            }
        }
    }

    cancle()
    {
        // 关闭控件
        this.setState({status:'none', fromState:false, changeFlag:'cancle'});
    }

    /**
     * 判断时间是否不能选择
     * @param {*} current 
     * @returns 
     */
    disabledStartDate( current ) 
    {
        let ret = false;

        let { dateType, options, dateEnd } = this.state;

        if( current )
        {
            switch( dateType )
            { 
                case "date":
                {
                    current = moment(current).format('YYYYMMDD');
                    dateEnd = dateEnd!==undefined ? moment(dateEnd).format('YYYYMMDD') : dateEnd;
                    break;
                }
                case "month":
                {
                    current = moment(current).format('YYYYMM');
                    dateEnd = dateEnd!==undefined ? moment(dateEnd).format('YYYYMM') : dateEnd;
                    break;
                }
                case "quarter":
                {
                    current = moment(current).format('YYYYQ');
                    dateEnd = dateEnd!==undefined ? dateEnd.replaceAll("Q", '') : dateEnd;
                    break;
                }
                case "year":
                {
                    current = moment(current).format('YYYY');
                    dateEnd = dateEnd!==undefined ? moment(dateEnd).format('YYYY') : dateEnd;
                    break;
                }
                default:
                    break;
            }

            for( let i in options.dateTypes )
            {
                if( options.dateTypes[i].value===dateType )
                {
                    if( options.dateTypes[i].minDate!==undefined )
                    {
                        let minDate ;
                        switch( dateType )
                        { 
                            case "date":
                            {
                                minDate = moment(options.dateTypes[i].minDate).format('YYYYMMDD');
                                break;
                            }
                            case "month":
                            {
                                minDate = moment(options.dateTypes[i].minDate).format('YYYYMM');
                                break;
                            }
                            case "quarter":
                            {
                                minDate = options.dateTypes[i].minDate.replaceAll("Q", '');
                                break;
                            }
                            case "year":
                            {
                                minDate = moment(options.dateTypes[i].minDate).format('YYYY');
                                break;
                            }
                            default:
                                break;
                        }
                        
                        if( current<minDate )
                        {
                            ret = true;
                        }
                    }
        
                    if( options.dateTypes[i].maxDate!==undefined  )
                    {
                        let maxDate ;
                        switch( dateType )
                        { 
                            case "date":
                            {
                                maxDate = moment(options.dateTypes[i].maxDate).format('YYYYMMDD');
                                break;
                            }
                            case "month":
                            {
                                maxDate = moment(options.dateTypes[i].maxDate).format('YYYYMM');
                                break;
                            }
                            case "quarter":
                            {
                                maxDate =  options.dateTypes[i].maxDate.replaceAll("Q", '');
                                break;
                            }
                            case "year":
                            {
                                maxDate = moment(options.dateTypes[i].maxDate).format('YYYY');
                                break;
                            }
                            default:
                                break;
                        }

                        if( dateEnd!==undefined )
                        {
                            if( current>dateEnd )
                            {
                                ret = true;
                            }
                        }
                        else
                        {
                            if( current>maxDate )
                            {
                                ret = true;
                            }
                        }
                        
                    }
                }
            }           
        }

        return ret;
    }

    /**
     * 判断时间是否不能选择
     * @param {*} current 
     * @returns 
     */
    disabledEndDate( current ) 
    {
        let ret = false;

        let { dateType, options, dateStart } = this.state;

        if( current )
        {
            switch( dateType )
            { 
                case "date":
                {
                    current = moment(current).format('YYYYMMDD');
                    dateStart = dateStart!==undefined ? moment(dateStart).format('YYYYMMDD') : dateStart;
                    break;
                }
                case "month":
                {
                    current = moment(current).format('YYYYMM');
                    dateStart = dateStart!==undefined ? moment(dateStart).format('YYYYMM') : dateStart;
                    break;
                }
                case "quarter":
                {
                    current = moment(current).format('YYYYQ');
                    dateStart = dateStart!==undefined ?  dateStart.replaceAll("Q", '') : dateStart;
                    break;
                }
                case "year":
                {
                    current = moment(current).format('YYYY');
                    dateStart = dateStart!==undefined ? moment(dateStart).format('YYYY') : dateStart;
                    break;
                }
                default:
                    break;
            }

            for( let i in options.dateTypes )
            {
                if(  options.dateTypes[i].value===dateType )
                {
                    if( options.dateTypes[i].minDate!==undefined )
                    {
                        let minDate ;
                        switch( dateType )
                        { 
                            case "date":
                            {
                                minDate = moment(options.dateTypes[i].minDate).format('YYYYMMDD');
                                break;
                            }
                            case "month":
                            {
                                minDate = moment(options.dateTypes[i].minDate).format('YYYYMM');
                                break;
                            }
                            case "quarter":
                            {
                                minDate = options.dateTypes[i].minDate.replaceAll("Q", '');
                                break;
                            }
                            case "year":
                            {
                                minDate = moment(options.dateTypes[i].minDate).format('YYYY');
                                break;
                            }
                            default:
                                break;
                        }

                        if( options.datePickerType==="point" || this.state.datePickerType==="point" )
                        {
                            if( current<minDate )
                            {
                                ret = true;
                            }
    
                        }
                        else
                        {
                            if( dateStart!==undefined )
                            {
                                if( current<dateStart )
                                {
                                    ret = true;
                                }
                            }
                            else
                            {
                                if( current<minDate )
                                {
                                    ret = true;
                                }
                            }
                        }
                    }
        
                    if( options.dateTypes[i].maxDate!==undefined  )
                    {
                        let maxDate ;
                        switch( dateType )
                        { 
                            case "date":
                            {
                                maxDate = moment(options.dateTypes[i].maxDate).format('YYYYMMDD');
                                break;
                            }
                            case "month":
                            {
                                maxDate = moment(options.dateTypes[i].maxDate).format('YYYYMM');
                                break;
                            }
                            case "quarter":
                            {
                                maxDate = options.dateTypes[i].maxDate.replaceAll("Q", '');
                                break;
                            }
                            case "year":
                            {
                                maxDate = moment(options.dateTypes[i].maxDate).format('YYYY');
                                break;
                            }
                            default:
                                break;
                        }

                        if( current>maxDate )
                        {
                            ret = true;
                        }
                    }
                }
            }           
        }

        return ret;
    }

    formatDateTitle( date )
    {
        const { dateType } = this.state;

        switch( dateType )
        {
            case "date":
            {
                return moment(date).format('YYYY年MM月DD日');
            }
            case "month":
            {
                return moment(date).format('YYYY年MM月');
            }
            case "quarter":
            {
                return moment(date).format('YYYY年Q季度');
            }
            case "year":
            {
                return moment(date).format('YYYY年');
            }
            default :
            {
                return moment(date).format('YYYY年MM月');
            }

        }
    }

    buildDate( date )
    {
        const { dateType } = this.state;

        if( date!==undefined && date!=="")
        {
            switch( dateType )
            {
                case "date":
                    return moment(date, 'YYYYMMDD');
                case 'month':
                    return moment(date, 'YYYYMM');
                case "quarter":
                    return moment(date, 'YYYYQ');
                case 'year':
                    return moment(date, 'YYYY');
                default:
                    break;
            }
        }

        return null; 
    }

    componentWillReceiveProps( nextProps )
    {
        if( nextProps.isDefault!==undefined && nextProps.isDefault===true )
        {
            let { defaultValue } = this.state;

            if( nextProps.defaultValue!==undefined  && ( defaultValue===undefined || nextProps.defaultValue.dateType!==defaultValue.dateType || 
                nextProps.defaultValue.dateStart!==defaultValue.dateStart|| nextProps.defaultValue.dateEnd!==defaultValue.dateEnd)  )
            {

                let { options } = this.state;

                let defaultValue = nextProps.defaultValue;

                let dateType = defaultValue.dateType;

                options["dateType"] = dateType;

                let dateStart = this.buildDate(defaultValue.dateStart);
                let dateEnd = this.buildDate(defaultValue.dateEnd);

                let dateStartTitle = this.formatDateTitle(dateStart);
                let dateEndTitle = this.formatDateTitle(dateEnd);

                this.setState({defaultValue:nextProps.defaultValue, fromState:true, options:options, dateType:dateType, 
                    dateStart:defaultValue.dateStart, dateEnd:defaultValue.dateEnd, dateStartTitle:dateStartTitle, dateEndTitle:dateEndTitle });
            }
        }
    }


    render()
    {
        const { defaultValue, options} = this.props;

        let { dateTypes, dateType, datePickerType, status, dateStart, dateEnd, dateStartTitle, dateEndTitle, fromState, changeFlag, divId,className} = this.state;
        
        if( fromState!==true )
        {
            dateType = options.dateType!==undefined ? options.dateType : 'month';
            dateTypes = options.dateTypes!==undefined ? options.dateTypes : [{title:'月', value:'month'}];
            datePickerType = options.datePickerType!==undefined ? options.datePickerType : 'point';

            this.state['dateType'] = dateType;
            this.state['dateTypes'] = dateTypes;
            this.state['datePickerType'] = datePickerType;
        }
        
        let { title } = this.state;

        let contentClass = 'widget-date-content';

        if( datePickerType==="range" )
        {
            contentClass = 'widget-date-content-range'
        }

        if( defaultValue!==undefined && fromState!==true )
        {
            if( defaultValue.dateType===dateType)
            {
                dateStart = this.buildDate(defaultValue.dateStart);
                dateEnd = this.buildDate(defaultValue.dateEnd);

                this.state["dateEnd"] = defaultValue.dateEnd;
                this.state["dateStart"] = defaultValue.dateStart;

                if( dateStart!==null && dateEnd!==null )
                {
                    dateStartTitle = this.formatDateTitle(dateStart);
                    dateEndTitle = this.formatDateTitle(dateEnd);
    
                    this.state["dateStartTitle"] = dateStartTitle;
                    this.state["dateEndTitle"] = dateEndTitle;
                }
                else
                {
                    dateStartTitle = null;
                    dateEndTitle = null;

                    this.state["dateStartTitle"] = null;
                    this.state["dateEndTitle"] = null;
                }
            }
            else
            {
                for( let i in dateTypes )
                {
                    if( dateTypes[i].value===dateType )
                    {
                        dateStart = this.buildDate(dateTypes[i].defaultValue.dateStart);
                        dateEnd = this.buildDate(dateTypes[i].defaultValue.dateEnd);
                        
                        this.state["dateEnd"] = dateTypes[i].defaultValue.dateEnd;
                        this.state["dateStart"] = dateTypes[i].defaultValue.dateStart;

                        if( dateStart!==null && dateEnd!==null )
                        {
                            dateStartTitle = this.formatDateTitle(dateStart);
                            dateEndTitle = this.formatDateTitle(dateEnd);
    
                            this.state["dateStartTitle"] = dateStartTitle;
                            this.state["dateEndTitle"] = dateEndTitle;
                        }
                        else
                        {
                            dateStartTitle = null;
                            dateEndTitle = null;

                            this.state["dateStartTitle"] = null;
                            this.state["dateEndTitle"] = null;
                        }
                    }
                }
            }
            //dateStartTitle = this.formatDateTitle(dateStart);
            //dateEndTitle = this.formatDateTitle(dateEnd);   
        }
        else
        {
            if( changeFlag==='changeDateType')
            {
                for( let i in dateTypes )
                {
                    if( dateTypes[i].value===dateType )
                    {
                        dateStart = this.buildDate(dateTypes[i].defaultValue.dateStart);
                        dateEnd = this.buildDate(dateTypes[i].defaultValue.dateEnd);
                        
                        this.state["dateEnd"] = dateTypes[i].defaultValue.dateEnd;
                        this.state["dateStart"] = dateTypes[i].defaultValue.dateStart;

                        if( dateStart!==null && dateEnd!==null )
                        {
                            dateStartTitle = this.formatDateTitle(dateStart);
                            dateEndTitle = this.formatDateTitle(dateEnd);
    
                            this.state["dateStartTitle"] = dateStartTitle;
                            this.state["dateEndTitle"] = dateEndTitle;
                        }
                        else
                        {
                            dateStartTitle = null;
                            dateEndTitle = null;

                            this.state["dateStartTitle"] = null;
                            this.state["dateEndTitle"] = null;
                        }
                    }
                }
            }
            else
            {
                dateStart = this.buildDate(dateStart);
                dateEnd = this.buildDate(dateEnd);

                if( dateStart!==null && dateEnd!==null )
                {
                    dateStartTitle = this.formatDateTitle(dateStart);
                    dateEndTitle = this.formatDateTitle(dateEnd);

                    this.state["dateStartTitle"] = dateStartTitle;
                    this.state["dateEndTitle"] = dateEndTitle;
                }
                else
                {
                    dateStartTitle = null;
                    dateEndTitle = null;

                    this.state["dateStartTitle"] = null;
                    this.state["dateEndTitle"] = null;
                }
            }
        }

        this.state["fromState"] = false;
        
        if( dateStartTitle===null || dateEndTitle===null )
        {
            title = "请选择日期";
            className="widget-date-title"
        }
        else
        {
            if( datePickerType==="point" )
            {
                dateStart = dateEnd;
                
                title = dateEndTitle;
            }
            else
            {
                title = dateStartTitle + "-" + dateEndTitle;
                
            }
            className="widget-date-title-font"
        }
        
        if( options.isLeftTitle===false )
        {
            contentClass += "-no-left";

            return (
                <div style={{float:'left'}}>
                    <div className="widget-date" >
                        <div ref={this.dateTitleRef} className={className} onClick={this.changeStatus} title={title} > {title} </div>
                        <div ref={this.dateContentRef} className={contentClass} style={{ display: status}}>
                            <div className="date-content-right" style={{width:'100%'}}>
                                <DateContent flag={this.props.flag} datePickerType={datePickerType} dateType={dateType} onChangeEnd={this.onChangeEnd} divId={divId}
                                    onChangeStart={this.onChangeStart}  disabledEndDate={this.disabledEndDate} disabledStartDate={this.disabledStartDate} open={status==="none"?false:true} 
                                    defaultValue={{dateStart:dateStart,dateEnd:dateEnd}}
                                />
                                <div className="footer">
                                    <Button onClick={this.cancle} type="default">取消</Button>
                                    <Button onClick={this.confirm} type="primary">确认</Button>
                                </div>
                            </div>
                               
                        </div>
                    </div>
                </div>
            )
        }
        else
        {
            return (
                <div style={{float:'left'}}>
                    <div className="widget-date">
        
                        <div ref={this.dateTitleRef} className={className} onClick={this.changeStatus} title={title} > {title} </div>
            
                        <div ref={this.dateContentRef} className={contentClass} style={{ display: status}} >
                            
                            <div className="date-content-left">
                                <ul>
                                {
                                    dateTypes.map((item, index) => {
                                        if( item.value===dateType )
                                        {
                                            return <li key={index} className='active' onClick={ ()=> this.changeDateType(item.value) }>{item.title}</li> 
                                        }
                                        else
                                        {
                                            return <li key={index} onClick={ ()=> this.changeDateType(item.value) }> {item.title}</li> 
                                        }
                                    }) 
                                }
                                </ul>
                            </div>
        
                            <div className="date-content-right">
                                <DateContent flag={this.props.flag} datePickerType={datePickerType} dateType={dateType} onChangeEnd={this.onChangeEnd} divId={divId}
                                    onChangeStart={this.onChangeStart}  disabledEndDate={this.disabledEndDate} disabledStartDate={this.disabledStartDate} open={status==="none"?false:true} 
                                    defaultValue={{dateStart:dateStart,dateEnd:dateEnd}}
                                />
                                <div className="footer">
                                    <Button onClick={this.cancle} type="default">取消</Button>
                                    <Button onClick={this.confirm} type="primary">确认</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}
export default WidgetFilterDatePicker

export const DateContent = ({ datePickerType, dateType, ...props }) => 
{
   let [dateStart,setDateStart] = useState(null)
   let [dateEnd,setDateEnd]= useState(null)
   useEffect(()=>{
       setDateStart(props.defaultValue.dateStart)
       setDateEnd(props.defaultValue.dateEnd)
       if(props.flag){
            setDateStart(null);
            setDateEnd(null)
       }
   })
    if( datePickerType==="point" )
    {
        let divId = props.divId + 'widget-datePicker-popup';
        switch( dateType )
        {
            case "date":
                return <div id={divId}>
                    <DatePicker
                        getPopupContainer={()=>document.getElementById(divId)}
                        dropdownClassName='widget-datePicker-popup-end' 
                        className='widget-datePicker' 
                        open={props.open} locale={locale} 
                        size={'default'} 
                        showToday= {false}
                        onChange={props.onChangeEnd}
                        defaultValue={dateEnd}
                        defaultPickerValue={dateEnd}
                        value={dateEnd}
                        disabledDate={props.disabledEndDate}/>
                </div>
            case "month":
                return  <div id={divId}>
                    <DatePicker
                        getPopupContainer={()=>document.getElementById(divId)}
                        dropdownClassName='widget-datePicker-popup-end' 
                        className='widget-datePicker' 
                        open={props.open} locale={locale} 
                        size={'default'}
                        onChange={props.onChangeEnd}
                        defaultValue={dateEnd}
                        defaultPickerValue={dateEnd}
                        value={dateEnd}
                        picker="month" disabledDate={props.disabledEndDate}/>
                </div>
            case "quarter":
                return <div id={divId}>
                    <DatePicker 
                        getPopupContainer={()=>document.getElementById(divId)}
                        dropdownClassName='widget-datePicker-popup-end' 
                        className='widget-datePicker' 
                        open={props.open} locale={locale}
                        defaultValue={dateEnd}
                        defaultPickerValue={dateEnd}
                        value={dateEnd}
                        size={'default'} 
                        onChange={props.onChangeEnd} 
                        picker="quarter" 
                        disabledDate={props.disabledEndDate} />
                </div>
            case "year":
                return <div id={divId}>
                    <DatePicker 
                        getPopupContainer={()=>document.getElementById(divId)}
                        dropdownClassName='widget-datePicker-popup-end' 
                        className='widget-datePicker' 
                        open={props.open} locale={locale}
                        defaultValue={dateEnd}
                        defaultPickerValue={dateEnd}
                        value={dateEnd}
                        size={'default'} onChange={props.onChangeEnd} 
                        picker="year" 
                        disabledDate={props.disabledEndDate}/>
                </div>
            default:
                return <div id={divId}>
                    <DatePicker
                        getPopupContainer={()=>document.getElementById(divId)}
                        dropdownClassName='widget-datePicker-popup-end' 
                        className='widget-datePicker' 
                        open={props.open} locale={locale} 
                        size={'default'}
                        defaultValue={dateEnd}
                        defaultPickerValue={dateEnd}
                        value={dateEnd}
                        onChange={props.onChangeEnd} picker="month" disabledDate={props.disabledEndDate}/>
                </div>
        }
    }
    else
    {
        let divStart = props.divId + 'widget-datePicker-popup-start';
        let divEnd = props.divId + 'widget-datePicker-popup-end';

        switch( dateType )
        {
            case "date":
                return (
                    <div>
                        <div id={divStart} className="widget-datePicker-popup">
                            <DatePicker
                                getPopupContainer={()=>document.getElementById(divStart)}
                                dropdownClassName='widget-datePicker-popup-end' 
                                className='widget-datePicker' 
                                open={props.open} locale={locale} 
                                size={'default'} 
                                showToday= {false}
                                onChange={props.onChangeStart}
                                defaultValue={dateStart}
                                defaultPickerValue={dateStart}
                                value={dateStart}
                                disabledDate={props.disabledStartDate}/>
                        </div>
                        <div id={divEnd} className="widget-datePicker-popup">
                            <DatePicker
                                getPopupContainer={()=>document.getElementById(divEnd)}
                                dropdownClassName='widget-datePicker-popup-end' 
                                className='widget-datePicker' 
                                open={props.open} locale={locale} 
                                size={'default'}
                                showToday= {false}
                                onChange={props.onChangeEnd}
                                defaultValue={dateEnd}
                                defaultPickerValue={dateEnd}
                                value={dateEnd}
                                disabledDate={props.disabledEndDate}/>
                        </div>
                    </div>
                )
            case "month":                                       
                return (
                    <div>
                        <div id={divStart} className="widget-datePicker-popup">
                            <DatePicker
                                getPopupContainer={()=>document.getElementById(divStart)}
                                dropdownClassName='widget-datePicker-popup-end' 
                                className='widget-datePicker' 
                                open={props.open} locale={locale} 
                                size={'default'}
                                defaultValue={dateStart}
                                defaultPickerValue={dateStart}
                                value={dateStart}
                                onChange={props.onChangeStart} picker="month" disabledDate={props.disabledStartDate}/>
                            </div>
                        <div id={divEnd} className="widget-datePicker-popup">
                            <DatePicker
                                getPopupContainer={()=>document.getElementById(divEnd)}
                                dropdownClassName='widget-datePicker-popup-end' 
                                className='widget-datePicker' 
                                open={props.open} locale={locale} 
                                size={'default'}
                                defaultValue={dateEnd}
                                defaultPickerValue={dateEnd}
                                value={dateEnd}
                                onChange={props.onChangeEnd} picker="month" disabledDate={props.disabledEndDate}/>
                        </div>
                    </div>
                )
            case "quarter":
                return (
                    <div>
                       <div id={divStart} className="widget-datePicker-popup">
                            <DatePicker 
                                getPopupContainer={()=>document.getElementById(divStart)}
                                dropdownClassName='widget-datePicker-popup-end' 
                                className='widget-datePicker' 
                                open={props.open} locale={locale}
                                defaultValue={dateStart}
                                defaultPickerValue={dateStart}
                                value={dateStart}
                                size={'default'} onChange={props.onChangeStart} picker="quarter" disabledDate={props.disabledStartDate} />
                        </div>
                        <div id={divEnd} className="widget-datePicker-popup">
                            <DatePicker 
                                getPopupContainer={()=>document.getElementById(divEnd)}
                                dropdownClassName='widget-datePicker-popup-end' 
                                className='widget-datePicker' 
                                open={props.open} locale={locale}
                                defaultValue={dateEnd}
                                defaultPickerValue={dateEnd}
                                value={dateEnd}
                                size={'default'} onChange={props.onChangeEnd} picker="quarter" disabledDate={props.disabledEndDate} />
                        </div>
                    </div>
                )
            case "year":
                return (
                    <div>
                        <div id={divStart} className="widget-datePicker-popup">
                            <DatePicker 
                                cleanable={true}
                                getPopupContainer={()=>document.getElementById(divStart)}
                                dropdownClassName='widget-datePicker-popup-end' 
                                className='widget-datePicker' 
                                open={props.open} locale={locale}
                                defaultValue={dateStart}
                                defaultPickerValue={dateStart}
                                value={dateStart}
                                size={'default'} onChange={props.onChangeStart} picker="year" disabledDate={props.disabledStartDate} />
                        </div>
                        <div id={divEnd} className="widget-datePicker-popup">
                            <DatePicker 
                                getPopupContainer={()=>document.getElementById(divEnd)}
                                dropdownClassName='widget-datePicker-popup-end' 
                                className='widget-datePicker' 
                                open={props.open} locale={locale}
                                defaultValue={dateEnd}
                                defaultPickerValue={dateEnd}
                                value={dateEnd}
                                size={'default'} onChange={props.onChangeEnd} picker="year" disabledDate={props.disabledEndDate} />
                        </div>
                    </div>
                )
            default:
                return (
                    <div>
                        <div id={divStart} className="widget-datePicker-popup">
                            <DatePicker
                                getPopupContainer={()=>document.getElementById(divStart)}
                                dropdownClassName='widget-datePicker-popup-end' 
                                className='widget-datePicker' 
                                open={props.open} locale={locale} 
                                size={'default'}
                                defaultValue={dateStart}
                                defaultPickerValue={dateStart}
                                value={dateStart}
                                onChange={props.onChangeStart} picker="month" disabledDate={props.disabledStartDate}/>
                            </div>
                        <div id={divEnd} className="widget-datePicker-popup">
                            <DatePicker
                                getPopupContainer={()=>document.getElementById(divEnd)}
                                dropdownClassName='widget-datePicker-popup-end' 
                                className='widget-datePicker' 
                                open={props.open} locale={locale} 
                                size={'default'}
                                defaultValue={dateEnd}
                                defaultPickerValue={dateEnd}
                                value={dateEnd}
                                onChange={props.onChangeEnd} picker="month" disabledDate={props.disabledEndDate}/>
                        </div>
                    </div>
                )
        }
    }
} 