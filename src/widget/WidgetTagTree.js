import React from "react";
import { Cascader } from "antd";

import '../css/widget/widget.tageTree.css';

class WidgetTagTree extends React.Component 
{
    constructor(props) 
    {
        super(props);


        this.state = {
            values: [],
            isFromState: false,
            //data:tag,
            catalog: [],
            currentCatalog: [],
            param: props.param,
            defaultValues: [],
            checkNodes: props.defaultNodes,
            searchable: props.searchable || true,
            option: props.option,
            width: undefined,
            loading:this.props.loading ?? false,
            height: undefined
        }

        this.onChange = this.onChange.bind(this);
        this.buildData = this.buildData.bind(this);
        this.findCatalog = this.findCatalog.bind(this);
        this.initTagValue = this.initTagValue.bind(this);

        // 获取组件自身
        this.myRef = React.createRef();
    }

    async onChange(values, event) 
    {
        let checkNode = [];
        let vals = [];
        values.forEach((item, index)=>{
            vals.push(item[item.length-1]);
            let checks = []
            item.forEach((i, v)=>{
                if(item[item.length-1] === event[index][v].value){
                    checks.push({...event[index][v], parentCatalog: event[index][v-1]})
                }
            })
            checkNode.push(checks)
        })
        checkNode = [[].concat.apply([], checkNode)]

        let arrT = Object.values(checkNode[0].reduce((res, item)=>{
            res[item.type] ? res[item.type].push(item) : res[item.type] = [item]
            return res;
        },{}))

        if (this.props.onSelect !== undefined) 
        {
            this.props.onSelect(arrT, [...vals], [...values]);
        }

        this.setState({ defaultValues: [...values], isFromState: true });

    }

    findCatalog(datas) 
    {
        let { catalog } = this.state;

        for (let i = 0; i < datas.length; i++) 
        {
            if (datas[i].catalog) 
            {
                catalog.push(datas[i].value);

                if (datas[i].children !== undefined) 
                {
                    this.findCatalog(datas[i].children);
                }
            }
        }
    }

    buildData(datas) 
    {
        let tag = [];

        if(datas)
        {
            for (let i = 0; i < datas.length; i++) 
            {
                if (tag[i] === undefined) tag[i] = {};

                tag[i]["label"] = datas[i].name;
                tag[i]["value"] = datas[i].code;
                tag[i]["type"] = datas[i].type;
                tag[i]["children"] = datas[i].catalog;
                tag[i]["id"] = datas[i].code;

                if (datas[i].subtags !== undefined) 
                {
                    tag[i]["children"] = this.buildData(datas[i].subtags);
                }
            }
        }

        return tag;

    }

    updateRect() 
    {
        if (this.myRef !== undefined && this.myRef !== null && this.myRef.current !== undefined && this.myRef.current !== null) {
            const height = this.myRef.current.parentElement.clientHeight;
            const width = this.myRef.current.parentElement.clientWidth;

            if (this.state.width !== width || this.state.height !== height) 
            {
                this.setState({ width: width, height: height });
            }
        }
    }

    /**
     * 初始化标签value
     * @param {*} values 
     */
    initTagValue( values )
    {
        if( values!==undefined && values.length>0 )
        {
            this.setState({defaultValues:values});
        }
    }

    componentDidMount() 
    {
        this.updateRect();
        this.initTagValue(this.props.defaultValue);
        
    }

    componentDidUpdate() 
    {
        this.updateRect();
    }

    componentWillReceiveProps(nextProps)
    {
        if(nextProps.defaultValue !== this.props.defaultValue){
            
            this.setState({defaultValues:[...nextProps.defaultValue]});
        }
    }

    render() {
        const data = this.buildData(this.props.data);

        // this.findCatalog(data);

        let { searchable, defaultValues,loading } = this.state;
        const {open = true, divID = ''} = this.props;

        if(loading===true||data===undefined)
        {
            return (
                <div ref={this.myRef} className="sf-widget-report" style={{position:'relative'}}>
                    <p className="sf-widget-report-loading"><img className="load" src={require('./../img/frame/loading.gif')} alt="es-lint want to get"/></p> 
                </div>
            );
        }else 
        {
            return (
                <div className="sf-tag-tree sd-tag-tree sg-tag-tree" ref={this.myRef} key={"key"}>
                    <Cascader 
                        options={[...data]}
                        open={true}
                        multiple
                        onChange={this.onChange}
                        defaultValue={defaultValues}
                        value={defaultValues}
                        showSearch={searchable}
                        getPopupContainer={() => document.getElementById(divID)}
                    />
                </div>
            );
        }
       
    }
}

export default WidgetTagTree;