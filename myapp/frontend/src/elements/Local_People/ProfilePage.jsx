import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import useMutation from "../../hooks/useMutation";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import BottomNavbar from "./Nav";

const ReportHistory = () => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center bg-gray-200 min-h-screen">
            <div className="relative w-full max-w-sm sm:max-w-md bg-white shadow-lg rounded-lg overflow-y-auto max-h-screen">
                <div className="flex items-center bg-orange-500 text-white px-4 py-3">
                    <button onClick={() => navigate(-1)} className="mr-2">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold">ResQ</h1>
                </div>
                
                <div className="flex-grow overflow-y-auto">
                    <h1>
                        this is profile page
                    </h1>
                    <button onClick={() => navigate("/manage-profile")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">แก้ไขข้อมูลส่วนตัว</button>
                </div>
                <div className="absolute bottom-0 w-full flex-shrink-0">
                    <BottomNavbar />
                </div>
            </div>
        </div>
    );
};

export default ReportHistory;