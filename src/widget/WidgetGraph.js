import React from 'react';
import $ from 'jquery';
import { NetChart } from '@dvsl/zoomcharts';
import { Select, Switch } from 'antd';

import Widget from './Widget';
import WidgetSelect from './WidgetSelect';
import WidgetInput from './WidgetInput';

import '@dvsl/zoomcharts/lib/assets/zc.css';
import './../css/widget/widget.graph.css';

class WidgetGraph extends React.Component
{
    constructor(props)
    {
        super(props);

        const { options } = this.props;

        let divID, popupDivID, container;

        if( options.divID!==undefined && options.divID!==null && options.divID!=="")
        {
            divID = options.divID;
        }

        if( options.popupDivID!==undefined && options.popupDivID!==null && options.popupDivID!=="")
        {
            popupDivID = options.popupDivID;
        }

        container = divID ? divID + "-graph-container" : "graph-container"

        this.state = {
            chart:undefined,
            options:options,
            container: container,
            legendDIV: divID ? divID + "-graph-legend" : "graph-legend",
            nettingDiagramDIV: divID ? divID + "-nettingDiagram-tool" : "nettingDiagram-tool",
            annularDIV: divID ? divID + "-annular-tool" : "annular-tool", 
            pyramidDIV: divID ? divID + "-pyramid-tool" : "pyramid-tool", 
            graphType: options.graphOptions && options.graphOptions.flag || 'netting',
            exports: [
                {label: '导出全景图', value: 'all'},
                {label: '导出当前图', value: 'current'},
                {label: '导出Excel', value: 'excel'},
            ],
            graphOptions:{
                divID: divID,
                popupDivID: popupDivID,
                clickFun:undefined,
                doubleClickFun:undefined,
                rightClickFun:undefined,
                pruneLeaves : false,
                isShowProperty: props.isShowProperty || false,
                colorType:undefined,
                changeTime : 0,
                time : 500,
                zoomchartsSetting:{
                    container : container,
                    playModel:'show',
                    title : {
                        align :"center",
                        enabled : true,
                        style : {
                            fillColor : "#000",
                            font : "14px"
                        },
                        text : ""
                    },
                    advanced : {
                        useAnimationFrame : false,
                        perNodeLoadingIndicator: false,
                        exportPdfSize : [2000,1000]
                    },
                    auras : {
                    },
                    credits : {
                        enabled : false,
                        imageScaling : 0,
                        enabledOnExport : true,
                    },
                    navigation: {
                        focusNodeExpansionRadius: 2,
                        initialNodes: null,
                        mode: "showall" //"manual" | "showall" | "focusnodes"
                    },
                    legend : {
                        enabled : false
                    },
                    layout: {
                        mode: "dynamic",//"dynamic" | "radial" | "hierarchy" | "static"
                        nodeSpacing: 40,
                        rowSpacing: 100,
                        aspectRatio: true,
                        layoutFreezeTimeout : 200
                    },
                    theme : null,
                    style : {
                        node: {
                            display: "circle",//circle (default), text, roundtext, droplet, rectangle, customShape
                            imageCropping: true
                        },
                        nodeLabel: {
                             textStyle:{font:"14px Arial", fillColor: ""}
                        },
                        nodeStyleFunction: function(node) {
                            
                        },
                        link : {
                            fillColor : "#ddd",
                            fromDecoration: null,
                            toDecoration : "arrow",
                        },
                        linkStyleFunction :function(link) {
                            
                        },
                        linkDecorationScale : 4,
                        linkDecorationMinSize : 4,
                        nodeClasses: null,
                        selection: {
                            fillColor: "rgba(0,90,181,0.6)",
                            sizeConstant : 8
                        },
                        nodeFocused:{
                            items : {
                                backgroundStyle : {
                                    //fillColor : "rgba(0,90,181,0.6)",
                                    lineColor : "#0058CC",
                                    lineWidth : 15			//圆的大小
                                },
                                aspectRatio : 12
                            },
                        },
                        nodeHovered: {
                            shadowColor: "#000079",		//鼠标移动到节点改变背景色
                            shadowBlur: 25,
                        },
                        linkHovered : {					//鼠标移动到线上改变背景色
                            shadowColor: "#000079",
                            shadowBlur: 10,
                        }
                    },
                    info:{
                        enabled: false,
                        nodeContentsFunction: function(itemData,item){
                            return "";
                        },
                        linkContentsFunction: function(itemData, item){
                            return itemData.type;
                        }
                    },
                    nodeMenu: {enabled: false},
                    linkMenu: {enabled: false},
                    data :{
                        preloaded: null
                    },
                    toolbar: {
                         enabled : true ,
                         align : 'left',
                         side : 'bottom',
                         location : 'outside',
                         back: false,
                         export : false,
                         exportOptions:'["png","jpg"]',
                         fullscreen : true
                    },
                    events:{
                        onClick: null,
                        onHoverChange: null,
                        onPointerMove : null,
                        onPositionChange: null,
                        onChartUpdate: null,
                        onDoubleClick : null,
                        onRightClick : null
                    },
                    filters: {
                        linkFilter : null,
                        nodeFilter: null
                    },
                    interaction: {
                        nodesMovable:true,
                        selection: {
                            lockNodesOnMove: false
                        },
                        zooming: {
                            zoomExtent : [0.25, 1],
                            autoZoomExtent: [null, 1],
                            autoZoomPositionEllasticity:0.0001,
                            autoZoomSize: 0.9,	//控制图表在不触发自动缩放调整的情况下可以移动的图表宽度/高度百分比，值0.9表示目标是在图标的所有面上保留10%的填充
                            autoZoomAfterClick:false, //用户每次单及图表是否自动缩放
                            initialAutoZoom:true,
                            doubleClickZoom:null,		//双击空白区域放大  false禁止
                            //zoomExtent:[1,4],				//手动缩放的缩放值限制
                            wheel:true					//是否通过鼠标滚轮缩放
                        },
                        resizing: {
                            enabled: false
                        }
                    }
                }
            },
            nodeType:{
                "center":{img:"center.png", color:"#e33c3e"},
                "entity":{img:"entity.png", color:"#e33c3e"},
                "branch":{img:"branch.png", color:"#e33c3e"},
                "person":{img:"person.png", color:"#e33c3e"},
                "website":{img:"website.png", color:"#e33c3e"},
                "webshop":{img:"webshop.png", color:"#e33c3e"},
                "app":{img:"app.png", color:"#e33c3e"},
                "wechat":{img:"wechat.png", color:"#e33c3e"},
                "bidding":{img:"bidding.png", color:"#e33c3e"},
                "patent":{img:"patent.png", color:"#e33c3e"},
                "litiga":{img:"litiga.png", color:"#e33c3e"},
                "addr":{img:"addr.png", color:"#e33c3e"},
                "tel":{img:"tel.png", color:"#e33c3e"},
                "email":{img:"email.png", color:"#e33c3e"},
                "person_grey":{img:"person_grey.png", color:"#cccccc"},
                "center_grey":{img:"center_grey.png", color:"#cccccc"},
                "entity_grey":{img:"entity_grey.png", color:"#cccccc"},
                "branch_grey":{img:"branch_grey.png", color:"#cccccc"},
                "website_grey":{img:"website_grey.png", color:"#cccccc"},
                "webshop_grey":{img:"webshop_grey.png", color:"#cccccc"},
                "app_grey":{img:"app_grey.png", color:"#cccccc"},
                "wechat_grey":{img:"wechat_grey.png", color:"#cccccc"},
                "bidding_grey":{img:"bidding_grey.png", color:"#cccccc"},
                "patent_grey":{img:"patent_grey.png", color:"#cccccc"},
                "litiga_grey":{img:"litiga_grey.png", color:"#cccccc"},
                "addr_grey":{img:"addr_grey.png", color:"#cccccc"},
                "tel_grey":{img:"tel_grey.png", color:"#cccccc"},
                "email_grey":{img:"email_grey.png", color:"#cccccc"}
            },
            entiysColors:{
				risklvl:{
					center:{
						"高风险":{img:"highRiskCenter.png", color:"#ba3cf4"},
						"中高风险":{img:"mediumHighRiskCenter.png", color:"#ff5307"},
						"中风险":{img:"mediumRiskCenter.png", color:"#ffa20f"},
						"中低风险":{img:"mediumlowentityCenter.png", color:"#fde920"},
						"低风险":{img:"lowentityCenter.png", color:"#64b8f3"}
					},
					entity:{
						"高风险":{img:"highRisk.png", color:"#ba3cf4"},
						"中高风险":{img:"mediumHighRisk.png", color:"#ff5307"},
						"中风险":{img:"mediumRisk.png", color:"#ffa20f"},
						"中低风险":{img:"mediumlowentity.png", color:"#fde920"},
						"低风险":{img:"lowentity.png", color:"#64b8f3"}
					},
					branch:{
						"高风险":{img:"highRiskBranch.png", color:"#ba3cf4"},
						"中高风险":{img:"mediumHighRiskBranch.png", color:"#ff5307"},
						"中风险":{img:"mediumRiskBranch.png", color:"#ffa20f"},
						"中低风险":{img:"mediumlowentityBranch.png", color:"#fde920"},
						"低风险":{img:"lowBranch.png", color:"#64b8f3"}
					}
				},
				is_abnormal:{
					center:{
						"true":{img:"center.png", color:"#75aaff"},
						"false":{img:"center_grey.png", color:"#cccccc"}
					},
					entity:{
						"true":{img:"entity.png", color:"#75aaff"},
						"false":{img:"entity_grey.png", color:"#cccccc"}
					},
					branch:{
						"true":{img:"branch.png", color:"#75aaff"},
						"false":{img:"branch_grey.png", color:"#cccccc"}
					}
					
				},
				is_illegual:{
					center:{
						"true":{img:"center.png", color:"#75aaff"},
						"false":{img:"center_grey.png", color:"#cccccc"}
					},
					entity:{
						"true":{img:"entity.png", color:"#75aaff"},
						"false":{img:"entity_grey.png", color:"#cccccc"}
					},
					branch:{
						"true":{img:"branch.png", color:"#75aaff"},
						"false":{img:"branch_grey.png", color:"#cccccc"}
					}
				},
				is_penalty:{
					center:{
						"true":{img:"center.png", color:"#75aaff"},
						"false":{img:"center_grey.png", color:"#cccccc"}
					},
					entity:{
						"true":{img:"entity.png", color:"#75aaff"},
						"false":{img:"entity_grey.png", color:"#cccccc"}
					},
					branch:{
						"true":{img:"branch.png", color:"#75aaff"},
						"false":{img:"branch_grey.png", color:"#cccccc"}
					}
				},
				is_dishonest:{
					center:{
						"true":{img:"center.png", color:"#75aaff"},
						"false":{img:"center_grey.png", color:"#cccccc"}
					},
					entity:{
						"true":{img:"entity.png", color:"#75aaff"},
						"false":{img:"entity_grey.png", color:"#cccccc"}
					},
					branch:{
						"true":{img:"branch.png", color:"#75aaff"},
						"false":{img:"branch_grey.png", color:"#cccccc"}
					}
				}
			},
            data:{},
            nodeMap:{},
            paths:undefined,
            centerNode:undefined,
            lightFlag : false,
        }

        this.createOptions = this.createOptions.bind(this);
        this.initEvent = this.initEvent.bind(this);
        
        this.nodeClick = this.nodeClick.bind(this);
        this.doubleClick = this.doubleClick.bind(this);
        this.rightClick = this.rightClick.bind(this);
       
        this.nodeStyleFunction = this.nodeStyleFunction.bind(this);
        this.linkStyleFunction = this.linkStyleFunction.bind(this);
    }

