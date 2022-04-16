import React from "react";

function Score(props){
    const score = props.score
    //sorting, for more detail, to read my Notion about JS.
    score.sort(function (a, b) {
        return b.score - a.score;
      })
    return(
        <div className = "scoretable">
            <table class="table table-light">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Score</th>
                    </tr>
                </thead>
                <tbody>
                {   
                    score.map( (scoreItem, index) =>{
                        console.log(scoreItem)
                        const {uid, score} = scoreItem
                        return (
                            <tr>
                            <th scope="row">{index+1}</th>
                            <td>{uid}</td>
                            <td>{score}</td>
                            </tr>
                        )//<li>{uid + " "+ msg}</li>
                    } )
                }
                    {/* <tr style={{color:"rgb(12, 150, 118)"}}>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>10</td>
                    </tr>
                    <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>5</td>
                    </tr>
                    <tr>
                    <th scope="row">3</th>
                    <td>Larry the Bird</td>
                    <td>6</td>
                    </tr> */}
                </tbody>
            </table>
        </div>
    )
}

export default Score
