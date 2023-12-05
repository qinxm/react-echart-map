// HeaderArea.js
import React from 'react';
import cookie from 'react-cookies'

import Config from '../config/Config';
import WidgetAjax from '../widget/WidgetAjax';

class HeaderArea extends React.Component 
{
    constructor( props )
    {
        super(props);

        this.state = {
			defaultDistrict : undefined,
			patentOptions : {
                title : "区域选择",
                button : false
            },
			currentArea:{},
            provinceStatus:"更多",
            commonArea : [],
            provinceData : [],
            letterData:[],
            city:"",
            defaultCityData:[],
            cityData : []
		}

        this.buildUserProperties = this.buildUserProperties.bind(this);

        this.openAreaModal = this.openAreaModal.bind(this);

		this.addDistrict = this.addDistrict.bind(this);
        this.removeDistrict = this.removeDistrict.bind(this);
        this.removeAllDistrict = this.removeAllDistrict.bind(this);

        this.provinceAllDistrict = this.provinceAllDistrict.bind(this); 

        this.setHover = this.setHover.bind(this); 

        this.handleAreaChange = this.handleAreaChange.bind(this); 
        this.selectArea = this.selectArea.bind(this); 
        this.selectcurrentArea = this.selectcurrentArea.bind(this); 

        this.obtainData = this.obtainData.bind(this); 
        this.onObtainData = this.onObtainData.bind(this); 

        this.updateData = this.updateData.bind(this); 
        this.changeCityData = this.changeCityData.bind(this); 
        
        this.cancle = this.cancle.bind(this); 

        // 获取组件自身
        this.myRef = React.createRef();

    }

    componentDidMount()
    {
        this.buildUserProperties();

        this.obtainData();
    }

    /**
	 * 创建用户属性信息
	 */
	buildUserProperties()
	{
		let defaultDistrict, userInfo = cookie.load("_user_login_info_");

		if( userInfo.user_properties!==undefined && userInfo.user_properties.default_district!==undefined )
		{
            if( typeof(userInfo.user_properties.default_district)==='string' )
            {
                defaultDistrict = JSON.parse(userInfo.user_properties.default_district);
            }
            else
            {
                defaultDistrict = userInfo.user_properties.default_district;

            }

			this.setState({defaultDistrict:defaultDistrict, currentArea:defaultDistrict});

            if( defaultDistrict!==undefined && defaultDistrict!==null && defaultDistrict.level!==undefined && typeof defaultDistrict.level==="string")
            {
                defaultDistrict["level"] = parseInt(defaultDistrict.level);
            }

			cookie.save("_user_district_", defaultDistrict, {path:"/"});
		}
	}

    obtainData()
    {
        //获取数据
        WidgetAjax.ajax({url : Config.getBasePath()+'/district', params : undefined, callback : this.onObtainData});
    }

    
    onObtainData(result, params )
    {
        let wordData = [];
        let words = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

        if( result.status===0 )
        {
            //判断显示的字母搜索
            for(let word in words)
            {
                let isLetter = false;
                for(let index in result.results)
                {
                    let firstLetter = result.results[index].namePinyin.toUpperCase().substring(0,1);

                    if(words[word]===firstLetter)
                    {
                        isLetter = true;
                    }
                }
                if(isLetter === true) wordData.push({name:words[word]});
            }

            //地区数据处理
            for(let index in result.results)
            {
                //如果层级为1，则代表省级地区数据,否则为市级地区数据
                if(result.results[index].level===1)
                {
                    this.state.provinceData.push(result.results[index]);
                }
                else
                {                    
                    this.state.cityData.push(result.results[index]);
                }
            }
            
            this.setState({
                letterData: wordData
            });

            //设置省份数据
            if(this.state.provinceData.length>0)
            { 
                this.setState({
                    provinceData: this.state.provinceData
                });
            }

            //市级数据转换格式
            this.changeCityData();
        }  
    }

    /**
     * 把子组件注入到父主键里
     * @param {*} ref 
     */
    onRef = (ref) => {
        this.modal =  ref ;
    }

    /**
     * 打开区域选择的模态窗口
     */
    openAreaModal()
    {
        this.modal.open();
    }

    /**
     * 转换城市数据格式
     */
    changeCityData()
    {
        let data = this.state.cityData;
        
        let words = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
        let newData = [];
        for(let word in words)
        {
            let wordEach = {};
            let wordData = [];
            data.map((item, index) => {
                let pinyin = item.namePinyin.toUpperCase().substring(0,1);
                if(words[word]===pinyin)
                {
                    let city = {};
                    city["name"] = item.name;
                    city["value"] = item.value;
                    city["level"] = item.level;
                    wordData.push(city);
                }
            }) 

            if(wordData.length>0)
            {
                wordEach["word"] = words[word];
                wordEach["data"] = wordData;
                newData.push(wordEach);
            }
            
        }

        this.setState({
            cityData: newData,
            defaultCityData: data
        });
        
    }

