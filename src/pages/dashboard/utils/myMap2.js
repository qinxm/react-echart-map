//散点图标准数据格式;
import * as echarts from "echarts/core";
import { geoCoordMap } from "../utils/china";
var colors = ['#02f5ed', '#fadb69', '#ec7547']
//01.获取数组对象值的最大值;
function getMax(Arr) {
  var newArr = [];
  for (var i = 0; i < Arr.length; i++) {
      newArr.push(Arr[i].data);
  }
  var maxValue = Math.max.apply(null, newArr);
  // return 0.9 / maxValue;
  return 3 / maxValue;
}

//02.柱状体的顶部坐标;
function getTopData(Arr, maxValue) {
  var newArr = [];
  for (var i = 0; i < Arr.length; i++) {
      newArr.push({name:Arr[i].name,value:[Arr[i].value[0], Arr[i].value[1] + Arr[i].data * maxValue, Arr[i].data]});
  }
  
  return newArr;
}

//03.柱状体的主干;
function getBodyData(Arr, maxValue) {
  var newArr = [];
  for (var i = 0; i < Arr.length; i++) {
      newArr.push({
          name:Arr[i].name,
          coords: [
              [Arr[i].value[0], Arr[i].value[1]],//起点坐标
              [Arr[i].value[0], Arr[i].value[1] + Arr[i].data * maxValue]//终点坐标
          ]
      });
  }
  return newArr;
}


export const setOption2 = (echartInstance,selfOption, data) =>{
  // scrData =[
  //   {"name": "新疆", "value": [87.617733,43.792818], data: 700},
  //   {"name": "北京", "value": [116.405285,39.904989], data: 300},
  //   {"name": "青海", "value": [101.778916,36.623178], data: 200},
  //   {"name": "宁夏", "value": [106.278179,38.46637], data: 1000},
  // ]

  // {
  //   FMZL_COUNT: 11,
  //   SYXXZL_COUNT: 22,
  //   WGSJZY_COUNT: 33,
  //   discode: "110000",
  //   disname: "北京",
  // },
let scrData = data.map(item => {
 return {
  name: item.disname,
    value: geoCoordMap[item.disname],
    data:  Number(item.FMZL_COUNT) + Number(item.SYXXZL_COUNT)  + Number(item.WGSJZY_COUNT)
  }
})
let option =Object.assign(selfOption,{
  
  tooltip: {
    show: true,
    padding: 0,
    textStyle: {
      color: '#fff'
    },
    borderColor: "rgba(0,0,0,0)",
    backgroundColor: "rgba(0,0,0,.5)",
    formatter:(params => {
      if(params.data) {
        let areaItem = data.find(item =>  item.disname == params.name)
        return `
          <div style="background-color: #2d80cbcc;font-weight: bold;color: #fff;padding: 5px 10px;">${areaItem.disname}</div>
          <div style="background-color: #18314f80;color: #fff;padding: 5px 10px; line-height: 2">
            <div style="border-bottom: 1px solid #ffffff33"><span style="margin-right: 42px;">发明专利数量</span> <span style="display: inline-block; width: 60px;text-align:right;">${areaItem.FMZL_COUNT}</span></div>
            <div style="border-bottom: 1px solid #ffffff33"><span style="margin-right: 15px;">外观设计专利数量</span>  <span style="display: inline-block; width: 60px;text-align:right;">${areaItem.SYXXZL_COUNT}</span></div>
            <div style="border-bottom: 1px solid #18314f"><span style="margin-right:15px;">外观设计专利数量</span>  <span style="display: inline-block; width: 60px;text-align:right;">${areaItem.WGSJZY_COUNT}</span></div>
          </div>`;
      } else {
        return params.name
      }
    })
  },
  series: [
    {
      type: "map",
      map: "china",
      geoIndex: 0,
      coordinateSystem: "geo",
      showLegendSymbol: true,
      roam: true,
      label: {
        show: true,
        textStyle: {
          color: "#fff",
        },
      },
      itemStyle: {
        opacity: 1,
        borderColor: "#2ab8ff",
        borderWidth: 1.5,
        // areaColor: "#12235c",
      },
      emphasis: {
        disabled: true,
      },
      zlevel: 9,
      data: scrData,
    },
    {
      type: "lines",
      zlevel: 5,
      effect: {
        symbolSize: 1, // 图标大小
      },
      lineStyle: {
        width: 10, // 尾迹线条宽度
        color: function (params) {
          let color = colors[params.dataIndex % 3]
          return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 1,
              color:color,
            },
            {
              offset: 0,
              color: '#ffffffcc',
            },
          ]);
        },
        opacity: 1, // 尾迹线条透明度
        curveness: 0, // 尾迹线条曲直度
      },
      label: {
        show: false,
        position: "end",
        formatter: "245",
      },
      silent: true,
      data: getBodyData(scrData, getMax(scrData)),
    },
    // 柱状体的顶部
    {
      type: "scatter",
      coordinateSystem: "geo",
      geoIndex: 0,
      zlevel: 5,
      label: {
        show: false,
       
        position: "top",
      },
      symbol: "circle",
      symbolSize: [8, 4],
      itemStyle: {
        color: function (params) {
          return '#ffffffcc'
        },
        opacity: 1,
      },
      silent: true,
      data: getTopData(scrData, getMax(scrData)),
    },
    {
      type: "effectScatter",
      coordinateSystem: "geo",
      geoIndex: 0,
      zlevel: 4,
      label: {
        show: false,
      },
      rippleEffect: {
        scale: 3,
        brushType: "fill",
      },
      symbol: "circle",
      symbolSize: [10, 5],
      itemStyle: {
       
        color: function (params) {
           let color = colors[params.dataIndex % 3]
           return color
          
        },
        opacity: 0.8,
      },
      silent: true,
      data: scrData,
    },
  ],

});
  echartInstance.setOption(option)
};
