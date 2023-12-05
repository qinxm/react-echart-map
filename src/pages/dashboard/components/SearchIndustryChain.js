import React, { Component } from "react";
import { Select, Space, message, Spin } from 'antd';
import './SearchIndustryChain.scss';
import {
  SearchOutlined,
} from '@ant-design/icons';
import Config from "../../../config/Config"
import WidgetAjax from "../../../widget/WidgetAjax";
const path = Config.getBasePath();
class SearchIndustryChain extends Component {
  constructor(props) {
    super();
    const radius = this.getRadius();
    this.state = {
      timer: null,
      pos: [],
      radius: radius,
      dataList: [
      ],
      newdataList: [],
      fieldNames: {
        label: 'name',
        value: 'code'
      },
      loading:true,
    }
    this.propChangeIndustry = props.onChangeIndustry;
    
    this.getIndustryChainList();
   
  }
  // 获取半径
  getRadius () {
    const conHeight=1080, conWidth=1920;
    // let conHeight=window.innerHeight, conWidth=window.innerWidth;
    // var height = parseInt(0.5625* window.innerWidth);
    // var width = parseInt(16/9* window.innerHeight);
    // if(height < conHeight) {
    //   conHeight= height
    // }else if(width < conWidth) {
    //   conWidth = width
    // }
    let radius =  conWidth*0.245
    return radius;
  }
  
  
  getMore(_this, flag=1) {
    const srart_pos = 90.75;
    // const flag = 1;
    const s = 0.52 * Math.PI / 180; 
    const radius =this.state.radius
    var elem = document.getElementsByClassName('leftlist-btn-industry');
    const item_count = elem.length;
    let pos = _this.state.pos
    pos[0] = srart_pos;
   
    var e = elem;
    const animate = (draw, duration, callback)=> {
        var start = performance.now();
        requestAnimationFrame(function animate(time) {
            var timePassed = time - start;
            if (timePassed > duration) {
              timePassed = duration;
            }
            draw(timePassed);
            
            if (timePassed < duration) {
                requestAnimationFrame(animate);
            } else callback();
        });
    }
    animate( (timePassed) => {
        var i;
        for (i = 0; i < item_count; i++) {
            e[i].style.left = radius - radius * Math.sin(pos[i]) + 'px';
            e[i].style.top = radius + radius * Math.cos(pos[i]) + 'px';
            if (flag) {
                pos[i] += s; 
            } else {
                pos[i] -= s; 
            }
        }  
    }, 200, () =>{
        var list = document.getElementById('list');
        var ch = flag ? list.firstElementChild : list.lastElementChild
        ch.remove();
        if (flag) {
          list.appendChild(ch);
        } else {
          list.insertBefore(ch, list.firstChild);
        }
        _this.allocationItems();
    });

  }
  allocationItems() {
    const srart_pos = 90.75;
    const radius = this.state.radius
    var pos =this.state.pos
    var elem = document.getElementsByClassName('leftlist-btn-industry');
    const item_count = elem.length;
    var i;
    pos[0] = srart_pos;
    for (i = 1; i < item_count; i++) {
      pos[i] = pos[i - 1] - 0.3045;
    }
    for (i = 0; i < item_count; i++) {
      elem[i].style.left = radius - radius * Math.sin(pos[i]) + 'px';
      elem[i].style.top = radius+ radius * Math.cos(pos[i]) + 'px';
    }
     
  }
  componentDidMount() {
    window.addEventListener('resize',()=>{
      this.setState({
        'radius': this.getRadius(),
      })
    })
  }
  getIndustryChainList() {
    
      window.setTimeout(() => {

    
        let res = {"status":0,"message":"OK","total":10,"results":[{"code":"10000","name":"data0","values":"{code=10000, name=data0, value=data0}"},{"code":"10001","name":"data1","values":"{code=10001, name=data1, value=data1}"},{"code":"10002","name":"data2","values":"{code=10002, name=data2, value=data2}"},{"code":"10003","name":"data3","values":"{code=10003, name=data3, value=data3}"},{"code":"10004","name":"data4","values":"{code=10004, name=data4, value=data4}"},{"code":"10005","name":"data5","values":"{code=10005, name=data5, value=data5}"},{"code":"10006","name":"data6","values":"{code=10006, name=data6, value=data6}"},{"code":"10007","name":"data7","values":"{code=10007, name=data7, value=data7}"},{"code":"10008","name":"data8","values":"{code=10008, name=data8, value=data8}"},{"code":"10009","name":"data9","values":"{code=10009, name=data9, value=data9}"}]}
        if(res.status === 0) {
          let dataList = res.results;
          let length = dataList.length;
          if(length > 4) {
            this.setState({'newdataList': [dataList[length-1]].concat(dataList.slice(0, dataList.length-1))})
            this.setState({'dataList': dataList})
            // 默认选择第四个，可修改
            this.changeIndustry(this, dataList[3])
          } else {
            message.error('数据不能少于4个');
          }
        } else {
          message.error(res.message, 5);
        }
        this.setState({loading: false})
  
  }, 500)
  }
  componentDidUpdate() {
    this.allocationItems();
  }
  componentWillUnmount() {
    this.state.timer=null
  }
  handleChange(vm, v) {
    let allLength = vm.state.newdataList.length;
    let halfLength = parseInt(allLength/2)
    let selectCodeIndex = vm.state.newdataList.findIndex(item => item.code == v)
    let centerIndex = vm.state.newdataList.findIndex(item => item.code == document.getElementsByClassName('leftlist-btn-industry')[4].getAttribute('data-code'))
    let needClickNum =  0
    
    if(centerIndex < selectCodeIndex) {
      needClickNum = selectCodeIndex - centerIndex
    }
    if(centerIndex > selectCodeIndex) {
      needClickNum = selectCodeIndex + (allLength-centerIndex)
    }
   
    while(needClickNum > 0) {
      vm.getMore(vm)
      needClickNum--;
    }
    vm.changeIndustry(vm, vm.state.newdataList.find(item => item.code == v))
   
  }
  // 下一个 1秒内只能点击一次，防止误操作
  handleChangeNext(vm,) {
  if (vm.state.timer)  return
  let newcode = document.getElementsByClassName('leftlist-btn-industry')[5].getAttribute('data-code')
  vm.handleChange(vm, newcode)
  vm.state.timer = setTimeout(() => {
    vm.state.timer = null
    vm.setState({
      'timer': null
    })
  }, 1000)

  }
  changeIndustry(v, item) {
   let dataList =  v.state.newdataList.map(item1 => {
      if(item1.code == item.code ) {
      item1.isActive = true
    } else {
      item1.isActive = false
    }
    return item1
    })
    v.setState({
      'newdataList': dataList
    })
    item.isActive = true
    v.propChangeIndustry(item)
  }
  render() {
    let { dataList,newdataList,fieldNames,radius,loading } = this.state;
    if(!loading) {
    return (
      <div className="con-industrychain-list">
        <div  className="con-industrychain-select">
        <Select
          style={{ width: '100%', 'zIndex': 9999 }}
          onChange={(v) => this.handleChange(this, v)}
          options={dataList}
          fieldNames={fieldNames}
          suffixIcon={<SearchOutlined/>}
          showArrow
          popupClassName="industry-select"
        >
        </Select>
        </div>
        <div className="con-btn-list" style={{height:radius*1.71}}>
          <div className="btn-list" id="list" style={{top:radius*-0.199, right: radius*-0.2}}>
            {newdataList.map((item, index) => (
              <div  className={[
                "leftlist-btn-industry",
                item.isActive ? "leftlist-btn-industry-active" : "",
              ].join(" ")} key={index} onClick={()=> this.handleChange(this, item.code)} data-code={item.code}>
                <span>{item.name}</span>
              </div>
            ))} 
            </div>
         
              
          </div>
          <div className="btn-more" onClick={() => this.handleChangeNext(this)} style={{left: 0.6*radius}}>
        </div>
      </div>
    )
  } else {
    return <Spin />
  }
  }
}
export default SearchIndustryChain