import React, { useState } from "react";
import UserPool from "../UserPool";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import Nav from '../elements/Admin/Nav'

const Login = () => {
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
  };

  return (
    <div>
      <Nav/>
      <div className="rounded shadow-lg p-10 justify-self-center mt-25 w-lg">
        <h1 className="text-xl font-bold text-center">เข้าสู่ระบบ</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex">
            <label htmlFor="username">ชื่อผู้ใช้ : </label>
            <input name="username" value={form.username} onChange={handleChange} placeholder="Username" type="text" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"/>
          </div>
          <div>
            <label htmlFor="email">อีเมล : </label>
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"/>
          </div>
          <div>
            <label htmlFor="password">รหัสผ่าน : </label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"/>
          </div>
          <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Phone (+123...)" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"/>
          <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"/>
          <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"/>

          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Login;