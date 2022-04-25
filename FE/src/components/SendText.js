import React from "react"

function SendTest(props){
    const ws = props.ws
    const uid = props.uid

    const sendMsg = () =>{
        let msg = document.getElementsByClassName('textBox')[0].value
        if(msg != ""){
            ws.emit("sendMsg",{uid:uid, msg:msg})
            document.getElementsByClassName('textBox')[0].value = ""
        }
    }

    const sendByEnter = (e) =>{
        if(e.charCode == 13){
            sendMsg()
        }
    }

    return(
        <div className="textBoxContainer">
          <input type="textbox" className="textBox" onKeyPress = {sendByEnter}></input>
          <button onClick={sendMsg} className="sendTextBtn">send</button>
        </div>
    )
}


export default SendTest;