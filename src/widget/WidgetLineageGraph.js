import React, {Component} from 'react';
import ReactDom from 'react-dom'
import { Graph, Shape, ToolsView, EdgeView} from "@antv/x6";
import { DagreLayout } from '@antv/layout'
import { Menu, Dropdown} from 'antd';

import Widget from './Widget';

import './../css/widget/widgetLineageGraph.css';


const LINE_HEIGHT = 24;
const NODE_WIDTH = 260;

class ContextMenuTool extends ToolsView.ToolItem
{
    render() 
    {
        if (!this.knob) 
        {
            this.knob = ToolsView.createElement('div', false);
            this.knob.style.position = 'absolute'
            this.container.appendChild(this.knob)
        }
        return this
    }

    toggleContextMenu = (visible ) => {

        ReactDom.unmountComponentAtNode(this.knob)
        document.removeEventListener('mousedown', this.onMouseDown)

        if (visible) 
        {
            ReactDom.render(
                <Dropdown
                    visible={true}
                    trigger={['contextMenu']}
                    overlay={this.options.menu}
                >
                <a />
                </Dropdown>,
                this.knob,
            )
            document.addEventListener('mousedown', this.onMouseDown)
        }
    }

    updatePosition = (e) => {
        const style = this.knob.style;
        if (e && e.e) 
        {
            const pos = this.graph.clientToGraph(e.e.clientX, e.e.clientY);
            style.left = `${pos.x}px`;
            style.top = `${pos.y}px`;
        } 
        else 
        {
            style.left = '-1000px';
            style.top = '-1000px';
        }
    }

    onMouseDown = () => {

        this.timer = window.setTimeout(() => {

            this.updatePosition();
            this.toggleContextMenu(false);
        }, 200);
    }

    onContextMenu = (e) => {
        if (this.timer) 
        {
            clearTimeout(this.timer);
            this.timer = 0;
        }
        this.updatePosition(e);
        this.toggleContextMenu(true);
    }

    delegateEvents = () => {

        this.cellView.on('cell:contextmenu', this.onContextMenu, this);
        return super.delegateEvents();
    }

    onRemove = () => {
        this.cellView.off('cell:contextmenu', this.onContextMenu, this);
    }
}

ContextMenuTool.config({
  tagName: 'div',
  isSVGElement: false,
})

Graph.registerEdgeTool('contextmenu', ContextMenuTool, true)
Graph.registerNodeTool('contextmenu', ContextMenuTool, true)



Graph.registerPortLayout(
    "erPortPosition",
    (portsPositionArgs) => {
      return portsPositionArgs.map((_, index) => {
        return {
          position: {
            x: 0,
            y: (index + 1) * LINE_HEIGHT,
          },
          angle: 0,
        };
      });
    },
    true
);

Graph.registerNode(
    "er-rect",
    {
        inherit: "rect",
        markup: [
            {
                tagName: "rect",
                selector: "body",
            },
            {
                tagName: "text",
                selector: "label",
            },
        ],
        attrs: {
            rect: {
                strokeWidth: 1,
                stroke: "#5F95FF",
                fill: "#5F95FF",
            },
            label: {
                fontWeight: "bold",
                fill: "#ffffff",
                fontSize: 12, 
                magnet: true,
            },
        },
        ports: {
            groups: {
                list: {
                    markup: [
                        {
                            tagName: "rect",
                            selector: "portBody",
                        },
                        {
                            tagName: "text",
                            selector: "portNameLabel",
                        },
                        {
                            tagName: "text",
                            selector: "portTypeLabel",
                        },
                    ],
                    attrs: {
                        portBody: {
                            width: NODE_WIDTH,
                            height: LINE_HEIGHT,
                            strokeWidth: 1,
                            stroke: "#5F95FF",
                            fill: "#EFF4FF",
                        },
                        portNameLabel: {
                            ref: "portBody",
                            refX: 6,
                            refY: 6,
                            fontSize: 10,
                        },
                        portTypeLabel: {
                            ref: "portBody",
                            refX: 95,
                            refY: 6,
                            fontSize: 10,
                        },
                    },
                    position: "erPortPosition",
                },
            },
        },
    },
    true
);

