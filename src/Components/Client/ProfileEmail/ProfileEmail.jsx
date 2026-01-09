import { Mail, ShieldCheck } from 'lucide-react';
import { useState, useContext } from 'react';
import axios from 'axios';
import OtpForm from '../OtpForm/OtpForm';
import { useToast } from '../../../Context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../Context/UserContext';
import getCookie from '../../../utils/getToken';

export default function ProfileEmail({ profile, onEmailUpdated }) {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const { setUser } = useContext(UserContext);
    const [confirmEmail, setConfirmEmail] = useState('');
    const { showToast } = useToast();
    const navigate = useNavigate();

    const isValid = email && confirmEmail && email === confirmEmail && email !== profile?.email;

    /* ================= SEND OTP ================= */
    const handleSendOtp = async () => {
        try {
            const token = getCookie('token');

            await axios.put(
                'http://localhost:8081/api/customer/email',
                {
                    old_email: profile.email,
                    new_email: email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true, // ⚠️ session
                },
            );

            showToast('OTP đã được gửi về email hiện tại', 'success');
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

            showToast('Cập nhật email thành công!', 'success');

            // reload profile ở component cha
            onEmailUpdated && onEmailUpdated();

            // logout
            handleLogout();

            // quay về trang login
            navigate('/login', { replace: true });

            // (tuỳ chọn) reset step
            setStep(1);
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
                <Mail className="w-5 h-5 text-orange-500" />
                Cập nhật email
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="text-sm text-gray-500">Email hiện tại</label>
                    <input
                        value={profile?.email || ''}
                        readOnly
                        className="mt-1 w-full p-4 rounded-xl border border-gray-300 outline-orange-500 bg-gray-100 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-500">Email mới</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full p-4 rounded-xl border border-gray-300 outline-orange-500"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-500">Xác nhận email mới</label>
                    <input
                        type="email"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        className="mt-1 w-full p-4 rounded-xl border border-gray-300 outline-orange-500"
                    />
                </div>

                {email && confirmEmail && email !== confirmEmail && (
                    <p className="text-sm text-red-500">Email xác nhận không khớp</p>
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
                Lưu email mới
            </button>
        </div>
    );
}
