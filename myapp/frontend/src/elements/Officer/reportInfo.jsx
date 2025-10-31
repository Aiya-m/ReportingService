import React, { useEffect, useState } from "react";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import OfficerNavbar from "./officerNav";

const ReportInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`http://13.220.85.162:5000/reports/${id}`);
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

  // ฟังก์ชันอัปเดตสถานะรายงาน
  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`http://54.146.205.234:5000/reports/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        setReport((prev) => ({ ...prev, status: newStatus }));
      } else {
        console.error("Update failed:", data.message);
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdating(false);
    }
  };

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

  // กำหนดข้อความและสถานะเป้าหมายของปุ่ม
  let buttonText = "";
  let nextStatus = "";
  if (report.status === "รอดำเนินการ") {
    buttonText = "รับเรื่อง";
    nextStatus = "กำลังดำเนินการ";
  } else if (report.status === "กำลังดำเนินการ") {
    buttonText = "เสร็จสิ้น";
    nextStatus = "สำเร็จ";
  }

  return (
    <div className="flex justify-center bg-gray-200 min-h-screen">
      <div className="relative w-full max-w-sm sm:max-w-md bg-white shadow-lg overflow-y-auto max-h-screen">
        {/* Header */}
        <div className="flex items-center justify-center bg-orange-500 text-white py-3 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-3 text-white"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-2xl font-bold">ResQ</h1>
        </div>

        {/* Content */}
        <div className="flex-grow px-6 py-5">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            รายละเอียดเหตุการณ์
          </h2>

          <div className="bg-orange-50 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col space-y-3">
              <div>
                <p className="font-semibold text-gray-700">
                  ( {report.title || "ชื่อเหตุการณ์"} )
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {report.image_url ? (
                  <img
                    src={report.image_url}
                    alt="report"
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                ) : (
                  <div className="w-20 h-20 flex justify-center items-center bg-gray-100 rounded-md border">
                    <ImageIcon size={32} className="text-gray-400" />
                  </div>
                )}

                <div className="text-gray-700 text-sm space-y-1">
                  <p>
                    <span className="font-medium">ผู้แจ้ง :</span>{" "}
                    {report.firstname} {report.lastname}
                  </p>
                  <p>
                    <span className="font-medium">ติดต่อ :</span>{" "}
                    {report.phone_number || "-"}
                  </p>
                  <p>
                    <span className="font-medium">ที่อยู่ :</span>{" "}
                    {report.address || "-"}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-medium text-gray-700">รายละเอียด:</p>
                <p className="text-gray-600 text-sm">
                  {report.description || "( รายละเอียดที่เกิดเหตุ )"}
                </p>
              </div>

              <div>
                <p className="font-medium text-gray-700">สถานะรายงาน:</p>
                <p className="text-gray-600 text-sm">{report.status}</p>
              </div>
            </div>
          </div>

          {/* ปุ่มแสดงเฉพาะเมื่อยังไม่สำเร็จ */}
          {buttonText && (
            <button
              onClick={() => handleStatusChange(nextStatus)}
              disabled={updating}
              className={`w-full mt-6 font-semibold py-2.5 rounded-md shadow text-white ${
                report.status === "รอดำเนินการ"
                  ? "bg-orange-500 hover:bg-yellow-500"
                  : "bg-green-500 hover:bg-green-600"
              } ${updating ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {updating ? "กำลังอัปเดต..." : buttonText}
            </button>
          )}
        </div>

        <div className="absolute bottom-0 w-full flex-shrink-0">
          <OfficerNavbar />
        </div>
      </div>
    </div>
  );
};

export default ReportInfo;
