/* global document */
import React, { Component } from 'react';

import {getAxiosClient,getMediaQueryString,getCsrfQueryString} from './helpers'  

export default  class LoginSystemContext extends Component {
    
    constructor(props) {
        super(props);
        // authServer url must be on same domain as website so oauth callback saves refresh cookie to same domain 
        // by default use the relative path /api/login
        this.state = {user: {}, authServer: process.env.REACT_APP_authServer && process.env.REACT_APP_authServer.trim() ? process.env.REACT_APP_authServer : '/api/login', authServerHostname: props.authServerHostname && props.authServerHostname.trim() ? props.authServerHostname : ''}
        this.setUser = this.setUser.bind(this)
        this.useRefreshToken = this.useRefreshToken.bind(this)
        this.loadUser = this.loadUser.bind(this)
        this.logout = this.logout.bind(this)
        this.isLoggedIn = this.isLoggedIn.bind(this)
     };
    
    isLoggedIn() {
        return (this.state.user && this.state.user.token && this.state.user.token.access_token) 
    }
    
    setUser(user) {
        this.setState({user:user})
    }
    
    componentDidMount(props) {
        let that=this;
        this.useRefreshToken().then(function(userAndToken) { 
            that.setUser(userAndToken)
        })
        
        function receiveMessage(event) {
            //console.log(["frame MESSAGE", JSON.stringify(event.data), event, event.origin,that.props.allowedOrigins, event.source])
            
            if (event.data && (event.data.check_login || event.data.poll_login )) {
                if (that.props.allowedOrigins && event.origin.indexOf(that.props.allowedOrigins) !== -1) {
                    if (that.state.user && that.state.user.token) {
                        event.source.postMessage({user:that.state.user && that.state.user.token ? that.state.user : null},event.origin)
                        if (event.data.check_login)  window.close()
                    } else {
                        event.source.postMessage({user:that.state.user && that.state.user.token ? that.state.user : null},event.origin)
                        if (event.data.check_login)  window.close()
                    }
                    if (Array.isArray(event.data.allowedPages)) {
                        var parts = window.location.href ? window.location.href.split("/") : []
                        if (event.data.allowedPages.indexOf(parts[parts.length -1]) !== -1) {
                        } else {
                            window.close()
                        }
                    }
                }
            }
        }

        window.addEventListener("message", receiveMessage, false);
    };
   
    
    useRefreshToken() {
        let that = this
        return new Promise(function(resolve,reject) {
            const axiosClient = getAxiosClient();
            axiosClient( {
              url: that.state.authServerHostname + that.state.authServer+'/refresh_token',
              method: 'get'
            }).then(function(res) {
                return res.data;  
            }).then(function(res) {
                if (res.access_token) {
                    that.setUser({token:res})
                    that.loadUser(res.access_token).then(function(user) {
                        var combined = Object.assign({},user,{token:res})
                        if (that.refreshTimeout) clearTimeout(that.refreshTimeout)
                        that.refreshTimeout = setTimeout(function() {
                            that.useRefreshToken().then(function(userAndToken) { 
                                that.setUser(userAndToken)
                            })
                        },840000) // 14 minutes
                        resolve(combined)
                    })
                } else {
                    console.log(err);
                    resolve({})
                }
             }).catch(function(err) {
                console.log(err);
            });
        })
    }
   
	loadUser(accessToken) {
		let that = this;
        return new Promise(function(resolve,reject) {
			if (accessToken) {
        		const axiosClient = getAxiosClient(accessToken);
				axiosClient.post(that.state.authServerHostname + that.state.authServer+'/me',{
				})
				.then(function(res) {
				  return res.data;  
				})
				.then(function(user) {
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
    
      
  logout(bearerToken) {
      let that = this;
	  this.setState({user:null});
	  const axiosClient = getAxiosClient(bearerToken);
      return axiosClient( {
		  url: that.state.authServerHostname + that.state.authServer+'/logout',
		  method: 'post',
		  
		}).catch(function(err) {
			console.log(err);
		});	
      
  };
  
   
  
    render() {
        return <div>{this.props.children(this.state.user,this.setUser,getAxiosClient,getMediaQueryString,getCsrfQueryString, this.isLoggedIn, this.loadUser, this.useRefreshToken,this.logout, this.state.authServer, this.state.authServerHostname)}</div>
    }
    
}
