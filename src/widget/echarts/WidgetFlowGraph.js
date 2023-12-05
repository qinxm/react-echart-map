// 流向图 流程图

import React, { Component } from "react";
import { FlowAnalysisGraph } from '@ant-design/graphs';

class WidgetFlowGraph extends Component{
    constructor(props) {
        super(props);
        this.state = {
            onEvents: {
                'click': this.onClick.bind(this)
            }
        }
    }

    onClick = (param) => {
        console.log(param)
    }

    formatStroke = (data) => {
        return data.leval === 1 ? '#31C64D' : data.leval === 2 ? '#3674FA' : '#FF8B02'
    }

    buildConfig = (data, isVertical) => {
        const config = {
            data,
            layout: {
                rankdir: isVertical ? 'TB' : 'LR',
                center: [0, 0],
                ranksepFunc: () => 30,
                nodesepFunc: isVertical ? () => 0 : () => 15,
                tooltipCfg: {
                    show: true
                },
                ToolbarCfg:{
                    show: true
                },
            },
            nodeCfg: {
                anchorPoints: isVertical && [
                  [0.5, 0],
                  [0.5, 1],
                ],
                nodeStateStyles: {
                
                },
                
                style: (cfg) => {
                    return {
                        stroke: this.formatStroke(cfg),
                    }
                },
                badge: {
                    style: () => {
                        return {
                            fill: null,
                        }
                    }
                },
                customContent: (item,group,cfg) => {
                    const { startX, startY, width } = cfg;
                    const { text, value, icon, iconType, leval } = item;
                    text && group.addShape('text', {
                        attrs: {
                            textBaseline: 'top',
                            x: startX,
                            y: startY,
                            text,
                            fill: this.formatStroke(item),
                        },
                    });
                    value && group.addShape('text', {
                        attrs: {
                            textBaseline: 'top',
                            x: startX,
                            y: startY + 18,
                            text: `(${value})`,
                            fill: this.formatStroke(item),
                        },
                    });

                    iconType && group.addShape('image', {
                        attrs: {
                            textBaseline: 'top',
                            x: startX + 12,
                            img: require(`../../img/frame/icon${iconType}.svg`),
                        },
                        name: `image-${Math.random()}`,
                    });
                },
                
            },
            edgeCfg: {
                type: 'polyline',
                endArrow: true,
                edgeStateStyles: {

                }
            },
            // customLayout: {
                
            //     tooltipCfg: {
            //         show: true,
            //         customContent: (item) => {
            //             console.log(item, 1)
            //             return <p>{item.title}</p>
            //         }
            //     },
            //     ToolbarCfg:{
            //         show: true,
            //         customContent: (item) => {
            //             console.log(item, 1)
            //             return <p>{item.title}</p>
            //         }
                    
            //     },
            //     // customContent: (item, group, cfg) => {
            //     //     console.log(item, group, cfg, 1)
            //     //     return <p>{item.title}</p>
            //     // }
                
            // },

            markerCfg: (cfg) => {
                return {
                    position: isVertical ? 'bottom' : 'right',
                    show: data.edges && data.edges.filter((item) => item.source === cfg.id)?.length,
                    style: {
                        stroke: this.formatStroke(cfg)
                    }
                };
            },
            behaviors: ['drag-canvas', 'drag-node'],
        };
        return config;
    };

    render() {
        const {onEvents} = this.state;
        const {data, isVertical} = this.props || {};
        const Config = this.buildConfig(data, isVertical);

        return <div className="swd-flow-graph">
            <FlowAnalysisGraph {...Config}  onEvents={onEvents} />
        </div>
    }
}

export default WidgetFlowGraph;