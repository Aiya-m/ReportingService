import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BottomNavbar from "./Nav";
import { AccountContext } from "../Account";

const ProfilePage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [phone_number, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const { getUserAttributes, logout } = useContext(AccountContext);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const attributes = await getUserAttributes();
                setUsername(attributes["cognito:username"]);
                setFirstname(attributes["given_name"]);
                setLastname(attributes["family_name"]);
                setPhoneNumber(attributes["phone_number"]);
                setAddress(attributes["custom:address"]);
                console.log("Fetched user attributes:", attributes);
            } catch (err) {
                console.error("Error fetching attributes:", err);
            }
        };

        fetchProfile();
    }, [getUserAttributes]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const fields = [
        { label: "ชื่อผู้ใช้", value: username },
        { label: "ชื่อจริง", value: firstname },
        { label: "นามสกุล", value: lastname },
        { label: "เบอร์โทรศัพท์", value: phone_number },
        { label: "ที่อยู่", value: address },
    ];

    return (
        <div className="flex justify-center bg-gray-200 min-h-screen">
            <div className="relative w-full max-w-sm sm:max-w-md bg-white shadow-lg rounded-lg flex flex-col h-[100vh]">
                <div className="flex items-center bg-orange-500 text-white px-4 py-3">
                    <button onClick={() => navigate(-1)} className="mr-2">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold">ResQ</h1>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                    <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
                        ข้อมูลผู้ใช้
                    </h2>

                    <div className="space-y-4">
                        {fields.map((field, idx) => (
                            <div key={idx} className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                <input
                                    type="text"
                                    value={field.value || ""}
                                    readOnly
                                    className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg p-3 cursor-not-allowed focus:outline-none focus:ring-0 placeholder-gray-400"
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => navigate("/manage-profile")}
                        className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition"
                    >
                        แก้ไขข้อมูลส่วนตัว
                    </button>
                </div>

                <div className="flex-shrink-0">
                    <BottomNavbar />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
