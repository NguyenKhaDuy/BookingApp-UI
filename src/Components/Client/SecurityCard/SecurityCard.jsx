import { ShieldCheck } from 'lucide-react';
import { useState, useContext } from 'react';
import axios from 'axios';
import OtpForm from '../OtpForm/OtpForm';
import { useToast } from '../../../Context/ToastContext';
import { UserContext } from '../../../Context/UserContext';
import getCookie from '../../../utils/getToken';

export default function ProfilePassword({profile}) {
    const { setUser } = useContext(UserContext);
    const { showToast } = useToast();
    const [step, setStep] = useState(1);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const isValid = oldPassword && newPassword && confirmPassword && newPassword === confirmPassword;

    /* ================= SEND OTP ================= */
    const handleSendOtp = async () => {
        try {
            const token = getCookie('token');

            await axios.post(
                'http://localhost:8081/api/changepassword/',
                {
                    old_password: oldPassword,
                    new_password: newPassword,
                    email: profile.email, // ✅ lấy từ UserContext
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                },
            );

            showToast('OTP đã được gửi về email', 'success');
            setStep(2);
        } catch (err) {
            showToast('Không thể gửi OTP', 'error');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    };

    /* ================= VERIFY OTP ================= */
    const verifyOtp = async (otp) => {
        try {
            const res = await fetch('http://localhost:8081/api/verify-otp/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ otp }),
            });

            const data = await res.json();

            if (!res.ok) {
                showToast(data.message || 'OTP không đúng', 'error');
                return;
            }

            showToast('Đổi mật khẩu thành công', 'success');
            setStep(1);

            handleLogout();

            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch {
            showToast('Lỗi xác thực OTP', 'error');
        }
    };

    /* ================= RENDER ================= */
    if (step === 2) {
        return <OtpForm email={profile.email} onVerify={verifyOtp} />;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-500" />
                Đổi mật khẩu
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="text-sm text-gray-500">Mật khẩu hiện tại</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="mt-1 w-full p-3 border rounded-xl"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-500">Mật khẩu mới</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1 w-full p-3 border rounded-xl"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-500">Nhập lại mật khẩu</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 w-full p-3 border rounded-xl"
                    />
                </div>

                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-sm text-red-500">Mật khẩu không khớp</p>
                )}
            </div>

            <button
                disabled={!isValid}
                onClick={handleSendOtp}
                className={`mt-6 w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2
                ${
                    isValid
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
                <ShieldCheck className="w-5 h-5" />
                Đổi mật khẩu
            </button>
        </div>
    );
}
