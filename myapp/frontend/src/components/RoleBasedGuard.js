import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAccount } from '../elements/Account';

/**
 * Guard นี้จะตรวจสอบว่า 'user.roles' (ที่เราดึงมาจาก custom:Role)
 * มีสิทธิ์ตรงกับ 'allowedRoles' ที่กำหนดไว้ใน Route หรือไม่
 */
const RoleBasedGuard = ({ allowedRoles }) => {
    // 2. ดึง user ที่ล็อกอินอยู่ (เรามั่นใจว่า user ไม่ null เพราะผ่าน AuthGuard มาแล้ว)
    const { user } = useAccount(); 

    // 3. ตรวจสอบสิทธิ์
    // allowedRoles คือ Array ที่ส่งมาจาก Route (เช่น ['admin', 'officers'])
    // user.roles คือ Array ที่เราสร้างจาก custom:Role (เช่น ['officers'])
    console.log(user.roles)
    const hasAccess = user.roles.some(role => allowedRoles.includes(role));

    if (!hasAccess) {
        // 4. ถ้าไม่มีสิทธิ์, เด้งไปหน้า "ไม่ได้รับอนุญาต"
        return <Navigate to="/" replace />;
    }

    // 5. ถ้ามีสิทธิ์, แสดงหน้าที่ร้องขอ (Outlet)
    return <Outlet />;
};

export default RoleBasedGuard;