// src/app/signup/page.tsx
'use client';
import { useState } from 'react';
import api from '../../lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/signup', formData); 
      alert('สมัครสมาชิกสำเร็จ!');
      router.push('/login');
    } catch (err: any) {
      alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการสมัคร');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] flex items-center justify-center p-6 relative overflow-hidden font-mono">
      {/* Background Glow - ปรับสีให้เข้ากับธีมหลัก */}
      <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-[400px] z-10 relative">
        <div className="bg-[#111827]/90 backdrop-blur-md border-2 border-white/5 p-12 rounded-3xl shadow-2xl">
          
          {/* Header - แก้ไขให้ REGIS กับ TER ติดกันแล้ว */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
              REGIS<span className="text-blue-500">TER</span>
            </h1>
            <div className="h-1 w-12 bg-blue-600 mx-auto mt-2 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.8)]"></div>
          </div>
          
          <form onSubmit={handleSignup} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest ml-1 italic">Email</label>
              <input 
                type="email" 
                placeholder="อีเมลของคุณ" 
                className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all placeholder:text-gray-700" 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required 
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest ml-1 italic">Password</label>
              <input 
                type="password" 
                placeholder="รหัสผ่านของคุณ" 
                className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all placeholder:text-gray-700" 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
              />
            </div>

            {/* Submit Button */}
            <button 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl transition-all font-black mt-4 shadow-xl shadow-blue-900/20 active:scale-[0.97] disabled:opacity-50 uppercase tracking-widest"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  กำลังสร้างบัญชี...
                </span>
              ) : 'ยืนยันการสมัครใช้งาน'}
            </button>
          </form>

          {/* Back to Login */}
          <p className="mt-10 text-center text-gray-500 text-[11px] tracking-tight">
            มีบัญชีอยู่แล้ว?{' '}
            <Link href="/login" className="text-white hover:text-blue-400 font-bold transition-colors border-b border-white/10 hover:border-blue-400 pb-0.5">
              เข้าสู่ระบบที่นี่
            </Link>
          </p>
        </div>

        {/* Decorative Footer Line */}
        <div className="mt-6 flex justify-center opacity-20">
          <div className="text-[10px] text-cyan-500 tracking-[0.5em] uppercase font-bold">ระบบสมัครการใช้งาน</div>
        </div>
      </div>
    </div>
  );
}