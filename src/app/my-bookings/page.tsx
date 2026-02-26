'use client';
import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function MyBookingsPage() {
    const [myBookings, setMyBookings] = useState([]);
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
            return;
        }

        const fetchMyBookings = async () => {
            try {
                const token = localStorage.getItem('token');

                // ระบบป้องกัน: ถ้าไม่มี Token เลย ให้กลับไป Login ใหม่
                if (!token) {
                    router.push('/login');
                    return;
                }

                const res = await api.get('/products/bookings', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const filtered = res.data.filter((b: any) => b.customerEmail === user?.email);
                setMyBookings(filtered);
            } catch (err: any) {
                console.error("Fetch Error:", err);

                // 🔴 จุดสำคัญที่เพิ่มเข้ามา: ถ้าหลังบ้านฟ้อง 401 (หมดอายุ/ไม่ถูกต้อง)
                if (err.response?.status === 401) {
                    alert("เซสชันการเข้าสู่ระบบหมดอายุ กรุณาล็อกอินใหม่อีกครั้งครับ");
                    localStorage.removeItem('token'); // ลบทิ้ง
                    localStorage.removeItem('user');  // ลบทิ้ง
                    window.location.href = '/login';  // บังคับรีเฟรชไปหน้า Login
                }
            }
        };

        if (user) fetchMyBookings();
    }, [user, loading, router]);

    if (loading) return <p className="text-center p-10 text-white">กำลังโหลดข้อมูล...</p>;

    return (
        <div className="min-h-screen bg-[#050b14] p-8 font-mono relative overflow-hidden">
            {/* เอฟเฟกต์แสงพื้นหลัง */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

            {/* ส่วนหัวของหน้า (Header Section) */}
            <div className="max-w-4xl mx-auto mb-10 border-l-4 border-cyan-500 pl-6">
                <h1 className="text-4xl font-black text-white italic tracking-tighter">
                    ประวัติการ<span className="text-cyan-500">_จอง</span>
                </h1>
                <p className="text-cyan-500/60 text-sm mt-1 tracking-[0.3em]">
                    รายการทั้งหมด {myBookings.length} รายการ
                </p>
            </div>

            <div className="max-w-4xl mx-auto z-10 relative">
                {myBookings.length === 0 ? (
                    <div className="text-center py-32 border-2 border-dashed border-cyan-500/20 rounded-2xl bg-[#111827]/50 backdrop-blur-sm">
                        <div className="mb-4 text-cyan-500/30 inline-block">
                            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <p className="text-gray-500 tracking-[0.2em] uppercase text-sm">ไม่พบประวัติการใช้งานในระบบ</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {myBookings.map((b: any) => (
                            <div
                                key={b._id}
                                className="group p-6 bg-[#111827]/80 border-2 border-cyan-500/10 rounded-xl flex justify-between items-center hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all duration-300 relative overflow-hidden"
                            >
                                {/* ตัวอักษร ID พื้นหลัง */}
                                <div className="absolute -left-2 top-1/2 -translate-y-1/2 text-cyan-500/5 text-6xl font-black italic pointer-events-none group-hover:text-cyan-500/10 transition-colors uppercase">     
                                </div>

                                <div className="relative z-10 flex items-center gap-6">
                                    {/* ไอคอนแสดงผล */}
                                    <div className="w-12 h-12 rounded bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>

                                    <div>
                                        <p className="text-white font-black text-xl tracking-tight group-hover:text-cyan-400 transition-colors">
                                            {b.productId?.name || 'ไม่พบข้อมูลเครื่อง'}
                                        </p>
                                        <p className="text-[10px] text-cyan-500/50 uppercase tracking-widest font-bold mt-1">
                                            วันที่จอง: <span className="text-gray-400 font-mono italic">{new Date(b.bookedAt).toLocaleString('th-TH')}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right relative z-10">
                                    <div className="flex flex-col items-end">
                                        <span className="flex items-center gap-2 px-4 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-[10px] font-black tracking-widest uppercase shadow-[0_0_10px_rgba(74,222,128,0.1)]">
                                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                            จองสำเร็จ
                                        </span>
                                        <p className="text-[9px] text-gray-600 mt-2 font-mono uppercase">รหัสการสั่งซื้อ: {b._id.slice(0, 8)}...</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}