import { geoCoordMap } from "../utils/china";
export const setOption1 = (echartInstance, selfOption, data) => {
  let option = Object.assign(selfOption, {
    series: [],
    xAxis: [],
    yAxis: [],
    grid: [],
    tooltip: {
      trigger: "item",
      textStyle: {
        color: '#fff'
      },
      padding: 0,
      // borderColor: "rgba(0,0,0,0)",
      backgroundColor: "rgba(0,0,0,.5)",
    },
  });
  data.forEach((item, idx) => {
    let nodeCoord = geoCoordMap[item.disname];
    let coord = echartInstance.convertToPixel("geo", nodeCoord);
    // let titleItems = [item.disname];
    let dataValue = Number(item.ENT_COUNT) + Number(item.SYENT_COUNT) + Number(item.ZYENT_COUNT) + Number(item.XYENT_COUNT);
    option.series.push({
        id: idx + item.disname,
        type: "effectScatter",
        colorBy: 'data',
        coordinateSystem: "geo",
        z: 100,
        rippleEffect: {
          brushType: "stroke"
        },
      
        data:[{
          name: item.disname,
          value: geoCoordMap[item.disname].concat(dataValue),
        },],
      
        tooltip: {
          padding: 0,
          borderColor: "rgba(0,0,0,0)",
          backgroundColor: "rgba(0,0,0,.5)",
          formatter(params) {
            let areaItem = data.find(item => 
              {
                return  item.disname == params.name 
              }
            )
            return `
              <div style="background-color: #2d80cbcc;font-weight: bold;color: #fff;padding: 5px 10px;">${areaItem.disname}</div>
              <div style="background-color: #18314f80;color: #fff;padding: 5px 10px; line-height: 2">
                <div style="border-bottom: 1px solid #ffffff33"><span style="display: inline-block; width: 100px;margin-right: 15px;">企业数</span> <span style="display: inline-block; width: 100px;text-align:right;">${areaItem.ENT_COUNT}</span></div>
                <div style="border-bottom: 1px solid #ffffff33"><span style="display: inline-block; width: 100px;margin-right: 15px;">bbbbXXX</span>  <span style="display: inline-block; width: 100px;text-align:right;">${areaItem.SYENT_COUNT}</span></div>
                <div style="border-bottom: 1px solid #18314f"><span style="display: inline-block; width: 100px;margin-right:15px;">cccXXX</span>  <span style="display: inline-block; width: 100px;text-align:right;">${areaItem.ZYENT_COUNT}</span></div>
                <div style="border-bottom: 1px solid #18314f"><span style="display: inline-block; width: 100px;margin-right:15px;">下游XXX</span>  <span style="display: inline-block; width: 100px;text-align:right;">${areaItem.XYENT_COUNT}</span></div>
              </div>`;
          },
        },
        
      });
  });
  echartInstance.setOption(option);
}