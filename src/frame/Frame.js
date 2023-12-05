import React,{Component} from 'react';

import Header from './Header';
import Left from './Left';
import Body from './Body';

import Cache from './Cache'
import Config from '../config/Config';
import FrameUtils from "./FrameUtils";
import WidgetAjax from '../widget/WidgetAjax'
import WidgetMessage from '../widget/WidgetMessage'

import './../css/common.css';
import './../css/base.css';
import './../css/frame.css';
import './../css/project.css';
import FrameBreadcrumb from './FrameBreadcrumb';

const basePath = Config.getBasePath();

class Frame extends Component 
{
    constructor(props)
    {
        super(props);

        this.state = {
            basePath:Config.getBasePath(),
            titleNodes:[
                { name: "home", title: "首页" },
            ],
            leftNode : [
                {
                    name: "system",
                    title: "系统设置",
                    subcomponents: [
                        { name: "department", title: "部门管理", path: "/home/department",
                            subcomponents:[
                                { name: "departmentUser", title: "部门用户管理", path: "/home/departmentUser", type:"POPUP"}
                            ]
                        },
                        { name: "user", title: "用户管理", path: "/home/user" },
                        { name: "group", title: "用户组管理", path: "/home/group",
                            subcomponents:[
                                { name: "groupUser", title: "用户组用户管理", path: "/home/groupUser", type:"POPUP"},
                                { name: "groupDomain", title: "用户组权限", path: "/home/groupDomain", type:"POPUP"}
                            ] 
                        },
                        { name: "role", title: "角色管理", path: "/home/role", 
                            subcomponents:[
                                { name: "roleUser", title: "角色用户管理", path: "/home/roleUser", type:"POPUP"},
                                { name: "rolePrivilege", title: "角色权限", path: "/home/rolePrivilege", type:"POPUP"}
                            ] 
                        },
                        { name: "component", title: "组件管理", path: "/home/component",
                            subcomponents:[
                                { name: "componentMethod", title: "组件接口对应关系", path: "/home/componentMethod", type:"POPUP"},
                            ] 
                        },
                        { name: "basicProperties", title: "系统参数设置", path: "/home/basicProperties" },
                        { name: "securityProperties", title: "系统安全设置", path: "/home/securityProperties" },
                        { name: "logSystem", title: "访问日志", path: "/home/logSystem" },
                    ],
                },
            ],
            privileges : [ 
                { name: "department", title: "部门管理", path: "/home/department"},
                { name: "departmentUser", title: "部门用户管理", path: "/home/departmentUser", type:"POPUP"},
                { name: "user", title: "用户管理", path: "/home/user" },
                { name: "group", title: "用户组管理", path: "/home/group"},
                { name: "groupUser", title: "用户组用户管理", path: "/home/groupUser", type:"POPUP"},
                { name: "groupDomain", title: "用户组权限", path: "/home/groupDomain", type:"POPUP"},
                { name: "role", title: "角色管理", path: "/home/role"},
                { name: "roleUser", title: "角色用户管理", path: "/home/roleUser", type:"POPUP"},
                { name: "rolePrivilege", title: "角色权限", path: "/home/rolePrivilege", type:"POPUP"},
                { name: "component", title: "组件管理", path: "/home/component" },
                { name: "componentMethod", title: "组件接口对应关系", path: "/home/componentMethod", type:"POPUP"},
                { name: "basicProperties", title: "系统参数设置", path: "/home/basicProperties" },
                { name: "securityProperties", title: "系统安全设置", path: "/home/securityProperties" },
                { name: "logSystem", title: "访问日志", path: "/home/logSystem" }
        
            ],
            leftNodes:{
               home:[
                    { name: "department", title: "部门管理", path: "/home/department",
                        subcomponents:[
                            { name: "departmentUser", title: "部门用户管理", path: "/home/departmentUser", type:"POPUP"}
                        ]
                    },
                    { name: "user", title: "用户管理", path: "/home/user" },
                    { name: "group", title: "用户组管理", path: "/home/group",
                        subcomponents:[
                            { name: "groupUser", title: "用户组用户管理", path: "/home/groupUser", type:"POPUP"},
                            { name: "groupDomain", title: "用户组权限", path: "/home/groupDomain", type:"POPUP"}
                        ] 
                    },
                    { name: "role", title: "角色管理", path: "/home/role", 
                        subcomponents:[
                            { name: "roleUser", title: "角色用户管理", path: "/home/roleUser", type:"POPUP"},
                            { name: "rolePrivilege", title: "角色权限", path: "/home/rolePrivilege", type:"POPUP"}
                        ] 
                    },
                    { name: "component", title: "组件管理", path: "/home/component",
                        subcomponents:[
                            { name: "componentMethod", title: "组件接口对应关系", path: "/home/componentMethod", type:"POPUP"},
                        ] 
                    },
                    { name: "basicProperties", title: "系统参数设置", path: "/home/basicProperties" },
                    { name: "securityProperties", title: "系统安全设置", path: "/home/securityProperties" },
                    { name: "logSystem", title: "访问日志", path: "/home/logSystem" },
               ]
            },
            
            nodes : undefined,
            systemTitle : "精准招商大屏",
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

    componentDidMount() 
    {   
        this.findNode(this.props.children.props);

        // this.loadComponent();
    }

    componentWillReceiveProps( nextProps )
    {
        this.findNode(nextProps.children.props);
    }


     /**
     * 请求用户有权限的组件
     */
    loadComponent()
    {
        WidgetAjax.ajax({url : basePath + '/component', params : undefined, callback : this.onLoadComponent});
    }
    /**
         * 请求
         * @param {*} result 
         * @param {*} params 
         */
    onLoadComponent = (result, params) => {
        if( result.status===0 )
        {
            if( result.result!==undefined && result.result.frame!==undefined )
            {
                this.state["nodes"] = result.result.frame;
               
            }
            
            if( result.result!==undefined && result.result.privileges!==undefined )
            {
                this.state["privileges"] = result.result.privileges;
            }

            this.buildNodes( this.state.nodes );
        }
        else
        {
            sessionStorage.removeItem("_user_access_");
            sessionStorage.removeItem("_user_info_");
            sessionStorage.removeItem("_user_login_info_");
            WidgetMessage.error(result.message);
            this.redrict("/login", undefined, true);
        }
    }

    buildPrivilegesMap = (privileges) => {
        
        let privilegesMap = {};

        for(let privilege of privileges)
        {
            privilegesMap[privilege.name] = privilege;
        }

        return privilegesMap;
    }

    /**
     * 创建菜单节点
     * @param {*} nodes 
     * @returns 
     */
    /**
     * 创建菜单节点
     * @param {*} nodes 
     * @returns 
     */
    buildNodes( nodes )
    {
        let titleNodes = [], leftNodes = {}, titleActiveKey, leftNode = [];

        if( nodes!==undefined && nodes.length>0 )
        {
            for( let i=0; i<nodes.length; i++ )
            {
                if( nodes[i].type==="PAGE" || nodes[i].type==="LINK" || nodes[i].type===undefined )
                {
                    let titleNode = {...nodes[i]};
                    delete titleNode["subcomponents"];
                    titleNodes.push(titleNode);

                    if( leftNodes[nodes[i].name] ===undefined )
                    {
                        leftNodes[nodes[i].name] = [];
                    }
                    
                    if( nodes[i].subcomponents!==undefined )
                    {
                        // nodes[i].subcomponents.forEach(da=>{
                        //   da.icon = <img alt="#" src={require(`../img/frame/${da.name}.png`)} style={{width:'16px',height:'auto'}}/>
                        // })
                        leftNodes[nodes[i].name].push(...nodes[i].subcomponents);
                    }

                    if( i===0 )
                    {
                        titleActiveKey = nodes[i].name;
                    }
                }
            }
        }

        if( leftNodes[titleActiveKey]!==undefined )
        {
            leftNode.push( ...leftNodes[titleActiveKey] );
        }

        this.setState({titleNodes:titleNodes, leftNodes:leftNodes, titleActiveKey:titleActiveKey, leftNode:leftNode}, () => {

            if( this.props.children.props.location.pathname )
            {
                this.findNode(this.props.children.props);
            }
        });
    }

    /**
     * 头部菜单选择后回调函数
     * @param {*} key 
     */
    headerOnSelect(key) 
    {
        if (!key) return;
        key = typeof key == "string" ? key : key.key;
        let { titleNodes } = this.state;
    
        let menuPaths = [];
    
        let leftNode = this.state.leftNodes[key];
    
        menuPaths.push(key);
    
        this.setState({ leftNode:leftNode, titleActiveKey: key, menuPaths: menuPaths });
    
        for (let item of titleNodes) 
        {
            if (item.name === key) 
            {
                let state = {
                    node: item,
                    item: item,
                    children: leftNode,
                };

                if( item.path )
                {
                    this.redrict(item.path, state, false);
                }
                else
                {
                    this.redrict("/home", state, false);
                }
            }
        }
      }

    /**
     * 左侧菜单选择
     * @param {*} key 
     * @param {*} path 
     * @param {*} keyPaths 
     * @param {*} openKey 
     */
    leftOnSelect(key, path, keyPaths) {
        
        let { menuPaths, titleActiveKey } = this.state;

        menuPaths = [];

        menuPaths.push(titleActiveKey);
    
        menuPaths.push(...keyPaths);
    
        this.setState({ leftActiveKey: key, menuPaths: menuPaths });
    
        this.props.children.props.history.push({ pathname: path, state: { pathData: key } });
      }

    /**
     *  强制刷新页面
     */
    freshPage()
    {
        window.location.reload() ; //刷新页面
    }

    /**
     * 跳转页面
     * @param {*} path 
     * @param {*} state 
     * @param {*} isFresh 
     */
    redrict( path, state, isFresh)
    {
        this.props.children.props.history.push({ pathname:path, state:state });
        
        if( isFresh!==undefined && isFresh!==false )
        {
            this.freshPage();
        }
    }

    /**
     * 查询节点
     * @param {*} nodeProps 
     * @returns 
     */
    findNode(nodeProps) 
    {
        const { titleNodes, leftNodes, privileges } = this.state;
    
        let { titleActiveKey } = this.state, menuPaths = [];
    
        let path = "", node, item;
    
        if (nodeProps !== undefined && nodeProps.match !== undefined) 
        {
            path = nodeProps.match.path;
        }
    
        if (
          nodeProps !== undefined &&
          nodeProps.location !== undefined &&
          nodeProps.location.state !== undefined
        ) 
        {
            item = nodeProps.location.state.node;
        }
    
        if (path !== undefined && path !== null && path !== "") 
        {
            node = this.findNodeByNodes(privileges, path, item, true);
        
            if (node !== undefined && node !== null) 
            {
                    let frameNode = this.findNodeByNodes(titleNodes, path, node, false);
            
                    if (frameNode !== undefined && frameNode !== null) 
                    {
                        let leftNode = leftNodes[frameNode.name];
                
                        this.buildMenuPaths(frameNode, menuPaths);

                        this.setState({
                            leftNode:leftNode,
                            titleActiveKey:frameNode.name,
                            leftActiveKey:frameNode.name,
                            menuPaths:menuPaths
                        })

                        // this.state["leftNode"] = leftNode;
                        // this.state["titleActiveKey"] = frameNode.name;
                        // this.state["leftActiveKey"] = frameNode.name;
                
                        return { node: frameNode, leftNode: leftNode, titleActiveKey: frameNode.name };
                    }
            
                    for (let key in leftNodes) 
                    {
                        frameNode = this.findNodeByNodes(leftNodes[key], path, node, true);
                
                        if (frameNode !== undefined && frameNode !== null) 
                        {
                            titleActiveKey = key;
                            break;
                        }
                    }
        
                    if( frameNode !== undefined && frameNode !== null ) 
                    {
                        let leftNode = leftNodes[titleActiveKey];

                        menuPaths.push(titleActiveKey);
                        
                        this.buildMenuPaths(frameNode, menuPaths);

                        this.setState({
                            leftNode:leftNode,
                            titleActiveKey:titleActiveKey,
                            leftActiveKey:frameNode.name,
                            menuPaths:menuPaths
                        })


                    } 
                    else 
                    {
                        this.buildMenuPaths(node, menuPaths);

                        this.setState({
                            titleActiveKey:undefined,
                            leftActiveKey:node.name,
                            menuPaths:menuPaths
                        })
                    }
            } 
            else 
            {
                if (!item) return;
                let leftNode = this.state.leftNodes[item.name];

                menuPaths.push(item.name);
                        
                this.setState({
                    leftNode:leftNode,
                    titleActiveKey:item.name,
                    menuPaths:menuPaths
                })
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
    
        if( nodes !== undefined && nodes.length > 0 ) 
        {
            for (let i = 0; i < nodes.length; i++) 
            {
                if (item !== undefined && item !== null && item !== "") 
                {
                    if (
                        nodes[i].name !== undefined &&
                        item !== undefined &&
                        item !== null &&
                        nodes[i].name === item.name
                    ) 
                    {
                        node = nodes[i];
                    } 
                    else if (nodes[i].subcomponents !== undefined && isRecurse === true) 
                    {
                        node = this.findNodeByNodes(nodes[i].subcomponents, path, item, true);
                    }
                } 
                else 
                {
                    if (
                        nodes[i].path !== undefined &&
                        (nodes[i].path === path ||
                        "/" + nodes[i].path === path ||
                        "/" + nodes[i].path + "/" === path ||
                        nodes[i].path + "/" === path)
                    ) 
                    {
                        node = nodes[i];
                    } 
                    else if (nodes[i].subcomponents !== undefined && isRecurse === true) 
                    {
                        node = this.findNodeByNodes(nodes[i].subcomponents, path, item, true);
                    }
                }
        
                if( node !== null ) 
                {
                    node = {...node};

                    if( node.name!==nodes[i].name  )
                    {
                        node.parent = {...nodes[i]};
                    }
                   
                    break;
                }
          }
    
          return node;
        }
      }

    /**
     * 通过 name 查询节点
     * @param {*} name 
     * @param {*} nodes 
     * @returns 
     */
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

    /**
     * 创建菜单路径
     * @param {*} node 
     * @param {*} menuPaths 
     */
    buildMenuPaths = ( node, menuPaths=[] ) => {

        if( node.parent )
        {
            this.buildMenuPaths(node.parent, menuPaths);
        }

        menuPaths.push(node.name);
    }

    render() 
	{    
        const { titleNodes, systemTitle, menuPaths, leftNode, titleActiveKey, disposalData, leftActiveKey, openKey  } = this.state;

        const { model } = this.props;

        if( model==="home" ) 
        {
            let state = { children: leftNode };

            if( this.props.children.props.location!==undefined && this.props.children.props.location.state!==undefined ) 
            {
                state = { ...this.props.children.props.location.state, ...state };
            }

            if( state.children && state.children.length>0 )
            {
                this.props.children.props.history.push({pathname: this.props.children.props.match.path, state: state});
            }
            
        }
        // let bre = <FrameBreadcrumb titleNodes={titleNodes} leftNodes={leftNode} menuPaths={menuPaths} frameLocation={this.props.children.props.location}></FrameBreadcrumb>
       
        // let breCrumb = [React.cloneElement(bre, { reload: this.reload }) ]

        const childrenBody = React.Children.map(this.props.children, (child) => React.cloneElement(child, { reload: this.reload }) );

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
                            history={this.props.children.props.history}
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
                            systemTitle={systemTitle} activeKey={titleActiveKey} freshPage={this.freshPage} redrict={this.redrict}   history={this.props.children.props.history}/>
                        <Body>{childrenBody}</Body>
                    </div> 
                );
            }
            case 'link':
            {
                return (
                    <div className="sf-normal sf-link">
                        <Header headerOnSelect={this.headerOnSelect} titleNode={titleNodes} leftNode= {leftNode} menuPaths={menuPaths} location={this.props.children.props.location}
                            systemTitle={systemTitle} activeKey={titleActiveKey} freshPage={this.freshPage} redrict={this.redrict}  history={this.props.children.props.history}/>
                        <Body>{childrenBody}</Body>
                    </div> 
                );
            }
            case "left-tree":
            {
                return (
                    <div className="sf-normal sf-left-tree">
                        <Header
                            headerOnSelect={this.headerOnSelect}
                            titleNode={titleNodes}
                            leftNode={leftNode}
                            menuPaths={menuPaths}
                            location={this.props.children.props.location}
                            systemTitle={systemTitle}
                            activeKey={titleActiveKey}
                            freshPage={this.freshPage}
                            redrict={this.redrict}
                            history={this.props.children.props.history}
                        />
                        <Left
                            leftNode={leftNode}
                            disposalData={disposalData}
                            leftActiveKey={leftActiveKey}
                            openKey = {openKey}
                            redrict={this.redrict}
                            leftOnSelect={this.leftOnSelect}
                            history={this.props.children.props.history}
                            location={this.props.children.props.location}
                        />
                        <Body 
                            titleNodes={titleNodes} 
                            leftNode={leftNode} 
                            menuPaths={menuPaths}
                            isBreadcrumb = {true}
                            location={this.props.children.props.location}
                        >   
                                {childrenBody}
                        </Body>
                    </div>
                );
            }
            case "no-breadcrumb":
            {
                return (
                    <div className="sf-normal">
                        <Header
                            headerOnSelect={this.headerOnSelect}
                            titleNode={titleNodes}
                            isBreadcrumb = {true}
                            leftNode={leftNode}
                            menuPaths={menuPaths}
                            location={this.props.children.props.location}
                            systemTitle={systemTitle}
                            activeKey={titleActiveKey}
                            freshPage={this.freshPage}
                            redrict={this.redrict}
                            history = {this.props.children.props.history}
                        />
                        <Left
                            leftNode={leftNode}
                            disposalData={disposalData}
                            leftActiveKey={leftActiveKey}
                            openKey = {openKey}
                            redrict={this.redrict}
                            leftOnSelect={this.leftOnSelect}
                            history={this.props.children.props.history}
                            location={this.props.children.props.location}
                        />
                        <Body>
                            {childrenBody}
                        </Body>
                    </div> 
                );
            }
            default :
            {
                return (
                    <div className="sf-normal">
                        <Header
                            headerOnSelect={this.headerOnSelect}
                            titleNode={titleNodes}
                            isBreadcrumb = {true}
                            leftNode={leftNode}
                            menuPaths={menuPaths}
                            location={this.props.children.props.location}
                            systemTitle={systemTitle}
                            activeKey={titleActiveKey}
                            freshPage={this.freshPage}
                            redrict={this.redrict}
                            history = {this.props.children.props.history}
                        />
                        <Left
                            leftNode={leftNode}
                            disposalData={disposalData}
                            leftActiveKey={leftActiveKey}
                            openKey = {openKey}
                            redrict={this.redrict}
                            leftOnSelect={this.leftOnSelect}
                            history={this.props.children.props.history}
                            location={this.props.children.props.location}
                        />
                        <Body  
                            titleNodes={titleNodes} 
                            leftNode={leftNode} 
                            menuPaths={menuPaths}
                            isBreadcrumb = {true}
                            location={this.props.children.props.location}
                        >
                            {childrenBody}
                        </Body>
                    </div> 
                );
            }
        }
    }
} 

export default Frame