import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  username: Yup.string()
    .required("กรุณากรอกชื่อผู้ใช้"),
    
  password: Yup.string()
    .required("กรุณากรอกรหัสผ่าน"),
});
