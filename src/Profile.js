import React, { Component } from 'react';
import 'whatwg-fetch'
import {FaSignOutAlt as LogoutButton} from 'react-icons/fa';
import {FaSave as SaveButton} from 'react-icons/fa';
import {BrowserRouter as Router,Route,Link,Redirect} from 'react-router-dom'
import {scrollToTop} from './helpers'  
import {getCookie,getAxiosClient,  getParentPath} from './helpers'  

 
export default class Profile extends Component {

    constructor(props) {
        super(props);
        this.change = this.change.bind(this);
        this.saveUser = this.saveUser.bind(this);
        this.saveUserReal = this.saveUserReal.bind(this);
        this.state = {
            warning_message: '',
            redirect: ''
        }
        this.redirTimeout = null
    };
    
      
    change(e) {
        let state = {...this.props.user};
        var key = e.target.name;
        if (e.target.name.startsWith('fake_')) {
            key = e.target.name.slice(5);
        }
        state[key] =  e.target.value;
        this.props.setUser(state);
        return true;
    };
    
    
    saveUser(e) {
        e.preventDefault();
        this.saveUserReal(this.props.user);
        return false;
    };
    
     saveUserReal(user) {
        let that = this
        return new Promise(function(resolve,reject) {
             if (that.props.startWaiting) that.props.startWaiting();
             if (user && user.token && user.token.access_token) {
                 const axiosClient = getAxiosClient(user.token.access_token);
                 axiosClient({
                  url: that.props.authServerHostname + that.props.authServer+'/saveuser',
                  method: 'post',
                  data: user
                }).then(function(res) {
                    if (that.props.stopWaiting) that.props.stopWaiting();
                    return res.data;  
                }).then(function(data) {
                    if (data.error) {
                            that.props.submitWarning(data.error);
                  } else {
                        if (data.message) {
                            that.props.submitWarning(data.message);
                        } 
                    }
                }).catch(function(err) {
                    console.log(err);
                });
            }
         })
         
    };
    
    componentDidMount() {
        let that = this;
		scrollToTop();
	};
    
    
    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        } 
        let that = this;
		if (this.props.user) {
            //if ()
           var pathParts = that.props.history.location.pathname.split("/")
           var parentPath = ''
           if (pathParts[0] && pathParts[0].trim()) {
                parentPath = "/"+pathParts.slice(0,pathParts.length-1).join("/")
            } else {
                // skip leading slash
                parentPath = "/"+pathParts.slice(1,pathParts.length-1).join("/")
            }
            if (parentPath === "/" ) parentPath=""
            var standalone = (this.props.allowedOrigins && this.props.allowedOrigins.length > 0) ? true : false
           return (
            <div> 
                
                {standalone && <button className='btn btn-danger' style={{float:'right', marginLeft:'3em'}} onClick={function() {window.close()}}>
                 Close</button>}
                {this.props.isLoggedIn() && <Link to={parentPath+"/logout"}   >
                <button className='btn btn-warning' style={{float:'right'}} >
                <LogoutButton  /> Logout</button></Link>}
                
                {!standalone && <Link to={parentPath+'/login'} style={{clear:'both',display:'inline'}} >
                     <button style={{float:'right', marginRight:'0.3em',marginLeft:'0.5em'}} className='btn btn-primary' >Login</button>
                </Link>}
                
                <form method="POST" onSubmit={this.saveUser} autoComplete="false" >
                    <div className="form-group" style={{width: '70%',marginLeft:'4em'}} >
                
                            <h3  style={{textAlign: 'left'}} >Profile</h3>
                            {this.props.warning_message && <div className='warning-message'  >{this.props.warning_message}</div>}
         
                               <label htmlFor="username" className='row'>Email </label><input autoComplete="false" id="username" readOnly={true} type='text' name='username' onChange={this.change} value={this.props.user ? this.props.user.username: ''}   className="form-control" />
                                
                                <label htmlFor="name" className='row'>Name </label><input autoComplete="false" id="name" type='text' name='name' onChange={this.change} value={this.props.user ? this.props.user.name : ''} className="form-control" />
                                <label htmlFor="avatar" className='row'>Avatar </label><input autoComplete="false" id="avatar" type='text' name='avatar' onChange={this.change} value={this.props.user ? this.props.user.avatar: ''}  className="form-control" />
                                
                            
                                <label htmlFor="password" className='row'>Password</label> <input  autoComplete="false" id="password" type='password' name='fake_password' onChange={this.change}    className="form-control"  />
                                <label htmlFor="password2" className='row'>Repeat Password</label><input  autoComplete="false" id="password2" type='password' name='fake_password2' onChange={this.change}   className="form-control" />
                                <input id="id" type='hidden' name='_id' value={this.props.user ? this.props.user._id : ''} />
                                <br/>
                                <br/>
                                <button  className='btn btn-lg btn-success btn-block'><SaveButton/> Save</button>
                   
                </div>
                </form></div>
                    
            )
        } else return '<b>no user</b>';
    };
}
