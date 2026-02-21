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
    <div className="min-h-screen bg-black text-white p-8">
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-[#121212] p-6 rounded-lg border border-gray-800 shadow-lg">
        <h1 className="text-2xl mb-6 font-bold text-yellow-400">เพิ่มสินค้าใหม่ (Admin)</h1>
        
        {/* ชื่อสินค้า */}
        <label className="block mb-1 text-sm font-medium text-gray-300">ชื่อสินค้า</label>
        <input 
          type="text" 
          placeholder="ใส่ลำดับเครื่อง 01, 02, 03..." 
          onChange={e => setForm({ ...form, name: e.target.value })} 
          className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition" 
          required 
        />

        {/* ราคา */}
        <label className="block mb-1 text-sm font-medium text-gray-300">ราคา (บาท)</label>
        <input 
          type="number" 
          placeholder="0"
          min="0" 
          max="500"
          onChange={e => setForm({ ...form, price: e.target.value })} 
          className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition" 
          required 
        />

        {/* สเปคเครื่อง */}
        <label className="block mb-1 text-sm font-medium text-gray-300">สเปคเครื่อง</label>
        <textarea 
          placeholder="ระบุรายละเอียดสเปค..." 
          onChange={e => setForm({ ...form, spec: e.target.value })} 
          className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition" 
          rows={3} 
        />

        {/* รูปภาพ */}
        <label className="block mb-1 text-sm font-medium text-gray-300">รูปภาพสินค้า</label>
        <input 
          type="file" 
          accept="image/*"
          onChange={e => setFile(e.target.files?.[0] || null)} 
          className="w-full mb-6 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-yellow-400 hover:file:bg-gray-700 transition" 
          required 
        />

        {/* ปุ่มบันทึก */}
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm"
        >
          บันทึกและแสดงสินค้า
        </button>
      </form>
    </div>
  );
}