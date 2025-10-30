import React, { useState, useContext, useEffect } from "react";
import { AccountContext } from "./Account";
import { useNavigate } from 'react-router-dom';

const Status = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [status, setStatus] = useState(false);
    const { getSession, logout } = useContext(AccountContext)

    useEffect(() => {
        getSession().then((session) => {
            console.log("session: ", session);
            const payload = session.getIdToken().payload;
            setUsername(payload["cognito:username"]);
            setStatus(true);
        })
        .catch((err) => {
            console.log("Failed to get session: ", err)
            setUsername("");
        });
    }, [getSession]);

    const handleLogout = () => {
        logout();
        setUsername("");
        navigate('/login');
    };

    return <div>{username ? (<button onClick={handleLogout}> สวัสดี, {username}! Logout </button>) : ("กรุณาเข้าสู่ระบบ")}</div>;
};

export default Status;