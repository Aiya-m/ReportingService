import React, { useState } from "react";
import userPool from "../UserPool";
import { CognitoUser } from "amazon-cognito-identity-js";
import { useLocation, useNavigate, Navigate } from "react-router-dom";

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

const ConfirmRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    confirmationCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const username = location.state?.username;
    const email = location.state?.email;

    if (!username) {
      setError("No username provided. Please go back to register.");
      setLoading(false);
      return;
    }

    const cognitoUser = new CognitoUser({
      Username: username,
      Email: email,
      Pool: userPool,
    });

    cognitoUser.confirmRegistration(form.confirmationCode, true, (err, result) => {
      setLoading(false);
      if (err) {
        alert(err.message || "Confirmation failed");
        setError(err.message || "Confirmation failed");
        console.error(err);
        return;
      }
      console.log("Confirmation result:", result);
      alert("Account confirmed successfully! Please log in.");
      navigate('/');
    });
  };

  const handleResendCode = () => {
    setLoading(true);
    setError("");
    const username = location.state?.username;
    if (!username) {
      setError("No username provided.");
      setLoading(false);
      return;
    }
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });
    cognitoUser.resendConfirmationCode((err, result) => {
      setLoading(false);
      if (err) {
        setError(err.message || "Error resending code.");
        console.error(err);
      } else {
        console.log("Resend result:", result);
        alert("Confirmation code has been resent to your email.");
      }
    });
  };

  if (!location.state?.username) {
    return <Navigate to="/" replace />;
  }

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
        
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          การยืนยันบัญชี
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          รหัสการยืนยันบัญชีถูกส่งไปที่:
          <strong className="font-medium text-gray-900 block truncate">
            {location.state?.email}
          </strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label htmlFor="confirmationCode" className="sr-only">รหัสการยืนยันบัญชี</label>
            <input 
              id="confirmationCode"
              name="confirmationCode"
              value={form.confirmationCode}
              onChange={handleChange}
              placeholder="Enter 6-digit code"
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center -mt-4">
              {error}
            </p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-orange-500 text-white font-semibold shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-colors disabled:bg-gray-400"
          >
            {loading ? "กำลังยืนยัน..." : "ยืนยันบัญชี"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button 
            onClick={handleResendCode} 
            disabled={loading}
            className="text-sm font-medium text-blue-600 hover:underline focus:outline-none disabled:text-gray-400"
          >
            {loading ? "กำลังส่ง..." : "ส่งรหัสอีกครั้ง"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmRegister;

