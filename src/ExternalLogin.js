import React, { Component } from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import {getAxiosClient,getMediaQueryString,getCsrfQueryString} from './helpers'  


export default class ExternalLogin   extends Component {
  
  
   constructor(props) {
        super(props)
        var that = this
        this.state = {user:null, checkLoginIframe: null}
        
        this.pollTimeout = null
        this.receiveMessage = this.receiveMessage.bind(this)
        this.pollIsLoggedIn = this.pollIsLoggedIn.bind(this)
        this.checkIsLoggedIn = this.checkIsLoggedIn.bind(this)
        this.checkLogin = this.checkLogin.bind(this)
        this.doLogin = this.doLogin.bind(this)
        this.doProfile = this.doProfile.bind(this)
        this.doLogout = this.doLogout.bind(this)
        this.isLoggedIn = this.isLoggedIn.bind(this)
        this.loadUser = this.loadUser.bind(this)
        this.setUser = this.setUser.bind(this)
        this.setCheckLoginIframe = this.setCheckLoginIframe.bind(this)
    }
    
    setUser(user) {
        this.setState({user:user})
    }
    
    setCheckLoginIframe(url) {
        this.setState({checkLoginIframe:url})
    }
    
    componentDidMount(props) {
        var that = this
        window.addEventListener("message", this.receiveMessage, false); 
        setTimeout(function() {
            that.checkLogin()
        },500)
     }
    
     receiveMessage(event) {
        if (event.origin === this.props.authServerHostname) {
            this.setUser(event.data.user)
        }
    }
   
    // open a window to check login and keep polling for login status updates
     pollIsLoggedIn(popup, allowedPages) {
        let that = this
        if (this.pollTimeout) clearTimeout(this.pollTimeout)
        this.pollTimeout = setTimeout(function() {
            if (popup && !popup.closed) {
                popup.postMessage({poll_login:true, allowedPages: allowedPages}, that.props.authServerHostname);
                that.pollIsLoggedIn(popup, allowedPages)
            }
        },500)
    }
    // open a window to check login then close it when it responds
     checkIsLoggedIn(popup) {
        let that = this
        if (this.pollTimeout) clearTimeout(this.pollTimeout)
        this.pollTimeout = setTimeout(function() {
            if (popup) {
                popup.postMessage({check_login:true}, that.props.authServerHostname);
            }
        },500)
    }

    // open an iframe to check login 
     checkLogin() {
        var that = this
        var url = this.props.authServerHostname + this.props.authWeb + "/blank"
        var i = document.createElement('iframe');
        i.style.display = 'none';
        i.src = url
        i.onload = function() {
            var popup = i.contentWindow;
            that.checkIsLoggedIn(popup)
        }
        document.body.appendChild(i);
        
    }
    

     doLogin() {
        var url = this.props.authServerHostname  + this.props.authWeb+ '/login'
        var popup = window.open(url,'mywin')
        this.pollIsLoggedIn(popup,['login','register','forgot','registerconfirm','privacy'])
    }
    
     doProfile() {
        var url = this.props.authServerHostname + this.props.authWeb + '/profile'
        var popup = window.open(url,'mywin')
        this.pollIsLoggedIn(popup,['profile','logout'])
    }
    
    doLogout() {
        var url = this.props.authServerHostname + this.props.authWeb + '/logout'
        var popup = window.open(url,'mywin')
        this.pollIsLoggedIn(popup,['logout'])
        
    }
	     
     isLoggedIn() {
        return (this.state.user && this.state.user.token && this.state.user.token.access_token) 
    }
    
     loadUser(accessToken) {
		let that = this;
        return new Promise(function(resolve,reject) {
			if (accessToken) {
        		const axiosClient = getAxiosClient(accessToken);
				axiosClient.post(that.props.authServerHostname + that.props.authServer+'/me',{
				})
				.then(function(res) {
				  return res.data;  
				})
				.then(function(user) {
                    that.setUser(user)
        			resolve(user);
				}).catch(function(err) {
					console.log(err);
					reject();
				});				
			} else {
				reject();
			}
		})
	}     
  
    render(props) {
      return <div>
      {this.props.children(this.state.user,this.setUser,getAxiosClient,getMediaQueryString,getCsrfQueryString,this.isLoggedIn, this.loadUser,this.doLogout, this.doLogin, this.doProfile, this.props.authServer, this.props.authServerHostname)}
      
      </div>
    }
}
