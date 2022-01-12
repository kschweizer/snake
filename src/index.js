import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Snake from './Snake';
import Snake2 from './Snake2';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <h1>SNAKE!</h1>
    <div className="textWrapper">
      <p className="subTitle">
      </p>
      <p id="instructions">Use the arrow keys or W/A/S/D to play</p>
    </div>
    <Snake />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
