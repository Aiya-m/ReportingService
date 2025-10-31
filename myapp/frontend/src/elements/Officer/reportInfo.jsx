import React, { useEffect, useState } from "react";
import { ArrowLeft, MapPin, FileText } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import OfficerNavbar from "./officerNav";

const ReportInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`http://52.87.254.106:5000/reports/${id}`);
        const data = await res.json();
        if (res.ok) {
          setReport(data.report);
        } else {
          console.error("Error:", data.message);
        }
      } catch (err) {
        console.error("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-200">
        <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-200">
        <p className="text-gray-500">ไม่พบข้อมูลรายงาน</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gray-200 min-h-screen">
      <div className="relative w-full max-w-sm sm:max-w-md bg-orange-500 shadow-lg rounded-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center bg-orange-500 text-white px-4 py-3">
          <button onClick={() => navigate(-1)} className="mr-3">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">รายละเอียดรายงาน</h1>
        </div>

        {/* Content */}
        <div className="flex-grow bg-white px-5 py-4 space-y-3">
          <h2 className="font-semibold text-xl text-gray-800">{report.title}</h2>

          <div className="text-gray-700">
            <p><span className="font-medium">ชื่อ:</span> {report.firstname} {report.lastname}</p>
            <p className="flex items-center">
              <MapPin size={14} className="mr-1 text-orange-500" />
              {report.address}
            </p>
            <p><span className="font-medium">รายละเอียด:</span> {report.description}</p>
          </div>
        </div>

        <div className="flex-shrink-0">
          <OfficerNavbar />
        </div>
      </div>
    </div>
  );
};

export default ReportInfo;