    updateData()
    {
        let userInfo = cookie.load("_user_login_info_");

        userInfo["user_properties"]["default_district"] = JSON.stringify(this.state.currentArea);

        //TODO 修改数据
        //常用地区
        console.log(this.state.commonArea);

        //当前地区
        console.log(this.state.currentArea);

        cookie.save("_user_login_info_", userInfo,  {path:"/"});

        if( this.state.currentArea!==undefined && this.state.currentArea!==null && this.state.currentArea.level!==undefined && typeof this.state.currentArea.level==="string")
        {
            this.state.currentArea["level"] = parseInt(this.state.currentArea.level);
        }

        cookie.save("_user_district_", this.state.currentArea, {path:"/"});

        this.modal.close();

       // this.buildUserProperties();

        if( this.props.freshPage!==undefined )
        {
            this.props.freshPage();
        } 
    }

    cancle()
    {
        this.modal.close();

        this.buildUserProperties();
    }

    selectcurrentArea(item)
    {
        this.setState({
            currentArea: item
          });
    }

    handleAreaChange( event )
    {
        let pinyin;
        for( let index in this.state.defaultCityData )
        {
            //匹配中文
            if(this.state.defaultCityData[index].name.indexOf(event.target.value)!==-1)
            {
                pinyin = this.state.defaultCityData[index].namePinyin;
                pinyin =pinyin.toUpperCase().substring(0,1);
            }
            
        }

        //中文匹配不上 继续匹配英文
        if(pinyin===undefined || pinyin===null) 
        {
            pinyin = event.target.value.toUpperCase().substring(0,1);
            if( pinyin!==undefined && pinyin!==null)
            {
                let btn = document.getElementById('cs'+pinyin);
                btn.click();
            }
        }
        else
        {
            let btn = document.getElementById('cs'+pinyin);
            btn.click();
        }    
    }

    selectArea(type , item)
    {
        if(type==='sf')
        {
            for( let i=0; i<document.getElementById('sf'+item.name).parentNode.childNodes.length; i++ )
            {
                document.getElementById('sf'+item.name).parentNode.childNodes[i].className = "";
            }

            document.getElementById('sf'+item.name).classList.add("select-button");

            this.setState({
                currentArea: item
              });
        }
        else
        {
            for( let i=0; i<document.getElementById('cs'+item.name).parentNode.childNodes.length; i++ )
            {
                document.getElementById('cs'+item.name).parentNode.childNodes[i].className = "";
            }

            for( let i=0; i<document.getElementById('cityWord'+item.name).parentNode.childNodes.length; i++ )
            {
                document.getElementById('cityWord'+item.name).parentNode.childNodes[i].className = "district-title-used city-solid";
            }

            document.getElementById('cs'+item.name).classList.add("select-button");
            document.getElementById('cityWord'+item.name).classList.add("select-word");
            let e = document.getElementById('cityWord'+item.name);
            e.scrollIntoView({behavior:'smooth'}); 

        }
    }

    setHover( is,div )
    {     
        for( let i=0; i<document.getElementById('districtButton').childNodes.length; i++ )
        {
            document.getElementById('districtButton').childNodes[i].childNodes[1].className = "districtButton-times display-none";
        }   

        if( is===true)
        {
            document.getElementById('districtButtontimes'+div).className = "districtButton-times inline-block";
        }
    }

    // 添加常用地区
    addDistrict( district )
    {
        let { commonArea } = this.state;

        // TODO 判断常用地区 是否存在 不存在 加入，已存在不处理
        for(let index in commonArea)
        {
            if(district.name===commonArea[index].name)
            {
                return;
            }
        }

        commonArea.push(district);
        this.setState({commonArea: commonArea });
        
    }

    //删除所选地区
    removeDistrict( index )
    {
        let { commonArea } = this.state;

        commonArea.splice(index,1);

        this.setState({commonArea: commonArea });
    }

    //清空全部
    removeAllDistrict()
    {
        this.setState({commonArea: []});
    }

    //更多、收起
    provinceAllDistrict(provinceStatus)
    {
        if(provinceStatus==="更多")
        {
            this.setState({ provinceStatus: "收起"  });
        }
        else
        {
            this.setState({ provinceStatus: "更多"  });
        }
    }

