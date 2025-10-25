import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import UserPool from "../UserPool";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import Nav from './Admin/Nav'

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {username: form.username, email: form.email}

    // ✅ Cognito needs attributes as "CognitoUserAttribute" objects
    const attributes = [
      new CognitoUserAttribute({ Name: "email", Value: form.email }),
      new CognitoUserAttribute({ Name: "given_name", Value: form.firstName }),
      new CognitoUserAttribute({ Name: "family_name", Value: form.lastName }),
      new CognitoUserAttribute({ Name: "phone_number", Value: form.phoneNumber }), // must be in +1234567890 format
    ];

    UserPool.signUp(
      form.username,          // username
      form.password,       // password
      attributes,          // attributes
      null,                // validationData (rarely used)
      (err, data) => {     // ✅ Correct callback
        if (err) {
          console.error("Signup error:", err);
        } else {
          console.log("Signup success:", data);
        }
      }
    );

    navigate('/ConfirmRegister', { state: userData })
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav/>
      <div className="flex justify-center py-12 px-4">
        <div className="rounded-lg shadow-lg p-8 sm:p-10 bg-white w-full max-w-lg">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
            สร้างบัญชีผู้ใช้
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">
                ชื่อผู้ใช้ :
              </label>
              <input 
                id="username"
                name="username" 
                value={form.username} 
                onChange={handleChange} 
                placeholder="ชื่อผู้ใช้" 
                type="text" 
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-400 focus:border-orange-400 focus:ring-2 block w-full p-2.5"
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                รหัสผ่าน :
              </label>
              <input 
                id="password"
                name="password" 
                type="password" 
                value={form.password} 
                onChange={handleChange} 
                placeholder="รหัสผ่าน" 
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-400 focus:border-orange-400 focus:ring-2 block w-full p-2.5"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                  อีเมล :
                </label>
                <input 
                  id="email"
                  name="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  placeholder="อีเมล" 
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-400 focus:border-orange-400 focus:ring-2 block w-full p-2.5"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-700">
                  เบอร์โทรศัพท์ :
                </label>
                <input 
                  id="phoneNumber"
                  name="phoneNumber" 
                  value={form.phoneNumber} 
                  onChange={handleChange} 
                  placeholder="+66123456789" 
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-400 focus:border-orange-400 focus:ring-2 block w-full p-2.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-700">
                  ชื่อจริง :
                </label>
                <input 
                  id="firstName"
                  name="firstName" 
                  value={form.firstName} 
                  onChange={handleChange} 
                  placeholder="ชื่อจริง" 
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-400 focus:border-orange-400 focus:ring-2 block w-full p-2.5"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-700">
                  นามสกุล :
                </label>
                <input 
                  id="lastName"
                  name="lastName" 
                  value={form.lastName} 
                  onChange={handleChange} 
                  placeholder="นามสกุล" 
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-400 focus:border-orange-400 focus:ring-2 block w-full p-2.5"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-colors duration-200"
            >
              สมัครสมาชิก
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Register;