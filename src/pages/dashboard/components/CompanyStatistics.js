import React, { Component, useEffect } from "react";
import { message } from "antd";
import "./CompanyStatistics.scss";
import CountUp from "react-countup";
import Config from "../../../config/Config";
import { func } from "prop-types";
const path = Config.getBasePath();
class CompanyStatistics extends Component {
  constructor(props) {
    super(props);
    console.log("props", props);
    this.state = {
      innovatecount: {},
      entcount: {},
      propcode: '',
    };
  }
  componentDidUpdate(preveProps) {
    if(preveProps.code !== this.props.code ||  !this.state.propcode) {
      this.state.propcode = this.props.code
      console.log(preveProps.code, this.props.code)
      this.getData();
    }
  }
  componentWillUnmount() {
    this.state.propcode = ''
  }
  getData() {
    let res1={
      "status": 0,
      "message": "OK",
      "result": {
          "CX_COUNT": "2428",
          "FMZL_COUNT": "234000",
          "SYXXZL_COUNT": "167030",
          "WGSJZY_COUNT": "98210"
      }
  }
  this.setState({ innovatecount: res1.result });

    let res={"status":0,"message":"OK","result":{"ENT_COUNT":"123456789","CYL_COUNT":"123","SYENT_COUNT":"12345","ZYENT_COUNT":"1234567","XYENT_COUNT":"123456789"}}
    this.setState({ entcount: res.result });
   
    this.setState({ loading: false });
  }
  numberFormate(num = 0) {
    return Number(num).toLocaleString();
  }
  onSearch(value, e, info) {
    console.log("search");
  }
   // 获取半径
   getWidth () {
    // let conHeight=window.innerHeight, conWidth=window.innerWidth;
    // var height = parseInt(0.5625* window.innerWidth);
    // var width = parseInt(16/9* window.innerHeight);
    // if(height < conHeight) {
    //   conHeight= height
    // }else if(width < conWidth) {
    //   conWidth = width
    // }
    // return conWidth;
    return 1920;
  }
  render() {
    let { innovatecount, entcount } = this.state;
    return (
      <div className="con-statistics" style={{width: this.getWidth()*0.2}}>
        <div>
          <div className="staticstics-title">XXX</div>
          <div className="staticstics-num font-num">
            <CountUp
              start={0}
              end={entcount.ENT_COUNT}
              duration={2.75}
              useEasing={true}
              useGrouping={true}
              separator=","
            ></CountUp>

            {/* {this.numberFormate(entcount.ENT_COUNT)} */}
          </div>
          <div className="divider"></div>
          <div className="company-list">
            <div className="company-item">
              <span className="label">aaaaa</span>
              <span className="number font-num">
                <CountUp
                  start={0}
                  end={entcount.CYL_COUNT}
                  duration={2.75}
                  useEasing={true}
                  useGrouping={true}
                  separator=","
                ></CountUp>
              </span>
            </div>
            <div className="company-item">
              <span className="label">bbbbb</span>
              <span className="number font-num">
                <CountUp
                  start={0}
                  end={entcount.SYENT_COUNT}
                  duration={2.75}
                  useEasing={true}
                  useGrouping={true}
                  separator=","
                ></CountUp>
              </span>
            </div>
            <div className="company-item">
              <span className="label">ccccc</span>
              <span className="number font-num">
                <CountUp
                  start={0}
                  end={entcount.SYENT_COUNT}
                  duration={2.75}
                  useEasing={true}
                  useGrouping={true}
                  separator=","
                ></CountUp>
              </span>
            </div>
            <div className="company-item">
              <span className="label">ddddd</span>
              <span className="number font-num">
                <CountUp
                  start={0}
                  end={entcount.XYENT_COUNT}
                  duration={2.75}
                  useEasing={true}
                  useGrouping={true}
                  separator=","
                ></CountUp>
              </span>
            </div>
          </div>
        </div>
        <div className="mgt40">
          <div className="staticstics-title">YYYY</div>
          <div className="staticstics-num font-num">
            <CountUp
              start={0}
              end={innovatecount.CX_COUNT}
              duration={2.75}
              useEasing={true}
              useGrouping={true}
              separator=","
            ></CountUp>
          </div>
          <div className="divider"></div>
          <div className="company-list">
            <div className="company-item">
              <span className="label">aaaaa</span>
              <span className="number font-num">
                <CountUp
                  start={0}
                  end={innovatecount.FMZL_COUNT}
                  duration={2.75}
                  useEasing={true}
                  useGrouping={true}
                  separator=","
                ></CountUp>
              </span>
            </div>
            <div className="company-item">
              <span className="label">bbbbb</span>
              <span className="number font-num">
                <CountUp
                  start={0}
                  end={innovatecount.SYXXZL_COUNT}
                  duration={2.75}
                  useEasing={true}
                  useGrouping={true}
                  separator=","
                ></CountUp>
              </span>
            </div>
            <div className="company-item">
              <span className="label">ccccc</span>
              <span className="number font-num">
                <CountUp
                  start={0}
                  end={innovatecount.WGSJZY_COUNT}
                  duration={2.75}
                  useEasing={true}
                  useGrouping={true}
                  separator=","
                ></CountUp>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default CompanyStatistics;
