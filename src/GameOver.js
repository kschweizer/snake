import React from 'react'

export default function GameOver(props) {
    return (
        <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            <h1 style={{ color: 'red' }}>YOU DIED!</h1>
            <div>
                {(props.score || props.score === 0) ?
                    <h3 style={{ marginLeft: 'auto', marginRight: 'auto' }}> Your Score: {props.score}</h3>
                    : null
                }
                {(props.highScore || props.highScore === 0) ?
                    <h3 style={{ marginLeft: 'auto', marginRight: 'auto' }}> High Score: {props.highScore}</h3>
                    : null
                }
            </div>
            <h3 style={{ color: 'red' }}>SPACEBAR TO RESET</h3>
            <img src="https://c.tenor.com/OYp_uK4WcwkAAAAS/packwatch-ripbozo.gif" alt="ripbozo" style={{ width: '450px', height: 'auto' }} />
        </div>
    )
}
