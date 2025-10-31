import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import UserPool from "../UserPool";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userRegisterSchema, officerRegisterSchema } from "./validationSchema";
import RoleToggle, { ACCOUNT_TYPES }  from "./RoleToggle";
import axios from 'axios';

const BackIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={2.5} 
    stroke="currentColor" 
    className="w-6 h-6 text-orange-500"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M15.75 19.5L8.25 12l7.5-7.5" 
    />
  </svg>
);

// const ToggleSwitch = ({ checked, onChange }) => (
//   <button
//     type="button"
//     onClick={onChange}
//     className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
//       checked ? 'bg-orange-600' : 'bg-gray-300'
//     }`}
//   >
//     <span
//       className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
//         checked ? 'translate-x-6' : 'translate-x-1'
//       }`}
//     />
//   </button>
// );

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("localpeople");
  const [isOfficer, setIsOfficer] = useState(false);

  const currentSchema = isOfficer ? officerRegisterSchema : userRegisterSchema;

  const { 
    register,           // (A) ฟังก์ชันสำหรับผูก input
    handleSubmit,       // (B) ฟังก์ชันสำหรับหุ้ม onSubmit ของ form
    formState: { errors }, // (C) Object ที่เก็บ error ทั้งหมด (มาจาก Yup)
    setError,           // (D) ฟังก์ชันสำหรับตั้ง error จาก Server (Cognito)
    reset,
  } = useForm({
    resolver: yupResolver(currentSchema), // (E) บอกให้ใช้กฎจาก Yup
  });

  useEffect(() => {
    if (isOfficer) {
      setRole("officer");
    } else {
      setRole("localpeople");
    }
    reset();
  }, [isOfficer, reset]);

  // const handleToggleChange = () => {
  //   setIsOfficer(prev => !prev);
  // };
  const handleRoleChange = (newRole) => {
    console.log("Selected role:", newRole);
    setIsOfficer(newRole === ACCOUNT_TYPES.OFFICER);
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setForm((prev) => ({ ...prev, [name]: value }));

  //   // เคลียร์ Error เมื่อผู้ใช้เริ่มพิมพ์แก้
  //   if (errors[name]) {
  //     setErrors((prev) => ({ ...prev, [name]: null }));
  //   }
  // };
  

  const onSubmit = (data) => {
    setLoading(true);
    console.log("Submitting data for:", isOfficer ? "Officer" : "User", data);
    const userData = {username: data.username, email: data.email, role: role}

    // Cognito needs attributes as "CognitoUserAttribute" objects
    const attributes = [
      new CognitoUserAttribute({ Name: "email", Value: data.email }),
      new CognitoUserAttribute({ Name: "given_name", Value: data.firstName }),
      new CognitoUserAttribute({ Name: "family_name", Value: data.lastName }),
      new CognitoUserAttribute({ Name: "phone_number", Value: data.phoneNumber }),
      new CognitoUserAttribute({ Name: "custom:address", Value: data.address}),
      new CognitoUserAttribute({ Name: "custom:citizen_id", Value: data.idCard}),
      new CognitoUserAttribute({ Name: "custom:Role", Value: role}),
    ];

    if (isOfficer) {
      attributes.push(
        new CognitoUserAttribute({ Name: "custom:officer_id", Value: data.idOfficer}),
        new CognitoUserAttribute({ Name: "custom:department", Value: data.department})
      );
    }

    UserPool.signUp(
      data.username, 
      data.password,
      attributes,
      null,
      async (err, result) => {
        setLoading(false);
        if (err) {
          console.error("Signup error:", err);
          console.log(err)
          if (err.code === "UsernameExistsException") {
            setError("username", { type: "server", message: "ชื่อผู้ใช้นี้มีคนใช้แล้ว" });
          } else if (err.message.toLowerCase().includes("password")) {
            setError("password", { type: "server", message: "รหัสผ่านไม่ตรงตามนโยบาย (เช่น สั้นไป)" });
          } else {
            setError("general", { type: "server", message: err.message });
          }
          return;
        }

        console.log("Signup success:", result);
        navigate('/ConfirmRegister', { state: userData });
      }
    );

  };

  return (
    <div className="min-h-screen bg-orange-500 p-4 sm:p-6 pb-20 font-sans">
      <div className="relative flex items-center justify-center mb-4 h-10">
        <button type="button" onClick={() => navigate(-1)} className="absolute left-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition">
          <BackIcon />
        </button>
        <h1 className="text-4xl font-bold text-white">
          ResQ
        </h1>
      </div>

      <h2 className="text-2xl font-bold text-white text-center mb-4">
        {isOfficer ? "ลงทะเบียนบัญชีเจ้าหน้าที่" : "ลงทะเบียนบัญชีผู้ใช้"}
      </h2>

      <div className="flex items-center justify-center space-x-3 mb-6">
        {/* <span className="font-medium text-white">ผู้ใช้ทั่วไป</span>
        <ToggleSwitch checked={isOfficer} onChange={handleToggleChange} />
        <span className="font-medium text-white">เจ้าหน้าที่</span> */}
        <RoleToggle 
          onToggleChange={handleRoleChange}
          currentType={isOfficer ? ACCOUNT_TYPES.OFFICER : ACCOUNT_TYPES.CITIZEN}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg mx-auto space-y-6">
        {errors.general && (
          <p className="text-center text-white bg-red-600 p-3 rounded-lg -mb-2">
            {errors.general.message} 
          </p>
        )}
        <div className="bg-orange-100 rounded-2xl p-6 sm:p-8 shadow-lg">
          <h3 className="text-xl font-bold mb-5">
            ข้อมูลส่วนตัว
          </h3>
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="firstName" className="block font-medium mb-2">
                  ชื่อจริง
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  {...register("firstName")}
                  placeholder="ชื่อจริง"
                  className="w-full bg-white rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="block font-medium mb-2">
                  นามสกุล
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  {...register("lastName")}
                  placeholder="นามสกุล"
                  className="w-full bg-white rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block font-medium mb-2">
                อีเมล
              </label>
              <input
                type="email"
                id="email"
                name="email"
                {...register("email")}
                placeholder="อีเมลผู้ใช้"
                className="w-full bg-white rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="idCard" className="block font-medium mb-2">
                หมายเลขบัตรประชาชน
              </label>
              <input
                type="text"
                id="idCard"
                name="idCard"
                {...register("idCard")}
                placeholder="หมายเลขบัตรประชาชน"
                className="w-full bg-white rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.idCard && <p className="text-red-600 text-sm mt-1">{errors.idCard.message}</p>}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block font-medium mb-2">
                เบอร์โทร (เช่น +6681234567)
              </label>
              <input
                type="tel"
                id="phoneNumber"
                {...register("phoneNumber")}
                placeholder="+6681234567"
                className="w-full bg-white rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.phoneNumber && <p className="text-red-600 text-sm mt-1">{errors.phoneNumber.message}</p>}
            </div>

            <div>
              <label htmlFor="address"  className="block font-medium mb-2">
                ที่อยู่ (ไม่จำเป็น)
              </label>
              <textarea
                id="address"
                name="address"
                {...register("address")}
                placeholder="ที่อยู่"
                rows="3"
                className="w-full bg-white rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>}
            </div>

            {isOfficer && (
              <>
                <hr className="border-t-2 border-orange-200" />
                <div>
                  <label htmlFor="idOfficer" className="block font-medium mb-2">
                    รหัสประจำตัวเจ้าหน้าที่
                  </label>
                  <input
                    type="text"
                    id="idOfficer"
                    {...register("idOfficer")}
                    placeholder="รหัสประจำตัวเจ้าหน้าที่"
                    className="w-full bg-white rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.idOfficer && <p className="text-red-600 text-sm mt-1">{errors.idOfficer.message}</p>}
                </div>

                <div>
                  <label htmlFor="department" className="block font-medium mb-2">
                    หน่วยงานที่สังกัด
                  </label>
                  <input
                    type="text"
                    id="department"
                    {...register("department")}
                    placeholder="หน่วยงานที่สังกัด"
                    className="w-full bg-white rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {errors.department && <p className="text-red-600 text-sm mt-1">{errors.department.message}</p>}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-orange-100 rounded-2xl p-6 sm:p-8 shadow-lg">
          <h3 className="text-xl font-bold mb-5">
            ข้อมูลผู้ใช้
          </h3>
          <div className="space-y-5">
            <div>
              <label htmlFor="username" className="block font-medium mb-2">
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                id="username"
                name="username"
                {...register("username")}
                placeholder="ชื่อผู้ใช้"
                className="w-full bg-white rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                required
                className="w-full bg-white rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <div>
                <label htmlFor="confirmPassword" className="block font-medium mb-2">
                  ยืนยันรหัสผ่าน
                </label>
                <input
                id="confirmPassword"
                type="password"
                placeholder="ยืนยันรหัสผ่าน"
                {...register("confirmPassword")}
                required
                className="w-full bg-white rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.confirmPassword && ( <p className="text-sm text-red-600 mt-1"> {errors.confirmPassword.message} </p> )}
            </div>
          </div>
        </div>
        <div className="flex justify-center pt-4">
          <button type="submit" disabled={loading} className="w-full max-w-xs bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-offset-orange-500">
            {loading ? "กำลังลงทะเบียน..." : "ลงทะเบียนสมาชิก"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;