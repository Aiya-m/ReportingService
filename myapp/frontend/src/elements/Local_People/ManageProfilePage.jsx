import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BottomNavbar from "./Nav";
import { AccountContext } from "../Account";

const ManageProfilePage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [phone_number, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

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
            } catch (err) {
                console.error("Error fetching attributes:", err);
            }
        };

        fetchProfile();
    }, [getUserAttributes]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = { username, firstname, lastname, phone_number, address };

        try {
            const response = await fetch("http://localhost:5000/api/manage-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.success) {
                navigate("/profile");
            } else {
                alert("Failed to update profile");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { label: "ชื่อจริง", value: firstname, setter: setFirstname },
        { label: "นามสกุล", value: lastname, setter: setLastname },
        { label: "เบอร์โทรศัพท์", value: phone_number, setter: setPhoneNumber },
        { label: "ที่อยู่", value: address, setter: setAddress },
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
                    <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">ข้อมูลผู้ใช้</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">ชื่อผู้ใช้</label>
                            <input
                                type="text"
                                value={username}
                                readOnly
                                className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg p-3 cursor-not-allowed focus:outline-none focus:ring-0 placeholder-gray-400"
                            />
                        </div>

                        {fields.map((field, idx) => (
                            <div key={idx} className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                <input
                                    type="text"
                                    value={field.value || ""}
                                    onChange={(e) => field.setter(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                                />
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full mt-6 font-semibold py-3 rounded-xl shadow-md transition ${loading
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
                                }`}
                        >
                            {loading ? "กำลังบันทึก..." : "ยืนยันการแก้ไข"}
                        </button>
                    </form>
                </div>

                <div className="flex-shrink-0">
                    <BottomNavbar />
                </div>
            </div>
        </div>
    );
};

export default ManageProfilePage;
