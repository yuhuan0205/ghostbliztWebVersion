import React from "react"
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css"
import {useEffect} from "react"
import { useNavigate } from 'react-router-dom';

function Login(props){

    const goPath = useNavigate();
    const ws = props.ws
    const uid = props.uid
    const setUid = props.setUid

    useEffect(()=>{
        if(ws){
            ws.emit("login",{uid:uid})
            ws.emit("getRoomList",{uid:uid})
            goPath('/lobby')
        }
    },[uid] )

    const connectToServerByEnter = (e) =>{
        //press Enter to trigger login
        if(e.charCode == 13){
            connectToServer()
        }
    }

    const connectToServer = () => {
        let e = document.getElementsByClassName("loginID")[0];
        if(e.value != ""){
            setUid(e.value) 
        }
    }

    return(
        <div className="loginPage">
            <h1 className="logo">閃靈快手Web</h1>
            <input type="text" className="loginID" placeholder="playerID" onKeyPress = {connectToServerByEnter}/><br/>
            <Button onClick={connectToServer} className="loginbtn btn btn-secondary">Login</Button>
        </div>
    )
}


export default Login;