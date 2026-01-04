import { useState, useContext } from 'react';
import axios from 'axios';
import { Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../Context/UserContext';
import { useToast } from '../../../Context/ToastContext';


let stompClient = null;

export default function LoginForm() {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext); // Lấy setUser từ context

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
            const res = await axios.post('http://localhost:8081/api/login/', form, { withCredentials: true });

            //LƯU USER INFO
            localStorage.setItem('user', JSON.stringify(res.data));
            setUser(res.data); // cập nhật ngay UI Header

            const roles = res.data.roles || [];

            if (roles.includes('ADMIN')) {
                navigate('/admin/home');
                return;
            }

            if (roles.includes('TECHNICIAN')) {
                navigate('/technician/home');
                return;
            }

            navigate('/');
        } catch (error) {
            showToast('Sai email hoặc mật khẩu', 'error');
        }
    };

    // 🔵 GOOGLE LOGIN
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8081/oauth2/authorization/google';
    };

    return (
        <form className="w-full space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <div className="relative">
                    <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Nhập email của bạn"
                        className="w-full pl-10 pr-4 py-3 border rounded-lg bg-white
                        focus:border-orange-500 focus:ring-2 focus:ring-orange-300
                        outline-none transition"
                        required
                    />
                </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Mật khẩu</label>
                <div className="relative">
                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu"
                        className="w-full pl-10 pr-4 py-3 border rounded-lg bg-white
                        focus:border-orange-500 focus:ring-2 focus:ring-orange-300
                        outline-none transition"
                        required
                    />
                </div>
            </div>

            {/* Login thường */}
            <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600
                text-white py-3 rounded-xl font-semibold text-lg"
            >
                Đăng nhập
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="text-sm text-gray-500">hoặc</span>
                <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* 🔴 GOOGLE LOGIN BUTTON */}
            <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full border flex items-center justify-center gap-3
                py-3 rounded-xl hover:bg-gray-50 transition"
            >
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
                <span className="font-medium">Đăng nhập bằng Google</span>
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

export { stompClient };
