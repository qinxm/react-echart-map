import axios from 'axios';

export default class Axios 
{
    static ajax(options)
    {
        const access = sessionStorage.getItem("_user_access_");

        let headers = {};

        headers = {'Content-Type':'application/json;charset=utf-8'};

        if( access!==undefined && access!==null )
        {
            headers["Authorization"] = "Access " + access;
        }
        axios({
            method:'post',
            url : options.url,
            crossDomain:true,
            data : options.params,
            headers: headers,
        }).then( function( response ) {

            if( options.callback!==undefined )
            {
                options.callback.call( this, response.data, options.params, options.backParam );
            }

        }).catch( function( error ) {
            console.error( error);
        });
    }

    static ajaxFile( options )
    {
        const access = sessionStorage.getItem("_user_access_");

        let headers = {};

        headers = {'Content-Type':'application/json;charset=utf-8'};

        if( access!==undefined && access!==null )
        {
            headers["Authorization"] = "Access " + access;
        }
        
        axios({
            method:'get',
            url : options.url,
            crossDomain:true,
            headers : headers,
        }).then( function( response ){

            if( options.callback!==undefined )
            {
                options.callback.call( this, response.data);
            }

        }).catch( function( error ) {
            console.log(error);
        });
    }

    /**
     * 上传文件
     * @param {s} options {FormData }
     */
    static uploadFile( options )
    {
        const access = sessionStorage.getItem("_user_access_");

        let headers = {};

        headers = {'Content-Type':'multipart/form-data'};

        if( access!==undefined && access!==null )
        {
            headers["Authorization"] = "Access " + access;
        }

        axios({
            method:'post',
            url : options.url,
            crossDomain:true,
            data : options.formData,
            headers : headers
        }).then( function( response ){

            if( options.callback!==undefined )
            {
                options.callback.call( this, response.data, options.backParam );
            }

        }).catch( function( error ) {
            console.log(error);
        });
    }


    static exportFile( options )
    {
        const access = sessionStorage.getItem("_user_access_");

        let headers = {};

        headers = {'Content-Type':'application/json;charset=utf-8'};

        if( access!==undefined && access!==null )
        {
            headers["Authorization"] = "Access " + access;
        }

        axios({
            method:'post',
            url : options.url,
            crossDomain:true,
            data : options.params,
            headers : headers,
            responseType: 'blob'
        }).then( function( response ){
            let url = window.URL.createObjectURL(response.data);
            let eleLink = document.createElement('a');
            eleLink.href = url;

            let fileName = "export.xlsx";

            if( options.params!==undefined && options.params.fileName!==undefined)
            {
                fileName = options.params.fileName;
            }
            
            eleLink.download = fileName;
            document.body.appendChild(eleLink);
            eleLink.click();
            window.URL.revokeObjectURL(url);

        }).catch( function( error ) {
            console.log(error);
        });
    }
}