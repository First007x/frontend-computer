'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/axios';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // ตรวจสอบสถานะการ Login เมื่อเปิดเว็บครั้งแรก
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        // ต้องเช็คว่าไม่ใช่ string คำว่า "undefined" ด้วย
        if (token && savedUser && savedUser !== "undefined") {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            // 1. ขอ Token จากหลังบ้าน
            const res = await api.post('/auth/signin', { email, password });

            if (res.data.access_token) {
                // 2. เซฟ Token ลงเครื่องก่อน
                localStorage.setItem('token', res.data.access_token);

                // 3. ยิง API ไปขอข้อมูล User (อีเมล, บทบาท) จาก /auth/profile
                // ต้องแนบ Token ไปด้วยเพื่อยืนยันตัวตน
                const profileRes = await api.get('/auth/profile', {
                    headers: { Authorization: `Bearer ${res.data.access_token}` }
                });

                // ข้อมูลจริงๆ จะอยู่ใน profileRes.data
                const userData = profileRes.data;

                // 4. บันทึก User ลงเครื่องและ State
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData); // อัปเดตสถานะให้ Navbar และหน้าสินค้าทำงาน

                // 5. เด้งไปหน้าหลัก
                router.push('/');
            }
        } catch (err: any) {
            console.error("Login Error:", err);
            alert(err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบอีเมลและรหัสผ่าน');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);