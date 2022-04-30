import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./style.css"



function MainApp(){
    
    return(
        <App/>
    )
}

ReactDOM.render(<MainApp/> , document.getElementById("root"));