Graph.registerNode(
    "column-rect",
    {
        inherit: "rect",
        markup: [
            {
                tagName: "rect",
                selector: "body",
            },
            {
                tagName: "text",
                selector: "label",
            },
        ],
        attrs: {
            rect: {
                strokeWidth: 1,
                stroke: "#5F95FF",
                fill: "#5F95FF",
            },
            label: {
                fontWeight: "bold",
                fill: "#ffffff",
                fontSize: 12,
            },
        },
        ports: {
            groups: {
                list: {
                    markup: [
                        {
                            tagName: "rect",
                            selector: "portBody",
                            
                        },
                        {
                            tagName: "text",
                            selector: "portNameLabel",
                        },
                        {
                            tagName: "text",
                            selector: "portTypeLabel",
                        },
                    ],
                    attrs: {
                        portBody: {
                            markup: { tagName: 'circle' },
                            width: NODE_WIDTH,
                            height: LINE_HEIGHT,
                            strokeWidth: 1,
                            stroke: "#5F95FF",
                            fill: "#EFF4FF",
                            magnet: true,
                        },
                        portNameLabel: {
                            ref: "portBody",
                            refX: 6,
                            refY: 6,
                            fontSize: 10,
                        },
                        portTypeLabel: {
                            ref: "portBody",
                            refX: 95,
                            refY: 6,
                            fontSize: 10,
                        },
                    },
                    position: "erPortPosition",
                },
            },
        },
    },
    true
);


Graph.registerNode(
    "normal-rect",
    {
        inherit: "rect",
        markup: [
            {
                tagName: "rect",
                selector: "body",
            },
            {
                tagName: "text",
                selector: "label",
            },
        ],
        attrs: {
            rect: {
                strokeWidth: 1,
                stroke: "#5F95FF",
                fill: "#5F95FF",
            },
            label: {
                fontWeight: "bold",
                fill: "#ffffff",
                fontSize: 12,
            },
        },
        ports: {
            groups: {
                list: {
                    markup: [
                        {
                            tagName: "rect",
                            selector: "portBody",
                        },
                        {
                            tagName: "text",
                            selector: "portNameLabel",
                        },
                        {
                            tagName: "text",
                            selector: "portTypeLabel",
                        },
                    ],
                    attrs: {
                        portBody: {
                            width: NODE_WIDTH,
                            height: LINE_HEIGHT,
                            strokeWidth: 1,
                            stroke: "#5F95FF",
                            fill: "#ffffff",
                        },
                        portNameLabel: {
                            ref: "portBody",
                            refX: 6,
                            refY: 6,
                            fontSize: 10,
                        },
                        portTypeLabel: {
                            ref: "portBody",
                            refX: 95,
                            refY: 6,
                            fontSize: 10,
                        },
                    },
                    position: "erPortPosition",
                },
            },
        },
    },
    true
);

Graph.registerNode(
    "center-rect",
    {
        inherit: "rect",
        markup: [
            {
                tagName: "rect",
                selector: "body",
            },
            {
                tagName: "text",
                selector: "label",
            },
        ],
        attrs: {
            rect: {
                strokeWidth: 1,
                stroke: "#E1C04B",
                fill: "#E1C04B",
            },
            label: {
                fontWeight: "bold",
                fill: "#ffffff",
                fontSize: 12,
            },
        },
        ports: {
            groups: {
                list: {
                    markup: [
                        {
                            tagName: "rect",
                            selector: "portBody",
                        },
                        {
                            tagName: "text",
                            selector: "portNameLabel",
                        },
                        {
                            tagName: "text",
                            selector: "portTypeLabel",
                        },
                    ],
                    attrs: {
                        portBody: {
                            width: NODE_WIDTH,
                            height: LINE_HEIGHT,
                            strokeWidth: 1,
                            stroke: "#E1C04B",
                            fill: "#ffffff",
                        },
                        portNameLabel: {
                            ref: "portBody",
                            refX: 6,
                            refY: 6,
                            fontSize: 10,
                            
                        },
                        portTypeLabel: {
                            ref: "portBody",
                            refX: 95,
                            refY: 6,
                            fontSize: 10,
                        },
                    },
                    position: "erPortPosition",
                },
            },
        },
    },
    true
);

