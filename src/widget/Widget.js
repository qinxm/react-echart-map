import React from 'react';
import moment from 'moment';

import 'moment/locale/zh-cn';

class Widget extends React.Component 
{
    constructor()
	{
		super();

		this.formatNumber = this.formatNumber.bind(this);

		this.formatTime = this.formatTime.bind(this);
		this.randomString = this.randomString.bind(this);
        this.numberFormatter = this.numberFormatter.bind(this);
        this.numberIsInteger = this.numberIsInteger.bind(this);
		
		this.parseDate = this.parseDate.bind(this);
		this.computeDate = this.computeDate.bind(this);
		this.dateFormatter = this.dateFormatter.bind(this);

		this.findDimension = this.findDimension.bind(this);

		this.addSessionStorage = this.addSessionStorage.bind(this);
		this.getSessionStorage = this.getSessionStorage.bind(this);	
    }
    
    static formatNumber( n )
    {
        n = n.toString()

        return n[1] ? n : '0' + n
    }
      // 时间格式化
	static formatTime( date ) 
    {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()
       
        return [year, month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
    }

	/**
	 * 获取小数位数
	 */
	static getValueBit( precision )
	{
		var valueBit = 0;
		if( precision<1 )
		{
			let s = precision.toString();
			valueBit = s.substr(s.indexOf(".")+1).length;
		}
		return valueBit;
	}

	/**
	 * 数字格式化
	 * @param {*} number 
	 * @param {*} decimals 
	 * @param {*} decPoint 
	 * @param {*} thousandsSep 
	 * @returns 
	 */
    static numberFormatter(number, decimals, decPoint, thousandsSep)
	{
		if( number === undefined || (number === "" && number !== 0) || number === null )
		{
			return "--";
		}
		/*else if( this.numberIsInteger(number) )
		{
			return number;
		}*/
		else
		{
	    	var lang = {
	    		decimalPoint: '.',
	    		thousandsSep: ','
	    	}, n = number, c = isNaN(decimals = Math.abs(decimals)) ? 2
	    			: decimals, d = decPoint === undefined ? lang.decimalPoint
	    			: decPoint, t = thousandsSep === undefined ? lang.thousandsSep
	    			: thousandsSep, s = n < 0 ? "-" : "", i = String(parseInt(n = Math.abs(+n || 0).toFixed(c))), j = i.length > 3 ? i.length % 3 : 0;
	    	return s + (j ? i.substring(0, j) + t : "") + i.substring(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
		}
	};

    static numberIsInteger(number)
	{
		if( Math.floor(number)===number )
		{
			return true;
		}
		 
		return false;
	}

	static randomString(len)
	{
		len = len || 32;
		
		var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    
		var maxLen = $chars.length;

		var str = '';

		for(let i = 0; i < len; i++) 
		{
			str += $chars.charAt(Math.floor(Math.random() * maxLen));
		}
		return str;
	}

	/**
	 * 日期计算方法
	 * @param {*} date 日期
	 * @param {*} dateType 计算日期的类型（'year', 'quarter', 'month', 'week', 'day'）
	 * @param {*} dateInterval  日期间隔，正数表示相加，负数表示相减
	 */
	static computeDate(date, dateType, dateInterval)
	{
		switch( dateType )
		{
			case "year":
			{
				if( dateInterval>0 )
				{
					date = moment(date).add(dateInterval, 'year');
				}
				else
				{
					date = moment(date).subtract(Math.abs(dateInterval), 'year');
				}
				break;
			}
			case "quarter":
			{
				if( dateInterval>0 )
				{
					date = moment(date).add(dateInterval, 'quarter');
				}
				else
				{
					date = moment(date).subtract(Math.abs(dateInterval), 'quarter');
				}
				break;
			}
			case "month":
			{
				if( dateInterval>0 )
				{
					date = moment(date).add(dateInterval, 'month');
				}
				else
				{
					date = moment(date).subtract(Math.abs(dateInterval), 'month');
				}
				break;
			}
			case "week":
			{
				if( dateInterval>0 )
				{
					date = moment(date).add(dateInterval, 'week');
				}
				else
				{
					date = moment(date).subtract(Math.abs(dateInterval), 'week');
				}
				break;
			}
			case "day":
			{
				if( dateInterval>0 )
				{
					date = moment(date).add(dateInterval, 'days');
				}
				else
				{
					date = moment(date).subtract(Math.abs(dateInterval), 'days');
				}
				break;
			}
			default:
				break;
		}
		return date;
	}

	/**
	 * 字符串转日期
	 * @param {*} dateString 日期字符串
	 * @param {*} dateFormatter 日期格式
	 * @returns 
	 */
	static parseDate(dateString, dateFormatter)
	{
		return moment(dateString, dateFormatter).calendar();
	}

	/**
	 * 日期格式化转字符串
	 * @param {*} date 日期
	 * @param {*} dateFormatter 格式化格式
	 * @returns 
	 */
	static dateFormatter( date, dateFormatter )
	{
		return moment(date).format(dateFormatter);
	}

	/**
	 * 把数组放入缓存里
	 * @param {*} key 
	 * @param {*} storeObj 
	 */
	static addSessionStorage(key, storeObj) 
	{
		//定义一个前缀，表示只删除自己定义的缓存
		const cachePrefix = 'SERVICE_QR_';
		// sessionStorage对大小是有限制的，所以要进行try catch
		// 500KB左右的东西保存起来就会令到Resources变卡
		// 2M左右就可以令到Resources卡死，操作不了
		// 5M就到了Chrome的极限
		// 超过之后会抛出如下异常：
		// DOMException: Failed to execute 'setItem' on 'Storage': Setting the value of 'basket-http://file.com/ykq/wap/v3Templates/timeout/timeout/large.js' exceeded the quota

		if( typeof storeObj ==='object')
		{
			storeObj = JSON.stringify(storeObj);
		}

		try 
		{
			sessionStorage.setItem(cachePrefix + key, storeObj);
		} 
		catch (e) 
		{
			// sessionStorage容量不够，根据保存的时间删除已缓存到 sessionStorage
			if ( e.name.toUpperCase().indexOf('QUOTA')>= 0 ) 
			{
				let item;
				const tempArr = [];
				// 先把所有的缓存对象来出来，放到 tempArr 里
				
				for (item in sessionStorage) 
				{
					if (item.indexOf(cachePrefix) === 0)
					{
						tempArr.push(item);
					}
				}
				// 如果有缓存对象
				if (tempArr.length) 
				{
					// 按缓存时间升序排列数组
					tempArr.sort((a, b) => a.stamp - b.stamp);
					
					// 删除缓存时间最早的
					for(let i =0; i<tempArr.length && i<=10; i++)
					{
						sessionStorage.removeItem(tempArr[i]);
					}
					
					// 删除后在再添加，利用递归完成
					this.addSessionStorage(key, storeObj);
				}
			}
		}
	}

	/**
	 * 获取缓存里的数据
	 * @param {*} key 
	 * @returns 
	 */
	static getSessionStorage(key) 
	{
		const cachePrefix = 'SERVICE_QR_';

		return sessionStorage.getItem(cachePrefix + key);
	}

	/**
	 * 清除缓存里的数据
	 * @param {*} key 
	 */
	static removeSessionStorage(key)
	{
		const cachePrefix = 'SERVICE_QR_';

		sessionStorage.removeItem(cachePrefix + key);
	}

	/**
	 * 清空缓存里的数据
	 */
	static clearSessionStorage()
	{
		sessionStorage.clear();
	}

	/**
	 * 找到维度
	 * @param {*} dimension 
	 * @param {*} code 
	 * @returns 
	 */
	static findDimension( dimension, code )
    {
        if( dimension.code===code )
        {
            return dimension;
        }
        else if( dimension.subdimension!==undefined )
        {
            return this.findDimension(dimension.subdimension, code);
        }
    }

	/**
	 * 找到对应的父维度
	 * @param {*} dimension 
	 * @param {*} code 
	 */
	static findParentDimension( dimension, code) 
	{
		if( dimension.subdimension!==undefined )
		{
			if( dimension.subdimension.code===code )
			{
				return dimension.subdimension;
			}
			else
			{
				return this.findParentDimension(dimension.subdimension);
			}
		}

		return null;
	}

	/**
	 * 在cube里找到对应的dimension
	 * @param {*} cube 
	 * @param {*} dimensionName 
	 */
	static findDimensionOfCube(cube, dimensionName)
	{
		const { dimensions } = cube;

		for(let i=0; i<dimensions.length; i++)
		{
			if( dimensions[i].code.substring(0,4)===dimensionName.substring(0, 4) )
			{
				return this.findDimension(dimensions[i], dimensionName);
			}
			else
			{
				continue;
			}
		}
	}

	/**
	 * 通过正则表达式来截取字符串
	 * @param {*} str 
	 * @param {*} regExp 
	 */
	static split(str, regExp)
	{
		let array = [];

		let strs = str.split(regExp, -1);

		if( strs.length>0 )
		{
			for( let item of strs )
			{
				array.push(item.trim());
			}
		}

		return array;
	}

	/**
	 * 比较两个对象是否相同
	 * @param {*} obj1 
	 * @param {*} obj2 
	 * @returns 
	 */
	static ObjectIsSame( obj1, obj2 )
	{
		if( obj1===undefined || obj1===null ) return false;
		if( obj2===undefined || obj2===null ) return false;
		
		let obj1keys = Object.keys(obj1);
		let obj2keys = Object.keys(obj2);

		if ( obj2keys.length !== obj1keys.length ) return false;

		for ( let i = 0; i < obj1keys.length; i++ ) 
		{
			let key = obj1keys[i]

			if ( !obj2keys.includes(key) ) return false;

			if ( obj2[key] !== obj1[key] ) return false;
		}
		return true

	}

	static exportFile( url, params )
	{
		// const eleLink = document.createElement('a');

		// // eleLink.target = "_blank"
        // eleLink.style.display = 'none';
        
		// // eleLink.href = record;
        // eleLink.href = url;
        
        // document.body.appendChild(eleLink);

        // eleLink.click();

        // document.body.removeChild(eleLink);

		const formElement = document.createElement('form'); 

		formElement.style.display = 'display:none;'; 

		formElement.method = 'post';
		formElement.action = url; 

		for(let key in params )
		{
			const inputElement = document.createElement('input'); 
				
			inputElement.type = 'hidden';  
			inputElement.name = key;  
			inputElement.value = params[key];  

			formElement.appendChild(inputElement); 
		}

		document.body.appendChild(formElement);
		formElement.submit();  
		document.body.removeChild(formElement);  
	}

	/**
	 * 创建部门树形接口数据
	 * @param {*} data 
	 * @returns 
	 */
	static buildDepartment = (data) => {

		let  departmentDatas = {},  departmentData = [], departments = {}, allData = [];
		
		data.map( item => {
			
			let node = {
				id : item.id,
				value : item.id,
				title : item.name,
				parent_id : item.parent_id
			}

			allData.push(node);
			departmentDatas[item.id] = {...node};
		})

		for( let item of allData )
		{
			if( !departmentDatas[item.parent_id] )
			{
				departments[item.id] = {...item};
			}
		}

		for(let key in departments)
		{
			let departmentItem = {...departments[key]};

			let treeData = this.arrTotree(allData, key);

			if( treeData && treeData.length>0  )
			{
				departmentItem["children"] = [];
				for( let item of treeData)
				{
					departmentItem["children"].push(item);
				}
			}
			
			departmentData.push(departmentItem);

		}
		 
        return departmentData;
    }

	/**
	 * 数组转树形
	 * @param {*} data 
	 * @param {*} parentId 
	 * @returns 
	 */
	static arrTotree = (data, parentId) => {

		let treeData = [];

		for(let item of data)
		{
			if( item.parent_id===parentId )
			{
				const children = this.arrTotree(data, item.id);

				if (children.length) 
				{
					item.children = [...children];
				}

				treeData.push(item)
			}
		}

		return treeData;

	}

	static buildDepartments = (data) => {

        let departmentData = [];

        data.map( item => {

            let node={};

            node.value = item.id;
            node.title = item.name;

            if( item.subdepartments )
            {
                node.children = this.buildDepartments(item.subdepartments)
            }

            departmentData.push(node);
        })
        return departmentData;
    }

	static buildRole = (data) => {

        let roleData = [];

        data.map( item => {
            let node={};

            node.value = item.id;
            node.title = item.name;

            if( item.subroles )
            {
                node.children = this.buildRole(item.subroles)
            }

            roleData.push(node);
        })
        return roleData;
    }

	static buildGroup = (data) => {

        let groupData = [];

        data.map( item => {
            let node={};

            node.value = item.id;
            node.title = item.name;

            if( item.subgroups )
            {
                node.children = this.buildGroup(item.subgroups)
            }

            groupData.push(node);
        })
        return groupData;
    }

}

export default Widget