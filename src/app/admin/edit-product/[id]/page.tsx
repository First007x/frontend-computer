'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../lib/axios'; // ถอยหลัง 4 ขั้นกลับไปที่โฟลเดอร์ lib
import { useAuth } from '../../../../context/AuthContext';

export default function EditProductPage() {
    const { id } = useParams(); // รับค่า id ของสินค้าจาก URL
    const router = useRouter();
    const { user, loading } = useAuth();

    // ตัวแปรเก็บข้อมูลฟอร์ม
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState(true);
    const [file, setFile] = useState<File | null>(null);

    // Guard: ถ้าไม่ใช่ Admin ให้เด้งกลับหน้าแรก
    useEffect(() => {
        if (!loading && user?.role !== 'admin') {
            router.push('/');
        }
    }, [user, loading, router]);

    // ดึงข้อมูลสินค้าเดิมมาแสดงในฟอร์มตอนโหลดหน้า
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setName(res.data.name);
                setPrice(res.data.price);
                setStock(res.data.stock);
            } catch (err) {
                console.error(err);
                alert('ไม่พบข้อมูลสินค้านี้');
                router.push('/');
            }
        };
        if (id) fetchProduct();
    }, [id, router]);

    // ฟังก์ชันกดยืนยันการแก้ไข
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // ใช้ FormData แบบเดียวกับตอนเพิ่มสินค้า (เพื่อรองรับการเปลี่ยนรูปภาพ)
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
            formData.append('stock', stock.toString());

            // ถ้ามีการเลือกไฟล์รูปภาพใหม่ ค่อยแนบไป
            if (file) {
                formData.append('image', file);
            }

            // ส่งข้อมูลไปแก้ไขที่ Backend (ปกติใช้ PATCH หรือ PUT)
            await api.patch(`/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}` // กันเหนียว แนบ Token ไปด้วย
                },
            });

            alert('อัปเดตข้อมูลสินค้าสำเร็จ!');
            router.push('/'); // กลับไปหน้าหลัก
        } catch (err: any) {
            alert('แก้ไขไม่สำเร็จ: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return <p className="text-white p-8">กำลังตรวจสอบสิทธิ์...</p>;

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-xl mx-auto bg-[#121212] p-6 rounded-lg border border-gray-800 shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-yellow-400">แก้ไขสินค้า</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* ชื่อสินค้า */}
                    <div>
                        <label className="block text-sm mb-1">ชื่อเครื่องคอมพิวเตอร์</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
                            required
                        />
                    </div>

                    {/* ราคา */}
                    <div>
                        <label className="block text-sm mb-1">ราคา (บาท/ชั่วโมง หรือ บาท/วัน)</label>
                        <input
                            type="number"
                            value={price}
                            min="0"
                            max="500"
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
                            required
                        />
                    </div>

                    {/* สถานะ ว่าง/ไม่ว่าง */}
                    <div>
                        <label className="block text-sm mb-1">สถานะเครื่อง</label>
                        <select
                            value={stock ? 'true' : 'false'}
                            onChange={(e) => setStock(e.target.value === 'true')}
                            className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
                        >
                            <option value="true">ว่าง (เปิดให้จอง)</option>
                            <option value="false">ไม่ว่าง (ปิดจอง)</option>
                        </select>
                    </div>

                    {/* เปลี่ยนรูปภาพ */}
                    <div>
                        <label className="block text-sm mb-1 text-gray-400">อัปโหลดรูปภาพใหม่ (เว้นว่างไว้ถ้าใช้รูปเดิม)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
                        />
                    </div>

                    {/* ปุ่มยืนยัน */}
                    <div className="flex gap-4 mt-4">
                        <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold transition">
                            บันทึกการแก้ไข
                        </button>
                        <button type="button" onClick={() => router.push('/')} className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded font-bold transition">
                            ยกเลิก
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}