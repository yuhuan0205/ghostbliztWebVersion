import Button from "react-bootstrap/Button";
import React from 'react'

function Lobby(props){
    const uid = props.uid
    const rooms = [{rid:0},{rid:1},{rid:2}]
    return(
        <div className="innerPlace">
            <div className='lobbyPage'>
                <div className='icon'></div>
                <h3 className='lobbyId'>{uid}</h3>
                <div className='roombtns'>
                    <Button className = "roombtn btn-secondary">Create</Button>
                    <Button className = "roombtn btn-secondary">Join</Button>
                </div>
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