    /**
     * 创建graph options
     * @param {*} options 
     */
    async createOptions( options )
    {
        let { graphOptions, container} = this.state;

        if( options!==undefined && options.graphOptions!==undefined )
        {            
            graphOptions = {...graphOptions, ...options.graphOptions};
            
            graphOptions.zoomchartsSetting.container = container;
            
            graphOptions.zoomchartsSetting = $.extend(graphOptions.zoomchartsSetting, options.graphOptions.zoomchartsSetting);
            
            if( options.graphOptions.flag=="pyramid" )
            {
                graphOptions.zoomchartsSetting.layout.mode = "hierarchy";
                graphOptions.zoomchartsSetting.layout.nodeSpacing = 50;
                graphOptions.zoomchartsSetting.layout.rowSpacing = 200;
            }
            else if( options.graphOptions.flag=="netting" )
            {
                graphOptions.zoomchartsSetting.layout.mode = "dynamic";
                graphOptions.zoomchartsSetting.layout.nodeSpacing = 40;
                graphOptions.zoomchartsSetting.layout.rowSpacing = null;
            }
            else if( options.graphOptions.flag=="annular" )
            {
                graphOptions.zoomchartsSetting.layout.mode = "radial";
                graphOptions.zoomchartsSetting.layout.nodeSpacing = 40;
                graphOptions.zoomchartsSetting.layout.rowSpacing = null;
            }
            
            graphOptions.isShowProperty = options.isShowProperty!=undefined ? options.isShowProperty : this.props.isShowProperty ? this.props.isShowProperty : false;
            graphOptions.pruneLeaves = options.graphOptions.pruneLeaves!=undefined ? options.graphOptions.pruneLeaves : false;
            graphOptions.playModel = options.graphOptions.playModel!=undefined ? options.graphOptions.playModel : 'all';
            
            
            if( options.graphOptions.nodeStyleFunction!=undefined )
            {
                graphOptions.zoomchartsSetting.style.nodeStyleFunction = options.graphOptions.nodeStyleFunction;
            }
            else
            {
                graphOptions.zoomchartsSetting.style.nodeStyleFunction = this.nodeStyleFunction;
            }
            
            if( options.graphOptions.linkStyleFunction!=undefined )
            {
                graphOptions.zoomchartsSetting.style.linkStyleFunction = options.graphOptions.linkStyleFunction;
            }
            else
            {
                graphOptions.zoomchartsSetting.style.linkStyleFunction = this.linkStyleFunction;
            }
        }
        
        await this.setState({graphOptions:graphOptions});
        this.initEvent();
    }

