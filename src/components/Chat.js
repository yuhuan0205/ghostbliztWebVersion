import React from "react"



function Chat(props){
    const chatState = props.chatState
    
    return(
        <div className="chat">
            <ul>
                {
                    chatState.map( (chatItem) =>{
                        const {uid, msg} = chatItem
                        return <li>{uid + " "+ msg}</li>
                    } )
                }
            </ul>
        </div>
    )
}


export default Chat;