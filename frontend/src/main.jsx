import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./App.css"; import "./index.css"
// src/index.js or src/App.js
//Fonts: Lato, poppins,montserrat
import "@fontsource/poppins"
import "@fontsource/lato"
import "@fontsource/montserrat"
import "@fontsource/roboto"
//main App

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </React.StrictMode>
);

