import { geoCoordMap } from "../utils/china";
function convertData(data) {
  var res = [];
  for (var i = 0; i < data.length; i++) {
    var dataItem = data[i];

    var fromCoord = geoCoordMap[dataItem.invest_disname];
    var toCoord = geoCoordMap[dataItem.invested_disname];
    if (fromCoord && toCoord) {
      res.push({
        fromName: dataItem.invest_disname,
        toName: dataItem.invested_disname,
        coords: [fromCoord, toCoord],
        value: dataItem.amount,
      });
    }
  }
  console.log(res);
  return res;
}
export const setOption3 = (echartInstance, selfOption, data) => {
  let option = Object.assign(selfOption, {
    series: [],
    xAxis: [],
    yAxis: [],
    grid: [],
    tooltip: {
      trigger: "item",
      textStyle: {
        color: "#fff",
      },
      padding: 0,
      borderColor: "rgba(0,0,0,0)",
      backgroundColor: "rgba(0,0,0,.5)",
      formatter: (params) => {
        console.log(params);
        if (params.data && params.seriesType == "lines") {
          return `  <div style="background-color: #2d80cbcc;font-weight: bold;color: #fff;padding: 5px 10px;">${params.data.fromName}-${params.data.toName}</div>
          <div style="background-color: #18314f80;color: #fff;padding: 5px 10px; line-height: 2">
              <div style="border-bottom: 1px solid #ffffff33"><span style="display: inline-block;width: 80px;margin-right: 10px;">投资区域</span> <span style="display: inline-block; width: 100px;text-align:right;">${params.data.fromName}</span></div>
              <div style="border-bottom: 1px solid #ffffff33"><span style="display: inline-block;width: 80px;margin-right: 10px;">被投资区域</span>  <span style="display: inline-block; width: 100px;text-align:right;">${params.data.toName}</span></div>
              <div style="border-bottom: 1px solid #18314f"><span style="display: inline-block;width: 80px;margin-right: 10px;">投资金额</span>  <span style="display: inline-block; width: 100px;text-align:right;">${params.data.value}</span></div>
            </div>`;
        } else {
          // return ''
        }
      },
    },
  });

  data.forEach((item, idx) => {
    option.series.push(
      {
        // name: item[0] + " Top3",
        type: "lines",
        z: 100,
        smooth: true,
        effect: {
          show: false,
        },
        lineStyle: {
          normal: {
            color: "#06fddd",
            type: "dotted",
            width: 1,
            type: [3, 5],
            opacity: 1,
            curveness: 0.2,
          },
        },
        data: convertData([item]),
      },
      {
        id: idx + item.disname,
        type: "effectScatter",
        coordinateSystem: "geo",
        z: 101,
        rippleEffect: {
          brushType: "stroke",
        },
        itemStyle: {
          color: "#06fddd",
        },
        data: [
          {
            name: item.invested_disname,
            value: geoCoordMap[item.invested_disname].concat(item.amount),
          },
          {
            name: item.invest_disname,
            value: geoCoordMap[item.invest_disname],
          },
        ],
      }
    );
  });
  echartInstance.setOption(option);
};
