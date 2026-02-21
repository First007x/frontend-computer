// src/app/signup/page.tsx
'use client';
import { useState } from 'react';
import api from '../../lib/axios';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  // 1. เก็บแค่ email และ password
  const [formData, setFormData] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 2. ส่งข้อมูลไปที่ /auth/signup (ต้องมี /auth นำหน้าตาม Controller)
      await api.post('/auth/signup', formData); 
      alert('สมัครสมาชิกสำเร็จ!');
      router.push('/login');
    } catch (err: any) {
      // แสดงข้อความ Error จริงจากหลังบ้านเพื่อให้รู้ว่าติดตรงไหน
      alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการสมัคร');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <form onSubmit={handleSignup} className="p-8 border border-gray-700 rounded-lg shadow-md w-96 bg-[#121212]">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-300">สมัครสมาชิก</h1>
        
        {/* ช่อง Gmail */}
        <input 
          type="email" 
          placeholder="gmail" 
          className="w-full p-2 mb-3 border border-gray-700 rounded bg-transparent text-white" 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
          required 
        />

        {/* ช่อง Password */}
        <input 
          type="password" 
          placeholder="password" 
          className="w-full p-2 mb-6 border border-gray-700 rounded bg-transparent text-white" 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
          required 
        />

        <button className="w-full bg-[#1a237e] text-white py-2 rounded hover:bg-[#283593]">
          ยืนยัน
        </button>
      </form>
    </div>
  );
}