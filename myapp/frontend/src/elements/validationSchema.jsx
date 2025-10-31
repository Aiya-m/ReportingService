import * as Yup from 'yup';

const baseSchema = {
  firstName: Yup.string().required("กรุณากรอกชื่อจริง"),
  lastName: Yup.string().required("กรุณากรอกนามสกุล"),
  email: Yup.string().email("รูปแบบอีเมลไม่ถูกต้อง").required("กรุณากรอกอีเมล"),
  idCard: Yup.string().required("กรุณากรอกหมายเลขบัตรประชาชน"),
  phoneNumber: Yup.string()
    .matches(/^\+66[0-9]{8,9}$/, "รูปแบบเบอร์โทรต้องเป็น +66XXXXXXXXX")
    .required("กรุณากรอกเบอร์โทร"),
  address: Yup.string(),
  username: Yup.string().min(3, "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร").required("กรุณากรอกชื่อผู้ใช้"),
  password: Yup.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร").required("กรุณากรอกรหัสผ่าน"),
  confirmPassword: Yup.string()
    .required("กรุณายืนยันรหัสผ่าน")
    .oneOf(
      [Yup.ref('password'), null],
      "รหัสผ่านไม่ตรงกัน"
    )
};

export const userRegisterSchema = Yup.object().shape(baseSchema);

export const officerRegisterSchema = Yup.object().shape({
  ...baseSchema, 
  idOfficer: Yup.string().required("กรุณากรอกรหัสเจ้าหน้าที่"),
  department: Yup.string().required("กรุณากรอกหน่วยงานที่สังกัด"),
});
