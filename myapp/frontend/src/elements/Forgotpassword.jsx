import React, { useState } from "react";
import { CognitoUser } from "amazon-cognito-identity-js";
import Pool from "../UserPool";
import { useNavigate } from "react-router-dom";

const BackIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={2.5} 
        stroke="currentColor" 
        className="w-6 h-6 text-white"
    >
        <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M15.75 19.5L8.25 12l7.5-7.5" 
        />
    </svg>
);

const ForgotPassword = () => {
    const [stage, setStage] = useState(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const getUser = () => {
        return new CognitoUser({
        Username: email,
        Pool
        });
    };

    const sendCode = event => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        getUser().forgotPassword({
        onSuccess: data => {
            console.log("onSuccess:", data);
            setLoading(false);
        },
        onFailure: err => {
            console.error("onFailure:", err);
            setLoading(false);
            setError(err.message || "ไม่พบอีเมลนี้ในระบบ");
        },
        inputVerificationCode: data => {
            console.log("Input code:", data);
            setLoading(false);
            setStage(2);
        }
        });
    };

    const resetPassword = event => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
        console.error("Passwords are not the same");
        setError("รหัสผ่านใหม่ไม่ตรงกัน");
        return;
        }

        setLoading(true);
        getUser().confirmPassword(code, password, {
        onSuccess: data => {
            console.log("onSuccess:", data);
            setLoading(false);
            setSuccess("เปลี่ยนรหัสผ่านสำเร็จ!");

            setTimeout(() => navigate('/login'), 2000);
        },
        onFailure: err => {
            console.error("onFailure:", err);
            setLoading(false);
            setError(err.message || "รหัสยืนยันไม่ถูกต้อง");
        }
        });
    };

    return (
        <div className="min-h-screen bg-orange-500 p-4 font-sans">

            <div className="relative flex items-center justify-center mb-6 h-10">
            <button 
                type="button" 
                onClick={() => navigate(-1)}
                className="absolute left-0 bg-white/30 rounded-full p-2 shadow-md hover:bg-white/50 transition"
            >
                <BackIcon />
            </button>
            <h1 className="text-4xl font-bold text-white">
                ResQ
            </h1>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 w-full max-w-md mx-auto">
                {stage === 1 && (
                    <>
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
                        ลืมรหัสผ่าน ?
                    </h2>
                    <p className="text-gray-600 text-center mb-6">
                        กรุณากรอกอีเมลที่ลงทะเบียน
                    </p>

                        <form onSubmit={sendCode} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block font-medium mb-2">
                                    อีเมล
                                </label>
                                <input
                                id="email"
                                type="email"
                                placeholder="อีเมลผู้ใช้"
                                    value={email}
                                    onChange={event => setEmail(event.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                                />
                            </div>

                            {error && <p className="text-center text-red-600">{error}</p>}
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full py-3 px-4 rounded-lg bg-orange-500 text-white font-semibold shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-colors disabled:bg-gray-400"
                                >
                                {loading ? "กำลังส่ง..." : "ส่งอีเมล"}
                                </button>

                            <p className="text-xs text-gray-500 text-center pt-2">
                                ระบบจะส่งรหัสผ่านสำหรับรีเซ็ตรหัสผ่านให้ผ่านทางอีเมล
                            </p>
                        </form>
                    </>
                )}

                {stage === 2 && (
                    <>
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
                            ตั้งรหัสผ่านใหม่
                        </h2>
                        <p className="text-gray-600 text-center mb-6">
                            กรอกรหัสยืนยันที่ได้รับจากอีเมล
                        </p>

                        <form onSubmit={resetPassword} className="space-y-5">
                        <div>
                            <label htmlFor="code" className="block font-medium mb-2">
                                รหัสยืนยัน
                            </label>
                            <input 
                            id="code"
                            placeholder="รหัสยืนยัน"
                            value={code} 
                            onChange={event => setCode(event.target.value)} 
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block font-medium mb-2">
                                รหัสผ่านใหม่
                            </label>
                            <input
                            id="password"
                            type="password"
                            placeholder="รหัสผ่านใหม่"
                                value={password}
                                onChange={event => setPassword(event.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block font-medium mb-2">
                                ยืนยันรหัสผ่านใหม่
                            </label>
                            <input
                            id="confirmPassword"
                            type="password"
                            placeholder="ยืนยันรหัสผ่านใหม่"
                                value={confirmPassword}
                                onChange={event => setConfirmPassword(event.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                            />
                        </div>

                        {error && <p className="text-center text-red-600">{error}</p>}
                        {success && <p className="text-center text-green-600">{success}</p>}
                            <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                            >
                            {loading ? "กำลังเปลี่ยน..." : "เปลี่ยนรหัสผ่าน"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;