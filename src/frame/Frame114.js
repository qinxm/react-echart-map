import React,{Component} from 'react';

import Header from './Header';
import Left from './Left';
import Body from './Body';

import Config from '../config/Config';
import Cache from './Cache'

import WidgetAjax from '../widget/WidgetAjax'

import './../css/common.css';
import './../css/base.css';
import './../css/frame.css';
import './../css/project.css';

class Frame extends Component 
{
    constructor(props)
    {
        super(props);

        this.state = {
            basePath:Config.getBasePath(),
            titleNodes:[
                {name:"workBench", title:"工作台"},
                {name:"catalogue", title:"数据编目"},      
                {name:"dataIntegration", title:"数据集成"},
                {name:"model", title:"数据建模"},
                {name:"quality", title:"数据治理"},
                {name:"theme", title:"数据融合"},  
                {name:"shared", title:"共享交换"},  
                {name:"dataSecurity",title:"数据安全"} ,

                // {name:"standard", title:"数据标准", path:"/home/standard"},
                // {name:"indicator", title:"数据指标", path:"/home/indicator"},
                // {name:"tag",title:"标签管理",path:"/home/tag"} ,  
                // {name:"dataGovern",title:"数据治理",path:"/home/dataQuality"} ,  
                // {name:"theme", title:"数据融合", path:"/home/theme"},   
                // {name:'shared',title:'共享交换',path:'/home/shared'},
                // {name:"dataSecurity",title:"数据安全",path:"/home/department"} ,
                // {name:"metadata",title:"元数据管理",path:"/home/gather"}  
            ],
            leftNode : [
                // {name:"workBench", title:"工作台", path:"/home/workBench"}
                {name: 'workBench', title: '工作台', path: '/home/workBench'},
                {name: 'mySql', title: '数据开发', path: '/home/mySql'},
                {name: 'search', title: '数据查询', path: '/home/search'},
                {name: 'serve', title: '数据服务', path: '/home/serve'},
                {name: 'ops', title: '数据运维', path: '/home/ops'}
            ],
            privileges : [ 
                
                // 工作台
                {name: 'workBench', title: '工作台', path: '/home/workBench'},
                {name: 'mySql', title: '数据开发', path: '/home/mySql'},
                {name: 'search', title: '数据查询', path: '/home/search'},
                {name: 'serve', title: '数据服务', path: '/home/serve'},
                {name: 'ops', title: '数据运维', path: '/home/ops'},

                // <FrameRoute path={pathBase+'/category'} component={Category}/>
                // <FrameRoute path={pathBase+'/resource'} component={Resource}/>
                // <FrameRoute path={pathBase+'/addResource'} component={addResource}/>
                // <FrameRoute path={pathBase+'/authorizedAudit'} component={authorizedAudit}/>
                // <FrameRoute path={pathBase+'/authorizedAuditInfo'} component={authorizedAuditInfo}/> 
                // <FrameRoute path={pathBase+'/applyAudit'} component={applyAudit}/>
                // <FrameRoute path={pathBase+'/applyAuditInfo'} component={applyAuditInfo}/>
                // <FrameRoute path={pathBase+'/categoryShare'} component={categoryShare}/>
                // <FrameRoute path={pathBase+'/addShare'} component={addShare}/>
                // <FrameRoute path={pathBase+'/categoryConfig'} component={categoryConfig}/>


                // 数据编目
                {name:"category",title:"信息类目管理",path:"/home/category"},
                {name:"resource",title:"信息资源编制",path:"/home/resource"},
                {name:"authorizedAudit",title:"资源编制审核",path:"/home/authorizedAudit"},
                {name:"applyAudit",title:"资源申请审核",path:"/home/applyAudit"},
                {name:"categoryShare",title:"信息类目共享",path:"/home/categoryShare"},

                // 数据集成-数据采集
                {name:"filling", title:"数据填报管理",path:"/home/filling"},
                {name:"audit", title:"填报审核管理",path:"/home/audit"},
                {name:"task", title:"采集任务管理",path:"/home/task"},
                {name:"project", title:"采集表单管理",path:"/home/project"},
                {name:"analysis", title:"采集情况统计",path:"/home/analysis"},

                // 数据集成-数据归集
                { name: "DataSourceManagement", title: "数据源管理", path:"/home/link/34", link: "http://218.26.73.114:18121/datafiber/home/DataSourceManagement" },
                { name: "DataRelatioManage",title: "数据关系管理", path:"/home/link/35", link: "http://218.26.73.114:18121/datafiber/home/DataRelatioManage"},
                { name: "SourceRelation", path:"/home/link/36", link: "http://218.26.73.114:18121/datafiber/home/SourceRelation"},
                { name: "ExpressionManagement", title: "表达式管理", path:"/home/link/37", link: "http://218.26.73.114:18121/datafiber/home/ExpressionManagement"},
                { name: "ProjectManagement", title: "项目管理", path:"/home/link/38", link: "http://218.26.73.114:18121/datafiber/home/ProjectManagement"},
                { name: "TaskTab",  path:"/home/link/39", link: "http://218.26.73.114:18121/datafiber/home/TaskTab"},
                { name: "StepPage", path:"/home/link/40",  link: "http://218.26.73.114:18121/datafiber/home/StepPage"},
                { name: "ProjectOperationManagement", title: "项目运行管理", path:"/home/link/41",  link: "http://218.26.73.114:18121/datafiber/home/ProjectOperationManagement"},
                { name: "ProjectDetail",  path:"/home/link/42", link: "http://218.26.73.114:18121/datafiber/home/ProjectDetail" },
                { name: "ProjectNotify", title: "项目通知配置",  path:"/home/link/43", link: "http://218.26.73.114:18121/datafiber/home/ProjectNotify"},
                { name: "SceneManagement", title: "场景管理", path:"/home/link/44", link: "http://218.26.73.114:18121/datafiber/home/SceneManagement"},
                { name: "SceneModule", path:"/home/link/45", link: "http://218.26.73.114:18121/datafiber/home/SceneModule" },
                { name: "ConnectionFunManagement", title: "功能管理", path:"/home/link/46", link: "http://218.26.73.114:18121/datafiber/home/ConnectionFunManagement"},
                { name: "FunOperation", path:"/home/link/47", link: "http://218.26.73.114:18121/datafiber/home/FunOperation"},
                {name: "OperationProcess", path:"/home/link/48", link: "http://218.26.73.114:18121/datafiber/home/OperationProcess"},
                { name: "CustomOperationMoanagement", title: "自定义操作管理", path:"/home/link/49", link: "http://218.26.73.114:18121/datafiber/home/CustomOperationMoanagement"},
                {name:"summarize", title:"归集情况概括",path:"/home/summarize"},
                {name:"monitoring", title:"归集任务监控",path:"/home/monitoring"},


                // 数据建模
                {name:"domain", title:"数据域",path:"/home/link/1", link:"http://218.26.73.114:18121/thalassa/home/domain"},
                {name:"element", title:"数据元",path:"/home/link/2", link:"http://218.26.73.114:18121/thalassa/home/element"},
                {name:"code", title:"代码集",path:"/home/link/3",  link:"http://218.26.73.114:18121/thalassa/home/code"},
                {name:"thalassaaudit", title:"标准审核",path:"/home/link/4",  link:"http://218.26.73.114:18121/thalassa/home/audit"},
                {name:"Terminology", title:"术语定义",path:"/home/link/5",  link:"http://218.26.73.114:18121/thalassa/home/Terminology"},
                {name:"standards", title:"标准规范",path:"/home/link/6",  link:"http://218.26.73.114:18121/thalassa/home/standards"},

                {name:"entity", title:"信息实体",path:"/home/link/7", link:"http://218.26.73.114:18121/coeus-indicator/home/entity"},
                {name:"dimension", title:"维度管理",path:"/home/link/8", link:"http://218.26.73.114:18121/coeus-indicator/home/dimension"},
                {name:"indicatorAudit", title:"维度审核",path:"/home/link/9", link:"http://218.26.73.114:18121/coeus-indicator/home/vdoingAudit"},
                {name:"entityMount", title:"实体挂接",path:"/home/link/10", link:"http://218.26.73.114:18121/coeus-indicator/home/entityMount"},
                {name:"dimenMount", title:"维度挂接",path:"/home/link/11", link:"http://218.26.73.114:18121/coeus-indicator/home/dimenMount"},

                {name:"base", title:"核心指标",path:"/home/link/12", link:"http://218.26.73.114:18121/coeus-indicator/home/base"},
                {name:"derive", title:"派生指标",path:"/home/link/13", link:"http://218.26.73.114:18121/coeus-indicator/home/derive"},
                {name:"extend", title:"业务指标",path:"/home/link/14", link:"http://218.26.73.114:18121/coeus-indicator/home/extend"},
                {name:"indexAudit", title:"指标审核",path:"/home/link/15", link:"http://218.26.73.114:18121/coeus-indicator/home/indexAudit"},
                {name:"baseMount", title:"核心指标挂接", path:"/home/link/50", link:"http://218.26.73.114:18121/coeus-indicator/home/baseMount"},
                {name:"deriveMount", title:"派生指标挂接", path:"/home/link/51", link:"http://218.26.73.114:18121/coeus-indicator/home/deriveMount"},
                {name:"extendMount", title:"业务指标挂接", path:"/home/link/52", link:"http://218.26.73.114:18121/coeus-indicator/home/extendMount"},
                {name:"labelContent", title:"指标内容",path:"/home/link/16", link:"http://218.26.73.114:18121/coeus-indicator/home/labelContent"},

                {name:"labelSystem", title:"数据标签",path:"/home/link/17", link:"http://218.26.73.114:18121/coeus-tag/home/labelSystem"},
                {name:"labelAudit", title:"标签审核",path:"/home/link/18", link:"http://218.26.73.114:18121/coeus-tag/home/labelAudit"},
                {name:"tagMount", title:"标签挂接", path:"/home/link/53", link:"http://218.26.73.114:18121/coeus-tag/home/tagMount"},
                {name:"tagContent", title:"标签内容",path:"/home/link/19", link:"http://218.26.73.114:18121/coeus-tag/home/tagContent"},

                // 数据治理
                { name:"metaCollection", title: "元数据采集", path: "/home/link/20", link:"http://218.26.73.114:18121/thalassa/home/metaCollection" },
                { name:"dataSourceManagement", title: "数据源管理", path: "/home/link/21", link:"http://218.26.73.114:18121/thalassa/home/dataSourceManagement" },
                { name:"metaPublish", title: "元数据发布", path: "/home/link/22", link:"http://218.26.73.114:18121/thalassa/home/metaPublish" },
                { name:"metaAudit", title: "元数据审核", path: "/home/link/23", link:"http://218.26.73.114:18121/thalassa/home/metaAudit" },
                { name:"metaAnalysis", title: "元数据分析", path: "/home/link/24", link:"http://218.26.73.114:18121/thalassa/home/metaAnalysis" },

                { name: "kinshipAnalysis", title: "数据血缘分析", path:"/home/link/32", link: "http://218.26.73.114:18121/thalassa/home/kinshipAnalysis" },
                { name: "lineagePierce", title: "血缘穿透分析",  path:"/home/link/33", link: "http://218.26.73.114:18121/thalassa/home/lineagePierce" },
                { name: "lineageModel", title: "数据血缘建模",  path:"/home/link/34", link: "http://218.26.73.114:18121/thalassa/home/lineageModel" },

                {name:"dataQuality",title:"数据质量检测",path:"/home/dataQuality"},
                {name:"ruleConfig",title:"模板规则配置",path:"/home/ruleConfig"},
                {name:"executeTask",title:"任务执行管理",path:"/home/executeTask"},
                {name:"dataAnalyse",title:"数据质量分析",path:"/home/dataAnalyse"},

                // 数据融合
                {name:"special",title:"专题库构建",path:"/home/link/25", link:"http://218.26.73.114:18121/coeus-indicator/home/theme"},
                {name:"resources",title:"资源挂接",path:"/home/link/26", link:"http://218.26.73.114:18121/coeus-indicator/home/resources"},
                {name:"log",title:"专题库更新日志",path:"/home/link/27", link:"http://218.26.73.114:18121/coeus-indicator/home/log"},

                // 数据共享
                {name:"exchange", title:"共享交换管理", path:"/home/link/28", link:"http://218.26.73.114:18121/coeus-indicator/home/exchange"},
                {name:"operation", title:"接口运行维护", path:"/home/link/29", link:"http://218.26.73.114:18121/coeus-indicator/home/operation"},    
                {name:"sharedmonitoring", title:"数据共享监控", path:"/home/link/30", link:"http://218.26.73.114:18121/coeus-indicator/home/monitoring"},    
                {name:"statistics", title:"共享情况分析", path:"/home/link/31", link:"http://218.26.73.114:18121/coeus-indicator/home/statistics"},  

                // 数据安全
                {name:"department",title:"部门管理", path:"/home/department"},
                {name:"user",title:"用户管理", path:"/home/user"},
                {name:"group",title:"用户组管理", path:"/home/group"},
                {name:"role",title:"角色管理", path:"/home/role"},
                {name:"basicProperties",title:"系统参数设置", path:"/home/basicProperties"},
                {name:"securityProperties",title:"系统安全设置", path:"/home/securityProperties"},
                {name:"component",title:"组件管理", path:"/home/component"},
                {name:"discern",title:'敏感数据识别',path:"/home/discern"},
                {name:"configuration",title:"识别规则配置",path:'/home/configurations'},
                {name:"classify",title:'数据分类管理',path:"/home/classify"},
                {name:"grading",title:'数据分级管理',path:"/home/grading"},
                {name:"rule",title:'脱敏规则',path:"/home/rule"},
                {name:"algorithm",title:'脱敏算法',path:'/home/algorithm'},
                {name:"secretKey",title:"密钥管理",path:"/home/secretKey"},
                {name:'EncryptionAndDecryption',title:'加解密算法',path:'/home/encryption'},
                {name:"logSystem",title:"访问日志",path:'/home/logSystem'},

            ],
            leftNodes:{
                workBench: [
                    {name: 'workBench', title: '工作台', path: '/home/workBench'},
                    {name: 'mySql', title: '数据开发', path: '/home/mySql'},
                    {name: 'search', title: '数据查询', path: '/home/search'},
                    {name: 'serve', title: '数据服务', path: '/home/serve'},
                    {name: 'ops', title: '数据运维', path: '/home/ops'}
                ],
                catalogue:[
                    {name:"category",title:"信息类目管理",path:"/home/category"},
                    {name:"resource",title:"信息资源编制",path:"/home/resource"},
                    {name:"authorizedAudit",title:"资源编制审核",path:"/home/authorizedAudit"},
                    {name:"applyAudit",title:"资源申请审核",path:"/home/applyAudit"},
                    {name:"categoryShare",title:"信息类目共享",path:"/home/categoryShare"}
                ],
                dataIntegration: [ 
                    {
                        name:"dataFilling", title:"数据采集",
                        subcomponents:[
                            {name:"filling", title:"数据填报管理",path:"/home/filling"},
                            {name:"audit", title:"填报审核管理",path:"/home/audit"},
                            {name:"task", title:"采集任务管理",path:"/home/task"},
                            {name:"project", title:"采集表单管理",path:"/home/project"},
                            {name:"analysis", title:"采集情况统计",path:"/home/analysis"},
                        ]
                    },
                    {
                        name: "dataConnectionScenario",
                        title: "资源管理",
                        properties: { icon: "resource" },
                        subcomponents: [
                          { name: "DataSourceManagement", title: "数据源管理", path:"/home/link/34",  link: "http://218.26.73.114:18121/datafiber/home/DataSourceManagement" },
                          { name: "DataRelatioManage",title: "数据关系管理", path:"/home/link/35", link: "http://218.26.73.114:18121/datafiber/home/DataRelatioManage",
                            child: [ {name: "SourceRelation", path:"/home/link/36", link: "http://218.26.73.114:18121/datafiber/home/SourceRelation"} ]},
                          { name: "ExpressionManagement", title: "表达式管理", path:"/home/link/37", link: "http://218.26.73.114:18121/datafiber/home/ExpressionManagement"},
                        ],
                    },
                    {
                        name: "dataAdministration",
                        title: "连接任务管理",
                        properties: { icon: "task" },
                        subcomponents: [
                          { name: "ProjectManagement", title: "项目管理", path:"/home/link/38", link: "http://218.26.73.114:18121/datafiber/home/ProjectManagement",
                            child: [{ name: "TaskTab",  path:"/home/link/39", link: "http://218.26.73.114:18121/datafiber/home/TaskTab", 
                                subChild: [{ name: "StepPage", path:"/home/link/40",  link: "http://218.26.73.114:18121/datafiber/home/StepPage"} ]} ],
                          },
                          { name: "ProjectOperationManagement", title: "项目运行管理", path:"/home/link/41",  link: "http://218.26.73.114:18121/datafiber/home/ProjectOperationManagement",
                            child: [{ name: "ProjectDetail",  path:"/home/link/42", link: "http://218.26.73.114:18121/datafiber/home/ProjectDetail" } ],
                          },
                          { name: "ProjectNotify", title: "项目通知配置",  path:"/home/link/43", link: "http://218.26.73.114:18121/datafiber/home/ProjectNotify"},
                        ],
                      },
                      {
                        name: "templateManagement",
                        title: "连接模板管理",
                        properties: { icon: "connection" },
                        subcomponents: [
                          { name: "SceneManagement", title: "场景管理", path:"/home/link/44", link: "http://218.26.73.114:18121/datafiber/home/SceneManagement",
                            child: [{ name: "SceneModule", path:"/home/link/45", link: "http://218.26.73.114:18121/datafiber/home/SceneModule" }],
                          },
                          { name: "ConnectionFunManagement", title: "功能管理", path:"/home/link/46", link: "http://218.26.73.114:18121/datafiber/home/ConnectionFunManagement",
                            child: [
                              { name: "FunOperation", path:"/home/link/47", link: "http://218.26.73.114:18121/datafiber/home/FunOperation", 
                                subChild: [{name: "OperationProcess", path:"/home/link/48", link: "http://218.26.73.114:18121/datafiber/home/OperationProcess"}] },
                            ],
                          },
                          { name: "CustomOperationMoanagement", title: "自定义操作管理", path:"/home/link/49", link: "http://218.26.73.114:18121/datafiber/home/CustomOperationMoanagement"},
                        ]
                    },
                    {
                        name:"collectionStatistics", title:"归集情况统计",
                        subcomponents:[
                            {name:"summarize", title:"归集情况概括",path:"/home/summarize"},
                            {name:"monitoring", title:"归集任务监控",path:"/home/monitoring"},
                          
                        ] 
                    }
                ],
                // 数据建模
                model:[
                    {
                        name:"warehouse", title:"数仓规划",
                        subcomponents: [
                            {name:"domain", title:"数据域",path:"/home/link/1", link:"http://218.26.73.114:18121/thalassa/home/domain"},
                        ]
                    },
                    {
                        name:"standard", title:"数据标准",
                        subcomponents: [
                            {name:"element", title:"数据元",path:"/home/link/2", link:"http://218.26.73.114:18121/thalassa/home/element"},
                            {name:"code", title:"代码集",path:"/home/link/3",  link:"http://218.26.73.114:18121/thalassa/home/code"},
                            {name:"thalassaaudit", title:"标准审核",path:"/home/link/4",  link:"http://218.26.73.114:18121/thalassa/home/audit"},
                            {name:"Terminology", title:"术语定义",path:"/home/link/5",  link:"http://218.26.73.114:18121/thalassa/home/Terminology"},
                            {name:"standards", title:"标准规范",path:"/home/link/6",  link:"http://218.26.73.114:18121/thalassa/home/standards"},
                        ]
                    },
                    {
                        name:"vdoing", title:"数据维度",
                        subcomponents:[
                            {name:"entity", title:"信息实体",path:"/home/link/7", link:"http://218.26.73.114:18121/coeus-indicator/home/entity"},
                            {name:"dimension", title:"维度管理",path:"/home/link/8", link:"http://218.26.73.114:18121/coeus-indicator/home/dimension"},
                            {name:"indicatorAudit", title:"维度审核",path:"/home/link/9", link:"http://218.26.73.114:18121/coeus-indicator/home/vdoingAudit"},
                            {name:"entityMount", title:"实体挂接",path:"/home/link/10", link:"http://218.26.73.114:18121/coeus-indicator/home/entityMount"},
                            {name:"dimenMount", title:"维度挂接",path:"/home/link/11", link:"http://218.26.73.114:18121/coeus-indicator/home/dimenMount"},
                        ]
                    },
                    {
                        name:"indicator", title:"数据指标",
                        subcomponents:[
                            {name:"base", title:"核心指标",path:"/home/link/12", link:"http://218.26.73.114:18121/coeus-indicator/home/base"},
                            {name:"derive", title:"派生指标",path:"/home/link/13", link:"http://218.26.73.114:18121/coeus-indicator/home/derive"},
                            {name:"extend", title:"业务指标",path:"/home/link/14", link:"http://218.26.73.114:18121/coeus-indicator/home/extend"},
                            {name:"indexAudit", title:"指标审核",path:"/home/link/15", link:"http://218.26.73.114:18121/coeus-indicator/home/indexAudit"},
                            {name:"baseMount", title:"核心指标挂接", path:"/home/link/50", link:"http://218.26.73.114:18121/coeus-indicator/home/baseMount"},
                            {name:"deriveMount", title:"派生指标挂接", path:"/home/link/51", link:"http://218.26.73.114:18121/coeus-indicator/home/deriveMount"},
                            {name:"extendMount", title:"业务指标挂接", path:"/home/link/52", link:"http://218.26.73.114:18121/coeus-indicator/home/extendMount"},
                            {name:"labelContent", title:"指标内容",path:"/home/link/16", link:"http://218.26.73.114:18121/coeus-indicator/home/labelContent"},
                        ]
                    },
                    {
                        name:"tag", title:"标签管理",
                        subcomponents:[
                            {name:"labelSystem", title:"数据标签",path:"/home/link/17", link:"http://218.26.73.114:18121/coeus-tag/home/labelSystem"},
                            {name:"labelAudit", title:"标签审核",path:"/home/link/18", link:"http://218.26.73.114:18121/coeus-tag/home/labelAudit"},
                            {name:"tagMount", title:"标签挂接", path:"/home/link/53", link:"http://218.26.73.114:18121/coeus-tag/home/tagMount"},
                            {name:"tagContent", title:"标签内容",path:"/home/link/19", link:"http://218.26.73.114:18121/coeus-tag/home/tagContent"},
                        ]
                    },
                ],
                quality: [
                    {
                        name: "metadata", title: "元数据管理",
                        subcomponents: [
                            { name:"metaCollection", title: "元数据采集", path: "/home/link/20", link:"http://218.26.73.114:18121/thalassa/home/metaCollection" },
                            { name:"dataSourceManagement", title: "数据源管理", path: "/home/link/21", link:"http://218.26.73.114:18121/thalassa/home/dataSourceManagement" },
                            { name:"metaPublish", title: "元数据发布", path: "/home/link/22", link:"http://218.26.73.114:18121/thalassa/home/metaPublish" },
                            { name:"metaAudit", title: "元数据审核", path: "/home/link/23", link:"http://218.26.73.114:18121/thalassa/home/metaAudit" },
                            { name:"metaAnalysis", title: "元数据分析", path: "/home/link/24", link:"http://218.26.73.114:18121/thalassa/home/metaAnalysis" }                        
                        ]
                    },
                    {
                        name: "kinship",
                        title: "数据血缘管理",
                        subcomponents: [
                          { name: "kinshipAnalysis", title: "数据血缘分析", path:"/home/link/32", link: "http://218.26.73.114:18121/thalassa/home/kinshipAnalysis" },
                          { name: "lineagePierce", title: "血缘穿透分析",  path:"/home/link/33", link: "http://218.26.73.114:18121/thalassa/home/lineagePierce" },
                          { name: "lineageModel", title: "数据血缘建模",  path:"/home/link/34", link: "http://218.26.73.114:18121/thalassa/home/lineageModel" }
                        ],
                    },
                    {
                        name:"Quality",title:"数据质量管理",
                        subcomponents:[
                            {name:"dataQuality",title:"数据质量检测",path:"/home/dataQuality"},
                            {name:"ruleConfig",title:"模板规则配置",path:"/home/ruleConfig"},
                            {name:"executeTask",title:"任务执行管理",path:"/home/executeTask"},
                            {name:"dataAnalyse",title:"数据质量分析",path:"/home/dataAnalyse"}
                            // {name:"ruleTest",title:"规则测试",path:"/home/ruleTest"},
                            
                        ]
                    },
                ],
                theme:[
                    {name:"special",title:"专题库构建",path:"/home/link/25", link:"http://218.26.73.114:18121/coeus-indicator/home/theme"},
                    {name:"resources",title:"资源挂载",path:"/home/link/26", link:"http://218.26.73.114:18121/coeus-indicator/home/resources"},
                    {name:"log",title:"专题库更新日志",path:"/home/link/27", link:"http://218.26.73.114:18121/coeus-indicator/home/log"}
                    // {name:"GeneralSituation",title:"专题库更新日志",path:"/home/link/27", link:"http://218.26.73.114:18121/coeus-indicator/home/theme"},
                ],
                shared:[
                    {name:"exchange", title:"共享交换管理", path:"/home/link/28", link:"http://218.26.73.114:18121/coeus-indicator/home/exchange"},
                    {name:"operation", title:"接口运行维护", path:"/home/link/29", link:"http://218.26.73.114:18121/coeus-indicator/home/operation"},    
                    {name:"sharedmonitoring", title:"数据共享监控", path:"/home/link/30", link:"http://218.26.73.114:18121/coeus-indicator/home/monitoring"},    
                    {name:"statistics", title:"共享情况分析", path:"/home/link/31", link:"http://218.26.73.114:18121/coeus-indicator/home/statistics"},  
                ],
                dataSecurity:[
                    {
                        name:"system",title:"多租户管理",
                        subcomponents:[
                            {name:"department",title:"部门管理", path:"/home/department"},
                            {name:"user",title:"用户管理", path:"/home/user"},
                            {name:"group",title:"用户组管理", path:"/home/group"},
                            {name:"role",title:"角色管理", path:"/home/role"},
                            {name:"basicProperties",title:"系统参数设置", path:"/home/basicProperties"},
                            {name:"securityProperties",title:"系统安全设置", path:"/home/securityProperties"},
                            {name:"component",title:"组件管理", path:"/home/component"}
                        ]
                    },
                    {
                        name:"datadiscern",title:"数据识别管理",
                        subcomponents:[
                        {name:"discern",title:'敏感数据识别',path:"/home/discern"},
                        {name:"configuration",title:"识别规则配置",path:'/home/configurations'}

                        ]
                    },
                    {
                        name:'datalevel',title:"数据分类分级",
                        subcomponents:[
                            {name:"classify",title:'数据分类管理',path:"/home/classify"},
                            {name:"grading",title:'数据分级管理',path:"/home/grading"},

                        ]
                    },
                    {
                        name:"sensitive",title:"数据脱敏管理",
                        subcomponents:[
                            {name:"rule",title:'脱敏规则',path:"/home/rule"},
                            {name:"algorithm",title:'脱敏算法',path:'/home/algorithm'} 
                        ]
                    },
                    {
                        
                        name:"encryption",title:"数据加密管理",
                        subcomponents:[
                            {name:"secretKey",title:"密钥管理",path:"/home/secretKey"},
                            {name:'EncryptionAndDecryption',title:'加解密算法',path:'/home/encryption'}
                        ]
                    },
                    {
                        name:"behavior",title:"访问行为审计",
                        subcomponents:[
                            {name:"logSystem",title:"访问日志",path:'/home/logSystem'},
                        ]
                    }
                ]
            },
            
            nodes : undefined,
            systemTitle : "行业数据仓综合治理平台",
            titleActiveKey : "",
            leftActiveKey : '',
            menuPaths:[],
		};

        this.leftOnSelect = this.leftOnSelect.bind(this);
        this.headerOnSelect = this.headerOnSelect.bind(this);
        this.freshPage = this.freshPage.bind(this);
        this.redrict = this.redrict.bind(this);
        this.findNode = this.findNode.bind(this);   
        
        this.myRef = this;
    }

