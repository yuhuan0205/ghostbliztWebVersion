import React from "react"
import {useState, useEffect, useRef} from "react"
import Button from "react-bootstrap/Button";
import { useNavigate } from 'react-router-dom';


function Game(props){
 
    const ws = props.ws
    const gameState = props.gameState
    const setGameState = props.setGameState
    const isHost = props.isHost
    const count = useRef(0)
    const [cardImg, setCardImg] = useState(require("../static/cardback.jpg"))
    const cardBack =  require("../static/cardback.jpg")
    const goPath = useNavigate();//設常數接收useHistory()回傳的物件

    useEffect(()=>{
        if(ws){
            getQuiz()
            init()
            disabledBtn()
        }
    },[ws])

    useEffect( () =>{
        let e = document.getElementsByClassName("quizbtns")[0];
        if(isHost){
            e.style.visibility = 'visible'
            // e.style.display = "none"
        }
        else{
            e.style.visibility = 'hidden'
            // e.style.display = "flex"
        }
    }
    ,[isHost])

    const nextQuiz = () =>{
        ws.emit("sendQuiz",{uid : props.uid})
    }

    //initialize the game, fliping the card back. 
    const init = () =>{
        ws.on("init", () =>{
            //Make ansbtns clickable.
            let ansbtns =  document.getElementsByClassName("ansbtn");
            ansbtns = Array.from(ansbtns)
            ansbtns.map((btn)=>{btn.disabled = false})
        
            if(count.current != 0){
                flip()
            }
            //in the beginning, do not flip the card.
            else{
                count.current = 1
            }
        })
    }

    const getQuiz = () =>{
        ws.on('getQuiz', msg => {
            let path = msg.quiz.url
            setCardImg(require("../static/"+path))
            setGameState(path)
            flip()
        })
    }

    const flip = () =>{
        let e = document.getElementsByClassName("flip-card-inner")[0]
        e.classList.toggle("flip-animation")
    }

    const disabledBtn = ()=>{
        let ansbtns =  document.getElementsByClassName("ansbtn");
        ansbtns = Array.from(ansbtns)
        ansbtns.map((btn)=>{btn.disabled = true})
    }

    return(
        <div className="game">
            <div className="flip-card-inner">
                <img src = {cardBack} className="flip-card-front"/>
                <img src = {cardImg} className="flip-card-back"/>
            </div>
            <div className="ansbtns">
                <Button onClick={()=>{ws.emit("sendAns",{uid : props.uid, q:gameState, ans:"rat"});disabledBtn()}} className="ansbtn btn-secondary">灰鼠</Button>
                <Button onClick={()=>{ws.emit("sendAns",{uid : props.uid, q:gameState, ans:"ghost"});disabledBtn()}} className="ansbtn btn-secondary">白鬼</Button>
                <Button onClick={()=>{ws.emit("sendAns",{uid : props.uid, q:gameState, ans:"book"});disabledBtn()}} className="ansbtn btn-secondary">藍書</Button>
                <Button onClick={()=>{ws.emit("sendAns",{uid : props.uid, q:gameState, ans:"bottle"});disabledBtn()}} className="ansbtn btn-secondary">綠瓶</Button>
                <Button onClick={()=>{ws.emit("sendAns",{uid : props.uid, q:gameState, ans:"chair"});disabledBtn()}} className="ansbtn btn-secondary">紅椅</Button>
            </div>

            <div className="quizbtns">
                <Button onClick={nextQuiz} className="quizbtn btn-secondary">出題</Button>
                {/* <Button onClick={() =>{goPath("/lobby")}} className="quizbtn btn-secondary">Lobby</Button> */}
            </div>
        </div>
    )
}


export default Game;