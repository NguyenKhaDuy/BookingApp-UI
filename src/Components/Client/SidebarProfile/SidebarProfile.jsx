// COMPONENT: ProfileSidebar.jsx
import { User, Lock, Settings } from 'lucide-react';

export function ProfileSidebar({ active, setActive }) {
    return (
        <aside className="hidden md:flex flex-col w-64 bg-white border rounded-xl shadow p-6 h-fit sticky top-24">
            <div className="flex flex-col items-center text-center mb-10">
                <img
                    src="https://i.pravatar.cc/150?img=68"
                    className="w-20 h-20 rounded-full border-4 border-orange-500 shadow"
                />
                <h3 className="mt-3 text-lg font-semibold">Nguyễn Văn A</h3>
                <p className="text-sm text-gray-500">nguyenvana@example.com</p>
            </div>

            <nav className="flex flex-col text-gray-700 font-medium">
                <button
                    onClick={() => setActive('profile')}
                    className={`flex items-center gap-3 p-3 rounded-xl mb-2 transition 
                    ${active === 'profile' ? 'bg-orange-500 text-white shadow' : 'hover:bg-orange-100'}`}
                >
                    <User className="w-5 h-5" /> Thông tin cá nhân
                </button>

                <button
                    onClick={() => setActive('password')}
                    className={`flex items-center gap-3 p-3 rounded-xl mb-2 transition 
                    ${active === 'password' ? 'bg-orange-500 text-white shadow' : 'hover:bg-orange-100'}`}
                >
                    <Lock className="w-5 h-5" /> Đổi mật khẩu
                </button>

                <button
                    onClick={() => setActive('settings')}
                    className={`flex items-center gap-3 p-3 rounded-xl mb-2 transition 
                    ${active === 'settings' ? 'bg-orange-500 text-white shadow' : 'hover:bg-orange-100'}`}
                >
                    <Settings className="w-5 h-5" /> Cài đặt
                </button>
            </nav>
        </aside>
    );
}
