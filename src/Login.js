/* edslint-disable */ 
/* global window */

import React, { Component } from 'react';
import {BrowserRouter as Router,Route,Link,Redirect} from 'react-router-dom'

import { ReactComponent as GoogleLogo } from './images/google-brands.svg';
import { ReactComponent as TwitterLogo } from './images/twitter-brands.svg';
import { ReactComponent as FacebookLogo } from './images/facebook-brands.svg';
import { ReactComponent as GithubLogo } from './images/github-brands.svg';
import { ReactComponent as AmazonLogo } from './images/amazon-brands.svg';
import {getCookie,getAxiosClient,  getParentPath} from './helpers'  

let brandImages={amazon: AmazonLogo, google:GoogleLogo,twitter:TwitterLogo,facebook:FacebookLogo,github:GithubLogo}

export default  class Login extends Component {
    
    constructor(props) {
        super(props);
        this.state={signin_username:'',signin_password:'',rememberme:false};
        this.change = this.change.bind(this);
        //this.submitSignIn = this.submitSignIn.bind(this);
        
    };
    
    componentDidMount() {
        if (window.location.search.indexOf('fail=true') !== -1) {
            this.props.submitWarning('Login Failed')
        }
    }
         
    change(e) {
        var state = {};
        state[e.target.name] =  e.target.value;
        this.setState(state);
        return true;
    };
     

    //submitSignIn(user,pass) {
       //var that=this;
        //this.props.submitWarning('');
        //if (this.props.startWaiting) this.props.startWaiting();
 
               //const axiosClient = getAxiosClient();
               //axiosClient( {
                  //url: that.props.authServerHostname + that.props.authServer+'/signin',
                  //method: 'post',
                  //data: {
                    //username: user,
                    //password: pass
                  //}
                //})
                //.then(this.checkStatus)
                //.then(function(res) {
                //return res.data;  
               //})
              //.then(function(data) {
                  //const user = data.user
                  //if (that.props.stopWaiting) that.props.stopWaiting();
                  //if (data.error) {
                    //that.props.submitWarning(data.error);
                  //} else {
                        //if (data.message) {
                            //that.props.submitWarning(data.message);
                        //}
                        //if (user && user.token && user.token.access_token) {
                            //let authRequest = localStorage.getItem('auth_request');
                            //if (authRequest) {
                                //// using the showButton property, a button will be shown instead of immediate automatic redirect
                                //if (that.props.showButton) {
                                    //that.setState({authRequest:authRequest});
                                //} else {
                                    //// if there is an auth request pending, jump to that
                                    //that.props.setUser(user);
                                    //that.props.history.push(getParentPath(that.props.history)+'/oauth');
                                //}
                            //} else {
                                //that.props.setUser(user);
                                //window.location = getParentPath(that.props.history)+'/profile'
                            //}
                        //}  
                  //}
                 
              //}).catch(function(error) {
                //console.log(['SIGN IN request failed', error])
              //});
          
    //};
    
    
 
    render() {
       let that = this;

        

		let loginButtonsEnabled = this.props.loginButtons && this.props.loginButtons.length > 0 ? this.props.loginButtons : []
		 let loginButtons = loginButtonsEnabled.map(function(key) {
			let link = that.props.authServerHostname + that.props.authServer + '/'+ key;
			let title = key.slice(0,1).toUpperCase() + key.slice(1);
			let image = brandImages[key]
			return <span key={key} >&nbsp;<a className='btn btn-primary' href={link} >
            {key === "amazon" && <AmazonLogo style={{marginRight: '0.6em', height: '2em', color:'black'}}/> }
            {key === "google" && <GoogleLogo style={{marginRight: '0.6em', height: '2em', color:'black'}}/> }
            {key === "github" && <GithubLogo style={{marginRight: '0.6em', height: '2em', color:'black'}}/> }
            {key === "twitter" && <TwitterLogo style={{marginRight: '0.6em', height: '2em', color:'black'}}/> }
            {key === "facebook" && <FacebookLogo style={{marginRight: '0.6em', height: '2em', color:'black'}}/> }
            {title}
            </a></span>                         
		 });
		 
            var pathParts = that.props.history.location.pathname.split("/")
            var parentPath = pathParts.slice(0,pathParts.length-1).join("/")
           return <div> 
          
         {this.props.isLoggedIn() && <Link to={parentPath+'/profile'} style={{clear:'both',display:'inline'}} >
             <div style={{float:'right', marginRight:'0.3em',marginLeft:'0.5em'}} className='btn btn-primary' >Profile</div>
        </Link>}
         
         <Link to={parentPath+'/forgot'} style={{clear:'both',display:'inline'}} >
         <div style={{float:'right', marginRight:'0.3em',marginLeft:'0.5em'}} className='btn btn-primary' >Forgot Password</div>
         </Link>
         
         <Link to={parentPath+'/register'} style={{clear:'both',display:'inline'}} >
         <div style={{float:'right', marginRight:'0.3em',marginLeft:'0.5em'}} className='btn btn-primary' >Register</div>
         </Link>
          <h1 className="h3 mb-3 font-weight-normal" style={{textAlign:'left'}}>Sign in</h1>
         {loginButtonsEnabled && loginButtonsEnabled.length > 0 && <div style={{float:'right'}}> using {loginButtons}  <br/> </div>}
             
           <form className="form-signin" method="POST"  action={that.props.authServerHostname + that.props.authServer+'/signin'} >
                             
                     
          <label htmlFor="inputEmail" className="sr-only">Email address</label>
          <input type="text" name="username" id="inputEmail" className="form-control" placeholder="Email address" required   autoComplete="signin_username" />
          <label htmlFor="inputPassword" className="sr-only">Password</label>
          <input type="password" name="password" id="inputPassword" className="form-control" placeholder="Password" required  autoComplete="signin_password" />

          <button className="btn btn-lg btn-success btn-block" type="submit">Sign in</button>  
                   
        </form>
       </div>
    };
}
 //donSubmit={(e) => {e.preventDefault(); console.log('LOGINSSSS'); this.submitSignIn(this.state.signin_username,this.state.signin_password); return false;}}
