import React, { useState, useEffect } from "react";
import { ArrowLeft, Clock, MapPin, FileText } from "lucide-react";
import OfficerNavbar from "./officerNav";
import { useNavigate } from "react-router-dom";
import Status from '../Status'

const ReportIncoming = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProgressReports = async () => {
            try {
                const res = await fetch("http://54.146.205.234:5000/reports-progress");
                const data = await res.json();
                if (res.ok) {
                    setReports(data.reports || []);
                } else {
                    console.error("Fetch error:", data.message);
                }
            } catch (err) {
                console.error("Error fetching progress reports:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProgressReports();
    }, []);

    return (
        <div className="flex justify-center bg-gray-200 min-h-screen">
            <div className="relative w-full max-w-sm sm:max-w-md bg-orange-500 shadow-lg rounded-lg h-screen flex flex-col">
                <div className="flex items-center justify-between bg-orange-500 text-white px-4 py-3">
                    <h1 className="text-lg font-bold">ResQ</h1>
                    <Status />
                </div>

                <div className="flex-grow overflow-y-auto px-4 py-3 space-y-3">
                    <h1 className="text-lg font-bold text-white">กำลังดำเนินงาน</h1>
                    {loading ? (
                        <p className="text-center text-gray-500 mt-10">กำลังโหลดข้อมูล...</p>
                    ) : reports.length > 0 ? (
                        reports.map((item) => (
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
                                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                        {item.status || "รอดำเนินการ"}
                                    </span>
                                    <button className="text-xs flex items-center text-blue-600 hover:underline" onClick={() => navigate(`/report-incoming/${item.id}`)}>
                                        <FileText size={14} className="mr-1" /> รายละเอียด
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center mt-10">ไม่มีรายงานที่กำลังดำเนินการ</p>
                    )}
                </div>

                <div className="flex-shrink-0">
                    <OfficerNavbar />
                </div>
            </div>
        </div>
    );
};

export default ReportIncoming;