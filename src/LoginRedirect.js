/* esslint-disable */ 

import React, { Component } from 'react';
import {BrowserRouter as Router,Route,Link,Redirect} from 'react-router-dom'
import {getCookie} from './helpers'  

export default  class LoginRedirect extends Component {
    
    constructor(props) {
        super(props);
        this.state={redirect:''};
    };
    
    componentWillUpdate() {
        let that = this
        if (this.props.user) {
           if (!this.props.isLoggedIn()) { 
               that.setState({redirect: that.props.match.url+'/login'})
            } else {
                that.setState({redirect: that.props.match.url+'/profile'})
            }
        }
    }


    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        } 
       return <div></div>
    };
}
 
