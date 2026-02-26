'use client';
import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProductList() {
    const [products, setProducts] = useState<any[]>([]);
    const { user } = useAuth();
    const router = useRouter();

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

    const handleBooking = async (productId: string) => {
        if (!user || !user.email) {
            return alert("กรุณาเข้าสู่ระบบก่อนจองครับ");
        }

        try {
            await api.post(`/products/${productId}/book`, {
                email: user.email
            });
            alert("จองสำเร็จ!");
            fetchProducts();
        } catch (err: any) {
            alert("เกิดข้อผิดพลาด: " + (err.response?.data?.message || err.message));
        }
    };

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
        <div className="min-h-screen bg-[#050b14] p-8 font-mono relative overflow-hidden">
            {/* พื้นหลังแสง Neon */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

            {/* ส่วนหัว (Header) */}
            <div className="max-w-7xl mx-auto mb-12 border-l-4 border-cyan-500 pl-6">
                <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
                    รายการ<span className="text-cyan-500"> อุปกรณ์</span>
                </h1>
                <p className="text-cyan-500/60 text-sm mt-1 tracking-[0.3em]"> จำนวนเครื่องทั้งหมด {products.length} เครื่อง</p>
            </div>

            {/* ตารางแสดงสินค้า (Grid) */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((item: any) => (
                    <div
                        key={item._id}
                        className="group relative bg-[#111827]/80 backdrop-blur-sm border-2 border-cyan-500/20 rounded-xl p-5 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all duration-500 ease-out flex flex-col"
                    >
                        {/* ไฟสถานะ */}
                        <div className={`absolute top-4 right-4 w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px] ${item.stock ? 'bg-green-400 shadow-green-400' : 'bg-red-500 shadow-red-500'}`}></div>

                        {/* กรอบรูปภาพ */}
                        <div className="relative h-56 w-full rounded-lg overflow-hidden border border-white/5 mb-6 group-hover:border-cyan-500/30 transition-colors">
                            <img
                                src={`http://localhost:3000/uploads/${item.imageUrl}`}
                                alt={item.name}
                                className="w-full h-full object-cover transition duration-700 group-hover:scale-110 group-hover:rotate-1"
                            />
                            {/* เส้น Scanlines บนรูป */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-40"></div>
                        </div>

                        {/* ข้อมูลเนื้อหา */}
                        <div className="flex-1">
                            <h2 className="text-2xl font-black text-white mb-2 group-hover:text-cyan-400 transition-colors truncate">
                                {item.name}
                            </h2>
                            
                            <div className="bg-black/40 p-3 rounded-lg border border-white/5 mb-4">
                                <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mb-1">ข้อมูลจำเพาะทางเทคนิค</p>
                                <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 italic">
                                    {item.spec || 'ไม่ได้ระบุรายละเอียด'}
                                </p>
                            </div>

                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <p className="text-[10px] text-yellow-500/70 font-bold uppercase tracking-widest">ราคาตลาด</p>
                                    <p className="text-3xl font-black text-yellow-400 tracking-tighter">
                                        {Number(item.price).toLocaleString()}<span className="text-sm ml-1 text-yellow-400/60">฿</span>
                                    </p>
                                </div>
                                <p className={`text-[10px] font-bold px-2 py-1 border ${item.stock ? 'border-green-500/50 text-green-400' : 'border-red-500/50 text-red-500'}`}>
                                    {item.stock ? 'สถานะ: พร้อมใช้งาน' : 'สถานะ: สินค้าหมด'}
                                </p>
                            </div>
                        </div>

                        {/* ปุ่มดำเนินการ */}
                        <div className="space-y-3">
                            {item.stock && user && (
                                <button
                                    onClick={() => handleBooking(item._id)}
                                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-400 text-cyan-950 font-black rounded-lg transition-all shadow-[0_4px_0_rgb(8,145,178)] active:shadow-none active:translate-y-1 uppercase tracking-tighter"
                                >
                                    ยืนยันการจองเครื่อง
                                </button>
                            )}

                            {user?.role === 'admin' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => router.push(`/admin/edit-product/${item._id}`)}
                                        className="py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 rounded uppercase transition-all"
                                    >
                                        แก้ไขข้อมูล
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold border border-red-500/20 rounded uppercase transition-all"
                                    >
                                        ลบข้อมูล
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}