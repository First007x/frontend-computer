// src/lib/axios.ts
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000', // เช็คพอร์ตหลังบ้านให้ตรง
});

// เพิ่ม Interceptor เพื่อยัด Token อัตโนมัติ
api.interceptors.request.use(
    (config) => {
        // ดึง Token จากเครื่อง
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        // ถ้ามี Token ให้ยัดใส่ Header เลย
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;