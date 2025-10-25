import React, { useState } from "react";
import userPool from "../UserPool";
import { CognitoUser } from "amazon-cognito-identity-js";
import { useLocation, useNavigate, Navigate } from "react-router-dom";

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
      navigate('/') 
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Confirm Your Account
        </h2>
        
        <p className="text-sm text-gray-600 text-center mb-6">
          A confirmation code was sent to:{" "}
          <strong className="font-medium text-gray-900">
            {location.state?.email}
          </strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label htmlFor="confirmationCode" className="sr-only">Confirmation Code</label>
            <input 
              id="confirmationCode"
              name="confirmationCode"
              value={form.confirmationCode}
              onChange={handleChange}
              placeholder="Enter 6-digit code"
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Confirming..." : "Confirm"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button 
            onClick={handleResendCode} 
            disabled={loading}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Resend Code"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmRegister;