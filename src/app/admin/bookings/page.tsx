'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/axios'; // แก้ Path เป็น ../../
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function MyBookingHistory() {
  const [bookings, setBookings] = useState([]);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ระบบป้องกัน: ถ้าโหลดเสร็จแล้วแต่ไม่มี User จริงๆ ให้กลับไป Login
    if (!loading && (!user || user === "undefined")) {
      router.push('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await api.get('/products/bookings'); 
        
        // กรองข้อมูล: แสดงเฉพาะรายการที่อีเมลตรงกับผู้ใช้ที่ล็อกอินอยู่
        const myData = res.data.filter((item: any) => 
            item.customerEmail === user?.email
        );
        setBookings(myData);
      } catch (err) { 
        console.error("Fetch bookings failed", err); 
      }
    };

    // มั่นใจว่ามี user และ email ก่อนค่อยดึงข้อมูล
    if (user?.email) fetchBookings();
  }, [user, loading, router]);

  if (loading) return <p className="text-center p-10 text-white">กำลังโหลดข้อมูล...</p>;

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 text-white">ประวัติการจองของฉัน</h1>
        <p className="text-gray-400 mb-6 text-sm">ตรวจสอบรายการจองคอมพิวเตอร์ของคุณที่นี่</p>
        
        <div className="border-t border-gray-800 pt-6">
          {bookings.length === 0 ? (
            <div className="text-center py-20 bg-[#121212] rounded-lg border border-dashed border-gray-700">
                <p className="text-gray-500">ไม่พบประวัติการจองในบัญชี {user?.email}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {bookings.map((b: any) => (
                <div key={b._id} className="p-5 bg-[#121212] rounded-xl border border-gray-800 flex justify-between items-center hover:border-blue-900 transition-colors">
                  <div>
                    <h3 className="text-lg font-bold text-blue-400">
                        {b.productId?.name || 'ขออภัย: ข้อมูลเครื่องนี้ถูกลบแล้ว'}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                        วันที่จอง: {new Date(b.bookedAt).toLocaleString('th-TH')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-green-900/30 text-green-400 border border-green-800 rounded-full text-xs font-semibold">
                      จองสำเร็จ
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}