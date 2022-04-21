import Button from "react-bootstrap/Button";
import React from 'react'
import { useNavigate } from 'react-router-dom';

function Lobby(props){
    const uid = props.uid
    const ws = props.ws
    const roomList = props.roomList
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

    const joinRoomBybtn = (roomNumber)=>{
        ws.emit("joinRoom",{uid:uid, room:roomNumber})
        goPath('/game')
    }

    const refresh = () =>{
        ws.emit("getRoomList",{uid:uid})
    }

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
                <input onClick={refresh} type="button" className="refreshbtn" ></input >
            </div>
            <div className="roomList">
                {   
                    roomList.map((roomItem, index)=>{
                        const room = roomItem
                        return(
                            <Button type="button" onClick={()=>{joinRoomBybtn(room)}} className="room btn btn-secondary" style={{ gridRowStart: index+1 , gridRowRnd: index+2}}>{room}</Button>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Lobby