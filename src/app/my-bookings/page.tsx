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
        <div className="p-8 bg-black min-h-screen text-gray-300">
            <h1 className="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-2">
                ประวัติการจองของฉัน
            </h1>

            {myBookings.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-gray-700 rounded-lg">
                    <p>คุณยังไม่มีประวัติการจองในขณะนี้</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {myBookings.map((b: any) => (
                        <div key={b._id} className="p-4 bg-[#121212] border border-gray-800 rounded-lg flex justify-between items-center hover:border-blue-900 transition">
                            <div>
                                <p className="text-blue-400 font-semibold text-lg">
                                    {b.productId?.name || 'เครื่องคอมพิวเตอร์'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    จองเมื่อ: {new Date(b.bookedAt).toLocaleString('th-TH')}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="px-3 py-1 bg-green-900 text-green-300 border border-green-800 rounded-full text-xs font-bold shadow-sm">
                                    จองสำเร็จ
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}