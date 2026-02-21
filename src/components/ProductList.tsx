'use client';
import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation'; // 1. นำเข้า useRouter เพื่อทำลิงก์ไปหน้าแก้ไข

export default function ProductList() {
    const [products, setProducts] = useState<any[]>([]);
    const { user } = useAuth();
    const router = useRouter(); // 2. เรียกใช้งาน router

    // ฟังก์ชันดึงข้อมูลจาก NestJS
    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // ฟังก์ชันจองเครื่อง
    const handleBooking = async (productId: string) => {
        if (!user || !user.email) {
            return alert("กรุณาเข้าสู่ระบบก่อนจองครับ");
        }

        try {
            await api.post(`/products/${productId}/book`, {
                email: user.email
            });

            alert("จองสำเร็จ!");
            fetchProducts(); // โหลดข้อมูลใหม่เพื่ออัปเดตสถานะ "ไม่ว่าง"
        } catch (err: any) {
            console.error("Booking Error:", err);
            // แสดง Error ออกมาให้ชัดเจน (ถ้าติด 401 แปลว่าไม่ได้แนบ Token)
            alert("เกิดข้อผิดพลาด: " + (err.response?.data?.message || err.message));
        }
    };

    // ฟังก์ชันลบ
    const handleDelete = async (productId: string) => {
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?')) {
            try {
                await api.delete(`/products/${productId}`);
                alert('ลบสินค้าสำเร็จ');
                fetchProducts();
            } catch (err) {
                alert('ไม่สามารถลบสินค้าได้');
            }
        }
    };

    return (
        // เพิ่ม Container สีดำเข้มสุดๆ เป็นพื้นหลัง
        <div className="min-h-screen bg-[#050b14] p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((item: any) => (
                    // --- Cyberpunk Card ---
                    <div
                        key={item._id}
                        className="relative group overflow-hidden rounded-lg p-4 bg-[#111827] border-2 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-[1.02] transition-all duration-300 ease-out"
                    >
                        {/* Decorative top glowing bar */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* --- Image --- */}
                        <div className="relative rounded-md overflow-hidden mb-3 border border-cyan-500/20 group-hover:border-cyan-500/50 transition-colors duration-300">
                            <img
                                src={`http://localhost:3000/uploads/${item.imageUrl}`}
                                alt={item.name}
                                className="w-full h-48 object-cover hover:contrast-110 transition duration-500"
                            />
                            {/* Subtle scanline overlay on image */}
                            <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSIxIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] opacity-20"></div>
                        </div>

                        {/* --- Title --- */}
                        {/* ใช้ Gradient text + drop-shadow เพื่อความเรืองแสง */}
                        <h2 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">
                            {item.name}
                        </h2>

                        {/* --- Spec --- */}
                        {/* ใช้ font-mono เพื่อให้ดูเป็นดิจิทัล */}
                        <p className="text-sm text-cyan-200/70 font-mono mb-2 line-clamp-2 tracking-wide">
                            <span className="text-cyan-500">SPECS: </span>
                            {item.spec || 'NO_DATA_FOUND'}
                        </p>

                        {/* --- Price --- */}
                        <p className="text-2xl font-bold text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] mb-2 font-mono">
                            {Number(item.price).toLocaleString()} <span className="text-sm text-yellow-200/80">THB</span>
                        </p>

                        {/* --- Status --- */}
                        <p className={`font-bold mb-4 drop-shadow-md ${item.stock
                            ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,1)]'
                            : 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,1)]'
                            }`}>
                            {item.stock ? ' ● SYSTEM READY ' : ' ● OUT OF STOCK '}
                        </p>

                        {/* --- Booking Button --- */}
                        {item.stock && user && (
                            <button
                                onClick={() => handleBooking(item._id)}
                                // ปุ่มไล่สี Neon + เงาแสง
                                className="w-full py-2 rounded-md font-bold uppercase tracking-wider text-cyan-950 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.6)] hover:shadow-[0_0_25px_rgba(6,182,212,1)] transition-all duration-300 relative overflow-hidden group/btn"
                            >
                                <span className="relative z-10">จองเครื่องนี้</span>
                                {/* Glare effect overlay */}
                                <div className="absolute inset-0 h-full w-full scale-0 rounded-md transition-all duration-300 group-hover/btn:scale-100 group-hover/btn:bg-white/20"></div>
                            </button>
                        )}

                        {/* --- Admin Buttons --- */}
                        {user?.role === 'admin' && (
                            <div className="flex gap-3 mt-4 pt-4 border-t border-cyan-500/20">
                                <button
                                    onClick={() => router.push(`/admin/edit-product/${item._id}`)}
                                    className="flex-1 py-2 rounded-md font-bold uppercase tracking-wider text-yellow-950 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 shadow-[0_0_15px_rgba(234,179,8,0.5)] hover:shadow-[0_0_20px_rgba(234,179,8,0.8)] transition-all duration-300"
                                >
                                    แก้ไข
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="flex-1 py-2 rounded-md font-bold uppercase tracking-wider text-red-950 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:shadow-[0_0_20px_rgba(239,68,68,0.8)] transition-all duration-300"
                                >
                                    ลบ
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}