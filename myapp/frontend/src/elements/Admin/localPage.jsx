import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from './Nav'
import DetailPopup from './DetailLayout'

const getStatusText = (status) => {
    if (status === 'Enabled') return 'ยืนยันแล้ว';
    if (status === 'Disabled') return 'ยังไม่ยืนยัน';
    return status;
};

function LocalPage(){
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const Role = 'localpeople'
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/users', {
                params: { isOfficer: Role }
            });

            setUsers(response.data); 
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false); 
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div>
                <Nav />
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">รายการผู้ใช้ทั่วไป</h2>
                    <p>กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Nav></Nav>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">รายการผู้ใช้ทั่วไป</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-orange-500 border border-gray-200 rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-blue-500 text-white">
                                <th className="py-2 px-4 text-left">ลำดับ</th>
                                <th className="py-2 px-4 text-left">ชื่อจริง</th>
                                <th className="py-2 px-4 text-left">นามสกุล</th>
                                <th className="py-2 px-4 text-left">หมายเลขบัตรประชาชน</th>
                                <th className="py-2 px-4 text-left">อีเมล</th>
                                <th className="py-2 px-4 text-left">ชื่อผู้ใช้</th>
                                <th className="py-2 px-4 text-left">สถานะบัญชี</th>
                                <th className="py-2 px-4 text-left">รายละเอียด</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.username} className={index % 2 === 0 ? "bg-gray-100" : "bg-orange-500"}>
                                    <td className="py-2 px-4">{index + 1}</td>
                                    <td className="py-2 px-4">{user.firstname || '-'}</td>
                                    <td className="py-2 px-4">{user.lastname || '-'}</td>
                                    <td className="py-2 px-4">{user.citizen_id || '-'}</td>
                                    <td className="py-2 px-4">{user.email || '-'}</td>
                                    <td className="py-2 px-4">{user.username || '-'}</td>
                                    <td className="py-2 px-4">{getStatusText(user.displayStatus)}</td>
                                    <td className="py-2 px-4">
                                        <DetailPopup user={user} onActionSuccess={fetchUsers} role={Role}/>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default LocalPage;
