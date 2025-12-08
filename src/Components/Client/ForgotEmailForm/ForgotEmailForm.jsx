import React, { useState } from 'react';

export default function ForgotEmailForm({ onSendOtp }) {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSendOtp(email);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-4 text-center">Quên mật khẩu</h2>
            <p className="text-gray-600 text-sm text-center mb-6">Nhập email của bạn để nhận mã OTP xác minh</p>

            <div className="mb-4">
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                    type="email"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <button
                type="submit"
                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
            >
                Gửi mã OTP
            </button>
        </form>
    );
}
