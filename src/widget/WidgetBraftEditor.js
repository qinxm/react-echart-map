//富文本编辑器
import React, { Component } from "react";
import { Modal, Form, Input, message } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';

class WidgetBraftEditor extends Component {

     /**
     * 构造函数 
     */
      constructor(props)  
      {
          super(props);
          this.state = {
              // 创建一个空的editorState作为初始值
              editorState: BraftEditor.createEditorState(null)
          }
      }

    
     // 获取富编译器文本值
     onChange =  async (editorState) => {
      
        editorState=BraftEditor.createEditorState(editorState);
        this.setState({editorState:editorState});
        if(this.props.handleEditorChange)this.props.handleEditorChange(editorState);
    }

  
    submitContent = async () => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        const htmlContent = this.state.editorState.toHTML()
        // const result = await saveEditorContent(htmlContent)
    }

    
    render()
    {
        const {width='61.4%',editor}=this.props;
        const {editorState}=this.state;
        const excludeControls = [ 'undo', 'redo', 'separator', 
        'font-size', 'line-height', 'letter-spacing', 'separator',
        'text-color', 'bold', 
        // 'italic', 'underline', 'strike-through', 'separator',
        // 'superscript', 'subscript', 'remove-styles', 'emoji',  'separator', 'text-indent', 'text-align', 'separator',
        // 'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
        // 'link', 'separator', 'hr', 'separator',
        // 'media', 'separator',
        'clear']
        return   <div>
                        {
                            editor?
                            <div className="my-component" style={{width}} >
                                <BraftEditor
                                value={editorState}
                                defaultValue={this.props.defaultValue}
                                onChange={this.onChange}
                                onSave={this.submitContent}
                                excludeControls={excludeControls}
                                />
                            </div>
                            :
                            <div className="my-component" style={{width}} >
                            <BraftEditor
                            defaultValue={this.props.defaultValue}
                            onChange={this.onChange}
                            onSave={this.submitContent}
                            excludeControls={excludeControls}
                            />
                        </div>
                        }
                    
                </div>
                
    }

}
export default WidgetBraftEditor;