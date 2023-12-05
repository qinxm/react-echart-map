//router.js
import React from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from "react-router-dom";
import './../css/common.css';
import './../css/base.css';
// import Frame from '../frame/Frame';
import Dashboard from '../pages/dashboard/Dashboard'; //报表

class FrameRouter extends React.Component 
{
    render() 
    {
        return(
            <Router basename="/larissa-business-screen">
                <Route exact path="/" component={Dashboard}></Route>
            </Router>   
        )
    }
}

const FrameRoute = ({component: Component, model, breadCur, ...rest}) => (
    <Route {...rest} render={(props) => (
        // <Frame model={model} >
            <Component {...props} />
        // </Frame>
    ) } />
)


export default FrameRouter


