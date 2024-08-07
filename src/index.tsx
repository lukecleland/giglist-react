import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import "semantic-ui-css/semantic.min.css";
import "./styles/styles.scss";

var myGlobal = "global";

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
