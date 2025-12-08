import React, { useState } from 'react';

export default function ResetPasswordForm() {
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Đặt lại mật khẩu</h2>

            {/* New Password */}
            <div className="mb-4">
                <label className="block text-gray-700 mb-1">Mật khẩu mới</label>
                <div className="relative">
                    <input
                        type={showPass ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu mới"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPass(!showPass)}
                    >
                        {showPass ? '👁️' : '👁️‍🗨️'}
                    </button>
                </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
                <label className="block text-gray-700 mb-1">Xác nhận mật khẩu</label>
                <div className="relative">
                    <input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Nhập lại mật khẩu"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={() => setShowConfirm(!showConfirm)}
                    >
                        {showConfirm ? '👁️' : '👁️‍🗨️'}
                    </button>
                </div>
            </div>

            {/* Submit Button */}
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition">
                Xác nhận
            </button>
        </div>
    );
}
