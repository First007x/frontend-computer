'use client';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        setIsLoading(true);
        try {
            await login(email, password);
        } catch (error) {
            console.error(error);
            alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050b14] flex items-center justify-center p-6 relative overflow-hidden font-mono">
            {/* Background Glow - ปรับให้เหมือนหน้า Signup */}
            <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="w-full max-w-[400px] z-10 relative">
                <div className="bg-[#111827]/90 backdrop-blur-md border-2 border-white/5 p-12 rounded-3xl shadow-2xl">
                    
                    {/* Header - ปรับให้ SIGNIN ติดกันและใช้สไตล์เดียวกับ REGISTER */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                            GAME<span className="text-blue-500">STORE</span>
                        </h1>
                        <div className="h-1 w-12 bg-blue-600 mx-auto mt-2 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.8)]"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest ml-1 italic">Email</label>
                            <input
                                type="email"
                                placeholder="อีเมลของคุณ"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all placeholder:text-gray-700"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest ml-1 italic">Password</label>
                            <input
                                type="password"
                                placeholder="รหัสผ่านของคุณ"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all placeholder:text-gray-700"
                                required
                            />
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl transition-all font-black mt-4 shadow-xl shadow-blue-900/20 active:scale-[0.97] disabled:opacity-50 uppercase tracking-widest"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    กำลังประมวลผล...
                                </span>
                            ) : 'เข้าสู่ระบบ'}
                        </button>
                    </form>

                    {/* Simple Bottom Link */}
                    <p className="mt-10 text-center text-gray-500 text-[11px] tracking-tight">
                        ยังไม่มีบัญชี?{' '}
                        <Link
                            href="/signup"
                            className="text-white hover:text-blue-400 font-bold transition-colors border-b border-white/10 hover:border-blue-400 pb-0.5"
                        >
                            สมัครที่นี่
                        </Link>
                    </p>
                </div>

                {/* Decorative Footer Line */}
                <div className="mt-6 flex justify-center opacity-20">
                    <div className="text-[10px] text-cyan-500 tracking-[0.5em] uppercase font-bold">ระบบล็อคอินสำหรับผู้มีบัญชี</div>
                </div>
            </div>
        </div>
    );
}