    componentDidMount ()
    {
    }

    /**
     * 头部菜单选择后回调函数
     * @param {*} key 
     */
    headerOnSelect( key ) 
    {
        if(!key) return;
        key = typeof key == 'string' ? key : key.key
        let { titleNodes } = this.state;

        let menuPaths = [];

        let leftNode = this.state.leftNodes[key];

        menuPaths.push(key);

        this.setState({leftNode, titleActiveKey: key, menuPaths:menuPaths});

        for(let item of titleNodes )
        {
            if( item.name===key )
            {
                let state = {
                    node : item,
                    item : item,
                    children:leftNode
                };

                if( item.path=== undefined|| item.path==="" ) 
                {
                    item.path = "/home"
                }

                this.redrict(item.path, state, false);
            }
        }
    }

    leftOnSelect(key, path, keyPaths)
    {
     
        let { menuPaths, titleNodes, privileges} = this.state;

        let showHeaderArea = Config.isShowHeaderArea();
        
        if( showHeaderArea!==true || titleNodes===undefined || titleNodes===null || titleNodes.length===0 )
        {
            menuPaths = [];
        }

        menuPaths.push(...keyPaths);

        this.setState({leftActiveKey: key, menuPaths:menuPaths});

        let node = this.findNodeByName(key, privileges);

        this.props.children.props.history.push({pathname:path,state:{pathData:key, node:node}});
    }

