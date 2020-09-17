import React, { Component , useState, useEffect} from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'

export default function ExternalLogin(props)  {	
  
    const [user,setUser] = useState(null)
    useEffect(() => {
       window.addEventListener("message", receiveMessage, false); 
       setTimeout(function() {
            checkLogin()
        },500)
    },[])
    
    var pollTimeout
    
    function receiveMessage(event) {
        if (event.origin === props.authHostname && event.data.user) {
            if (pollTimeout) clearTimeout(pollTimeout)
            setUser(event.data.user)
        }
        
    }
   
    // open a window to check login and keep polling for login status updates
    function pollIsLoggedIn(popup, allowedPages) {
        //console.log(['pollisloggedin'])
        let that = this
        if (pollTimeout) clearTimeout(pollTimeout)
        pollTimeout = setTimeout(function() {
            if (popup) {
                //console.log(['pollisloggedin send',popup])
                popup.postMessage({poll_login:true, allowedPages: allowedPages}, props.authHostname);
                pollIsLoggedIn(popup, allowedPages)
            }
            
        },500)
    }
    // open a window to check login then close it when it responds
    function checkIsLoggedIn(popup) {
        let that = this
        if (pollTimeout) clearTimeout(pollTimeout)
        pollTimeout = setTimeout(function() {
            if (popup) {
                popup.postMessage({check_login:true}, props.authHostname);
            }
        },500)
    }

    // open a window to check login then close it when it responds
    function checkLogin() {
        var popup = window.open(props.authHostname + props.authWeb + "/blank",'mywin','resizable=no, scrollbars=no, status=no, width=1,height=1, top: 0, left:'+window.screen.availHeight+10);
        checkIsLoggedIn(popup)
    }
    

    function doLogin() {
        var url = props.authHostname  + props.authWeb+ '/login'
        var popup = window.open(url,'mywin')
        pollIsLoggedIn(popup,['login','register'])
    }
    
    function doProfile() {
        var url = props.authHostname + props.authWeb + '/profile'
        var popup = window.open(url,'mywin')
        pollIsLoggedIn(popup,['profile'])
    }
    
    function doLogout() {
        var url = props.authHostname + props.authWeb + '/logout'
        var popup = window.open(url,'mywin')
        pollIsLoggedIn(popup,['logout','login'])
    }
	      
  
      return (
      <div className="App" style={{backgroundColor:'lightblue', width:'100%', height: '1000px'}} >
           
           {JSON.stringify(user)}
           {!user && <button className="btn btn-lg btn-success btn-block"  onClick={doLogin} type="submit">Login</button>}
           {user && <button className="btn btn-lg btn-success btn-block"  onClick={doProfile} type="submit">Profile</button>}
           {user && <button className="btn btn-lg btn-success btn-block" onClick={doLogout} type="submit">Logout</button>}
      </div>)
}
