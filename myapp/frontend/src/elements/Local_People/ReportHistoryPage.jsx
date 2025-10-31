import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, FileText } from "lucide-react";
import BottomNavbar from "./Nav";
import { AccountContext } from "../Account";

const ReportHistory = () => {
    const navigate = useNavigate();
    const { getSession } = useContext(AccountContext);

    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSession()
            .then((session) => {
                const payload = session.getIdToken().payload;
                setFirstName(payload.given_name);
                setLastName(payload.family_name);
            })
            .catch((err) => console.error("Session Error:", err));
    }, [getSession]);

    useEffect(() => {
        if (!firstname || !lastname) return;

        const fetchHistory = async () => {
            try {
                const res = await fetch(
                    `/api/reports?firstname=${firstname}&lastname=${lastname}`
                );
                const data = await res.json();
                if (res.ok) {
                    setHistoryData(data.reports || []);
                } else {
                    console.error("Fetch error:", data.message);
                }
            } catch (err) {
                console.error("Error fetching report history:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [firstname, lastname]);

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
                    {loading ? (
                        <p className="text-center text-gray-500 mt-10">กำลังโหลดข้อมูล...</p>
                    ) : historyData.length > 0 ? (
                        historyData.map((item) => (
                            <div
                                key={item.id}
                                className="bg-gray-100 rounded-xl shadow p-3 border border-gray-200"
                            >
                                <h2 className="font-semibold text-lg text-gray-800">{item.title}</h2>
                                <div className="text-sm text-gray-600 mt-1 flex items-center">
                                    <MapPin size={14} className="mr-1 text-orange-500" />
                                    {item.address || "-"}
                                </div>
                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                    <Clock size={14} className="mr-1 text-orange-500" />
                                    {item.date || "-"} • {item.time || ""}
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                        {item.status || "รอดำเนินการ"}
                                    </span>
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
