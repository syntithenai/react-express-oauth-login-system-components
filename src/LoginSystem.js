/* global document */

import React, { Component } from 'react';
import {BrowserRouter as Router,Route,Link,Redirect} from 'react-router-dom'
import Logout from './Logout'
import Profile from './Profile'
import Login from './Login'
import Register from './Register'
import LoginRedirect from './LoginRedirect'
import TermsOfUse from './TermsOfUse'
import ForgotPassword from './ForgotPassword'
import RegistrationConfirmation from './RegistrationConfirmation'

import OAuth from './OAuth'
import {getCookie,getAxiosClient,  getParentPath} from './helpers'  

export default  class LoginSystem extends Component {
    
    constructor(props) {
        super(props);
        this.timeout = null;
        this.refreshInterval = null;
        this.state={message:null};
        // XHR
        this.submitWarning = this.submitWarning.bind(this);
        this.refreshTimeout = null
    };

    submitWarning(warning) {
        let that=this;
        clearTimeout(this.timeout);
        this.setState({'message':warning});
        this.timeout = setTimeout(function() {
            that.setState({'message':''});
        },6000);
    };
 
    render() {
		let that = this;
        let callBackFunctions = {
            logout : this.props.logout,
            isLoggedIn : this.props.isLoggedIn,
            saveUser : this.props.saveUser,
            setUser:  this.props.setUser,
            submitWarning : this.submitWarning,
            user:this.props.user,
            message: this.state.message,
            authServer: this.props.authServer,
            authServerHostname: this.props.authServerHostname,
            loginButtons: this.props.loginButtons,
            useRefreshToken: this.props.useRefreshToken,
            loadUser: this.props.loadUser,
            logoutRedirect : this.props.logoutRedirect
        };
        if (this.state.authRequest) {
			return <div className='pending-auth-request' ><Link to={`${that.props.match.url}/auth`} className='btn btn-success'  >Pending Authentication Request</Link></div>
				
		} else {
            return (
				<div>
                {this.state.message && <div className='warning-message' style={{zIndex:99,clear:'both', position:'fixed', top: 50, left:200, minWidth: '200 px', backgroundColor:'pink', border:'2px solid red', padding: '1em',  borderRadius:'10px', fontWeight: 'bold', fontSize:'1.1em'}} >{this.state.message}</div>}
          
                <Router>
                    <Route  path={`${that.props.match.path}/profile`}  render={(props) => <Profile  {...callBackFunctions}  history={props.history} match={props.match} location={props.location} />}  />
                    <Route  path={`${that.props.match.path}/login`}  render={(props) => <Login {...callBackFunctions} history={props.history} match={props.match} location={props.location}  />}  />
                    <Route  path={`${that.props.match.path}/register`}  render={(props) => <Register {...callBackFunctions} history={props.history} match={props.match} location={props.location}  />}  />
                    <Route  path={`${that.props.match.path}/registerconfirm`}  render={(props) => <RegistrationConfirmation {...callBackFunctions} history={props.history} match={props.match} location={props.location}  />}  />
                    <Route  path={`${that.props.match.path}/logout`}  render={(props) => <Logout {...callBackFunctions} history={props.history} match={props.match} location={props.location}  />}  />
                    <Route  path={`${that.props.match.path}/oauth`}  render={(props) => <OAuth {...callBackFunctions}  history={props.history} match={props.match} location={props.location} />}  />
                    <Route  path={`${that.props.match.path}/forgot`}  render={(props) => <ForgotPassword {...callBackFunctions} history={props.history} match={props.match} location={props.location}  />}  />
                    <Route  path={`${that.props.match.path}/privacy`}  render={(props) => <TermsOfUse {...callBackFunctions} history={props.history} match={props.match} location={props.location}  />}  />
                    <Route  path={`${that.props.match.path}/`} exact render={(props) => <LoginRedirect {...callBackFunctions} history={props.history} match={props.match} location={props.location}  />}  />
                    
                </Router>    
                </div>
            )
         }
    };
}
