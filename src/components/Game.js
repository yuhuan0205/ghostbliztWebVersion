import React from "react"
import {useState, useEffect, useRef} from "react"
import Button from "react-bootstrap/Button";
import { useNavigate } from 'react-router-dom';


function Game(props){
 
    const ws = props.ws
    
    const gameState = props.gameState
    const setGameState = props.setGameState

    const host = props.host

    const count = useRef(0)
    const [ci, setCi] = useState(require("../static/cardback.jpg"))
    const cardBack =  require("../static/cardback.jpg")

    

    const goPath = useNavigate();//設常數接收useHistory()回傳的物件

    useEffect(()=>{
        if(ws){
            test()
            init()
            
        }
    },[ws])

    useEffect( () =>{
        let e = document.getElementsByClassName("quizbtns")[0];
        if(host == 0){
            e.style.visibility = 'hidden'
            // e.style.display = "none"
        }
        else{
            e.style.visibility = 'visible'
            // e.style.display = "flex"
        }
    }
    ,[host])


    const nextQuiz = () =>{
        ws.emit("test",{uid : props.uid})
    }

    const init = () =>{
        ws.on("init", () =>{
            console.log(count.current)
            if(count.current != 0){
                flip()
            }
            else{
                count.current = 1
            }
        })
    }

    const test = () =>{
        ws.on('test', message => {
            let path = message.quiz.url
            setTimeout(() =>{setCi(require("../static/"+path))
            setGameState(path)},0)
            flip()
        })
    }

    
    const flip = () =>{
        let e = document.getElementsByClassName("flip-card-inner")[0]
        e.classList.toggle("flip-animation")
    }


    return(
        <div className="game">
            <div className="flip-card-inner">
                <img src = {cardBack} className="flip-card-front"/>
                <img src = {ci} className="flip-card-back"/>
            </div>
            <div className="ansbtns">
                <Button onClick={()=>ws.emit("sendAns",{uid : props.uid, q:gameState, ans:"rat"})} className="ansbtn btn-secondary">灰鼠</Button>
                <Button onClick={()=>ws.emit("sendAns",{uid : props.uid, q:gameState, ans:"ghost"})} className="ansbtn btn-secondary">白鬼</Button>
                <Button onClick={()=>ws.emit("sendAns",{uid : props.uid, q:gameState, ans:"book"})} className="ansbtn btn-secondary">藍書</Button>
                <Button onClick={()=>ws.emit("sendAns",{uid : props.uid, q:gameState, ans:"bottle"})} className="ansbtn btn-secondary">綠瓶</Button>
                <Button onClick={()=>ws.emit("sendAns",{uid : props.uid, q:gameState, ans:"chair"})} className="ansbtn btn-secondary">紅椅</Button>
            </div>

            <div className="quizbtns">
                <Button onClick={nextQuiz} className="quizbtn btn-secondary">出題</Button>
                {/* <Button onClick={() =>{goPath("/lobby")}} className="quizbtn btn-secondary">Lobby</Button> */}
            </div>
        </div>
    )
}


export default Game;