    /**
     * 设置点击事件
     */
    initEvent()
    {
        let { graphOptions } = this.state;

        graphOptions.zoomchartsSetting.events.onClick = this.nodeClick;
        graphOptions.zoomchartsSetting.events.onDoubleClick = this.doubleClick;
        graphOptions.zoomchartsSetting.events.onRightClick = this.rightClick;

        this.setState({graphOptions:graphOptions})
    }


    /**
     * 设置图谱数据
     * @options graphData 图谱数据 {data:data, centerName:""}
     */
    buildData = async (graphData) => {
        
        let { data, nodeMap } = this.state;

        let nodes, links, centerNode;
        
        data = {...graphData};
        
        nodes = graphData.data.NODES;
        
        links = graphData.data.EDGES;
        
        for( let i=0; i<links.length; i++ )
        {
            links[i]["from"] = links[i]["from_id"];
            links[i]["to"] = links[i]["to_id"];
        }
        
        for( let i=0; i<nodes.length; i++ )
        {
            if( nodes[i].name == graphData.centerName )
            {
                nodes[i].isCenter = true;
                centerNode = nodes[i];
            }
            
            nodeMap[nodes[i].id] = nodes[i];
        }

        await this.setState({nodeMap:nodeMap, data:data, centerNode:centerNode})
        
        this.drawGraph();
    };

    annularDiagram = (type) => () => {
        if(type === this.state.graphType) return;
        this.setState({graphType: type})
        this.createOptions({...this.state.options,graphOptions: { flag: type, playModel: "all"}})
        this.buildData(this.state.data);
    }

   
    /**
     * 画图谱
     */
    drawGraph = async () => {

        let { data, graphOptions, chart, nodeMap, nettingDiagramDIV, annularDIV, pyramidDIV, graphType}  = this.state;

        let chartData = {};
        
        chartData = {...data.data};

        if( chart!==undefined )
        {
            chart = null;
        }
        
        /** 剪枝 可以传入true 或者一个数组，数组中定义一个类型，例如['人员','企业'] */
        if( graphOptions.pruneLeaves!==undefined )
        {
            chartData = this.pruneLeaves(chartData, graphOptions.pruneLeaves);
        }
        
        if( graphOptions.playModel!==undefined && graphOptions.playModel!=='' && graphOptions.playModel==='play' )
        {
            graphOptions.zoomchartsSetting.data.preloaded = null;
            
            chart = new NetChart(graphOptions.zoomchartsSetting);
            
            this.drawPlayChart(chart, [...chartData.EDGES], nodeMap);
        }
        else
        {
            graphOptions.zoomchartsSetting.data.preloaded = {nodes:[...chartData.NODES], links:[...chartData.EDGES]} ;
            
            chart = new NetChart(graphOptions.zoomchartsSetting);
        }

        this.setState({chart:chart, chartData:chartData});
    };

    /**
     * 重画图谱
     * @param {*} nodeIds 
     */
    redraw = async ( nodeIds ) => {
        let { graphOptions } = this.state;

        graphOptions.nodeIds = nodeIds;

        this.setState({graphOptions:graphOptions});

        this.drawGraph();
    }

    /**
     * 播放画族谱
     */
    drawPlayChart = (chart, links, nodeMap) => {

        let { graphOptions, timerInterval} = this.state;

        let that = this;
        
        timerInterval = setInterval(function()
        {
            graphOptions.changeTime++;
            
            if( links.length >0 )
            {
                let data = {};
                
                data["links"] = [];
                data["nodes"] = [];
                
                let item = links.pop();
                
                data["links"].push(item);
                
                data["nodes"].push(nodeMap[item.from_id]);
                data["nodes"].push(nodeMap[item.to_id]);
                
                chart.addData(data);
                
                if( graphOptions.changeTime >= 15 &&  graphOptions.changeTime < 30 )
                {
                    graphOptions.time = 300;
                    clearInterval(timerInterval);
                    
                    that.drawPlayChart(chart, links, nodeMap);
                    
                    //initPlay(links, nodeMap);
                }
                else if( graphOptions.changeTime >= 30 )
                {
                    graphOptions.time = 60;
                    clearInterval(timerInterval);
                    that.drawPlayChart(chart, links, nodeMap);
                    //initPlay(links, nodeMap);
                }
            }
            else
            {
                clearInterval(timerInterval);
                timerInterval = null;
            }
        }, graphOptions.time);
        
    }

