import React from 'react';

import { Radio } from 'antd';

import './../css/widget/widget.radio.css';

class WidgetRadio extends React.Component 
{
    constructor( props )
    {
        super(props);

        this.state = {
            options : props.options || {
                    isTitle : false
                },
            data : props.data || [],
            defaultValue : props.defaultValue,
            title : props.title || ""
        }
    }

    /**
     * 选择变化的调用函数
     * @param {*} e 
     */
    onChange = (e) => {

        let item;

        const { data } = this.props;

        this.setState({defaultValue:e.target.value});

        for(let dataItem of data)
        {
            if( dataItem.value===e.target.value )
            {
                item = dataItem;
            }
        }

        if( this.props.onChange!==undefined )
        {
            this.props.onChange(e.target.value, item);
        }
    }

    componentWillReceiveProps( nextProps )
    {
        const {defaultValue } = this.state;

        if( nextProps.defaultValue!==defaultValue )
        {
            this.setState({defaultValue:nextProps.defaultValue});
        }
    }

    render()
    {
        const { defaultValue} = this.state;

        const {data, options } = this.props;

        if( options && data )
        {
            if( options.isTitle!==false )
            {
                const { title } = options;

                return (
                    <div className='sf-radio sd-radio sg-radio'>
                        <div className='sf-radio-title'>
                            {
                                options.nullable && options.nullable===true ? 
                                <></> : 
                                <> <div className='sf-nullable'>*</div> </>
                            }
                            {title}
                        </div>
                        <div className='sf-radio-body'>
                            <Radio.Group onChange={this.onChange} value={defaultValue}>
                            {
                                data.map((item, index) => {
                                    return <Radio key={item.value + index} value={item.value}>{item.title}</Radio>;
                                })
                            }
                            </Radio.Group>
                        </div>
                    </div>
                )
            }
            else
            {
                return (
                    <div className='sf-radio sd-radio sg-radio'>
                        <div className='sf-radio-body'>
                            <Radio.Group onChange={this.onChange} value={defaultValue}>
                            {
                                data.map((item, index) => {
                                    return <Radio key={item.value + index} value={item.value}>{item.title}</Radio>;
                                })
                            }
                            </Radio.Group>
                        </div>
                    </div>
                )
            }
        }
        else
        {
            return <></>
        }

        
        
    }
}

export default WidgetRadio