    freshPage()
    {
        window.location.reload() ; //刷新页面
    }

    redrict( path, state, isFresh)
    {
        this.props.children.props.history.push({ pathname:path, state:state });
        
        if( isFresh!==undefined && isFresh!==false )
        {
            this.freshPage();
        }
    }

    findNode( nodeProps )
    {
        const { titleNodes, leftNodes, privileges } = this.state;

        let { titleActiveKey, leftActiveKey } = this.state;

        let path = "", node, item;
       
        if( nodeProps!==undefined && nodeProps.match!==undefined )
        {
            path = nodeProps.match.url;
        }

        if( nodeProps!==undefined && nodeProps.location!==undefined && nodeProps.location.state!==undefined )
        {
            item = nodeProps.location.state.node;
        }

        if( path!==undefined && path!==null && path!=="" )
        {
            node = this.findNodeByNodes(privileges, path, item, true);

            if( node!==undefined && node!==null )
            {
                let frameNode = this.findNodeByNodes(titleNodes, path, node, false);

                if( frameNode!==undefined && frameNode!==null )
                {
                    let leftNode = leftNodes[frameNode.name];

                    return {node:frameNode, leftNode:leftNode, titleActiveKey: frameNode.name }
                }
                
                for( let key in leftNodes )
                {
                    frameNode = this.findNodeByNodes(leftNodes[key], path, node, true);

                    if( frameNode!==undefined && frameNode!==null )
                    {
                        titleActiveKey = key;
                        break;
                    }
                }

                if( frameNode!==undefined && frameNode!==null )
                {
                    let leftNode = leftNodes[titleActiveKey];

                    this.state["leftNode"] = leftNode;
                    this.state["titleActiveKey"] = titleActiveKey;
                    this.state["leftActiveKey"] = frameNode.name;
                }
                else
                {
                    this.state["titleActiveKey"] = undefined;
                    this.state["leftActiveKey"] = node.name;
                }
            }
            else
            {
                if(!item) return;

                let leftNode = this.state.leftNodes[item.name]
                this.state["leftNode"] = leftNode;
                this.state["titleActiveKey"] = item.name;
            }
        }
        
    }

