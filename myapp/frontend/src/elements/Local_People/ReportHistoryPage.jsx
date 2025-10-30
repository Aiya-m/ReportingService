import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, FileText } from "lucide-react";
import BottomNavbar from "./Nav";

const ReportHistory = () => {
    const navigate = useNavigate();

    const [historyData, setHistoryData] = useState([
        {
            id: 1,
            title: "ไฟไหม้ที่ตลาด",
            location: "ถนนประชาอุทิศ ซอย 90",
            date: "28 ต.ค. 2025",
            time: "19:45 น.",
            status: "ดำเนินการแล้ว",
        },
        {
            id: 2,
            title: "น้ำท่วมในซอย",
            location: "ลาดพร้าว 101",
            date: "25 ต.ค. 2025",
            time: "21:10 น.",
            status: "กำลังตรวจสอบ",
        },
        {
            id: 3,
            title: "หมาโดนรถชน",
            location: "หน้ามหาวิทยาลัย",
            date: "20 ต.ค. 2025",
            time: "14:22 น.",
            status: "ดำเนินการแล้ว",
        },
        {
            id: 4,
            title: "ไฟไหม้โกดัง",
            location: "พระราม 2 ซอย 69",
            date: "15 ต.ค. 2025",
            time: "10:05 น.",
            status: "ดำเนินการแล้ว",
        },
        {
            id: 5,
            title: "อุบัติเหตุรถชน",
            location: "สุขุมวิท 77",
            date: "12 ต.ค. 2025",
            time: "08:30 น.",
            status: "ดำเนินการแล้ว",
        },
    ]);

    return (
        <div className="flex justify-center bg-gray-200 min-h-screen">
            <div className="relative w-full max-w-sm sm:max-w-md bg-white shadow-lg rounded-lg h-screen flex flex-col">

                <div className="flex items-center bg-orange-500 text-white px-4 py-3 flex-shrink-0">
                    <button onClick={() => navigate(-1)} className="mr-2">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold">ResQ</h1>
                </div>

                <div className="flex-grow overflow-y-auto px-4 py-3 space-y-3">
                    {historyData.length > 0 ? (
                        historyData.map((item) => (
                            <div
                                key={item.id}
                                className="bg-gray-100 rounded-xl shadow p-3 border border-gray-200"
                            >
                                <h2 className="font-semibold text-lg text-gray-800">{item.title}</h2>
                                <div className="text-sm text-gray-600 mt-1 flex items-center">
                                    <MapPin size={14} className="mr-1 text-orange-500" />
                                    {item.location}
                                </div>
                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                    <Clock size={14} className="mr-1 text-orange-500" />
                                    {item.date} • {item.time}
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                        {item.status}
                                    </span>
                                    <button className="text-xs flex items-center text-blue-600 hover:underline">
                                        <FileText size={14} className="mr-1" /> รายละเอียด
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center mt-10">ไม่มีข้อมูลประวัติการแจ้งเหตุ</p>
                    )}
                </div>
                <div className="flex-shrink-0">
                    <BottomNavbar />
                </div>
            </div>
        </div>
    );
};

export default ReportHistory;
