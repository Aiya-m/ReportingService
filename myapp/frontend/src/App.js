import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './elements/Home';
import Register from './elements/Register';
import AdminOfficer from './elements/Admin/officerPage'
import AdminLocal from './elements/Admin/localPage'
import LocalReport from './elements/Local_People/ReportPage'
import Profile from './elements/Local_People/ProfilePage'
import HistoryPage from './elements/Local_People/ReportHistoryPage'
import ManageProfile from './elements/Local_People/ManageProfilePage'

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
        <Route path="/register" element={<Register />} />
        <Route path="/admin-officer" element={<AdminOfficer />} />
        <Route path='/admin-localpeople' element={<AdminLocal />} />
        <Route path='/report-page' element={<LocalReport />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/history-page' element={<HistoryPage />} />
        <Route path='/manage-profile' element={<ManageProfile />} />
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
