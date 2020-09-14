/* global document */
import React, { Component } from 'react';

import {getAxiosClient,getMediaQueryString,getCsrfQueryString} from './helpers'  

export default  class LoginSystemContext extends Component {
    
    constructor(props) {
        super(props);
        this.state = {user: {}}
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
        
    };
   
    
    useRefreshToken() {
        let that = this
        return new Promise(function(resolve,reject) {
            const axiosClient = getAxiosClient();
            axiosClient( {
              url: that.props.authServerHostname+that.props.authServer+'/refresh_token',
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
				axiosClient.post(that.props.authServerHostname + that.props.authServer+'/me',{
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
		  url: that.props.authServerHostname + that.props.authServer+'/logout',
		  method: 'post',
		  
		}).catch(function(err) {
			console.log(err);
		});	
      
  };
  
   
  
    render() {
        return <div>{this.props.children(this.state.user,this.setUser,getAxiosClient,getMediaQueryString,getCsrfQueryString, this.isLoggedIn, this.loadUser, this.useRefreshToken,this.logout)}</div>
    }
    
}
