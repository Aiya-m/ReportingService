import React from "react";
import { Home, AlertTriangle, List, Plus, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-0 left-0 right-0 bg-white border-t shadow-inner flex justify-around items-center py-2 z-50">
      <button
        onClick={() => navigate("/")}
        className={`flex flex-col items-center transition ${isActive("/") ? "text-orange-500" : "text-gray-500"}`}
      >
        <Home size={22} />
        <span className="text-xs mt-1">หน้าแรก</span>
      </button>

      <button
        onClick={() => navigate("/history-page")}
        className={`flex flex-col items-center transition ${isActive("/history-page") ? "text-orange-500" : "text-gray-500"}`}
      >
        <List size={22} />
        <span className="text-xs mt-1">ประวัติการแจ้งเหตุ</span>
      </button>

      <button
        onClick={() => navigate("/profile")}
        className={`flex flex-col items-center transition ${isActive("/profile") ? "text-orange-500" : "text-gray-500"}`}
      >
        <User size={22} />
        <span className="text-xs mt-1">ข้อมูลส่วนตัว</span>
      </button>
    </nav>
  );
};

export default BottomNavbar;
