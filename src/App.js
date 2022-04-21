import React from "react";
import Login from "./components/Login";
import Game from "./components/Game";
import Chat from "./components/Chat";
import {useState, useEffect} from "react"
import webSocket from 'socket.io-client'
import SendText from "./components/SendText";
import config from "./static/config.json"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Lobby from "./components/Lobby";
import Score from "./components/Score";


function App(){

    const [ws,setWs] = useState(null)
    const [uid, setUid] = useState()
    const [gameState, setGameState] = useState("init")
    const [chatState, setChatState] = useState([])
    const [isHost, setIsHost] = useState(false)
    const [score, setScore] = useState([])
    const [roomNumber,setRoomNumber] = useState("0")
    const [roomList, setRoomList] = useState([])

    useEffect(()=>{
        //記得要改
        // setWs(webSocket('http://35.236.187.48:8080'))
        setWs(webSocket(config.ip))
    },[])

    useEffect(()=>{
        if(ws){
            //set listener
            updateChat()
            updateScore()
            getRoomInfo()
        }
    },[ws])

    useEffect( () =>{
        if(ws){
            ws.emit("hostCheck",{uid:uid})
            ws.on("isHost", msg =>{
                if(msg.isHost == true & msg.uid == uid ){    
                    setIsHost(true)
                }
            })
            ws.on("roomList", msg =>{
                if(msg.uid == uid){
                    setRoomList(msg.data)
                }
            })
        }
    }
    ,[uid])

    //監聽分頁or瀏覽器關閉事件
    window.onbeforeunload = function () {
        ws.emit('discon',{uid:uid})
    }


    const updateChat = () =>{
        ws.on('updateChat', msg => {
            setChatState(prevArray => [...prevArray, {uid:msg.uid, msg:msg.msg}] )
            //chat至底
            let e = document.getElementsByClassName("chat")[0]
            e.scrollTop += 25
        })
    }

    const updateScore = () =>{
        ws.on('updateScore', msg => {
            setScore(prevArray => msg.data )
        })
    }

    const getRoomInfo = () =>{
        ws.on('roomInfo', msg => {
            setRoomNumber(msg.msg)
        })
    }

    return(
            <div className="mainPage">
                <Router>
                    <Routes>
                        <Route path = "/" element = {<Login ws = {ws} uid = {uid} setUid = {setUid}/>}></Route>
                        <Route path = "/game" element = {
                                <div className="innerPlace">
                                    <h3 className="roomNumber">{roomNumber}</h3>
                                    <Game  ws = {ws} uid = {uid} setUid = {setUid} 
                                        gameState = {gameState} setGameState = {setGameState} 
                                        isHost = {isHost} />
                                    <Chat chatState={chatState} setChatState = {setChatState}/>
                                    <SendText ws = {ws} uid = {uid} />
                                    <Score score = {score}/>
                                </div>
                                                        }></Route>
                        <Route path = "/lobby" element = {<Lobby uid = {uid} ws = {ws} roomList={roomList}/>}></Route>
                    </Routes>
                </Router>
            </div>
    )
}

export default App;