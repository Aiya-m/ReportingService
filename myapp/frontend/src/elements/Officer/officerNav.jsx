import React from "react";
import { ClipboardList, Clock, CircleCheckBig } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const OfficerNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-0 left-0 right-0 bg-white border-t shadow-inner flex justify-around items-center py-2 z-50">
      <button
        onClick={() => navigate("/report-incoming")}
        className={`flex flex-col items-center transition ${isActive("/report-incoming") ? "text-orange-500" : "text-gray-500"}`}
      >
        <ClipboardList size={22} />
        <span className="text-xs mt-1">รายงาน</span>
      </button>

      <button
        onClick={() => navigate("/report-in-progress")}
        className={`flex flex-col items-center transition ${isActive("/report-in-progress") ? "text-orange-500" : "text-gray-500"}`}
      >
        <Clock size={22} />
        <span className="text-xs mt-1">กำลังดำเนินการ</span>
      </button>

      <button
        onClick={() => navigate("/report-complete")}
        className={`flex flex-col items-center transition ${isActive("/report-complete") ? "text-orange-500" : "text-gray-500"}`}
      >
        <CircleCheckBig size={22} />
        <span className="text-xs mt-1">เสร็จสิ้นแล้ว</span>
      </button>
    </nav>
  );
};

export default OfficerNavbar;
