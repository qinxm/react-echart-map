//app.js
import React from 'react';
import FrameRouter from './router/FrameRouter';
// import 'antd/dist/antd.css'
import './App.css';
import './css/common.css';
// import './css/media.scss';

class App extends React.Component 
{
	render() 
	{
		return (
			<FrameRouter />
		)	
	}
}

export default App;