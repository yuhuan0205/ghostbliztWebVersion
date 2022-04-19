import Button from "react-bootstrap/Button";
import React from 'react'
import { useNavigate } from 'react-router-dom';

function Lobby(props){
    const uid = props.uid
    const ws = props.ws
    const goPath = useNavigate();

    const createRoom = ()=>{
        ws.emit("createRoom",{uid:uid})
        goPath('/game')
    }

    const joinRoom = ()=>{
        let e = document.getElementsByClassName("roomEnter")[0];
        if(e.value != ""){
            ws.emit("joinRoom",{uid:uid, room:e.value})
            goPath('/game')
        }
    }


    const rooms = [{rid:0},{rid:1},{rid:2}]
    return(
        <div className="innerPlace">
            <div className='lobbyPage'>
                <div className='icon'></div>
                <h3 className='lobbyId'>{uid}</h3>
                <div className='roombtns'>
                    <Button onClick={createRoom} className = "roombtn btn-secondary">Create</Button>
                    <Button onClick={joinRoom} className = "roombtn btn-secondary">Join</Button>
                </div>
                <input type="text" className="roomEnter" placeholder="Room"/>
            </div>
            <div className="roomList">
                {
                    rooms.map((room, index)=>{
                        const {rid} = room
                        
                        return(
                            <div className="room" style={{ gridRowStart: index+1 , gridRowRnd: index+2}}>
                                <h4>{"room : " + String(rid)}</h4>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Lobby