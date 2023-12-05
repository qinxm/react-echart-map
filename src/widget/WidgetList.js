import React, {Component} from 'react';

import { Container, Draggable } from 'react-smooth-dnd';

import WidgetInput from './WidgetInput';


import './../css/widget/widget.list.css';

class WidgetList extends Component 
{
    constructor ( props )
    {
        super(props);

        this.state = {
            allData : props.data ? props.data : [],
            data : props.data ? props.data : []
        }
    }

    /**
     * 获取移动的孩子节点
     * @param {*} index 
     */
    getChildPayload = ( index ) => {

        const { data = [] } = this.props;

        if( this.props.notify )
        {
            this.props.notify(data[index], data, "getChildPayload");
        }

        this.setState({node:data[index], data:data})
    }

    /**
     * 删除节点的函数
     * @param {*} e 
     */
    onDrop = ( e ) => {

        const { data = [] } = this.props;

        if( this.props.notify )
        {
            this.props.notify( e, data, "onDrop");
        }
    }

    onClick = ( e, item ) => {

        if( this.props.notify )
        {
            this.props.notify( e, item, "click");
        }
    }

    onDragEnd = (e, a, b, c) => {
       console.log(e);
    }

    /**
     * 检索含有关键字的数据
     */
    search = ( isWillProps ) => {

        const { allData, keyWord } = this.state;

        let data = [];

        if( keyWord!==undefined && keyWord!=="" )
        {
            for( let item of allData )
            {
                if( item.title && item.title.indexOf(keyWord)>-1 )
                {
                    data.push(item);
                }
            }

            this.setState({data:data});
        }
        else
        {
            this.setState({data:[...allData]});
        }

        if( this.props.notify && isWillProps!==true )
        {
            this.props.notify(keyWord, null, "search")
        }
    }

    //键盘捕获事件
    keyWordKeyUp = (e, type) => {

        if ( e.keyCode === 13) 
        {
            this.search();
        }
    };

    componentWillReceiveProps( nextProps ) 
    {
        if( nextProps.data && nextProps.data.length>0 )
        {
            this.setState({allData:nextProps.data, data:[...nextProps.data]}, () => {
                this.search( true );
            });
        }
    }

    render ()
    {
        const { data = [], keyWord} = this.state;

        const { options } = this.props;
        return (
            <div className="sf-list" >
                <div className="sf-list-input">
                    <WidgetInput
                        placeholder="请输入名称"
                        defaultValue={keyWord}
                        onChange={(e) => {
                            this.setState({ keyWord: e.target.value });
                        }}
                        onKeyUp={(e) => this.keyWordKeyUp(e)}
                        onClick={( e ) =>{ this.search(e) }}
                    />
                </div>

                <div className="sf-list-title">
                    <span>{options.title}</span>
                </div>

                <div className="sf-list-body">
                    <Container groupName="1" behaviour={options.behaviour ? options.behaviour : 'move'} getChildPayload={this.getChildPayload}
                        onDrop={ this.onDrop } 
                        onDragEnd={this.onDragEnd}
                    >
                    {
                        data.map((item, index) => {
                            return (
                                <Draggable key={item.value}>
                                    <div className="draggable-item" onClick={ (e) => {this.onClick(e, item)}}>
                                        {item.title}
                                    </div>
                                </Draggable>
                            );
                        })
                    }
                    </Container>
                </div>
            </div>
        );
    }
}

export default WidgetList;