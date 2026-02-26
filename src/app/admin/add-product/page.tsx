'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../../lib/axios'; // เรียกใช้ axios instance ที่เราสร้างไว้

export default function AddProductPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // --- 1. ประกาศ State สำหรับข้อมูลใน Form ---
  const [form, setForm] = useState({ name: '', price: '', spec: '' });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    // ระบบป้องกัน: ถ้าโหลดเสร็จแล้ว แต่ไม่ใช่ Admin ให้ดีดกลับหน้าแรก
    if (!loading && user?.role !== 'admin') {
      router.push('/');
    }
  }, [user, loading, router]);

  // --- 2. ฟังก์ชันส่งข้อมูล (Submit) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ต้องใช้ FormData เพราะมีการอัปโหลดไฟล์รูปภาพ
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('spec', form.spec);
    if (file) formData.append('image', file); // 'image' ต้องตรงกับชื่อใน NestJS Interceptor

    try {
      await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('เพิ่มสินค้าสำเร็จ!');
      router.push('/'); // เพิ่มเสร็จแล้วกลับหน้าหลัก
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการเพิ่มสินค้า');
    }
  };

  // ระหว่างรอเช็คสิทธิ์ ให้แสดงข้อความ Loading
  if (loading || user?.role !== 'admin') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">กำลังตรวจสอบสิทธิ์...</p>
      </div>
    );
  }

return (
        <div className="min-h-screen bg-[#050b14] flex items-center justify-center p-8 font-mono relative overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute top-[-5%] left-[-5%] w-96 h-96 bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-5%] right-[-5%] w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-xl w-full z-10 relative">
                {/* Header Section */}
                <div className="mb-8 border-l-4 border-yellow-500 pl-6">
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase shadow-yellow-500/20">
                        เพิ่มสินค้าใหม่ <span className="text-yellow-500">(Admin)</span>
                    </h1>
                </div>

                <form 
                    onSubmit={handleSubmit} 
                    className="bg-[#111827]/90 backdrop-blur-md border-2 border-yellow-500/20 p-10 rounded-xl shadow-[0_0_50px_rgba(234,179,8,0.05)] space-y-6"
                >
                    {/* ชื่อสินค้า */}
                    <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-yellow-500/80 uppercase tracking-[0.2em] ml-1">ชื่อสินค้า</label>
                        <input 
                            type="text" 
                            placeholder="ใส่ลำดับเครื่อง 01, 02, 03..." 
                            onChange={e => setForm({ ...form, name: e.target.value })} 
                            className="w-full p-4 bg-black/40 border border-yellow-500/20 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-all placeholder:text-gray-700" 
                            required 
                        />
                    </div>

                    {/* ราคา */}
                    <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-yellow-500/80 uppercase tracking-[0.2em] ml-1">ราคา (บาท)</label>
                        <input 
                            type="number" 
                            placeholder="0"
                            min="0" 
                            max="500"
                            onChange={e => setForm({ ...form, price: e.target.value })} 
                            className="w-full p-4 bg-black/40 border border-yellow-500/20 rounded-lg text-yellow-400 font-bold focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all placeholder:text-gray-700" 
                            required 
                        />
                    </div>

                    {/* สเปคเครื่อง */}
                    <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-yellow-500/80 uppercase tracking-[0.2em] ml-1">สเปคเครื่อง</label>
                        <textarea 
                            placeholder="ระบุรายละเอียดสเปค..." 
                            onChange={e => setForm({ ...form, spec: e.target.value })} 
                            className="w-full p-4 bg-black/40 border border-yellow-500/20 rounded-lg text-gray-300 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all placeholder:text-gray-700 resize-none italic" 
                            rows={3} 
                        />
                    </div>

                    {/* รูปภาพ */}
                    <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1">รูปภาพสินค้า</label>
                        <div className="relative">
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={e => setFile(e.target.files?.[0] || null)} 
                                className="w-full p-4 bg-yellow-500/5 border border-dashed border-yellow-500/20 rounded-lg text-xs text-gray-500 file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-[10px] file:font-black file:bg-yellow-500 file:text-black hover:file:bg-yellow-400 transition-all cursor-pointer" 
                                required 
                            />
                        </div>
                    </div>

                    {/* ปุ่มบันทึก */}
                    <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white py-4 rounded-lg font-black uppercase tracking-widest transition-all shadow-[0_4px_0_rgb(29,78,216)] active:shadow-none active:translate-y-1 mt-4"
                    >
                        บันทึกและแสดงสินค้า
                    </button>
                </form>

                {/* Footer Decor */}
                <div className="mt-8 flex justify-between items-center opacity-30 px-2">
                    <div className="h-[1px] flex-1 bg-yellow-500/50"></div>
                    <span className="text-[9px] text-yellow-500 mx-4 font-bold tracking-[0.3em]">ระบบเพิ่มสินค้าเฉพาะแอดมิน</span>
                    <div className="h-[1px] flex-1 bg-yellow-500/50"></div>
                </div>
            </div>
        </div>
    );
}