import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import { TailSpin } from 'react-loader-spinner';
import { usePromiseTracker } from "react-promise-tracker";

export const LoadingIndicator = props => {
  const { promiseInProgress } = usePromiseTracker();

  return promiseInProgress && 
    <div
      style={{
        width: "100%",
        height: "100",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <TailSpin color="#00BFFF" height={80} width={80} />
    </div>
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);