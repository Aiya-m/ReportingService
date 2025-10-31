import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "./loginSchema";
import { AccountContext } from "./Account"

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { authenticate } = useContext(AccountContext);

    const { 
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors
    } = useForm({
        resolver: yupResolver(loginSchema),
    });

  const onSubmit = (data) => {
    setLoading(true);
    const { username, password, email } = data;
    clearErrors("general");

    authenticate(username, password, email)
      .then(data => {
        setLoading(false);
        console.log("Logged in!", data)
        const payload = data.getIdToken().payload;
        const role = payload["custom:Role"];
        if (role === "officer"){
          navigate('/report-incoming');
        } else if (role === 'admin') {
          navigate('/admin-officer')
        } else {
          navigate('/')
        }
        
      })
      .catch(err => {
        setLoading(false);
        console.error("Failed to login", err)
        if (err.name === "UserNotFoundException" || err.name === "NotAuthorizedException") {
          setError("general", { type: "server", message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
        } else if (err.name === "UserNotConfirmedException") {
          setError("general", { type: "server", message: "บัญชีนี้ยังไม่ได้ยืนยันตัวตน" });
        } else {
          setError("general", { type: "server", message: err.message });
        }
        return;
      });
  };

  return (
      <div className="min-h-screen bg-orange-500 flex flex-col justify-center items-center p-4 font-sans">
        
        <h1 className="text-7xl font-bold text-white mb-8">
          ResQ
        </h1>

        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 w-full max-w-md">
          
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            เข้าสู่ระบบ
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {errors.general && (
              <p className="text-center text-red-600 bg-red-100 p-3 rounded-lg -mb-2">
                {errors.general.message}
              </p>
            )}

            <div>
              <label htmlFor="username" className="block font-medium mb-2">
                  ชื่อผู้ใช้
              </label>
              <input
                id="username"
                type="text"
                placeholder="ชื่อผู้ใช้"
                {...register("username")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block font-medium mb-2">
                รหัสผ่าน
              </label>
              <input
                id="password"
                type="password"
                placeholder="รหัสผ่าน"
                {...register("password")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div className="text-right -mt-3 mb-2">
              <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                ลืมรหัสผ่าน?
              </a>
            </div>

            <div className=" flex flex-col sm:flex-row gap-4 pt-2 mb-2 items-center justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-lg bg-orange-500 text-white font-semibold shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-colors disabled:bg-gray-400"
              >
                {loading ? "กำลังโหลด..." : "เข้าสู่ระบบ"}
              </button>
            </div>

            <div className="text-center text-sm pt-1">
              <a href="/register" className="text-blue-600 hover:underline">
                สร้างบัญชีใหม่?
              </a>
            </div>

          </form>
        </div>
      </div>
  );
};

export default Login;