class WidgetLineageGraph extends Component
{

    constructor( props )
    {
        super(props);

        this.state = {
            divID: "_" + Widget.randomString(12) + "_div",
            center:props.center,
            options:props.options,
            data:props.data 
        }
    }

    componentWillReceiveProps( nextProps )
    {
        if( nextProps.data )
        {
            let graphData = this.buildData(nextProps.data); 

            this.setState({data:nextProps.data , graphData:graphData}, () => {
                this.drawGraph(graphData);
            })
            
        }
    }

    componentDidMount()
    {
        this.createGraph();

        if( this.props.data )
        {
            let graphData = this.buildData(this.props.data);

            this.setState({data:this.props.data, graphData:graphData}, () => {
                this.drawGraph(graphData);
            })
            
            // this.drawGraph(graphData);
        }
    }

    /**
     * 创建数据
     * @param {*} data 
     * @returns 
     */
    buildData = ( data ) => {
        
        let nodes = this.buildNodes(data.nodes);

        let edges = this.buildEdges(data.edges);

        let graphData = {
            nodes:nodes,
            edges:edges
        }
        // let graphData = [...nodes, ...edges];

        // await this.setState({graphData:graphData});

        return graphData;
    }

    /**
     * 创建节点数据
     * @param {*} nodeData 
     * @returns 
     */
    buildNodes = ( nodeData ) => {

        const {centers, options } = this.props;

        let nodes = [];

        if( nodeData && nodeData.length>0 )
        {
            for( let item of nodeData)
            {
                let node = {
                    "id":  item.id,
                    "shape": "normal-rect",
                    "label": item.name,
                    "width": NODE_WIDTH,
                    "height": 24,
                    // "position": {
                    //     "options":{
                    //       "relative":true
                    //     },
                    //     "x": 324 + index*(NODE_WIDTH + 50),
                    //     "y": 150
                    // },
                }
    
                if( options.isEdit===true )
                {
                    if( options.granularity===1)
                    {
                        node["shape"] = "er-rect";   
                    }
                    else
                    {
                        node["shape"] = "column-rect";   
                    }
                }
                
                if( centers && centers.length>0 )
                {
                    for( let center of centers )
                    {
                        if( item.id===center.id )
                        {
                            node["shape"] = "center-rect";  
                        }
                    }
                }
    
                if( item.children )
                {
                    let ports = [];
    
                    for(let child of item.children)
                    {
                        let port = {
                            "id": child.id,
                            "group": "list",
                            "attrs": {
                                "portNameLabel": {
                                    "text": child.name 
                                },
                                "portTypeLabel": {
                                    "text": child.type
                                }
                            }
                        }
                        ports.push(port)
                    }
    
                    node["ports"] = ports;
    
                }
    
                nodes.push(node);
            }
        }
        
        return nodes;
    }

    /**
     * 创建边数据
     * @param {*} edgeData 
     * @returns 
     */
    buildEdges = ( edgeData ) => {

        let edges = [];

        if( edgeData && edgeData.length>0 )
        {
            for(let item of edgeData)
            {
                let edge = {
                    "id": item.id,
                    "shape": "edge",
                    "source": {
                        "cell": item.from_cell,
                        "port": item.from_id,
                        "table":item.from_table_id
                    },
                    "target": {
                        "cell": item.to_cell,
                        "port": item.to_id,
                        "table":item.to_table_id
                    },
                    "attrs": {
                        "line": {
                            "stroke": "#A2B1C3",
                            "strokeWidth": 2
                        }
                    },
                    "zIndex": 0,
                }
    
                edges.push(edge);
            }    
        }
        
        return edges;
    }
    /**
     * 画布数据初始化
     */
    createGraph = () => {

        const { divID } = this.state;

        this.graph = new Graph({
            container: document.getElementById(divID),
            resizing: true,
            grid: {
                visible: true,
            },
           
            autoResize: true,
            scroller: {
                enabled: true,
                pageVisible: true,
                pageBreak: true,
                pannable: true,
            },
            mousewheel: {
                enabled: true,
                modifiers: ['ctrl', 'meta'],
                minScale: 0.5,
                maxScale: 2,
            },
            connecting: {

                router: {
                    name: "er",
                    args: {
                        offset: 25,
                        direction: "H",
                    },
                },

                createEdge() {

                    return new Shape.Edge({
                        attrs: {
                            line: {
                                stroke: "#A2B1C3",
                                strokeWidth: 2,
                            },
                        },
                    });
                },
               validateEdge: (graph, args) => { return this.validateEdge(graph, args)}
            },
        });
    };

    /**
     * 画图
     * @param {*} graphData 
     */
    drawGraph = ( graphData ) => {

        this.layout(graphData);

        // 监听
        this.listener();


        // if( graphData && graphData.length>0 )
        // {
        //     graphData.forEach((item) => {

        //         if( item.shape==="edge" ) 
        //         {
        //             cells.push(this.graph.createEdge(item));
        //         } 
        //         else 
        //         {
        //             cells.push(this.graph.createNode(item));
        //         }
        //     });
    
        //     this.graph.resetCells(cells);
        //     this.graph.zoomToFit({ padding: 10, maxScale: 1 });
        // }
    }

    /**
     * 布局
     */
    layout = ( graphData ) => {

        if( this.dagreLayout===undefined )
        {
            this.dagreLayout = new DagreLayout({
                type: 'dagre',
                rankdir: 'LR',
                align: 'UR',
                ranksep: 80,
                nodesep: 30,
            })
        }

        this.model = this.dagreLayout.layout(graphData)
          
        

        if( this.graph )
        {
            this.graph.fromJSON(this.model);

            this.graph.center();
        }
    }

    /**
     * 监听
     */
    listener = () =>{
        this.graph.on('edge:contextmenu', (cell, e) => {
            
            this.edgeContextmenu(cell, e);
        });


        this.graph.on('node:contextmenu', (cell, e) => {
            
            this.nodeContextmenu(cell, e);
        })

    }

    /**
     * 边右键事件
     * @param {*} cell 
     * @param {*} e 
     */
    edgeContextmenu = (cell, e) => {

        const p = this.graph.clientToGraph(cell.e.clientX, cell.e.clientY);

        const menu = (
            <Menu className="sf-lineage-graph-menu" onClick={(e) => {this.handleMenuClick(cell, e, "edge-contextmenu")}}>
                <Menu.Item key="remove-edge" >删除边</Menu.Item>
            </Menu>
        )

        cell.cell.addTools([
            {
                name:"contextmenu",
                args:{
                    menu,
                    x:p.x,
                    y:p.y,
                    onHide() {
                        cell.cell.removeTools();
                    }
                }
            }
        ])
    }

    nodeContextmenu = (cell, e) => {

        const p = this.graph.clientToGraph(cell.e.clientX, cell.e.clientY);

        const menu = (
            <Menu className="sf-lineage-graph-menu" onClick={(e) => {this.handleMenuClick(cell, e, "node-contextmenu")}}>
                <Menu.Item key="remove-node" >删除节点</Menu.Item>
            </Menu>
        )

        cell.cell.addTools([
            {
                name:"contextmenu",
                args:{
                    menu,
                    x:p.x,
                    y:p.y,
                    onHide() {
                        cell.cell.removeTools();
                    }
                }
            }
        ])
    }


    handleMenuClick = (cell, event, type) => {
    
        switch( type )
        {
            case "edge-contextmenu":
            {
                if( event.key==="remove-edge")
                {
                    this.removeEdge(cell.edge.id)
                }
                break;
            }
            case "node-contextmenu":
            {
                if( event.key==="remove-node")
                {
                    this.removeNode(cell.node.id)
                }
                break;
            }         
            default:
                break;
        }
       
    }


    /**
     * 画边校验
     * @param {*} graph 
     * @param {*} args 
     */
    validateEdge = (graph, args) => {

        const { edge }  = graph;

        const { store }  = edge;

        const { data }  = store;

        const { source, target }  = data;

        if( target.cell && source.cell )
        {
            if( this.props.notify )
            {
                return this.props.notify(graph, args, "validateEdge");
            }
            else
            {
                return true;
            }
        }
        else
        {
            return false;
        }

        
    }

