import React from 'react';
import cookie from 'react-cookies'

import './../css/common.css';
import './../css/frame.css';

class Title extends React.Component 
{

    constructor( props )
	{
		super(props);

        this.state = {
            title : props.title
        }

		this.loadDistrict = this.loadDistrict.bind(this);
	}

    loadDistrict()
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
            
            return defaultDistrict;
		}

        return null;
    }

    render() 
	{
        let { title }  = this.state;
        
        return <div className='sf-system-title sd-system-title sg-system-title'>
                <span>{title}</span>
            </div> 
    }
}

export default Title