    /**
     * 通过path查找节点
     * @param {*} nodes 
     * @param {*} path 
     * @param {*} item 当前节点 
     * @param {*} isRecurse 是否需要递归查找
     * @returns 
     */
    findNodeByNodes(nodes, path, item, isRecurse)
    {
        let node = null;

        if( nodes!==undefined && nodes.length>0 )
        {
            for(let i=0; i<nodes.length; i++)
            {
                if( item!==undefined && item!==null && item!=="" )
                {
                    if( nodes[i].name!==undefined && item!==undefined && item!==null && nodes[i].name===item.name )
                    {
                        node = nodes[i];
                    }
                    else if( nodes[i].subcomponents!==undefined && isRecurse===true )
                    {
                        node = this.findNodeByNodes(nodes[i].subcomponents, path, item, true);
                    }
                }
                else
                {
                    if( nodes[i].path!==undefined && (nodes[i].path===path || ( "/" + nodes[i].path )===path || ( "/" + nodes[i].path + "/" )===path ||  ( nodes[i].path + "/" )===path) )
                    {
                        node = nodes[i];
                    }
                    else if( nodes[i].subcomponents!==undefined && isRecurse===true )
                    {
                        node = this.findNodeByNodes(nodes[i].subcomponents, path, item, true);
                    }
                }

                if( node!==null )
                {
                    break;
                }
            }

            return node;
        }
    }

