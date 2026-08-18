import { useState, useContext, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { UserContext } from '../../../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../Context/ToastContext';
import getCookie from '../../../utils/getToken';
import OtpForm from '../../../Components/Client/OtpForm/OtpForm';
import LoadingOverlay from '../../../Layouts/LoadingOverLay/LoadingOverlay';

export default function PasswordManager() {
    const { user, setUser } = useContext(UserContext);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentEmail, setCurrentEmail] = useState('');

    // ẨN / HIỆN MẬT KHẨU
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const token = getCookie('token');

    const getTechnicianId = () => {
        const localUser = localStorage.getItem('user');

        if (!localUser) return null;

        return JSON.parse(localUser).id_user;
    };

    const id_user = getTechnicianId();

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);

            const res = await axios.get(`http://localhost:8082/api/technician/profile/id=${id_user}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.data?.data) {
                throw new Error('Không có dữ liệu');
            }

            setCurrentEmail(res.data.data.email);
        } catch (err) {
            showToast('Lỗi load email: ' + (err.response?.data?.message || err.message), 'error');
        } finally {
            setLoading(false);
        }
    }, [id_user, token, showToast]);

    useEffect(() => {
        if (id_user) {
            fetchProfile();
        }
    }, [fetchProfile, id_user]);

    const isValid = oldPassword && newPassword && confirmPassword && newPassword === confirmPassword;

    // GỬI OTP
    const handleSendOtp = async () => {
        try {
            setLoading(true);

            const token = getCookie('token');

            await axios.post(
                'http://localhost:8082/api/changepassword/',
                {
                    old_password: oldPassword,
                    new_password: newPassword,
                    email: currentEmail,
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
            showToast(err.response?.data?.message || 'Không thể gửi OTP', 'error');
        } finally {
            setLoading(false);
        }
    };

    // LOGOUT
    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);

        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    };

    // VERIFY OTP
    const verifyOtp = async (otp) => {
        try {
            setLoading(true);

            const res = await fetch('http://localhost:8082/api/verify-otp/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: currentEmail,
                    otp: otp,
                    type: 'CHANGE_PASSWORD',
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                showToast(data.message || 'OTP không đúng', 'error');
                return;
            }

            showToast('Đổi mật khẩu thành công', 'success');

            handleLogout();

            navigate('/login', {
                replace: true,
            });

            setStep(1);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');

            // Reset trạng thái ẩn/hiện
            setShowOldPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
        } catch (error) {
            console.error(error);

            showToast('Lỗi xác thực OTP', 'error');
        } finally {
            setLoading(false);
        }
    };

    // OTP
    if (step === 2) {
        return <OtpForm email={currentEmail} onVerify={verifyOtp} />;
    }

    return (
        <div className="w-full bg-white shadow rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
                <Lock size={20} className="text-orange-500" />

                <h2 className="text-lg font-semibold">Cập nhật mật khẩu</h2>
            </div>

            {/* MẬT KHẨU CŨ */}
            <label className="block text-sm text-gray-600 mb-1">Mật khẩu cũ</label>

            <div className="relative mb-4">
                <input
                    type={showOldPassword ? 'text' : 'password'}
                    className="
                        w-full
                        p-4
                        pr-12
                        rounded-xl
                        border
                        outline-orange-500
                    "
                    placeholder="Nhập mật khẩu cũ..."
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />

                <button
                    type="button"
                    onClick={() => setShowOldPassword((prev) => !prev)}
                    className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                        hover:text-orange-500
                        transition
                    "
                >
                    {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            {/* MẬT KHẨU MỚI */}
            <label className="block text-sm text-gray-600 mb-1">Mật khẩu mới</label>

            <div className="relative mb-4">
                <input
                    type={showNewPassword ? 'text' : 'password'}
                    className="
                        w-full
                        p-4
                        pr-12
                        rounded-xl
                        border
                        outline-orange-500
                    "
                    placeholder="Nhập mật khẩu mới..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                        hover:text-orange-500
                        transition
                    "
                >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            {/* XÁC NHẬN MẬT KHẨU */}
            <label className="block text-sm text-gray-600 mb-1">Xác nhận mật khẩu mới</label>

            <div className="relative mb-5">
                <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="
                        w-full
                        p-4
                        pr-12
                        rounded-xl
                        border
                        outline-orange-500
                    "
                    placeholder="Nhập lại mật khẩu mới..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                        hover:text-orange-500
                        transition
                    "
                >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            {/* PASSWORD KHÔNG KHỚP */}
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-red-500 -mt-3 mb-3">Mật khẩu không khớp</p>
            )}

            {/* BUTTON */}
            <button
                disabled={!isValid}
                onClick={handleSendOtp}
                className={`
                    w-full
                    py-2
                    rounded-lg
                    flex
                    items-center
                    justify-center
                    gap-2
                    transition

                    ${
                        isValid
                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }
                `}
            >
                Gửi OTP xác nhận
            </button>

            <LoadingOverlay show={loading} />
        </div>
    );
}
