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
        <div className="min-h-screen bg-[#050b14] flex items-center justify-center p-8 font-mono relative overflow-hidden">
            {/* Background Neon Ambient */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-xl w-full z-10 relative">
                {/* Header Section */}
                <div className="mb-8 border-l-4 border-yellow-500 pl-6">
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                        แก้ไข<span className="text-yellow-500">สินค้า</span>
                    </h1>
                    <p className="text-yellow-500/60 text-[10px] mt-1 tracking-[0.3em]">● SYSTEM_OVERRIDE // ADMIN_ACCESS_ONLY</p>
                </div>

                <div className="bg-[#111827]/90 backdrop-blur-md border-2 border-yellow-500/20 p-10 rounded-xl shadow-[0_0_50px_rgba(234,179,8,0.05)]">
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        
                        {/* ชื่อสินค้า */}
                        <div className="space-y-2">
                            <label className="block text-[11px] font-bold text-yellow-500/80 uppercase tracking-[0.2em] ml-1">
                                ชื่อเครื่องคอมพิวเตอร์
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-4 bg-black/40 border border-yellow-500/20 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all placeholder:text-gray-700 font-bold"
                                required
                            />
                        </div>

                        {/* ราคา */}
                        <div className="space-y-2">
                            <label className="block text-[11px] font-bold text-yellow-500/80 uppercase tracking-[0.2em] ml-1">
                                ราคา (บาท/ชั่วโมง หรือ บาท/วัน)
                            </label>
                            <input
                                type="number"
                                value={price}
                                min="0"
                                max="500"
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full p-4 bg-black/40 border border-yellow-500/20 rounded-lg text-yellow-400 font-black focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all"
                                required
                            />
                        </div>

                        {/* สถานะ ว่าง/ไม่ว่าง */}
                        <div className="space-y-2">
                            <label className="block text-[11px] font-bold text-yellow-500/80 uppercase tracking-[0.2em] ml-1">
                                สถานะเครื่อง
                            </label>
                            <select
                                value={stock ? 'true' : 'false'}
                                onChange={(e) => setStock(e.target.value === 'true')}
                                className="w-full p-4 bg-black/40 border border-yellow-500/20 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all appearance-none cursor-pointer font-bold"
                            >
                                <option value="true" className="bg-[#111827]">ว่าง (เปิดให้จอง)</option>
                                <option value="false" className="bg-[#111827]">ไม่ว่าง (ปิดจอง)</option>
                            </select>
                        </div>

                        {/* เปลี่ยนรูปภาพ */}
                        <div className="space-y-2">
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">
                                อัปโหลดรูปภาพใหม่ (เว้นว่างไว้ถ้าใช้รูปเดิม)
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="w-full p-4 bg-yellow-500/5 border border-dashed border-yellow-500/20 rounded-lg text-xs text-gray-500 file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-[10px] file:font-black file:bg-yellow-500 file:text-black hover:file:bg-yellow-400 transition-all cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* ปุ่มยืนยัน / ยกเลิก */}
                        <div className="flex gap-4 mt-4">
                            <button 
                                type="submit" 
                                className="flex-1 bg-blue-500 hover:bg-blue-500 text-yellow-950 py-4 rounded-lg font-black uppercase tracking-widest transition-all shadow-[0_4px_0_rgb(29,78,216)] active:shadow-none active:translate-y-1"
                            >
                                บันทึกการแก้ไข
                            </button>
                            <button 
                                type="button" 
                                onClick={() => router.push('/')} 
                                className="flex-1 bg-transparent hover:bg-white/5 text-gray-500 hover:text-white py-4 rounded-lg font-bold border border-white/10 transition-all uppercase text-xs tracking-widest"
                            >
                                ยกเลิก
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer Decor */}
                <div className="mt-8 flex justify-between items-center opacity-30 px-2">
                    <div className="h-[1px] flex-1 bg-yellow-500/50"></div>
                    <span className="text-[9px] text-yellow-500 mx-4 font-bold tracking-[0.3em]">SECURE_CONNECTION_ESTABLISHED</span>
                    <div className="h-[1px] flex-1 bg-yellow-500/50"></div>
                </div>
            </div>
        </div>
    );
}