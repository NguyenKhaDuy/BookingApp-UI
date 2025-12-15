import { useState } from 'react';
import axios from 'axios';
import { Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { connectWebSocket } from '../../../utils/stompClient';
// Khai báo stompClient bên ngoài component để nó không bị khởi tạo lại mỗi khi render
let stompClient = null; 

export default function LoginForm() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:8081/api/login/', form);
            const token = res.data.token;

            localStorage.setItem('token', token);
            localStorage.setItem('email', form.email);

            console.log('Đăng nhập thành công:', form.email);

            // // 🌟 Kết nối WebSocket tại Login luôn
            // connectWebSocket(token, (msg) => {
            //     const data = JSON.parse(msg.body);
            //     console.log('📩 [LOGIN] Nhận thông báo:', data);
            // });

            navigate('/technician/home');
        } catch (error) {
            alert('Sai email hoặc mật khẩu!');
        }
    };

    return (
        <form className="w-full space-y-5" onSubmit={handleSubmit}>
           {/* ... (Phần UI giữ nguyên) ... */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <div className="relative">
                    <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Nhập email của bạn"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300"
                        required
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Mật khẩu</label>
                <div className="relative">
                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold text-lg"
            >
                Đăng nhập
            </button>

            <p className="text-center text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-orange-500 font-semibold hover:underline">
                    Đăng ký ngay
                </Link>
            </p>
        </form>
    );
}

// Hàm export này cho phép các component khác sử dụng lại stompClient đã kết nối (nếu cần)
export { stompClient };
