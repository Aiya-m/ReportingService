import { useMemo } from 'react';

// เช็คในเบราว์เซอร์มี Token เก็บอยู่ไหม
export const useAuth = () => {
  const token = localStorage.getItem('token');

  // ใช้ useMemo เพื่อไม่ให้คำนวณใหม่ทุกครั้งที่ re-render
  // ถ้า token มีค่า (ไม่ใช่ null หรือ undefined) ให้ถือว่า "อาจจะ" ล็อกอินแล้ว
  const isLoggedIn = useMemo(() => !!token, [token]);

  return { isLoggedIn, token };
};