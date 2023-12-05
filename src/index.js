import React from 'react';
import ReactDOM from 'react-dom';
// 针对ant的全局化配置
import { ConfigProvider } from "antd";
// 导入中文包
import zhCN from "antd/lib/locale/zh_CN";

import App from './App';
import * as serviceWorker from './serviceWorker';

import './index.css';
import "antd/dist/antd.css";

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
