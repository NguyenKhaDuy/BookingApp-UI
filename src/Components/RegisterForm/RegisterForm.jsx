import { useState } from 'react';
import logo from '../../assets/logo.png'

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
                <input
                    type="text"
                    name="fullName"
                    placeholder="Họ và tên"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg bg-white 
                    focus:border-orange-500 focus:ring-2 focus:ring-orange-300 
                    outline-none transition"
                />

                {/* Email */}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg bg-white
                    focus:border-orange-500 focus:ring-2 focus:ring-orange-300 
                    outline-none transition"
                />

                {/* Số điện thoại */}
                <input
                    type="text"
                    name="phone"
                    placeholder="Số điện thoại"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg bg-white
                    focus:border-orange-500 focus:ring-2 focus:ring-orange-300 
                    outline-none transition"
                />

                {/* Mật khẩu */}
                <input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg bg-white
                    focus:border-orange-500 focus:ring-2 focus:ring-orange-300 
                    outline-none transition"
                />

                {/* Xác nhận mật khẩu */}
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Xác nhận mật khẩu"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg bg-white
                    focus:border-orange-500 focus:ring-2 focus:ring-orange-300 
                    outline-none transition"
                />

                {/* BUTTON GỬI OTP */}
                <button
                    onClick={() => onSendOtp(form.email)}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg 
                    font-semibold shadow-md hover:bg-orange-600 transition"
                >
                    Đăng kí
                </button>
            </div>
        </>
    );
}
