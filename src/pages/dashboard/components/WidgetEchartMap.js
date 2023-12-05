import React from "react";
// import ReactEChartsCore from 'echarts-for-react/lib/core';
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts/core";
import {
  LineChart,
  BarChart,
  ScatterChart,
  MapChart,
  EffectScatterChart,
  LinesChart,
} from "echarts/charts";

import {
  GridComponent,
  GeoComponent,
  TooltipComponent,
  TitleComponent,
  MarkLineComponent,
} from "echarts/components";
import {
  CanvasRenderer,
} from "echarts/renderers";

import "./WidgetEchartMap.scss";
import {  setOption1 } from "../utils/myMap1";
import { setOption2 } from "../utils/myMap2";
import { setOption3  } from "../utils/myMap3";
import { chinaMapJson} from "../utils/china";
import {selfAreaData1, selfAreaData2,selfAreaData3} from '../utils/mock'
// import chinaMapJson1 from "../utils/china.json";
// import { Scatter3DChart, Map3DChart } from 'echarts-gl/charts';
// import { Grid3DComponent, Mapbox3DComponent } from 'echarts-gl/components';
class WidgetEchartMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapType: props.mapType,
      mapData: props.mapData,
    };
    this.selfOption = {
      // backgroundColor: '#ffffffcc',
      color: ['#02f5ed', '#fadb69', '#ec7547','#02f5ed', '#fadb69', '#ec7547','#02f5ed', '#fadb69', '#ec7547'],
      geo: {
        // show:false,
        map: "china",
        zoom: 1.2,
        roam: false,
        label: {
          show: false,
        },
        tooltip: {
          show: true,
        },
        // 宽高比
        aspectScale: 0.85,
        emphasis: {
          disabled: true,
        },
        itemStyle: {
          
          normal: {
            opacity: 0.8,
            // 如果需要加背景图片，请把opacity设置为0
            // opacity: 0,
            areaColor: "#2d72b5",
            // borderColor: "#255c84",
            borderColor: "#ffffff",
            borderWidth: 1,
            shadowColor: "#000",
          },
          emphasis: {
            areaColor: "#9DD4F4",
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowBlur: 20,
            borderWidth: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    };
 }
  // 初始化
  initEchart() {
    echarts.use([
      LineChart,
      MarkLineComponent,
      TitleComponent,
      TooltipComponent,
      GridComponent,
      BarChart,
      CanvasRenderer,
      GeoComponent,
      LinesChart,
      EffectScatterChart,
      MapChart,
      ScatterChart,
    ]);
    echarts.registerMap("china", chinaMapJson);
  }
 
  componentDidMount() {
    if (this.echartRef) {
      const echartInstance = this.echartRef.getEchartsInstance();
      // window.addEventListener('resize',()=>{
      //   this.render();
      //   // echartInstance&&echartInstance.resize();
      // })
      //selfAreaData1 selfAreaData2 selfAreaData3 需要替换mapData
      if (this.state.mapType == 1) {
        setOption1(echartInstance,this.selfOption, selfAreaData1);
      } else if (this.state.mapType == 2) {
        setOption2(echartInstance,this.selfOption, selfAreaData2);
      } else if (this.state.mapType == 3) {
        setOption3(echartInstance,this.selfOption, selfAreaData3);
      }
    }
  }

  render() {
    // let conHeight=window.innerHeight, conWidth=window.innerWidth;
    // var height = parseInt(0.5625* window.innerWidth);
    // var width = parseInt(16/9* window.innerHeight);
    // if(height < conHeight) {
    //   conHeight= height
    // }else if(width < conWidth) {
    //   conWidth = width
    // }
    const conHeight=1080, conWidth=1920;
    // var width1 = parseInt(0.68 * window.innerWidth);
    // var width2 = parseInt(
    //   width1 > window.innerHeight ? window.innerHeight : width1
    // );
    // var height = parseInt(0.8 * width2);
    this.initEchart();
    const onEvents = {
      click: this.onChartClick,
      legendselectchanged: this.onChartLegendselectchanged,
    };
    return (
      <div className="data-collection">
        <div className="bg-map-img" style={{ height: conWidth*0.5, width: conWidth*0.5468 }}></div>
        <ReactECharts
          ref={(e) => {
            this.echartRef = e;
          }}
          echarts={echarts}
          option={this.selfOption}
          notMerge={true}
          lazyUpdate={true}
          theme={"theme_name"}
          onChartReady={this.onChartReadyCallback}
          onEvents={onEvents}
          opts={{ renderer: "canvas" }}
          style={{  height: conWidth*0.5, width: conWidth*0.5468}}
        />
      </div>
    );
  }
}

export default WidgetEchartMap;