    /**
     * 高亮路径
     * @param {*} bool 
     * @param {*} startNodeName 
     * @param {*} endNodeName 
     */
    drawLightPathGraph = async(bool, startNodeName, endNodeName) => {
        const { data, chart} = this.state;

        let chartData = {...data.data };
        
        let nodes = chartData.NODES;
        
        let startNode, endNode = {};

        let paths;
        
        if( typeof startNodeName==="string" )
        {
            for( let i=0; i<nodes.length; i++ )
            {
                if( nodes[i].name===startNodeName )
                {
                    startNode = nodes[i];
                }
                else if( nodes[i].name == endNodeName )
                {
                    endNode = nodes[i] || {};
                }
            }
            
            let to = chart.getNode(endNode.id);
            let from = chart.getNode(startNode.id);
            
            paths = this.computePath(from, to);
            
            if( paths!==undefined )
            {
                this.setState({paths:paths});
            }
            
            this.redraw();
        }	
    }


    /**
     * 计算最短路径
     * @param {*} from 
     * @param {*} to 
     * @returns 
     */
    computePath = (from, to) => {
        if(!to) return;
        let back = {};
        let queue = [from];
        let link, next, cur;
        
        //循环起始节点
        while ( queue.length>0 ) 
        {
            //删减
            cur = queue.shift();
            
            //找到后退出
            if ( cur==to ) break;
            
            //循环该节点的所有边
            for( let i in cur.links ) 
            {
                link = cur.links[i];
                
                //找到边对应的另外一个节点
                next = link.otherEnd(cur);
                
                //如果这个节点之前已经找过了，不在继续
                if ( back[next.id] ) continue;
                
                //否则存入找过队列
                back[next.id] = link;
                
                //将该店划入下一次需要找的数组中
                queue.push(next);
            }
        }
        
        let result = {};
        
        //找到关联的点和边
        while ( cur!=from ) 
        {
            //循环back中的边
            link = back[cur.id];
            cur = link.otherEnd(cur);
            result[link.id] = true;
            result[cur.id] = true;
        }
        
        //把目标节点一起放入其中
        result[to.id] = true;
        
        return result;
    }

    /**
     * 剪枝
     * @param {*} data 
     * @param {*} pruneLeaves 
     * @returns 
     */
    pruneLeaves = (data, pruneLeaves) => {
        let nodeMap = {}, edgsNumMap = {}, leaveNodes = [], remainNodes = [];
        
        let chartData = {...data};
        
        let nodes = [...chartData.NODES];
        let edges = [...chartData.EDGES];
        
        if( pruneLeaves===true )
        {
            for( let i=0; i<nodes.length; i++ )
            {
                nodeMap[nodes[i].id] = nodes[i];
                edgsNumMap[nodes[i].id] = 0;
            }
            
            for( let j=0; j<edges.length; j++ )
            {
                if( edgsNumMap[edges[j].from_id] !== undefined )
                {
                    edgsNumMap[edges[j].from_id] =  edgsNumMap[edges[j].from_id]+1;
                }
            }
            
            for( let i=0; i<nodes.length; i++ )
            {
                if( edgsNumMap[nodes[i].id] > 1 && !nodes[i].isCenter )
                {
                    leaveNodes.push(nodes[i]);
                }
                else
                {
                    remainNodes.push(nodes[i]);
                }
            }
            
            for( let j=0; j<edges.length; j++ )
            {
                for( let k=0; k<leaveNodes.length; k++ )
                {
                    if( edges[j].from_id===leaveNodes[k].id || edges[j].to_id===leaveNodes[k].id )
                    {
                        edges.splice(j,1);
                        j-= 1;
                        if( j < 0 ) j=0;
                    }
                }
            }
            
            chartData.nodes = remainNodes;
            chartData.links = edges; 
        }
        else if( typeof pruneLeaves=== 'object' && pruneLeaves.length>0 )
        {
            //指定某个类型的叶子节点剪掉
            let nodeTypes = pruneLeaves;
            
            for( let i=0; i<nodes.length; i++ )
            {
                nodeMap[nodes[i].id] =  nodes[i];
                edgsNumMap[nodes[i].id] = [];
                
            }
            
            for( let j=0; j<edges.length; j++ )
            {
                if( edgsNumMap[edges[j].from_id].indexOf(edges[j].to_id) === -1 )
                {
                    edgsNumMap[edges[j].from_id].push(edges[j].to_id);
                }

                if( edgsNumMap[edges[j].to_id].indexOf(edges[j].from_id) === -1 )
                {
                    edgsNumMap[edges[j].to_id].push(edges[j].from_id);
                }
            }
            
            for( let i=0; i<nodes.length; i++ )
            {
                if( edgsNumMap[nodes[i].id].length===1 && !nodes[i].isCenter && nodeTypes.indexOf(nodes[i].type)!==-1 )
                {
                    leaveNodes.push(nodes[i]);
                }
                else
                {
                    remainNodes.push(nodes[i]);
                }
            }
            
            for( let j=0; j<edges.length; j++ )
            {
                for( let k=0; k<leaveNodes.length; k++ )
                {
                    if( edges[j].from_id===leaveNodes[k].id || edges[j].to_id===leaveNodes[k].id )
                    {
                        edges.splice(j,1);
                        j-= 1;
                        if( j < 0 ) j=0;
                    }
                }
            }
            chartData.nodes = remainNodes;
            chartData.links = edges; 
        }
        
       // await this.setState({data:chartData});

        return chartData;
    }


    /**
     * 点击节点事件
     * @param {*} event 
     * @param {*} args 
     */
    nodeClick(e, args)
    {
        let { options, centerNode, graphOptions} = this.state;

        let startPath, endPath;

        if( options.shortestFlag )	//最短路径被选中
        {
            /*	
            if ( event.clickNode!=undefined )
            {
                startPath = event.clickNode.label;
                
                if( clickFlag )
                {
                    clickFlag = false;
                }
                else
                {
                    endPath = startPath;
                    clickFlag = true;
                }
                
            }
            else if ( event.currentTarget!=undefined)
            { 
                startPath = event.currentTarget.centerName;
            }
            else if(event.clickNode == undefined || event.clickNode == '')
            {
                return ;
            }
            
            if( startPath!=endPath )
            {
                whetherShowHeightLightPath(true, startPath, endPath);
            }
            */
        }
        else if( options.lightFlag )		//高亮路径被选中
        {
            startPath = centerNode.name;
            
            // if ( this.export && this.export.clickNode!=undefined )
            if ( e.clickNode!=undefined )
            {
                endPath = e.clickNode.label;						//获取选中的图标
            }
            
            this.drawLightPathGraph(true, startPath, endPath );
        }
        // else if( $("#showMenu").attr("class").indexOf("hide") == -1 )
        // {
        //     $("#showMenu").addClass("hide");
        // }
        
        if( graphOptions.clickFun!==undefined )
        {
            graphOptions.clickFun.call(this, e.clickNode);
        }
    }


