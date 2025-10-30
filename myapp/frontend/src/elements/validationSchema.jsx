import * as Yup from 'yup';

const baseSchema = {
  firstName: Yup.string().required("กรุณากรอกชื่อจริง"),
  lastName: Yup.string().required("กรุณากรอกนามสกุล"),
  email: Yup.string().email("รูปแบบอีเมลไม่ถูกต้อง").required("กรุณากรอกอีเมล"),
  idCard: Yup.string().required("กรุณากรอกหมายเลขบัตรประชาชน"),
  // (ตัวอย่าง: ทำให้เบอร์โทรต้องขึ้นต้นด้วย +66)
  phoneNumber: Yup.string()
    .matches(/^\+66[0-9]{8,9}$/, "รูปแบบเบอร์โทรต้องเป็น +66XXXXXXXXX")
    .required("กรุณากรอกเบอร์โทร"),
  address: Yup.string(), // (ไม่ required)
  username: Yup.string().min(3, "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร").required("กรุณากรอกชื่อผู้ใช้"),
  password: Yup.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร").required("กรุณากรอกรหัสผ่าน"),
  confirmPassword: Yup.string()
    .required("กรุณายืนยันรหัสผ่าน")
    .oneOf(
      [Yup.ref('password'), null],
      "รหัสผ่านไม่ตรงกัน"
    )
};

// 1. Schema สำหรับผู้ใช้ทั่วไป (User)
export const userRegisterSchema = Yup.object().shape(baseSchema);

// 2. Schema สำหรับเจ้าหน้าที่ (Officer)
export const officerRegisterSchema = Yup.object().shape({
  ...baseSchema, // เอา Schema พื้นฐานมาทั้งหมด
  // และเพิ่มกฎสำหรับช่องของเจ้าหน้าที่
  idOfficer: Yup.string().required("กรุณากรอกรหัสเจ้าหน้าที่"),
  department: Yup.string().required("กรุณากรอกหน่วยงานที่สังกัด"),
});
