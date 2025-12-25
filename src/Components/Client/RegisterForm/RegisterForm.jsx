import { useState } from 'react';
import logo from '../../../assets/logo.png';
import { User, Mail, Phone, Lock } from 'lucide-react';

export default function RegisterForm({ onSendOtp }) {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const inputClass =
        'w-full pl-10 pr-4 py-3 border rounded-lg bg-white ' +
        'focus:border-orange-500 focus:ring-2 focus:ring-orange-300 ' +
        'outline-none transition';

    const iconClass =
        'w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 ' +
        'group-focus-within:text-orange-500 transition';

    return (
        <>
            {/* HEADER */}
            <div className="text-center mb-6">
                <img src={logo} alt="logo" className="w-20 h-20 object-contain mx-auto" />
                <h1 className="text-2xl font-bold mt-4">Đăng ký</h1>
                <p className="text-gray-500 text-sm mt-1">Nhập thông tin để tạo tài khoản mới</p>
            </div>

            {/* FORM INPUTS */}
            <div className="space-y-4">
                {/* Họ tên */}
                <div className="relative group">
                    <User className={iconClass} />
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Họ và tên"
                        value={form.fullName}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                {/* Email */}
                <div className="relative group">
                    <Mail className={iconClass} />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                {/* Số điện thoại */}
                <div className="relative group">
                    <Phone className={iconClass} />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Số điện thoại"
                        value={form.phone}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                {/* Mật khẩu */}
                <div className="relative group">
                    <Lock className={iconClass} />
                    <input
                        type="password"
                        name="password"
                        placeholder="Mật khẩu"
                        value={form.password}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                {/* Xác nhận mật khẩu */}
                <div className="relative group">
                    <Lock className={iconClass} />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Xác nhận mật khẩu"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                {/* BUTTON */}
                <button
                    onClick={() => onSendOtp(form.email)}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg 
                    font-semibold shadow-md hover:bg-orange-600 transition"
                >
                    Đăng ký
                </button>
            </div>
        </>
    );
}
