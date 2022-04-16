import React from "react"
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css"
import {useState, useEffect} from "react"
import { useNavigate } from 'react-router-dom';

function Login(props){

    const goPath = useNavigate();


    const ws = props.ws
    const setWs = props.setWs
    const uid = props.uid
    const setUid = props.setUid
    
    const connectToServerByEnter = (e) =>{
        if(e.charCode == 13){
            connectToServer()
        }
    }

    const connectToServer = () => {
        let element = document.getElementsByClassName("userID")[0];
        // TO DO : use async or something to solve connecting problem
        // see this video https://www.youtube.com/watch?v=LenNpb5zqGE
        // solved
        if(element.value != ""){
            setUid(element.value)
            
            
            // element = document.getElementsByClassName("loginPage")[0];
            // element.style.display = "none";
            // element = document.getElementsByClassName("game")[0];
            // element.style.display = "flex"
            // element = document.getElementsByClassName("chat")[0];
            // element.style.display = "inline"
            // element = document.getElementsByClassName("textBoxContainer")[0];
            // element.style.display = "inline"   
        }
    }

    useEffect(()=>{
        if(ws){
            ws.emit("login",{uid:props.uid})
            goPath('/game')
        }
    },[props.uid] )




    return(
        <div className="loginPage">
            <h1 className="logo">閃靈快手Dev</h1>
            <input type="text" className="userID" placeholder="playerID" onKeyPress = {connectToServerByEnter}/><br/>
            <Button onClick={connectToServer} className="loginbtn btn btn-secondary">Login</Button>
        </div>
    )
}


export default Login;