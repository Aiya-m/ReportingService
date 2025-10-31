import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from 'axios';

const getStatusText = (status) => {
    if (status === 'Enabled') return 'ยืนยันแล้ว';
    if (status === 'Disabled') return 'ยังไม่ยืนยัน';
    return status;
};

const DetailPopupLayout = ({ user, onActionSuccess, role }) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isConfirming, setIsLoading] = useState(false);
    const [confirmError, setConfirmError] = useState(null);
    const [apiError, setApiError] = useState(null);

    console.log("This is in popup",role)

    const changeStatus = async () => {
        setIsLoading(true);
        setConfirmError(null);

        try {
            await axios.post('http://localhost:5000/api/confirm-user', {
                username: user.username
            });

            alert('ยืนยันบัญชีสำเร็จ!');
            onActionSuccess();
            setIsOpen(false);

        } catch (error) {
            console.error("Error confirming user:", error);
            setConfirmError('เกิดข้อผิดพลาด: ' + error.response.data.error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteAccount = async () => {
        const isConfirmed = window.confirm(
            `คุณแน่ใจหรือไม่ว่าต้องการลบบัญชี: ${user.username}?`
        );

        if (!isConfirmed) {
            return;
        }

        setIsLoading(true);
        setApiError(null);

        try {
            await axios.post('/api/delete-user', {
                username: user.username 
            });

            alert('ลบบัญชีสำเร็จ!');
            onActionSuccess();
            setIsOpen(false);

        } catch (error) {
            console.error("Error deleting user:", error);
            setApiError(error.response?.data?.error || 'Failed to delete');
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="flex bg-gray-100">
            <button onClick={() => setIsOpen(true)} className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-800">
                เพิ่มเติม
            </button>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800">
                    <div className="bg-white p-6 pr-10 pl-10 rounded-lg shadow-lg w-150">
                        <div className="flex justify-between items-center">
                            <h2 className="text-4xl font-bold">รายละเอียดบัญชี</h2>
                            <button onClick={() => setIsOpen(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="mb-4 text-gray-600">
                            <div className="mt-3 mb-1">
                                <p className="text-2xl font-bold mb-2">
                                    {user.firstname || '-'} {user.lastname || '-'} 
                                    {role === 'officer' &&
                                        <span> ({user.department})</span>
                                    }
                                </p>
                                <p className="font-bold">ข้อมูลส่วนตัว</p>
                                <p className="mb-2">
                                    หมายเลขบัตรประชาชน : {user.citizen_id} <br />
                                    {role === 'officer' &&
                                        <p>รหัสเจ้าหน้าที่ : {user.officer_id} <br /></p>
                                    }
                                    เบอร์ติดต่อ : {user.phone} <br />
                                    ที่อยู่ : <br /> {user.address}
                                </p>
                                <p className="font-bold">ข้อมูลผู้ใช้</p>
                                <p>
                                    อีเมล : {user.email} <br />
                                    ชื่อผู้ใช้ : {user.username} <br />
                                    สถานะอีเมล : {user.status}
                                </p>
                            </div>
                            <div className="flex mb-4 justify-end items-end">
                                <p>
                                    สถานะบัญชี : {getStatusText(user.displayStatus)}
                                </p>
                            </div>
                            <div className="flex justify-end items-center">
                                {user.displayStatus !== 'Enabled' && (
                                    <>
                                        <button
                                            onClick={changeStatus}
                                            disabled={isConfirming}
                                            className=" mx-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full disabled:bg-gray-400"
                                        >
                                            {isConfirming ? 'กำลังดำเนินการ...' : 'ยืนยันบัญชี'}
                                        </button>
                                        {confirmError && <p className="text-red-500 text-sm ml-4">{confirmError}</p>}
                                    </>
                                )}
                                <button
                                    onClick={deleteAccount}
                                    disabled={isConfirming}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full disabled:bg-gray-400"
                                >
                                    {isConfirming ? 'กำลังดำเนินการ...' : 'ลบบัญชี'}
                                </button>
                                {apiError && <p className="text-red-500 text-sm ml-4">{apiError}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DetailPopupLayout;
