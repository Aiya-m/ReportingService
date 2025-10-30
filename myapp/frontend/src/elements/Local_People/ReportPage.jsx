import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import useMutation from "../../hooks/useMutation";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import BottomNavbar from "./Nav";

const validFileType = ['image/png', 'image/jpeg', 'image/png']
const URL = "/images"


const Report = () => {
    const navigate = useNavigate();
    const [fileName, setFileName] = useState('อัพโหลดรูปภาพ');
    const [form, setForm] = useState({
        detail: "",
        phone_num: "",
        address: "",
        agency: "",
        situation_img: "",
    });

    const [error, setError] = useState('');
    const { mutate: uploadImage, isLoading: uploading, error: uploadError } = useMutation({ url: URL })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!validFileType.includes(file.type)) {
            setError("File must be in JPG/PNG format");
            return;
        }

        setError('');

        const form = new FormData();
        form.append('image', file);

        const response = await uploadImage(form);

        setForm((prev) => ({ ...prev, situation_img: response.key }));
        setFileName(file.name);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
    };

    return (
        <div className="flex justify-center bg-gray-200 min-h-screen">
            <div className="relative w-full max-w-sm sm:max-w-md bg-white shadow-lg rounded-lg overflow-y-auto max-h-screen">
                <div className="flex items-center bg-orange-500 text-white px-4 py-3">
                    <button onClick={() => navigate(-1)} className="mr-2">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold">ResQ</h1>
                </div>

                <div className="flex-grow overflow-y-auto">
                    <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
                        <h2 className="font-bold text-gray-800">แจ้งเหตุ</h2>

                        <div>
                            <label className="text-sm text-gray-700">รายละเอียดเหตุ</label>
                            <input
                                type="text"
                                name="detail"
                                value={form.detail}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-700">เบอร์โทรศัพท์</label>
                            <input
                                type="text"
                                name="phone_num"
                                value={form.phone_num}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-700">ที่อยู่</label>
                            <input
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-700">ประเภทอุบัติเหตุ</label>
                            <select
                                name="agency"
                                value={form.agency}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            >
                                <option value="">ปัญหาทั่วไป</option>
                                <option value="ไฟไหม้">ไฟไหม้</option>
                                <option value="อุบัติเหตุท้องถนน">อุบัติเหตุรถ</option>
                                <option value="บาดเจ็บ/ป่วยฉุกเฉินม">บาดเจ็บ/ป่วยฉุกเฉิน</option>
                                <option value="ทะเลาะวิวาท">ทะเลาะวิวาท</option>
                                <option value="สัตว์อันตราย">สัตว์อันตราย</option>
                                <option value="ไฟดับ">ไฟดับ</option>
                                <option value="น้ำไม่ไหล">น้ำไม่ไหล</option>
                                <option value="โจรกรรม">โจรกรรม</option>
                            </select>
                        </div>


                        <div>
                            <label className="text-sm text-gray-700">แนบรูปประกอบ</label>
                            <div className="w-full border rounded-md p-6 mt-1 flex justify-center items-center cursor-pointer">
                                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center text-gray-500">
                                    <ImageIcon size={32} />
                                    <span className="text-xs mt-1">{fileName}</span>
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={uploading}
                            className="w-full bg-orange-500 text-white py-2 rounded-md font-semibold hover:bg-orange-600 transition"
                        >
                            {uploading ? "กำลังอัพโหลด..." : "ยืนยัน"}
                        </button>
                    </form>
                </div>
                <div className="absolute bottom-0 w-full flex-shrink-0">
                    <BottomNavbar />
                </div>
            </div>
        </div>
    );
};

export default Report;