import React, { useState } from "react";
import UserPool from "../UserPool";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { Navigate, useNavigate } from "react-router-dom";

const ConfirmRegister = () => {
  const [form, setForm] = useState({
    confirmationCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });
    
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>

        <input name="confirmationCode" value={form.confirmationCode} onChange={handleChange} placeholder="Code" /><p/>

        <button type="submit">Confirm</button>
      </form>
    </div>
  );
};

export default ConfirmRegister;