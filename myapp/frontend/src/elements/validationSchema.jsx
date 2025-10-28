import * as Yup from 'yup';

export const registerSchema = Yup.object().shape({
    username: Yup.string()
        .required("กรุณากรอกชื่อผู้ใช้"),
        
    email: Yup.string()
        .email("รูปแบบอีเมลไม่ถูกต้อง")
        .required("กรุณากรอกอีเมล"),
    
    password: Yup.string()
        .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
        .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, // ตัวอย่าง: ต้องมีเล็ก, ใหญ่, ตัวเลข
        "รหัสผ่านต้องมีตัวพิมพ์เล็ก, ใหญ่ และตัวเลข"
        )
        .required("กรุณากรอกรหัสผ่าน"),
    
    firstName: Yup.string()
        .required("กรุณากรอกชื่อจริง"),
    
    lastName: Yup.string()
        .required("กรุณากรอกนามสกุล"),
    
    phoneNumber: Yup.string()
        .matches(/^\+[1-9]\d{1,14}$/, "รูปแบบเบอร์โทรไม่ถูกต้อง (ต้องขึ้นด้วย +66)")
        .required("กรุณากรอกเบอร์โทร"),
    
    idCard: Yup.string()
        .min(13, "ต้องเป็นตัวเลข 13 หลักเท่านั้น")
        .required("กรุณากรอกหมายเลขบัตรประชาชน"),
    
     address: Yup.string(), // (ไม่ required)

    idCard: Yup.string()
        .min(13, "กรอกตัวเลข 13 หลักเท่านั้น")
        .required("กรุณากรอกหมายเลขบัตรประชาชน"),

    idOfficer: Yup.string()
        .required("กรุณากรอกหมายเลขเจ้าหน้าที่"),

    department: Yup.string()
        .required("กรุณากรอกหน่วยงานที่สังกัด"),
});