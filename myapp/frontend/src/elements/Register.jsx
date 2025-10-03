import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import UserPool from "../UserPool";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";

const Register = () => {
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

    const navigate = useNavigate();
    const userData = {username: form.username}

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
    <div>
      <form onSubmit={handleSubmit}>

        <input name="username" value={form.username} onChange={handleChange} placeholder="Username" /><p/>
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" /><p/>
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" /><p/>
        <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Phone (+123...)" /><p/>
        <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" /><p/>
        <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" /><p/>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Register;