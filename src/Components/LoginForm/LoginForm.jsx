import { Mail, Lock } from 'lucide-react';

export default function LoginForm() {
    return (
        <form className="w-full space-y-5">
            {/* Email */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Email</label>

                <div className="relative">
                    <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    <input
                        type="email"
                        placeholder="Nhập email của bạn"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 
                        bg-white shadow-sm focus:border-orange-500 focus:ring-2 
                        focus:ring-orange-300 outline-none transition"
                    />
                </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Mật khẩu</label>

                <div className="relative">
                    <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 
                        bg-white shadow-sm focus:border-orange-500 focus:ring-2 
                        focus:ring-orange-300 outline-none transition"
                    />
                </div>
            </div>

            {/* Login button */}
            <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 
                text-white py-3 rounded-xl font-semibold shadow-md hover:opacity-90 
                transition text-lg"
            >
                Đăng nhập
            </button>

            <p className="text-center text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <a href="/register" className="text-orange-500 font-semibold hover:underline">
                    Đăng ký ngay
                </a>
            </p>
        </form>
    );
}
