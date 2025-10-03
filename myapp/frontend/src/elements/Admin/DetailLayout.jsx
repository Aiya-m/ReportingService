import { useState } from "react";
// import muichiro from '../../img/muichiro_sad.png';

const DetailPopupLayout = ({data}) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
    <div className="flex bg-gray-100">
        {/* ปุ่มเปิด Popup */}
        <button onClick={() => setIsOpen(true)} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            เพิ่มเติม
        </button>

        {/* Popup */}
        {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 pr-10 pl-10 rounded-lg shadow-lg w-150">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">รายละเอียดบัญชี</h2>
                        <button onClick={() => setIsOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="mb-4 text-gray-600">
                        <div className="mt-5 flex justify-between items-end">
                            <img src="/img/muichiro_sad.jpg" alt="Muichiro" width="50%"/>
                            <p>
                                สถานะบัญชี : status
                            </p>
                        </div>
                        <div className="mt-3">
                            <p className="text-xl font-bold">
                                firstname lastname (department)
                            </p>
                            <p>
                                หมายเลขบัตรประชาชน : citizen_id <br />
                                รหัสเจ้าหน้าที่ : officer_id <br />
                            </p>
                            <p>
                                อีเมล : email <br />
                                ชื่อผู้ใช้ : username
                            </p>
                        </div>
                        <div className="flex justify-end items-center">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                                ยืนยันบัญชี
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
    )
}

export default DetailPopupLayout;
