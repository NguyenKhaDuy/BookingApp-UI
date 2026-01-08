import { User, Lock, Settings, Camera, Mail, HelpCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import axios from 'axios';
import avatarDefault from '../../../assets/default-avatar.jpg';
import { useToast } from '../../../Context/ToastContext';

export function ProfileSidebar({ active, setActive, profile, onAvatarUpdated }) {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const { showToast } = useToast();

    const avatarSrc = profile?.avatarBase64 ? `data:image/jpeg;base64,${profile.avatarBase64}` : avatarDefault;

    /* ================= CLICK AVATAR ================= */
    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    /* ================= UPLOAD AVATAR ================= */
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('id_user', user.id_user);
        formData.append('avatar', file);

        try {
            setUploading(true);

            await axios.put('http://localhost:8081/api/customer/profile/avatar/', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            showToast('Cập nhật ảnh đại diện thành công', 'success');
            onAvatarUpdated && onAvatarUpdated();
        } catch (err) {
            showToast('Cập nhật ảnh thất bại', 'error');
        } finally {
            setUploading(false);
        }
    };

    return (
        <aside className="hidden md:flex flex-col w-64 bg-white border rounded-xl shadow p-6 h-fit sticky top-24">
            {/* ================= AVATAR + INFO ================= */}
            <div className="flex flex-col items-center text-center mb-10 relative">
                <div onClick={handleAvatarClick} className="relative cursor-pointer group">
                    <img
                        src={avatarSrc}
                        alt="avatar"
                        className="w-20 h-20 rounded-full border-4 border-orange-500 shadow object-cover"
                    />

                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <Camera className="text-white w-6 h-6" />
                    </div>
                </div>

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className="hidden"
                />

                {uploading && <p className="text-xs text-orange-500 mt-2">Đang tải ảnh...</p>}

                <h3 className="mt-3 text-lg font-semibold">{profile?.full_name || '---'}</h3>
                <p className="text-sm text-gray-500">{profile?.email || ''}</p>
            </div>

            {/* ================= MENU ================= */}
            <nav className="flex flex-col text-gray-700 font-medium">
                {/* PROFILE */}
                <button
                    onClick={() => setActive('profile')}
                    className={`flex items-center gap-3 p-3 rounded-xl mb-2 transition
                    ${active === 'profile' ? 'bg-orange-500 text-white shadow' : 'hover:bg-orange-100'}`}
                >
                    <User className="w-5 h-5" />
                    Thông tin cá nhân
                </button>

                {/* CHANGE EMAIL */}
                <button
                    onClick={() => setActive('email')}
                    className={`flex items-center gap-3 p-3 rounded-xl mb-2 transition
                    ${active === 'email' ? 'bg-orange-500 text-white shadow' : 'hover:bg-orange-100'}`}
                >
                    <Mail className="w-5 h-5" />
                    Đổi email
                </button>

                {/* PASSWORD */}
                <button
                    onClick={() => setActive('password')}
                    className={`flex items-center gap-3 p-3 rounded-xl mb-2 transition
                    ${active === 'password' ? 'bg-orange-500 text-white shadow' : 'hover:bg-orange-100'}`}
                >
                    <Lock className="w-5 h-5" />
                    Đổi mật khẩu
                </button>

                {/* Feedback */}
                <button
                    onClick={() => setActive('help')}
                    className={`flex items-center gap-3 p-3 rounded-xl mb-2 transition
                    ${active === 'help' ? 'bg-orange-500 text-white shadow' : 'hover:bg-orange-100'}`}
                >
                    <HelpCircle className="w-5 h-5" />
                    Trợ giúp
                </button>

                {/* SETTINGS */}
                <button
                    onClick={() => setActive('settings')}
                    className={`flex items-center gap-3 p-3 rounded-xl transition
                    ${active === 'settings' ? 'bg-orange-500 text-white shadow' : 'hover:bg-orange-100'}`}
                >
                    <Settings className="w-5 h-5" />
                    Cài đặt
                </button>
            </nav>
        </aside>
    );
}