    /**
     * 双击图标时事件
     */
    doubleClick(e ,args)
    {
        const { graphOptions } = this.state;

        if( graphOptions.doubleClickFun!==undefined )
        {
            graphOptions.doubleClickFun.call(this, e.clickNode);
        }        
    }

    /** 
     * 右键弹出选项 
     */
    rightClick(e, args)
    {
        let { graphOptions } = this.state, ret = false;

        let events = args;
        
        if( graphOptions.rightClick!==undefined  )
        {
            ret = graphOptions.rightClick.call(this, e, args);
        }

        if( ret==false )
        {
            if( args.clickNode )
            {
                // if( $("#showMenu").attr("class").indexOf("hide") != -1 )
                // {
                //     $("#showMenu").removeClass("hide");
                // }
                
                // let menu = document.getElementById("showMenu");
                
                // menu.style.left = event.pageX+25 + "px";
                // menu.style.top = event.pageY-10 + "px";
                
                // let content = "<div onmouseover='over(this)' onmouseout='out(this)' id='entity_name' style='padding-left: 15px;padding-right: 15px;'><div style='border-bottom: solid 1px #EAEDF3;'><span>"+event.clickNode.label+"</span></div></div>"
                
                // if(args.clickNode.data.type=="ENTITY") //只有企业才显示"进入全景"
                // {
                //     content += "<div onmouseover='over(this)' onmouseout='out(this)' style='cursor: pointer;padding-left: 15px;padding-right: 15px;' id='entityPanorama'><div style='border-bottom: solid 1px #EAEDF3;' onclick='searchEntityProgram()'>企业全景</div></div>"
                //     content += "<div onmouseover='over(this)' onmouseout='out(this)' style='cursor: pointer;padding-left: 15px;padding-right: 15px;' id='searchNode' onclick='searchNode()'><div style='border-bottom: solid 1px #EAEDF3;'>探寻</div></div>";	
                // }
                
                /*content += "<div onmouseover='over(this)' onmouseout='out(this)' style='cursor: pointer;padding-left: 15px;padding-right: 15px;' id='showNode' onclick='showNode()'><div style='border-bottom: solid 1px #EAEDF3;'>展开</div></div>";*/
                
                // content += "<div onmouseover='over(this)' onmouseout='out(this)' style='cursor: pointer;padding-left: 15px;padding-right: 15px;' id='deleteNode' onclick='deleteNode()'>删除</div>"
                
                // menu.innerHTML = content;
            }
        }
    }

