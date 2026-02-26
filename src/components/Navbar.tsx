'use client';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="flex justify-between items-center p-4 bg-[#050b14]/80 backdrop-blur-md text-white sticky top-0 z-50 border-b-2 border-cyan-500/30 shadow-[0_4px_20px_rgba(6,182,212,0.15)] font-mono">
            {/* Logo / ลิงก์หน้าแรก */}
            <Link href="/" className="group flex items-center gap-2">
                <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:rotate-90 transition-transform duration-300">
                    <span className="text-black font-black text-xl">G</span>
                </div>
                <span className="font-black text-2xl tracking-tighter italic text-white group-hover:text-cyan-400 transition-colors">
                    GAME<span className="text-cyan-500">STORE</span>
                </span>
            </Link>

            <div className="flex gap-8 items-center">
                {user ? (
                    <>
                        {/* 1. ลิงก์เมนูหลัก */}
                        <div className="flex gap-6 items-center text-xs font-bold tracking-widest uppercase">
                            <Link href="/" className="text-gray-400 hover:text-cyan-400 transition-all hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                                [ หน้าหลัก ]
                            </Link>

                            <Link href="/my-bookings" className="text-cyan-500 hover:text-cyan-300 transition-all flex items-center gap-2 group">
                                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
                                [ ประวัติการจอง ]
                            </Link>
                        </div>

                        {/* 2. ส่วนควบคุมสำหรับ Admin */}
                        {user.role === 'admin' && (
                            <div className="flex gap-4 border-l-2 border-white/10 pl-6 ml-2">
                                <Link href="/admin/add-product" className="text-yellow-500 hover:text-yellow-300 transition-all text-xs font-bold uppercase tracking-tighter bg-yellow-500/10 px-3 py-1.5 rounded border border-yellow-500/20">
                                    + เพิ่มสินค้า
                                </Link>
                            </div>
                        )}

                        {/* 3. ข้อมูลผู้ใช้และปุ่มออกจากระบบ */}
                        <div className="flex items-center gap-4 ml-4 bg-black/40 border border-white/5 p-1.5 pl-4 rounded-full">
                            <div className="flex flex-col items-end leading-none">
                                <span className="text-[10px] text-cyan-400 font-black mb-1">{user.email.split('@')[0].toUpperCase()}</span>
                                <span className={`text-[8px] px-1 rounded font-bold ${user.role === 'admin' ? 'bg-red-500 text-white' : 'bg-cyan-500/20 text-cyan-500'}`}>
                                    {user.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งาน'}
                                </span>
                            </div>

                            <button
                                onClick={logout}
                                className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-full text-[10px] font-black transition-all border border-red-500/20 uppercase tracking-tighter"
                            >
                                ออกจากระบบ
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* 4. ส่วนสำหรับผู้เยี่ยมชม */}
                        <div className="flex gap-6 items-center text-xs font-bold uppercase tracking-widest">
                            <Link href="/login" className="text-gray-400 hover:text-white transition-all">
                                เข้าสู่ระบบ
                            </Link>
                            <Link href="/signup" className="relative px-6 py-2 bg-cyan-600 hover:bg-cyan-400 text-cyan-950 font-black transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] group overflow-hidden">
                                <span className="relative z-10">สมัครสมาชิก</span>
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </nav>
    )
}