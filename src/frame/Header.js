// Header.js
import React from 'react';
import { NavLink } from "react-router-dom";

import Title from './Title';
import HeaderMenu from './HeaderMenu';
import HeaderArea from './HeaderArea';
import FrameBreadcrumb from './FrameBreadcrumb';

import Config from '../config/Config';
import WidgetAjax from '../widget/WidgetAjax';

import 'antd/dist/antd.css';
import WidgetModal from '../widget/WidgetModal';
import UpdatePassword from './UpdatePassword';

class Header extends React.Component 
{
	constructor( props )
	{
		super(props);
		this.refTest = React.createRef();
		this.state = {
			realname:undefined,
			location : undefined,
			modification:false,
			modalOptions:{
				modalType:'form',
				title:"修改密码",
				bodyStyle:{
					padding:0
				}
			},
		}
		this.freshPage = this.freshPage.bind(this);

		this.headerMenuOnSelect = this.headerMenuOnSelect.bind(this);

		this.logout = this.logout.bind(this);
		this.onLogout = this.onLogout.bind(this);
		this.userInfo = this.userInfo.bind(this);
	}

	componentDidMount() 
	{
		this.userInfo();
		document.addEventListener('mousedown', (e)=>this.handleClickOutside(e), false);
	}
	componentWillUnmount() {
        document.removeEventListener('mousedown', (e)=>this.handleClickOutside(e), false);
    }

	handleClickOutside = (e) => {
        const target = e.target;
        if(this.refTest.current){
        // 组件已挂载且事件触发对象不在div内
            let result=(this.refTest.current).contains(target);
            if( !result ) {
                this.setState({
                    modification:false
                });
            } else{
				this.setState({
                    modification:true
                });
			} 
        }
    }

	modification = () => {
		let { modification } = this.state;

		if(modification)
		{
			this.setState({modification:false,new_password:"",old_password:"",});
		}
		else
		{
			this.setState({modification:true,new_password:"",old_password:"",});
		}
	}

	onUser = (type) => {
		this.setState({modification:false});
		switch( type )
		{
			case "details" :
			{
				
				this.setState({modalType: 'detail'})
				this.modalRef.open();
				break;
			}
			case "password" :
			{
				this.setState({modalType: 'password'})
				this.modalRef.open();
				break;
			}
		}
	}
	
	userInfo()
	{

		let location, realname;

		let data = window.sessionStorage.getItem("_user_info_");

		let res = JSON.parse(data);

		if( res!==null && res!==undefined )
		{
			realname = res.realname;
		}

		let userLoginInfo =  window.sessionStorage.getItem("_user_login_info_");

		userLoginInfo = JSON.parse(userLoginInfo);

		if( userLoginInfo!==null && userLoginInfo.user_properties!==undefined && userLoginInfo.user_properties.default_district!==undefined )
		{
			location = userLoginInfo.user_properties.default_district.name;
		}

		this.setState({realname:realname, username: res && res.username || '', location:location, userInfo: res})
	}

	headerMenuOnSelect( key )
	{
		if( this.props.headerOnSelect!==undefined )
		{
			this.props.headerOnSelect(key);
		}
	}

	freshPage()
	{
		if( this.props.freshPage!==undefined )
		{
			this.props.freshPage();
		}
	}

	logout()
	{
		WidgetAjax.ajax({url : Config.getBasePath()+'/logout', params : undefined, callback : this.onLogout});
	}

	onLogout(result, params )
	{
		if( result.status===0 )
		{
			sessionStorage.removeItem("_user_access_");
            sessionStorage.removeItem("_user_info_");
            sessionStorage.removeItem("_user_login_info_");
            
			if( this.props.redrict!==undefined )
			{
				this.props.redrict("/login", undefined, true);
			}
		}
	}

	notify = (type) => {
		this.modalRef.onClose();
	}

	navigate = () => {
		
		if( this.props.history )
		{
			this.props.history.push({ pathname: "/home/navigatePage", state: { isLogin: true } });
		}
		
	}

