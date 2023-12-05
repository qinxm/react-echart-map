/**
 * 自定义sql编辑器制作封装
 * @author zhaowen
 * @date 2022/10/21
 * @lastModifiedBy zhaowen
 * @lastModifiedTime 2022/10/21
 */
import React,{useEffect} from "react";
// import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from "prop-types";
// import "./editor-codemirror.scss";

// 引入 基于react的codemirror容器
import { UnControlled as CodeMirror } from "react-codemirror2";

// 引入 codemirror核心css,js文件（经试验css必须有，js文件还没发现它的用处）
import "codemirror/lib/codemirror.js";
import "codemirror/lib/codemirror.css";

// 引入 sql 依赖
import "codemirror/mode/sql/sql";
import "codemirror/mode/shell/shell";

// 当前行代码高亮插件
import "codemirror/addon/selection/active-line";

// 括号颜色匹配
import "codemirror/addon/edit/matchbrackets";

// 滚动条
import "codemirror/addon/scroll/simplescrollbars.js";
import "codemirror/addon/scroll/simplescrollbars.css";

// 括号冒号等自动闭合
import "codemirror/addon/edit/closebrackets";

// 提示与自动补全
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/sql-hint";

import 'codemirror/addon/fold/foldgutter.css'; 
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';  
import 'codemirror/addon/fold/brace-fold.js';  
import 'codemirror/addon/fold/comment-fold.js';

// 主题
import "codemirror/theme/idea.css";
import { useRef } from "react";

const EditorCodemirror = (props) => {
  /**
   * 编辑器初始化完成后获取编辑器实例并设置初始值
   * @param {*} obj
   */
  const getEditorInstance = (obj, e) => {
    obj.setValue(props.value);
    props.getEditor(obj);
    
  };

  const codeRef = useRef(null)

  /**
   * 编辑器输入值更改方法
   */
  const textChange = (editor, change, value) => {
    
    setTimeout(() => {
        editor.refresh();
    },100);

    if (!value) return;
    
    if(props.onChange) props.onChange(value);

    document.getElementById('editor').addEventListener("mouseup", onMouseup);

    // editor.on("change", function (editor, change) {
    //   //任意键触发autocomplete
    //   if (change.origin == "+input") {
    //     var text = change.text;
    //     if ( !ignoreToken(text) )
    //       //提示
    //     //   setTimeout(function () {
    //     //     editor.execCommand("autocomplete"); // 自动输入
    //     //   }, 20);
    //     editor.showHint({ completeSingle: false }); // 使用tab或确定键输入
         
    //   }
    // });
  };

  const onMouseup = (e) =>
  {
    if(props.mouseup) props.mouseup(e.view.getSelection().toString())
  }

  useEffect(()=>{
    console.log(codeRef);
  },[])

  /**
   * 忽略自动提示的token
   * @param {*} text
   * @returns
   */
  const ignoreToken = (text) => {
    const ignore = ["", "#", "!", "-", "=", "@", "$", "%", "&", "+", ";", "(", ")", "*"];
    if (text && text[0]) {
      for (const pre in ignore) {
        if (ignore[pre] === text[0]) {
          return true;
        }
      }
    } else {
      return true;
    }
    return false;
  };
  
  return (
    
    <div className="sd-component-editor" id='editor'>
     <CodeMirror
        ref={codeRef}
        editorDidMount={(editor) => getEditorInstance(editor)}
        value={props.value}
        options={{
          lineNumbers: true, // 显示行号
          lineWrapping: true, // 自动换行
          smartIndent: true, // 智能缩进
          indentWithTabs: true, // 使用tab键缩进
          mode: { name: "text/x-mysql" }, // 实现代码高亮
          styleActiveLine: true, // 当前行背景高亮
          matchBrackets: true, // 括号匹配和高亮
          scrollbarStyle: "overlay", // 滚动条样式
          autoCloseBrackets: true, // 键入时将自动关闭()[]{}''""
          theme: "idea", // 主题
          autoRefresh: true,
        }}
        onChange={textChange}
      />
    </div>
  );
};

EditorCodemirror.propTypes = {
  value: PropTypes.string,
  getEditor: PropTypes.func,
};

EditorCodemirror.defaultProps = {
  value: "",
  getEditor: () => {},
};

export default EditorCodemirror;
