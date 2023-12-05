import React from 'react';
import { Upload, Button} from 'antd';

import 'antd/dist/antd.css';
import '../css/widget/widget.uploader.css';

class WidgetUploader extends React.Component
{ 
    constructor( props )
    {
        super(props);

        this.onRemove = this.onRemove.bind(this);
        this.beforeUpload = this.beforeUpload.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        
        this.state = {
            uploading : false,
            fileList : [],
            disabled : true,
            fileName : undefined,
            options : props.options,
            uploaderProps : {
                accept : (props.options!==undefined && props.options.accept!==undefined) ? props.options.accept : "",
                onRemove :  (file) => {
                    this.onRemove(file);
                },
                beforeUpload : (file) => { 
                    this.beforeUpload(file);
                }
            }
        }
    }

    onRemove(file)
    {
        let newFileList = [];

        let { options, fileList, disabled } = this.state;

        if( options!==undefined && options.type!=="single")
        {
            const index = fileList.indexOf(file);

            newFileList = fileList.slice();
    
            newFileList.splice(index, 1);
        }   
        else
        {
            newFileList = [...fileList, file];
        }

        if( newFileList.length>0 )
        {
            disabled = false;
        }
        else
        {
            disabled = true;
        }

        this.setState({fileList:newFileList, disabled:disabled});
    }

    beforeUpload(file)
    {
        let isFirst=true, fileName = undefined;

        let { fileList, options, disabled} = this.state;
       
        let newFileList = [];

        if( options!==undefined && options.type!=="single")
        {
            newFileList = [...fileList, file];
           
        }
        else
        { 
            newFileList.push(file);
        }

        for( let item of newFileList)
        {
            if( isFirst )
            {
                fileName = item.name;
                isFirst = false;
            }
            else
            {
                fileName += "; " + item.name;
            }
           
        }

        if( newFileList.length>0 )
        {
            disabled = false;
        }
        else
        {
            disabled = true;
        }

        this.setState({ fileList: newFileList, fileName:fileName, disabled:disabled});
    }

    handleUpload()
    {
        const { fileList } = this.state;

        this.setState({
            uploading: true,
            disabled:true
        });

        if( this.props.handleUpload!==undefined )
        {
            this.props.handleUpload(fileList);
        }
    }

    render()
    {
        const { uploaderProps, fileList, fileName, disabled} = this.state;
        const {isUp = true, width = ''} = this.props

        let {uploading} = this.state;

        if( this.props.uploading!==undefined )
        {
            uploading = this.props.uploading;
        }
        
        return (
            <div className="sf-uploader">
                <input type="text" className="sf-upload-input" readOnly="readonly" id="fileName" value={fileName} style={{width}} />
                
                <Upload {...uploaderProps} onChange={ !isUp ? this.handleUpload : ()=>{}}>
                    <Button>
                        选择文件
                    </Button>
                </Upload>

                <div className="sf-upload-button">
                    {
                        isUp && <Button
                            type="primary"
                            onClick={this.handleUpload}
                            disabled={ fileList.length===0 && disabled }
                            loading={uploading}
                            style={{ marginTop: 16 }}
                            >
                            {uploading ? '上传' : '开始上传' }
                        </Button>
                    }
                </div>
                
            </div>
        )
        
    }
}

export default WidgetUploader

