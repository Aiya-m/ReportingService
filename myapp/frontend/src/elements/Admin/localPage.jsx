import Nav from './Nav'
import DetailPopup from './DetailLayout'

const data = [
    { 
        id: 1, 
        firstname: "Aiyarat", 
        lastname: "Mueankrut",
        citizen_id: "1101101010100", 
        email: "66070325@kmitl.ac.th", 
        username: "taiyaki" 
    }
  ];



function LocalPage(){
    return (
        <div>
            <Nav></Nav>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">รายการบัญชีบุคคลทั่วไป</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-blue-500 text-white">
                                <th className="py-2 px-4 text-left">ลำดับ</th>
                                <th className="py-2 px-4 text-left">หมายเลขบัตรประชาชน</th>
                                <th className="py-2 px-4 text-left">ชื่อจริง</th>
                                <th className="py-2 px-4 text-left">นามสกุล</th>
                                <th className="py-2 px-4 text-left">อีเมล</th>
                                <th className="py-2 px-4 text-left">ชื่อผู้ใช้</th>
                                <th className="py-2 px-4 text-left">รายละเอียด</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                            <tr key={item.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                <td className="py-2 px-4">{item.id}</td>
                                <td className="py-2 px-4">{item.citizen_id}</td>
                                <td className="py-2 px-4">{item.firstname}</td>
                                <td className="py-2 px-4">{item.lastname}</td>
                                <td className="py-2 px-4">{item.email}</td>
                                <td className="py-2 px-4">{item.username}</td>
                                <td className="py-2 px-4"><DetailPopup/></td>
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
