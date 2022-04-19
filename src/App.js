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
    const [host, setHost] = useState(0)
    const [score, setScore] = useState([])
    const [roomNumber,setRoomNumber] = useState("0")

    useEffect(()=>{
        //記得要改
        // setWs(webSocket('http://35.236.187.48:8080'))
        setWs(webSocket(config.ip))
        console.log(config.ip)
    },[])


    useEffect(()=>{
        if(ws){
            //連線成功在 console 中打印訊息
            // console.log(ws)
            // console.log('success connect!')
            update()
            updateScore()
            test()
            getRoomInfo()
            //設定監聽
        }
    },[ws])




    useEffect( () =>{
        if(ws){
            ws.emit("hostCheck",{uid:uid})
            ws.on("host", msg =>{
                
                console.log(uid)
                if(msg.host == 1 & msg.uid == uid ){
                    
                    setHost(1)
                }
            })
        }
    }
    ,[uid])

    window.onbeforeunload = function () {
        ws.emit('discon',{uid:uid})
    }


    const update = () =>{
        ws.on('update', msg => {
            setChatState(prevArray => [...prevArray, {uid:msg.uid, msg:msg.msg}] )
            let e = document.getElementsByClassName("chat")[0]
            e.scrollTop += 25
            // console.log(message.uid + " " + message.msg)
        })
    }

    const updateScore = () =>{
        ws.on('updateScore', msg => {
            setScore(prevArray => msg.data )
            // console.log(message.uid + " " + message.msg)
        })
    }

    const test = () => {
        ws.on("console", msg=>{
            console.log(msg)
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
                        <Route path = "/" element = {<Login ws = {ws} setWs = {setWs} uid = {uid} setUid = {setUid}/>}></Route>
                        <Route path = "/game" element = {
                                <div className="innerPlace">
                                    <h3 className="roomNumber">{roomNumber}</h3>
                                    <Game  ws = {ws} setWs = {setWs} uid = {uid} setUid = {setUid} 
                                    gameState = {gameState} setGameState = {setGameState} 
                                    host = {host} />
                                    <Chat chatState={chatState} setChatState = {setChatState}/>
                                    <SendText ws = {ws} uid = {uid} />
                                    <Score score = {score}/>
                                </div>
                                                        }></Route>
                        <Route path = "/lobby" element = {<Lobby uid = {uid} ws = {ws}/>}></Route>

                    </Routes>
                </Router>
            </div>
    )
}

export default App;