    render()
    {
        const { defaultDistrict, patentOptions, provinceStatus, currentArea, commonArea, provinceData, letterData, cityData} = this.state;

        const { show } = this.props;


        if( show &&  defaultDistrict!==undefined && defaultDistrict!==null )
        {
            return (
                <div className='sf-system-title sd-system-title sg-system-title sf-system-area sd-system-area sg-system-area'>
                    <span className='sf-area' onClick={ this.openAreaModal }>[{currentArea.name}]</span>

                    {/* <WidgetModal options={patentOptions} onRef={this.onRef}>
                        <div className="page">
                            <div className="page-content page-overflow">
                                <div className="content-top">
                                    <div className="content-canvas content-top-distribution" style={{height:'auto'}}>
                                        <div className="district-title">
                                            <span className="district-title">当前地区</span>
                                            <span className="district-title-1" >[ <img src={require("../img/frame/icon_location.png")} alt="" style={{ verticalAlign: 'text-top',marginRight: '2px'}}></img>{currentArea.name} ]</span>
                                            <span className="district-title-2" onClick={() => {this.addDistrict(currentArea)} }>[添加为常用地区]</span>
                                        </div>

                                        <div className="district-title-used">
                                            <div className="district-title-left">常用地区</div>
                                            <div className="district-title-right" id="districtButton" >
                                            {
                                                commonArea.map((item, index) => {
                                                    return (
                                                        <button key={index} id={["districtButton"+index]} className="districtButtonClass" onMouseOver={()=> {this.setHover(true,index)}} onMouseOut={()=> {this.setHover(false,index)}}>
                                                            <span onClick={() => {this.selectcurrentArea(item)}}>{item.name}</span>
                                                            <img src={require("../img/frame/icon_sc.png")} alt="" id={["districtButtontimes"+index]} className="districtButton-times display-none" name="districtButtontimesClass" onClick={() => {this.removeDistrict(index)}}></img>
                                                        </button>
                                                    )
                                                }) 
                                            }
                                            </div>

                                            <span className="district-title-2" onClick={() => {this.removeAllDistrict()}}>[清空全部]</span>
                                        </div>
                                        
                                        <div className="district-title-used">
                                            <div className="">选择地区</div>
                                            <div className="district-title-top province-u1" style={provinceData.length===0?{display:"none"}:{display:"block"}}>
                                                <div className="district-title-left">省份</div>

                                                <div className="district-title-right district-title-right-height" style={provinceStatus==='更多'?{height:"25px",overflow:"hidden"}:{height:"auto"}}>
                                                {
                                                    provinceData.map((item, index) => {
                                                        return (
                                                            <label key={index} id={["sf"+item.name]} onClick={() => {this.selectArea('sf',item)}}>{item.name}</label>
                                                        )
                                                    }) 
                                                }
                                                    <span>
                                                        <label className="district-title-2 district-title-3" style={provinceData.length<18?{display:"none"}:{display:"block"}} onClick={() => {this.provinceAllDistrict(provinceStatus)}}>[{provinceStatus}]</label>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="district-title-top">
                                                <div className="district-title-left">城市</div>

                                                <div className="district-title-right">
                                                    <img src={require("../img/frame/union.svg")} alt="" className="search-button"></img>
                                                    <input type="text" className="district-input" onChange={this.handleAreaChange} placeholder="请输入城市名称进行搜索..." style={{paddingLeft: '30px'}}></input>
                                                </div>
                                            </div>

                                            <div className="district-title-top">
                                                <div className="district-title-left" style={{width: '150px'}}>按拼音首字母选择</div>

                                                <div className="district-title-right">
                                                {
                                                    letterData.map((item, index) => {
                                                        return (
                                                            <label key={index} id={["cs"+item.name]} name={["cityWord"+item.name]} onClick={() => {this.selectArea('cs', item)}}>{item.name}</label>
                                                        )
                                                    }) 
                                                }
                                                </div>
                                            </div>

                                            <div className="district-title-top" style={{height: '300px',overflow: 'auto'}}>
                                                <div className="">
                                                {
                                                    cityData.map((item, index) => {
                                                        let cityDataList = item.data;
                                                        if(cityDataList!==undefined)
                                                        {
                                                            return (
                                                                <div key={index} id={["cityWord"+item.word]} className="district-title-used city-solid">
                                                                    <div className="district-title-left" style={{width:'60px'}}><label className="city-word">{item.word}</label></div>
                                                                    {    
                                                                        cityDataList.map((itemson, indexson) => {
                                                                            return (
                                                                                <div key={indexson} className="district-title-right"><label key={indexson} onClick={() => {this.selectcurrentArea(itemson)}}>{itemson.name}</label></div> 
                                                                            )
                                                                        })
                                                                        
                                                                    }	
                                                                </div>
                                                            )
                                                        }
                                                        
                                                    }) 
                                                }
                                                </div>
                                            </div>

                                        </div>

                                        <div className="footer"> 
                                            <button className="footer-cancel" onClick={() => {this.cancle()}}>取消</button>
                                            <button className="footer-submit" onClick={() => {this.updateData()}}>确定</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </WidgetModal> */}

                </div>
            )
        }
        else
        {
            return "";
        }
    }
}

export default HeaderArea