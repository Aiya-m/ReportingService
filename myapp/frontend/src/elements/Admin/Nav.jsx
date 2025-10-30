import React, { useState, useContext, useEffect } from "react";
import { AccountContext } from "../Account";
import { useNavigate } from 'react-router-dom';

function Nav() {
    const navigate = useNavigate();
    const { getSession, logout } = useContext(AccountContext);
    const [username, setUsername] = useState("");

    useEffect(() => {
            getSession().then((session) => {
                console.log("session: ", session);
                const payload = session.getIdToken().payload;
                setUsername(payload["cognito:username"]);
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

    return (
        <div>
            <nav className="bg-orange-500 text-white px-6 py-3 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    {/* Logo */}
                    <div className="text-2xl font-bold">
                        Report admin
                    </div>

                    {/* Menu */}
                    <div class="p-4 flex justify-center">
                        <ul class="flex space-x-6">
                            <li>
                                <a href="/admin-officer" class="text-white hover:text-gray-300 font-medium transition-colors">
                                    ผู้ใช้เจ้าหน้าที่
                                </a>
                            </li>
                            <li>
                                <a href="/admin-localpeople" class="text-white hover:text-gray-300 font-medium transition-colors">
                                    ผู้ใช้ทั่วไป
                                </a>
                            </li>
                            <button onClick={handleLogout}>ออกจากระบบ</button>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Nav;