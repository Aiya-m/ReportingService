import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './elements/Home';
import Login from './elements/Login';
import AdminOfficer from './elements/Admin/officerPage'
function App() {

  // const [backendData, setBackendData] = useState([{}])

  // useEffect(() => {
  //   fetch("/api").then(
  //     response => response.json()
  //   ).then(
  //     data => {
  //       setBackendData(data)
  //     }
  //   )
  // }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminOfficer />}/>
      </Routes>
    </BrowserRouter>
    // <div>
    //     {(typeof backendData.users === "undefined") ? (
    //       <p>loading....</p> 
    //     ): (
    //       backendData.users.map((user, i) => (
    //         <p key={i}>{user}</p>
    //       ))
    //     )}


    // </div>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
