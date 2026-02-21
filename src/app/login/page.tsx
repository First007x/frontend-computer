'use client';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // ตรวจสอบ path ให้ตรงกับโปรเจกต์คุณ

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // บังคับไม่ให้หน้าเว็บรีเฟรชตอนกดปุ่ม
        
        // ตรวจสอบว่ากรอกข้อมูลครบไหม
        if (!email || !password) {
            alert('กรุณากรอกอีเมลและรหัสผ่าน');
            return;
        }

        // เรียกใช้ฟังก์ชัน login จาก AuthContext
        await login(email, password);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-sm p-8 border border-gray-700 rounded-lg bg-[#121212] shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-white text-center">Login</h1>
                
                {/* ต้องใช้แท็ก <form> และมี onSubmit */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 bg-transparent border border-gray-600 rounded text-white"
                            required 
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-transparent border border-gray-600 rounded text-white"
                            required 
                        />
                    </div>
                    {/* ปุ่มต้องเป็น type="submit" */}
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition font-bold mt-2"
                    >
                        เข้าสู่ระบบ
                    </button>
                </form>
            </div>
        </div>
    );
}