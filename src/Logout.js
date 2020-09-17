/* global window */
import  React,{ Component } from 'react';
import {Redirect, Link} from 'react-router-dom'

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default  class Logout extends Component {
  
    componentDidMount() {
        let that = this
        setTimeout(function() {
            if (that.props.user && that.props.user.token && that.props.user.token.access_token) { 
                that.props.logout(that.props.user.token.access_token);
            }
        },1000)
    }; 
    
 
    render() {
        if (this.props.logoutRedirect)  {
           //window.location=this.props.logoutRedirect
        } 
        return <div style={{width:'100%', textAlign:'center', paddingTop:'1em'}} ><b>Logged Out </b><br/><Link to='../login' ><button className="btn btn-lg btn-success btn-block" type="submit">Login</button></Link></div>
       
    };
}