    /**
     * 获取节点集合
     * @returns 
     */
    getNode = ( nodeId ) => {

        if( this.graph )
        {
            return this.graph.getNode(nodeId);
        }

        return null;
    }

    /**
     * 添加节点 
     * @param {*} item 
     * @returns 
     */
    addNode = ( item ) => {
        
        const { options } = this.props;

        let node = {
            "id":  item.id,
            "table_id":item.table_id,
            "shape": "normal-rect",
            "label": item.name,
            "width": NODE_WIDTH,
            "height": 24,
            "position": {
                "options":{
                  "relative":true
                },
                
                "x": 324,
                "y": 150
            },
        }

        if( options.isEdit===true )
        {
            if( options.granularity===1)
            {
                node["shape"] = "er-rect";   
            }
            else
            {
                node["shape"] = "column-rect";   
            }
            // node["shape"] = "er-rect";   
        }

        if( item.children )
        {
            let ports = [];

            for(let child of item.children)
            {
                let port = {
                    "id": child.id,
                    "table_id":item.table_id,
                    "group": "list",
                    "attrs": {
                        "portNameLabel": {
                            "text": child.name 
                        },
                        "portTypeLabel": {
                            "text": child.type
                        }
                    }
                }
                ports.push(port)
            }

            node["ports"] = ports;
        }   

        if( this.graph )
        {
            this.graph.addNode( this.graph.createNode(node));
        }
    }

    /**
     * 删除节点
     * @param {*} nodeId 
     */
    removeNode = ( nodeId ) => {

        if(  this.graph )
        {
            const { graphData } = this.state;

            for( let edge of graphData.edges )
            {
                if( edge.source.cell===nodeId || edge.target.cell===nodeId )
                {
                    this.removeEdge( edge.id );
                }

            }

            this.graph.removeNode(nodeId);

            if( this.props.notify )
            {
                this.props.notify(nodeId, null, "removeNode")
            }
        }
        return null;
    }

    /**
     * 添加边
     * @param {*} edge 
     */
    addEdge = ( item ) => {

        let edge = {
            "id":  item.id,
            "shape": "edge",
            "source": {
                "cell": item.from_cell,
                "port": item.from_id
            },
            "target": {
                "cell": item.to_cell,
                "port": item.to_id
            },
            "attrs": {
                "line": {
                    "stroke": "#A2B1C3",
                    "strokeWidth": 2
                }
            },
            "zIndex": 0,
        }

        if( this.graph )
        {
            this.graph.addEdge( this.graph.createEdge(edge));
        }
    }

    /**
     * 删除边
     * @param {*} edgeId 
     * @returns 
     */
    removeEdge = ( edgeId) => {

        if(  this.graph )
        {
            this.graph.removeEdge(edgeId);

            if( this.props.notify )
            {
                this.props.notify(edgeId, null, "removeEdge")
            }
        }
        return null;
    }

    /**
     * 获取节点集合
     * @returns 
     */
    getNodes = () => {

        if( this.graph )
        {
            return this.graph.getNodes();
        }

        return null;
    }

    /**
     * 获取边集合
     * @returns 
     */
    getEdges = () => {

        if( this.graph )
        {
            return this.graph.getEdges();
        }

        return null;
    }

    /**
     * 获取画布中所有节点和边
     * @returns 
     */
    getCells = () => {

        if( this.graph )
        {
            return this.graph.getCells();
        }

        return null;
    }

    /**
     * 导出点和边
     * @param {*} options 
     * @returns 
     */
    toJSON = ( options ) => {

        if( this.graph )
        {
            return this.graph.toJSON( options );
        }

        return null;
    }
    
    /**
     * 获取关系数据
     * @returns 
     */
    getData = () => {

        const { data } = this.state;

        return data;
    }


    render()
    {
        const {divID} = this.state;

        return (
            <div className="sf-lineage-graph sd-lineage-graph sg-lineage-graph">
                <div id={divID} className="sf-graph x6-graph" />
            </div>
        )
    }
}

export default WidgetLineageGraph