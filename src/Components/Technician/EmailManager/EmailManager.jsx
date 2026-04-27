import { Mail, ShieldCheck } from 'lucide-react';
import { useState, useContext, useCallback, useEffect } from 'react';
import OtpForm from '../../../Components/Client/OtpForm/OtpForm';
import { useToast } from '../../../Context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../Context/UserContext';
import getCookie from '../../../utils/getToken';
import LoadingOverlay from '../../../Layouts/LoadingOverLay/LoadingOverlay';
import axios from 'axios';

export default function EmailManager() {
    const { user, setUser } = useContext(UserContext);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [currentEmail, setCurrentEmail] = useState(''); // email lấy từ API
    const [email, setEmail] = useState(''); // email mới để đổi
    const [confirmEmail, setConfirmEmail] = useState('');

    const token = getCookie('token');

    const getTechnicianId = () => {
        const localUser = localStorage.getItem('user');
        if (!localUser) return null;
        return JSON.parse(localUser).id_user;
    };

    const id_user = getTechnicianId();

    // ====== FETCH CURRENT EMAIL ======
    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:8082/api/technician/profile/id=${id_user}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.data?.data) throw new Error('Không có dữ liệu');

            setCurrentEmail(res.data.data.email); // chỉ gán currentEmail
        } catch (err) {
            showToast('Lỗi load email: ' + (err.response?.data?.message || err.message), 'error');
        } finally {
            setLoading(false);
        }
    }, [id_user, token]);

    useEffect(() => {
        if (id_user) fetchProfile();
    }, [fetchProfile, id_user]);

    const isValid = email && confirmEmail && email === confirmEmail && email !== currentEmail;

    // ====== SEND OTP ======
    const handleSendOtp = async () => {
        setLoading(true);
        try {
            await axios.put(
                `http://localhost:8081/api/email`,
                {
                    old_email: currentEmail,
                    new_email: email,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                },
            );

            showToast('OTP đã gửi về email hiện tại', 'success');
            setStep(2);
        } catch (err) {
            showToast('Không thể gửi OTP', 'error');
        } finally {
            setLoading(false);
        }
    };

    // ====== LOGOUT ======
    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    };

    // ====== VERIFY OTP ======
    const verifyOtp = async (otp) => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:8082/api/verify-otp/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ otp }),
            });

            const data = await res.json();
            if (!res.ok) {
                showToast(data.message || 'OTP sai', 'error');
                return;
            }

            showToast('Đổi email thành công!', 'success');
            handleLogout();
            navigate('/login', { replace: true });

            setStep(1);
        } catch {
            showToast('Lỗi xác thực OTP', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (step === 2) return <OtpForm email={currentEmail} onVerify={verifyOtp} />;

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
                        value={currentEmail}
                        readOnly
                        className="mt-1 w-full p-4 rounded-xl border bg-gray-100 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-500">Email mới</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full p-4 rounded-xl border outline-orange-500"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-500">Xác nhận email mới</label>
                    <input
                        type="email"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        className="mt-1 w-full p-4 rounded-xl border outline-orange-500"
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

            <LoadingOverlay show={loading} />
        </div>
    );
}
