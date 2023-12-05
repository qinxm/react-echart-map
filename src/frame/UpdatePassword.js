import React, { Component } from "react";
import {Form, Input, Button, Row, Col} from 'antd';
import md5 from "js-md5";
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';

import Cache from "./Cache";
import Config from "../config/Config";
import WidgetAjax from "../widget/WidgetAjax";
import WidgetMessage from "../widget/WidgetMessage";

React.Component.prototype.$md5 = md5;

class UpdatePassword extends Component 
{

    constructor( props )
    {
        super(props);

        let userInfo = sessionStorage.getItem("_user_info_"), isLogin = false;

        if( userInfo )
        {
            isLogin = true;

            userInfo = JSON.parse(userInfo)
        }

        let initialValue = {
            username: props.username ? props.username : userInfo.username
        }

        this.state = {
            basePath:Config.getBasePath(),
            userInfo:userInfo,
            isLogin:isLogin,
            username: props.username ? props.username : userInfo.username,
            initialValue:initialValue
        }
    }

    onFinish = () => {

        if(this.props.modalType === 'detail') 
        {
            return this.onCancel()
        }
        
        const { basePath, username,  isLogin, userInfo, oldPassword, newPassword, confirmPassword} = this.state;

        let oldPasswordEncryption = this.$md5("ES_6ps" + oldPassword + "_N3tM").toUpperCase();
        let newPasswordEncryption = this.$md5("ES_6ps" + newPassword + "_N3tM").toUpperCase();
        let confirmPasswordEncryption = this.$md5("ES_6ps" + confirmPassword + "_N3tM").toUpperCase();

        let params = {};

        if( isLogin )
        {
            params = {
                UID: userInfo.UID,
                old_password: oldPasswordEncryption,
                new_password: newPasswordEncryption
            }
        }
        else
        {
            params = {
                username: username,
                old_password: oldPasswordEncryption,
                new_password: newPasswordEncryption
            }
        }

        const onUpdatePassword = (result, params ) => {

            if( result.status===0 )
            {

                WidgetMessage.success( "密码修改成功，请重新登录");
                Cache.logout();

                if( isLogin )
                {
                    Cache.logout();
                }

                if( this.props.notify )
                {
                    this.props.notify("confirm");
                }
            }
            else 
            {
                WidgetMessage.error( result.message);
            }

        }

        WidgetAjax.ajax({
            url: basePath + "/update_password",
            params:params,
            callback:onUpdatePassword
        }, this.props);
    }

    onCancel = () => {

        if( this.props.notify )
        {
            this.props.notify("cancel") 
        }
    }
        

    render()
    {
        const { isLogin, initialValue } = this.state;
        const {modalType = 'password'} = this.props

        return (
            <div>
                <Form ref={ref=>this.form=ref} labelCol={{ span: 7 }}  wrapperCol={{ span: 15 }} initialValues={initialValue}>
                    <div className="sf-page-Bottom-padding0" style={{display: modalType === 'password' ? '' : 'none'}}>
                        {
                            isLogin===false ? 
                            <Form.Item  label="账号" name="username"
                                rules={[{ required: true, message: '请输入账号' }]}
                            >
                                <Input placeholder="请输入账号" onChange={(e)=>this.setState({username:e.target.value})}/>
                            </Form.Item> 
                            :<></>
                        }
                       
                        <Form.Item  label="旧密码" name="oldPassword"
                            rules={[{ required: true, message: '请输入旧密码' }]}
                        >
                            <Input.Password placeholder="请输入旧密码" iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} onChange={(e)=>this.setState({oldPassword:e.target.value})}/>
                        </Form.Item>

                        <Form.Item  label="新密码" name="newPassword" tooltip="密码中必须包含字母、数字、特称字符，至少6个字符，最多20个字符!" rules={[
                            { required: true,  message: '请输入新密码!',  },
                            () => ({
                                validator(_, value) {
                                var regex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,20}');
                                if (!regex.test(value) ) {
                                    return Promise.reject(new Error('密码中必须包含字母、数字、特称字符，至少6个字符，最多20个字符!'));
                                }else{
                                    return Promise.resolve();
                                }
                                },
                            }) ]} hasFeedback
                        >
                            <Input.Password placeholder="请输入新密码"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} 
                                onChange={(e)=>this.setState({newPassword:e.target.value})}
                            />
                        </Form.Item>
                        <Form.Item  label="再次输入新密码" name="confirmPassword" dependencies={['newPassword']} hasFeedback
                            rules={[
                                { required: true,  message: '请再次输入新密码!',  },
                                ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次输入的密码不一致!'));
                                },
                                }),
                            ]}>
                            <Input.Password placeholder="请再次输入新密码"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} 
                                onChange={(e)=>this.setState({confirmPassword:e.target.value})}
                            />
                        </Form.Item>
                    </div>
                    <Form.Item noStyle>
                        <div className="sf-page-tool-right sf-modalBotton-top">
                            <Row>
                                <Col span={24} style={{ textAlign: 'right' }}>
                                <Button
                                    style={{ margin: '0 8px' }}
                                    onClick={() => {this.onCancel()}}
                                >
                                    取消
                                </Button>
                                <Button type="primary" htmlType="submit" onClick={this.onFinish}>
                                    确定
                                </Button>
                                </Col>
                            </Row>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        )
        
    }

}

export default UpdatePassword