	render() 
	{
		const { activeKey, leftNode, titleNode, menuPaths, location : frameLocation} = this.props;

		const { realname, location, modification,modalOptions,username,modalType} = this.state;

		let showHeaderArea = Config.isShowHeaderArea();

		if( this.props.titleNode!==undefined && this.props.titleNode.length!==0 )
		{
			return (
				<div className='sf-top sd-top sg-top'>
					{/* <FrameBreadcrumb titleNodes={titleNode} leftNodes={leftNode} menuPaths={menuPaths} frameLocation={frameLocation}></FrameBreadcrumb> */}
					{/* <Title title={this.props.systemTitle} /> */}
					<div className='sf-logo sd-logo click' onClick={ () => { this.navigate()}}>
						<img src={require('../img/logo.svg')} alt="" />
						<span className="sf-system-title sd-system-title sg-system-title">{this.props.systemTitle}</span>
					</div>
					<HeaderMenu onSelect={this.headerMenuOnSelect} titleNode={this.props.titleNode} activeKey={activeKey}/>
					<div className="sf-title-right sd-title-right sg-title-right">
						<div className="sf-logout">
							<Location location={location}/>

							<img className="headimg" src={require('../img/frame/user.svg')} alt="es-lint want to get"></img>
							
							<span className="sf-user-name sd-user-name sg-user-name cursor-pointer" onClick={()=>this.modification()}>{ realname }</span>
							<span className="sf-vertical-line sd-vertical-line sg-vertical-line" >｜</span>

							<div className='sf-modification' style={modification?{display:"flex"}:{display:"none"}} ref={this.refTest}>
								{/* <div onClick={()=>this.onUser("details")}>账号详情</div> */}
								<div onClick={()=>this.onUser("password")}>修改密码</div>
							</div>
							
							<div className="sf-logout-button" style={ {paddingRight: '0px'}} onClick={this.logout}>
								<img className="headimg click" src={require("../img/frame/logout.svg")} alt="es-lint want to get" />
							</div>
						</div>
					</div>

					<WidgetModal onRef={(ref)=>this.modalRef = ref} options={{...modalOptions, title: modalType === 'detail' ? '账号详情' : '修改密码'}} >
						<div className="sf-padding sf-update-password">
							<UpdatePassword username={username} modalType={modalType} notify={this.notify} history={this.props.history}></UpdatePassword>
						</div>
					</WidgetModal>
				</div>
			);
		}
		else
		{
			return(
				<div className='sf-top'>
					{/* <Title title={this.props.systemTitle} /> */}

					{/* <FrameBreadcrumb titleNodes={titleNode} leftNodes={leftNode} menuPaths={menuPaths}></FrameBreadcrumb> */}

					<div className="sf-title-right sd-title-right sg-title-right">
						<div className="sf-logout"> 
						
							<Location location={location}/>

							<img className="headimg " src={require('../img/frame/user.svg')} alt="es-lint want to get"></img>
							
							<span className="sf-user-name sd-user-name sg-user-name cursor-pointer" onClick={()=>this.modification()}>{ realname }</span>
							<span className="sf-vertical-line sd-vertical-line sg-vertical-line" >|</span>

							<div className='sf-modification' style={modification?{display:"flex"}:{display:"none"}} ref={this.refTest}>
								{/* <div onClick={()=>this.onUser("details")}>账号详情</div> */}
								<div onClick={()=>this.onUser("password")}>修改密码</div>
							</div>
							
							<div className="sf-logout-button" onClick={this.logout}>
								<img className="headimg click" src={require("../img/frame/logout.svg")} alt="es-lint want to get" />
							</div>

						</div>
					</div>

					<WidgetModal onRef={(ref)=>this.modalRef = ref} options={{...modalOptions, title: modalType === 'detail' ? '账号详情' : '修改密码'}} >
						<div className="sf-padding sf-update-password">
							<UpdatePassword username={username} modalType={modalType} notify={this.notify} history={this.props.history}></UpdatePassword>
						</div>
					</WidgetModal>
				</div>
			)
		}
		
	}
}

export default Header

export const Location = ({ location}) => 
{
	if( location!==undefined )
	{
		return (
			<div style={{float: 'left'}}>
				<img className="headimg" src={require('../img/frame/location.svg')} alt="es-lint want to get"></img>
				<span style={{padding:'10px',fontSize:'14px'}}>{ location }</span>
				<span style={{paddingRight:'10px',color:'#999',fontWeight:'bold'}}>|</span>
			</div>
		)
	}
	else
	{
		return "";
	}
}