    findNodeByName = ( name, nodes ) => {

        for( let item of nodes )
        {
            if( item.name===name )
            {
                return item;
            }

            if( item.subcomponents )
            {
                return this.findNodeByName(name, item.subcomponents);
            }
        }
    }

    render() 
	{    
        const { titleNodes, systemTitle, menuPaths } = this.state;

        this.findNode(this.props.children.props);

        let { leftNode, titleActiveKey, disposalData, leftActiveKey} = this.state;

        const { model } = this.props;

        if( model==="home" )
        {
            let state = {children:leftNode};

            if( this.props.children.props.location!==undefined && this.props.children.props.location.state!==undefined)
            {
                state = {...this.props.children.props.location.state, ...state};
            }

            this.props.children.props.history.push({pathname:this.props.children.props.match.path, state:state});
        }

        const childrenBody = React.Children.map(this.props.children, child =>
            React.cloneElement(child, { reload: this.reload })
        );

        switch( model )
        {
            case "page":
            {
                return (
                    <div className="sf-page">
                        <Body>{childrenBody}</Body>
                    </div> 
                );
            }
            case "table":
            {
                return (
                    <div className="sf-table-page">
                        <Header headerOnSelect={this.headerOnSelect} titleNode={titleNodes} leftNode= {leftNode} 
                            menuPaths={menuPaths} location={this.props.children.props.location}
                            systemTitle={systemTitle} activeKey={titleActiveKey} freshPage={this.freshPage} redrict={this.redrict}  />
                        <Left leftNode={leftNode} disposalData={disposalData} leftActiveKey={leftActiveKey} redrict={this.redrict} leftOnSelect={this.leftOnSelect} history={this.props.children.props.history} location={this.props.children.props.location}/>
                        <Body>{childrenBody}</Body>
                    </div> 
                );
            }
            case "home" :
            {
                return (
                    <div className="sf-page">
                        <Body>{childrenBody}</Body>
                    </div> 
                );
            }
            case 'screen':
            {
                return (
                    <div className="sf-normal sf-screen">
                        <Header headerOnSelect={this.headerOnSelect} titleNode={titleNodes} leftNode= {leftNode} menuPaths={menuPaths} location={this.props.children.props.location}
                            systemTitle={systemTitle} activeKey={titleActiveKey} freshPage={this.freshPage} redrict={this.redrict} />
                        <Body>{childrenBody}</Body>
                    </div> 
                );
            }
            case 'link':
            {
                return (
                    <div className="sf-normal sf-link">
                        <Header headerOnSelect={this.headerOnSelect} titleNode={titleNodes} leftNode= {leftNode} menuPaths={menuPaths} location={this.props.children.props.location}
                            systemTitle={systemTitle} activeKey={titleActiveKey} freshPage={this.freshPage} redrict={this.redrict} />
                        <Body>{childrenBody}</Body>
                    </div> 
                );
            }
            default :
            {
                return (
                    <div className="sf-normal">
                        <Header headerOnSelect={this.headerOnSelect} titleNode={titleNodes} leftNode= {leftNode} menuPaths={menuPaths} location={this.props.children.props.location}
                            systemTitle={systemTitle} activeKey={titleActiveKey} freshPage={this.freshPage} redrict={this.redrict} />
                        <Left leftNode={leftNode} disposalData={disposalData} leftActiveKey={leftActiveKey} redrict={this.redrict} leftOnSelect={this.leftOnSelect} history={this.props.children.props.history} location={this.props.children.props.location}/>
                        <Body>{childrenBody}</Body>
                    </div> 
                );
            }
        }
    }
} 

export default Frame