'use client';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-lg border-b border-gray-800">
            {/* Logo / Home Link */}
            <Link href="/" className="font-bold text-xl text-blue-400 hover:text-blue-300 transition">
                Computer Booking
            </Link>
            
            <div className="flex gap-6 items-center">
                {user ? (
                    <>
                        {/* 1. ลิงก์สำหรับทุกคนที่เข้าสู่ระบบแล้ว (ทั้ง User และ Admin) */}
                        <div className="flex gap-4">
                            <Link href="/" className="hover:text-blue-400 transition">หน้าหลัก</Link>
                            
                            {/* ลิงก์ไปหน้าประวัติส่วนตัวที่เพิ่งแก้ไขไป */}
                            <Link href="/my-bookings" className="hover:text-blue-400 transition text-green-400">
                                ประวัติการจองของฉัน
                            </Link>
                        </div>

                        {/* 2. ส่วนเสริมเฉพาะ Admin (คั่นด้วยเส้นแบ่งเพื่อความชัดเจน) */}
                        {user.role === 'admin' && (
                            <div className="flex gap-4 border-l border-gray-700 pl-4">
                                <Link href="/admin/add-product" className="text-yellow-400 hover:text-yellow-200 transition">
                                    + เพิ่มสินค้า
                                </Link>
                                {/* <Link href="/admin/bookings" className="text-yellow-400 hover:text-yellow-200 transition">
                                    จัดการการจองทั้งหมด
                                </Link> */}
                            </div>
                        )}

                        {/* 3. ข้อมูลผู้ใช้และปุ่ม Logout */}
                        <div className="flex items-center gap-4 ml-2 bg-gray-800 p-2 rounded-lg">
                            <div className="flex flex-col items-end">
                                <span className="text-white text-xs font-semibold">{user.email}</span>
                                <span className="text-[10px] uppercase text-gray-400 font-bold">{user.role}</span>
                            </div>
                            <button 
                                onClick={logout} 
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-bold transition shadow-md"
                            >
                                ออกจากระบบ
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* 4. ส่วนที่แสดงสำหรับคนยังไม่ Login (Guest) */}
                        <Link href="/login" className="text-gray-300 hover:text-white transition">เข้าสู่ระบบ</Link>
                        <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-bold transition shadow-lg">
                            สมัครใช้งาน
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}