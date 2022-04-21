import React from "react";

function Score(props){
    const score = props.score
    //sorting, for more detail, to read my Notion about JS.
    score.sort(function (a, b) {
        //from big to small.
        return b.score - a.score;
      })

    return(
        <div className = "scoretable">
            <table className="table table-light">
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
                        const {uid, score} = scoreItem
                        return (
                            <tr>
                            <th scope="row">{index+1}</th>
                            <td>{uid}</td>
                            <td>{score}</td>
                            </tr>
                        )
                    } )
                }
                </tbody>
            </table>
        </div>
    )
}

export default Score