    /**
     * 族谱节点
     */
    nodeStyleFunction(node)
    {
        const  { nodeType, entiysColors, graphOptions, paths, options} = this.state;

        let lineColor = null, imageUrl;
        
        switch( node.data.type )
        {
            case "ENTITY":
            {
                if( node.data.isCenter )
                {
                    //"center.png"
                    // node.image = nodeType["center"].img;
                    
                    imageUrl = require("../img/netGraph/" + nodeType["center"].img);

                    if( graphOptions.colorType!=undefined )
                    {
                        imageUrl = require("../img/netGraph/" + nodeType["center_grey"].img);

                        lineColor = nodeType["center_grey"].color;
                        let nodeVal;
                        
                        switch( graphOptions.colorType )
                        {
                            case "risklvl":
                            {
                                nodeVal = node.data.content.RISKLVL;
                                
                                if("-"!=nodeVal && ""!=nodeVal )
                                {
                                    imageUrl = require("../img/netGraph/" + entiysColors["risklvl"]["center"][node.data.content.RISKLVL].img);
                                    lineColor = entiysColors["risklvl"]["center"][node.data.content.RISKLVL].color;
                                }	
                                
                                break;
                            }
                            case "is_abnormal":
                            case "is_illegual":
                            case "is_penalty":
                            case "is_dishonest":
                            {
                                lineColor = null;
                                if( node.data.content.content[graphOptions.colorType.toUpperCase()]==true || node.data.content.content[graphOptions.colorType.toUpperCase()]=="TRUE" )
                                {
                                    imageUrl = require("../img/netGraph/" + entiysColors[graphOptions.colorType]["center"]["true"].img);
                                    lineColor = entiysColors[graphOptions.colorType]["center"]["true"].color;
                                }
                                else
                                {
                                    imageUrl = require("../img/netGraph/" + entiysColors[graphOptions.colorType]["center"]["false"].img);
                                    lineColor = entiysColors[graphOptions.colorType]["center"]["false"].color;
                                }
                                break;
                            }
                            default:
                            {
                                imageUrl = require("../img/netGraph/" + nodeType["center"].img);
                                break;
                            }
                        }
                    }
                    
                    if( graphOptions.nodeIds!=null )
                    {
                        if( graphOptions.nodeIds.length>0 )
                        {
                            let isSelected = false;
                            for(let i in graphOptions.nodeIds)
                            {
                                if( graphOptions.nodeIds[i]==node.data.id )
                                {
                                    isSelected = true;
                                    break;
                                }
                            }
                            
                            if( isSelected==false )
                            {
                                imageUrl = require("../img/netGraph/" + nodeType["center_grey"].img); 
                                lineColor = nodeType["center_grey"].color;
                            }
                            
                        }
                        else
                        {
                            //
                            imageUrl = require("../img/netGraph/" + nodeType["center_grey"].img); 
                            lineColor = nodeType["center_grey"].color;
                        }	
                        
                    }
                    
                    node.cursor = "pointer";
                    node.items = [{
                        px : 0.7, 
                        py : -0.7, 
                        backgroundStyle : {fillColor :"", lineColor :"", lineWithd :2 }, //中心节点样式
                        scaleWithZoom : true
                    }]
                    
                }
                else if( node.data.content.IS_BRANCH=="TRUE" )
                {
                    imageUrl = require("../img/netGraph/" + nodeType["branch"].img); 
                    
                    if( options.lightFlag==true )
                    {
                        imageUrl = require("../img/netGraph/" + nodeType["branch_grey"].img); 

                        if( paths!=undefined && paths[node.data.id]==true )
                        {
                            node.image = nodeType["branch"].img;
                        }
                    }	
                    
                    if( graphOptions.colorType!=undefined )
                    {
                        imageUrl = require("../img/netGraph/" + nodeType["branch_grey"].img); 

                        let nodeVal;
                        
                        switch( graphOptions.colorType )
                        {
                            case "risklvl":
                            {
                                nodeVal = node.data.content.RISKLVL;
                                
                                if("-"!=nodeVal && ""!=nodeVal )
                                {
                                    imageUrl = require("../img/netGraph/" + entiysColors["risklvl"]["branch"][node.data.content.RISKLVL].img); 

                                }
                                
                                break;
                            }
                            case "is_abnormal":
                            case "is_illegual":
                            case "is_penalty":
                            case "is_dishonest":
                            {
                                if( node.data.content.content[graphOptions.colorType.toUpperCase()]==true || node.data.content.content[graphOptions.colorType.toUpperCase()]=="TRUE")
                                {
                                    imageUrl = require("../img/netGraph/" + entiysColors[graphOptions.colorType]["branch"]["true"].img); 
                                }
                                else
                                {
                                    imageUrl = require("../img/netGraph/" + entiysColors[graphOptions.colorType]["branch"]["false"].img); 
                                }
                                break;
                            }
                            default:
                            {
                                imageUrl = require("../img/netGraph/" + nodeType["branch"].img); 
                                break;
                            }
                        }
                        
                        if( options.lightFlag==true )
                        {
                            imageUrl = require("../img/netGraph/" + nodeType["branch_grey"].img); 
                            
                            if( paths!=undefined && paths[node.data.id]==true )
                            {
                                switch( graphOptions.colorType )
                                {
                                    case "risklvl":
                                    {
                                        if("-"!=node.data.content.RISKLVL && ""!=node.data.content.RISKLVL)
                                        {
                                            imageUrl = require("../img/netGraph/" + entiysColors["risklvl"]["branch"][node.data.content.RISKLVL].img); 
                                        }	
                                        
                                        break;
                                    }
                                    case "is_abnormal":
                                    case "is_illegual":
                                    case "is_penalty":
                                    case "is_dishonest":
                                    {
                                        if( node.data.content.content[graphOptions.colorType.toUpperCase()]==true || node.data.content.content[graphOptions.colorType.toUpperCase()]=="TRUE")
                                        {
                                            imageUrl = require("../img/netGraph/" + entiysColors[graphOptions.colorType]["branch"]["true"].img); 
                                        }
                                        else
                                        {
                                            imageUrl = require("../img/netGraph/" + entiysColors[graphOptions.colorType]["branch"]["false"].img); 
                                        }
                                        break;
                                    }
                                    default:
                                    {
                                        imageUrl = require("../img/netGraph/" + nodeType["branch"].img); 
                                        node.image = nodeType["branch"].img;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    
                    if( graphOptions.nodeIds!=null )
                    {
                        if( graphOptions.nodeIds.length>0 )
                        {
                            let isSelected = false;
                            for(let i in graphOptions.nodeIds)
                            {
                                if( graphOptions.nodeIds[i]==node.data.id )
                                {
                                    isSelected = true;
                                    break;
                                }
                            }
                            
                            if( isSelected==false )
                            {
                                imageUrl = require("../img/netGraph/" + nodeType["branch_grey"].img); 
                                lineColor = nodeType["branch_grey"].color;
                            }
                            
                        }
                        else
                        {
                            imageUrl = require("../img/netGraph/" + nodeType["branch_grey"].img); 
                            lineColor = nodeType["branch_grey"].color;
                        }	
                        
                    }
                    
                }
                else
                {
                    imageUrl = require("../img/netGraph/" + nodeType["entity"].img); 
                    
                    if( options.lightFlag==true )
                    {
                        imageUrl = require("../img/netGraph/" + nodeType["entity_grey"].img); 
                        
                        if( paths!=undefined && paths[node.data.id]==true )
                        {
                            imageUrl = require("../img/netGraph/" + nodeType["entity"].img); 
                        }
                    }
                    
                    if( graphOptions.colorType!=undefined )
                    {
                        imageUrl = require("../img/netGraph/" + nodeType["entity_grey"].img); 
                        
                        switch( graphOptions.colorType )
                        {
                            case "risklvl":
                            {
                                if("-"!=node.data.content.RISKLVL && ""!=node.data.content.RISKLVL)
                                {
                                    imageUrl = require("../img/netGraph/" + entiysColors["risklvl"]["entity"][node.data.content.RISKLVL].img); 
                                }	
                                
                                break;
                            }
                            case "is_abnormal":
                            case "is_illegual":
                            case "is_penalty":
                            case "is_dishonest":
                            {
                                if( node.data.content.content[graphOptions.colorType.toUpperCase()]==true || node.data.content.content[graphOptions.colorType.toUpperCase()]=="TRUE")
                                {
                                    imageUrl = require("../img/netGraph/" + entiysColors[graphOptions.colorType]["entity"]["true"].img); 
                                }
                                else
                                {
                                    imageUrl = require("../img/netGraph/" + entiysColors[graphOptions.colorType]["entity"]["false"].img); 
                                }
                                break;
                            }
                            default:
                            {
                                imageUrl = require("../img/netGraph/" + nodeType["entity"].img); 
                                break;
                            }
                        }
                        
                        if( options.lightFlag==true )
                        {
                            imageUrl = require("../img/netGraph/" + nodeType["entity_grey"].img); 

                            if( paths!=undefined && paths[node.data.id]==true )
                            {
                                switch( graphOptions.colorType )
                                {
                                    case "risklvl":
                                    {
                                        if("-"!=node.data.content.RISKLVL && ""!=node.data.content.RISKLVL)
                                        {	
                                            imageUrl = require("../img/netGraph/" + entiysColors["risklvl"]["entity"][node.data.content.RISKLVL].img); 
                                        }	
                                        break;
                                    }
                                    case "is_abnormal":
                                    case "is_illegual":
                                    case "is_penalty":
                                    case "is_dishonest":
                                    {
                                        if( node.data.content.content[graphOptions.colorType.toUpperCase()]==true || node.data.content.content[graphOptions.colorType.toUpperCase()]=="TRUE")
                                        {
                                            imageUrl = require("../img/netGraph/" + entiysColors[graphOptions.colorType]["entity"]["true"].img); 
                                        }
                                        else
                                        {
                                            imageUrl = require("../img/netGraph/" + entiysColors[graphOptions.colorType]["entity"]["false"].img); 
                                        }
                                        break;
                                    }
                                    default:
                                    {
                                        imageUrl = require("../img/netGraph/" + nodeType["entity"].img); 
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    
                    if( graphOptions.nodeIds!=null )
                    {
                        if( graphOptions.nodeIds.length>0 )
                        {
                            let isSelected = false;
                            for(let i in graphOptions.nodeIds)
                            {
                                if( graphOptions.nodeIds[i]==node.data.id )
                                {
                                    isSelected = true;
                                    break;
                                }
                            }
                            
                            if( isSelected==false )
                            {
                                imageUrl = require("../img/netGraph/" + nodeType["entity_grey"].img);
                                lineColor = nodeType["entity_grey"].color;
                            }
                            
                        }
                        else
                        {
                            imageUrl = require("../img/netGraph/" + nodeType["entity_grey"].img);
                            lineColor = nodeType["entity_grey"].color;
                        }	
                    }
                }
                
                //lineColor = "rgba(253,125,0,1)";
                node.label = node.data.name; //显示节点下面名称
                break;
            }
            case "PERSON":
            {
                imageUrl = require("../img/netGraph/" + nodeType["person"].img);
                
                if( options.lightFlag==true )
                {
                    imageUrl = require("../img/netGraph/" + nodeType["person_grey"].img);
                    
                    if( paths!=undefined && paths[node.data.id]==true )
                    {
                        imageUrl = require("../img/netGraph/" + nodeType["person"].img);
                    }
                }	
                
                if( graphOptions.colorType!=undefined )
                {

                    imageUrl = require("../img/netGraph/" + nodeType["person"].img);
                                        
                    if( paths!=undefined && paths[node.data.id]==true )
                    {
                        imageUrl = require("../img/netGraph/" + nodeType["person"].img);
                    }	
                    
                }
                //lineColor = "rgba(52,153,255,1)";
                node.label = node.data.name;
                break;
            }
            case "WEBSITE":
            {
                imageUrl = require("../img/netGraph/" + nodeType["website"].img);
                
                if( options.lightFlag==true )
                {
                    imageUrl = require("../img/netGraph/" + nodeType["website_grey"].img);
                    
                    if( paths!=undefined && paths[node.data.id]==true )
                    {
                        imageUrl = require("../img/netGraph/" + nodeType["website"].img);

                    }
                }
                
                if( graphOptions.colorType!=undefined )
                {
                    imageUrl = require("../img/netGraph/" + nodeType["website"].img);
                    
                    if( paths!=undefined && paths[node.data.id]==true )
                    {
                        imageUrl = require("../img/netGraph/" + nodeType["website_grey"].img);
                    }	
                    
                }
                
                //lineColor = "rgba(26,187,156,1)";
                node.label =   node.data.name;
                break;
            }
            default :
            {
                if(node.data.type!=undefined)
                {
                    imageUrl = require("../img/netGraph/" + nodeType[node.data.type.toLowerCase()].img);
                    
                    if( options.lightFlag==true )
                    {
                        imageUrl = require("../img/netGraph/" + nodeType[node.data.type.toLowerCase()+"_grey"].img);
                        
                        if( paths!=undefined && paths[node.data.id]==true )
                        {
                            imageUrl = require("../img/netGraph/" + nodeType[node.data.type.toLowerCase()].img);
                        }
                    }
                    
                    if( graphOptions.colorType!=undefined )
                    {
                        imageUrl = require("../img/netGraph/" + nodeType[node.data.type.toLowerCase()].img);
                        
                        if( paths!=undefined && paths[node.data.id]==true )
                        {
                            imageUrl = require("../img/netGraph/" + nodeType[node.data.type.toLowerCase()].img);
                        }	
                        
                    }
                    
                    //lineColor = "rgba(26,187,156,1)";
                    node.label =   node.data.name;
                }	
                break;
            }
        }
        
        node.image = imageUrl;
        // node.fillColor = isCenter ? "rgba(253,125,0,1)" : "rgba(255,255,255,1)";
        node.lineWidth =  node.data.isCenter ? 10 : 0;										//中心环 宽度
        node.lineColor =  lineColor==null ? "#4786F7" : lineColor;			//中心环颜色        rgba(253,125,0,0.3)
        //node.labelStyle.backgroundStyle.fillColor = isCenter ? "rgba(253,125,0,1)" : "rgba(255,255,255,1)";	中心 字体背景色
        node.labelStyle.textStyle.fillColor = "#666666";		//节点字体颜色
        node.labelStyle.textStyle.font = "16px Comic Sans MS";
        node.labelStyle.margin = 10;	
    }
    
    /**
     * 族谱边样式
     */
    linkStyleFunction(link)
    {
        const { options, paths, graphOptions} = this.state;

        let contentTemp = null, linkText = null;
        
        if( graphOptions.isShowProperty )
        {	
            //开启属性
            if( link.data.type=="INV_ENT" || link.data.type=="INV_PER" )
            {
                contentTemp = link.data.content.SUBCONPROP==undefined ? null : Widget.numberFormatter((link.data.content.SUBCONPROP), 2) ;
                //linkText = link.data.content.INVTYPE + "," + contentTemp +"%";
                linkText = "投资" + "," + contentTemp +"%";
                
            }
            else if( link.data.type=="OFF" )
            {
                linkText = link.data.content.POSITION;
            }
            else
            {
                linkText = link.data.type_name;
            }
        }
        else//关闭属性
        {				
            contentTemp = null;
            linkText = null;
        }
        
        let py = 10;
        let textFillColor = "#242324";
        
        //高亮情况下字体的颜色
        if( options.lightFlag==true )
        {
            textFillColor = "#dddddd";
            
            if( paths!=undefined && paths[link.data.id]==true )
            {
                textFillColor = "#242324";
            }
        }
        
        link.radius = 2;
        
        let color = null;						//设置连线颜色
        
        switch( link.data.type )
        {
            case "INV_ENT":
            case "INV_PER":
            {
                color = "#4E98FF";		//投资显示的线的颜色	RGB(253,125,0)
                break;
            }
            case "OFF":
            {
                color = "#FFA902";		//任职       线的颜色	RGB(147,171,250)
                
                break;
            }
            case "BRH":
            {
                color = "#30c6e9";
                break;
            }
            default :
            {
                color = "#0b3b9c";
                break;
            }
        }
        
        if( options.lightFlag==true )
        {
            color = "#ddd";
            
            if( paths!=undefined && paths[link.data.id]==true )
            {
                switch( link.data.type )
                {
                    case "INV_PER":
                    case "INV_ENT":
                    {
                        color = "#4E98FF";		//投资显示的线的颜色	RGB(253,125,0)
                        break;
                    }
                    case "OFF":
                    {
                        color = "#FFA902";		//任职       线的颜色	RGB(147,171,250)
                        break;
                    }
                    case "BRH":
                    {
                        color = "#30c6e9";
                        break;
                    }
                    default :
                    {
                        color = "RGB(0,0,0)";
                        break;
                    }
                }
            }
        }
        
        link.items = [{
            text: linkText,
            padding:2,
            backgroundStyle: {
                fillColor: linkText == null? "":"#ffffff",	//显示属性时线条旁边字体背景   fillColor: linkText == null? "":"rgba(86,185,247,1)"
            },
            rotateWithLink : false,
            textStyle: {
                fillColor: textFillColor
                    
            },
            py : 10
        }];

        link.length = 0.5;
        
        link.fillColor = color;
    }

    componentWillReceiveProps( nextProps )
    {
        const { data, options } = this.props;
        if( nextProps.data!==data || options!==nextProps.options )
        {
            this.createOptions(nextProps.options);
            this.buildData(nextProps.data);
        }
    }

    exportGraph = (exportType) => {
        	
        const {graphOptions, chart} = this.state;
        
        graphOptions.zoomchartsSetting.interaction.zooming.wheel = false;
        
        switch(exportType) {
            case "all":
                setTimeout(function(){
                    chart.export("jpg");
                    graphOptions.zoomchartsSetting.interaction.zooming.wheel = true;
                },3000);
                break;
            case "current":
                setTimeout(function(){
                    chart.export("jpg");
                    graphOptions.zoomchartsSetting.interaction.zooming.wheel = false;
                    
                },3000);
                break;
            case "excel":
            {
                // var preloaded = graphOptions.zoomchartsSetting.data.preloaded;
                // var excelData = JSON.stringify(preloaded);
                
                // var url ='graphData/exportExcel';
                // $.ajax({
                //     url:url,
                //     type:"post",
                //     datatype:"json",
                //     contentType : "application/json; charset=utf-8",
                //     data:excelData,
                //     success :function(data){
                //         data = JSON.parse(data);
                        
                //         var form = $("<form></form>").attr("action", "graphData/downloadLocal").attr("method", "post");
                //         form.append($("<input></input>").attr("type", "hidden").attr("name", "fileName").attr("value", data.fileName));
                //         form.append($("<input></input>").attr("type", "hidden").attr("name", "filePath").attr("value", data.filePath));
                //         form.appendTo('body').submit().remove(); 
                //     },
                //     error:function(data){
                        
                //     }
                // })
                
                break;
            }
        }
    };

    getNodeName = () => {
        let { data, chart, keyWord}  = this.state;

        let chartData = {...data.data} || {};
        
        let nodes = chartData.NODES;
        	
        	for( let k in nodes )
        	{
        		if( nodes[k].name.indexOf(keyWord)!=-1 )
        		{
        			var charNode = chart.getNode(nodes[k].id);
        			
        			chart.addFocusNode(charNode);
        		}	
        	}	
        }
        

    onSwitch = async (val,e,type) => {
        e.stopPropagation();
        if(type === 1){
            await this.setState({
                options: {...this.state.options, ...this.state.graphOptions, isShowProperty: val},
            })
        }else{
            await this.setState({
                options: {...this.state.options, lightFlag: !this.state.options.lightFlag}
            })
        }
        this.createOptions({...this.state.options, graphOptions: {...this.state.options.graphOptions, flag: this.state.flag, playModel: this.state.playModel}})
        this.buildData(this.state.data);
    }

    keyWordKeyUp = (e) => {
        if(e.keyCode === 13){
            this.getNodeName();
        }
    }

    export = (val) => {
        this.exportGraph(val)
    }

    render()
    {
        const { container, legendDIV, nettingDiagramDIV, annularDIV, pyramidDIV, graphType, exports, } = this.state;
        
        return (
            <div className="sf-graph sd-graph sg-graph">
                <div className='sf-graph-filter sd-graph-filter sg-graph-filter'>
                    <div>
                        <WidgetSelect data={exports} options={{title: '导出'}} onSelect={(val)=>{this.export(val)}} showSearch={false} defaultValue={null} />
                    </div>
                    <div>
                        <Select placeholder='关系' defaultValue={null}>
                            <div value={1}>显示属性 <Switch checkedChildren="开" unCheckedChildren="关" size="small" defaultChecked={this.props.isShowProperty} onClick={(val, e)=>{this.onSwitch(val, e, 1)}} /></div>
                            <option value={2}>高亮路径 <Switch checkedChildren="开" unCheckedChildren="关" size="small" onClick={(val, e)=>{this.onSwitch(val, e, 2)}} /></option>
                        </Select>
                    </div>
                    <div>
                        <WidgetInput onClick={()=>this.getNodeName()} onChange={(e)=>this.setState({keyWord:e.target.value})}  onKeyUp={this.keyWordKeyUp}/>
                    </div>
                </div>
                <div id={container} className="sf-graph-content"> </div>
                {/* <div className='mask'></div> */}
                
                <div id={legendDIV} className="legend" style={{zIndex:999}}>
                    <div>
                        <p><img src={require('../img/netGraph/o3.svg')} /><span>企业</span></p>
                        <p><img src={require('../img/netGraph/o2.svg')} /><span>人员</span></p>
                        <p><img src={require('../img/netGraph/o1.svg')} /><span>分支机构</span></p>
                    </div>
                    <div>
                        <p><span></span><span>投资</span></p>
                        <p><span className='yellow'></span><span>任职</span></p>
                        <p><span className='green'></span><span>开设分支</span></p>
                    </div>
                </div>  
                <div id={nettingDiagramDIV} className={`sf-netting${graphType === 'netting' ? '-select' : ''}`} onClick={this.annularDiagram('netting')}></div>
                <div id={annularDIV} className={`sf-annular${graphType === 'annular' ? '-select' : ''}`} onClick={this.annularDiagram('annular')}></div>
                <div id={pyramidDIV} className={`sf-pyramid${graphType === 'pyramid' ? '-select' : ''}`} onClick={this.annularDiagram('pyramid')}></div>
            </div>
        )
    }
}
export default WidgetGraph
