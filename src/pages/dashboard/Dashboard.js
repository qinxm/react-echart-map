import React, { Component } from "react";
import { Avatar, Button, Divider, message } from "antd";
import "./dashboard.scss";
import WidgetEchartMap from "./components/WidgetEchartMap";
import SearchIndustryChain from "./components/SearchIndustryChain";
import CompanyStatistics from "./components/CompanyStatistics";
import InvestmentList from "./components/InvestmentList";

import Config from "../../config/Config";
const path = Config.getBasePath();
class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      industryCode: "",
      businessLayout: "1", //布局 1:产业链布局  2:投资布局
      mapType: "1", //1:XXX 2:YYYY
      menus: [
        {
          label: "产业概览",
          href: "#",
          isActive: true,
        },
        {
          label: "产业大脑",
          href: "#",
          isActive: false,
        },
        {
          label: "产业专题",
          href: "#",
          isActive: false,
        },
        {
          label: "企业评价",
          href: "#",
          isActive: false,
        },
        {
          label: "企业关联图谱",
          href: "#",
          isActive: false,
        },
        {
          label: "企业精准招商",
          href: "#",
          isActive: false,
        },
        {
          label: "企业监测",
          href: "#",
          isActive: false,
        },
        {
          label: "项目管理",
          href: "#",
          isActive: false,
        },
      ],
      mapData: [],
    };
  }
  componentDidMount() {
    window.addEventListener('load', () => {
      this.adaptation()
    });
    window.addEventListener('resize', this.adaptation.bind(this));
    window.addEventListener("resize", () => {
      this.forceUpdate();
      this.adaptation()
    });
  }
  clickMenu(menuIndex) {
    this.state.menus.map((item, index) => {
      if (index == menuIndex) {
        item.isActive = true;
      } else {
        item.isActive = false;
      }
    });
  }
  clickBusinessLayout(value) {
    this.setState({ businessLayout: value });
    //产业链布局
    if(value == '1') {
     
        this.getMapEntList();
        this.getMapInnovatelist();
      
    }
  }
  //产业链地图XXX
  getMapEntList() {
    // if (!this.state.industryCode) return;
    let res ={
    "status": 0,
    "message": "OK",
    "total": 10,
    "results": [
        {
            "discode": "10000",
            "disname": "省市名称0",
            "ENT_COUNT": "产业链0",
            "SYENT_COUNT": "产业链0",
            "ZYENT_COUNT": "产业链0",
            "XYENT_COUNT": "产业链0"
        },
        {
            "discode": "10001",
            "disname": "省市名称1",
            "ENT_COUNT": "产业链1",
            "SYENT_COUNT": "产业链1",
            "ZYENT_COUNT": "产业链1",
            "XYENT_COUNT": "产业链1"
        },
        {
            "discode": "10002",
            "disname": "省市名称2",
            "ENT_COUNT": "产业链2",
            "SYENT_COUNT": "产业链2",
            "ZYENT_COUNT": "产业链2",
            "XYENT_COUNT": "产业链2"
        },
        {
            "discode": "10003",
            "disname": "省市名称3",
            "ENT_COUNT": "产业链3",
            "SYENT_COUNT": "产业链3",
            "ZYENT_COUNT": "产业链3",
            "XYENT_COUNT": "产业链3"
        },
        {
            "discode": "10004",
            "disname": "省市名称4",
            "ENT_COUNT": "产业链4",
            "SYENT_COUNT": "产业链4",
            "ZYENT_COUNT": "产业链4",
            "XYENT_COUNT": "产业链4"
        },
        {
            "discode": "10005",
            "disname": "省市名称5",
            "ENT_COUNT": "产业链5",
            "SYENT_COUNT": "产业链5",
            "ZYENT_COUNT": "产业链5",
            "XYENT_COUNT": "产业链5"
        },
        {
            "discode": "10006",
            "disname": "省市名称6",
            "ENT_COUNT": "产业链6",
            "SYENT_COUNT": "产业链6",
            "ZYENT_COUNT": "产业链6",
            "XYENT_COUNT": "产业链6"
        },
        {
            "discode": "10007",
            "disname": "省市名称7",
            "ENT_COUNT": "产业链7",
            "SYENT_COUNT": "产业链7",
            "ZYENT_COUNT": "产业链7",
            "XYENT_COUNT": "产业链7"
        },
        {
            "discode": "10008",
            "disname": "省市名称8",
            "ENT_COUNT": "产业链8",
            "SYENT_COUNT": "产业链8",
            "ZYENT_COUNT": "产业链8",
            "XYENT_COUNT": "产业链8"
        },
        {
            "discode": "10009",
            "disname": "省市名称9",
            "ENT_COUNT": "产业链9",
            "SYENT_COUNT": "产业链9",
            "ZYENT_COUNT": "产业链9",
            "XYENT_COUNT": "产业链9"
        }
    ]
  }
    this.setState({ mapData: res.result });
    this.setState({ mapType: "1" });
   
  }
  // 产业链地图YYYY
  getMapInnovatelist() {
    if (!this.state.industryCode) return;
    let res = {
      "status": 0,
      "message": "OK",
      "total": 10,
      "results": [
          {
              "discode": "10000",
              "disname": "省市名称0",
              "FMZL_COUNT": "发明专利数量0",
              "SYXXZL_COUNT": "实用新型专利数量0",
              "WGSJZY_COUNT": "外观设计专业数量0"
          },
          {
              "discode": "10001",
              "disname": "省市名称1",
              "FMZL_COUNT": "发明专利数量1",
              "SYXXZL_COUNT": "实用新型专利数量1",
              "WGSJZY_COUNT": "外观设计专业数量1"
          },
          {
              "discode": "10002",
              "disname": "省市名称2",
              "FMZL_COUNT": "发明专利数量2",
              "SYXXZL_COUNT": "实用新型专利数量2",
              "WGSJZY_COUNT": "外观设计专业数量2"
          },
          {
              "discode": "10003",
              "disname": "省市名称3",
              "FMZL_COUNT": "发明专利数量3",
              "SYXXZL_COUNT": "实用新型专利数量3",
              "WGSJZY_COUNT": "外观设计专业数量3"
          },
          {
              "discode": "10004",
              "disname": "省市名称4",
              "FMZL_COUNT": "发明专利数量4",
              "SYXXZL_COUNT": "实用新型专利数量4",
              "WGSJZY_COUNT": "外观设计专业数量4"
          },
          {
              "discode": "10005",
              "disname": "省市名称5",
              "FMZL_COUNT": "发明专利数量5",
              "SYXXZL_COUNT": "实用新型专利数量5",
              "WGSJZY_COUNT": "外观设计专业数量5"
          },
          {
              "discode": "10006",
              "disname": "省市名称6",
              "FMZL_COUNT": "发明专利数量6",
              "SYXXZL_COUNT": "实用新型专利数量6",
              "WGSJZY_COUNT": "外观设计专业数量6"
          },
          {
              "discode": "10007",
              "disname": "省市名称7",
              "FMZL_COUNT": "发明专利数量7",
              "SYXXZL_COUNT": "实用新型专利数量7",
              "WGSJZY_COUNT": "外观设计专业数量7"
          },
          {
              "discode": "10008",
              "disname": "省市名称8",
              "FMZL_COUNT": "发明专利数量8",
              "SYXXZL_COUNT": "实用新型专利数量8",
              "WGSJZY_COUNT": "外观设计专业数量8"
          },
          {
              "discode": "10009",
              "disname": "省市名称9",
              "FMZL_COUNT": "发明专利数量9",
              "SYXXZL_COUNT": "实用新型专利数量9",
              "WGSJZY_COUNT": "外观设计专业数量9"
          }
      ]
  }
  this.setState({ mapData: res.result });
          this.setState({ mapType: "2" });
   
  }
  // 投资布局
  getInvestList() {
    if (!this.state.industryCode) return;
    let res = {
      "status": 0,
      "message": "OK",
      "total": 10,
      "results": [
          {
              "discode": "110000",
              "disname": "北京",
              "invested_discode": "120000",
              "invested_disname": "天津",
              "invest_discode": "110000",
              "invest_disname": "北京",
              "amount": "53200000"
          },
          {
              "discode": "130000",
              "disname": "河北省",
              "invested_discode": "120000",
              "invested_disname": "天津",
              "invest_discode": "130000",
              "invest_disname": "河北省",
              "amount": "1200000"
          }
      ]
  }
  let dataList = res.results.map((item, index) => {
    item.key = index + 1;
    return item;
  });
  this.setState({ tableData: dataList });
}
  changeIndustry(value) {
    this.setState({ industryCode: value.code }, () => {
      let { businessLayout, mapType } = this.state;
      if (businessLayout == "1") {
        if (mapType == "1") {
          this.getMapEntList();
        } else {
          this.getMapInnovatelist();
        }
      } else {
        this.getInvestList();
      }
    });
  }
  adaptation () {
    var w = document.body.clientWidth;
    var h = document.body.clientHeight;
    var nw = 1920;
    var nh = 1080;
    var scale = 1;
    if (w / h > nw / nh) {
      scale = h / nh;
    } else {
      scale = w / nw;
    }
    document.getElementById('main').setAttribute('style', 'transform: scale('+ scale +');transform-origin:center top;');
  }
  render() {
    let { menus, businessLayout, mapType, mapData, industryCode } = this.state;
    // let conHeight = window.innerHeight,
    //   conWidth = window.innerWidth;
    // var height = parseInt(0.5625 * window.innerWidth);
    // var width = parseInt((16 / 9) * window.innerHeight);
    // if (height < conHeight) {
    //   conHeight = height;
    // } else if (width < conWidth) {
    //   conWidth = width;
    // }
    const conHeight=1080, conWidth=1920;
    var bottomHeight = parseInt((conHeight * 72) / 1080);
    
    // style={{ height: conHeight, width: conWidth }}
    return (
      <div className="con-dashboard" id="main">
        <div
          className="con-dashobard-main"
          style={{width: '1920px',height:'1080px'}}
        >
          <div className="dashboard-main">
            {/* <div
              className="header"
              style={{ height: parseInt(conHeight * 0.1) }}
            >
              <div className="logo">
                <img src={require("../../img/dashboard/logo.png")} alt="logo" />
              </div>
              <div className="nav-btn">
                {menus.map((item, index) => (
                  <a
                    href={item.href}
                    onClick={() => this.clickMenu(index)}
                    key={index}
                  >
                    <div
                      className={[
                        "btn-list",
                        item.isActive ? "list-active" : "",
                        item.label.length > 4 ? "btn-item-6" : "",
                      ].join(" ")}
                    >
                      <span className="menu-text">{item.label}</span>
                    </div>
                  </a>
                ))}
              </div>
              <div className="user-avartar">
                <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=2" />
                <span className="username">admin</span>
              </div>
            </div> */}
            <div
              className="main-content"
              style={{ height: parseInt(conHeight * 0.9) }}
            >
              <div className="left-menu">
                <SearchIndustryChain
                  onChangeIndustry={(value) => this.changeIndustry(value)}
                />
              </div>
              <div className="middle-map">
                {businessLayout == "1" ? (
                  <div className="con-tab">
                    <Button
                      className={[
                        "btn-map-number",
                        mapType == "1" ? "actived" : "",
                      ]}
                      type="text"
                      onClick={() => this.getMapEntList()}
                    >
                      散点图
                    </Button>
                    <Button
                      className={[
                        "btn-map-number",
                        mapType == "2" ? "actived" : "",
                      ]}
                      type="text"
                      onClick={() => this.getMapInnovatelist()}
                    >
                      柱状图
                    </Button>
                  </div>
                ) : (
                  ""
                )}
                {/* <WidgetEchartMap ref={(e) => { this.echartRef = e; }} mapType={mapType} /> */}
                {businessLayout == "1" && mapType == "1" ? (
                  <WidgetEchartMap mapType="1" mapData={mapData} />
                ) : (
                  ""
                )}
                {businessLayout == "1" && mapType == "2" ? (
                  <WidgetEchartMap mapType="2" mapData={mapData} />
                ) : (
                  ""
                )}
                {businessLayout == "2" ? <WidgetEchartMap mapType="3" /> : ""}
              </div>
              <div className="right-content">
                {/* {businessLayout == "1" ? (
                  <CompanyStatistics code={industryCode} />
                ) : (
                  <InvestmentList code={industryCode} />
                )} */}
                <CompanyStatistics code={industryCode} />
              </div>
              <div className="bottom-content" style={{ height: bottomHeight }}>
                <div className="footer-tab" style={{ height: bottomHeight }}>
                  <div
                    className={[
                      "btn-industrychain ",
                      businessLayout == "1" ? "actived" : "",
                    ].join(" ")}
                    style={{ height: bottomHeight * 0.6 }}
                  >
                    <Button
                      type="text"
                      onClick={() => this.clickBusinessLayout("1")}
                    >
                      Map1
                    </Button>
                  </div>
                  <div
                    className={[
                      "btn-invest ",
                      businessLayout == "2" ? "actived" : "",
                    ].join(" ")}
                    style={{ height: bottomHeight * 0.6 }}
                  >
                    <Button
                      type="text"
                      onClick={() => this.clickBusinessLayout("2")}
                    >
                      Map2
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Dashboard;
