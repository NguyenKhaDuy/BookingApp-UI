import React, { useState } from 'react';
import ForgotEmailForm from '../../../Components/Client/ForgotEmailForm/ForgotEmailForm';
import OtpForm from '../../../Components/Client/OtpForm/OtpForm';
import ResetPasswordForm from '../../../Components/Client/ResetPasswordForm/ResetPasswordForm';
import { useToast } from '../../../Context/ToastContext';
import axios from 'axios';
import LoadingOverlay from '../../../Layouts/LoadingOverLay/LoadingOverlay';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../utils/api';
export default function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Gửi OTP tới email
    const sendOtp = async (userEmail) => {
        if (!userEmail) {
            showToast('Vui lòng nhập email', 'error');
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/forgotpassword/send-otp/?email=${userEmail}`);
            setEmail(userEmail);
            showToast('Mã OTP đã gửi về email của bạn!', 'success');
            setStep(2);
        } catch (err) {
            showToast(err?.response?.data?.message || 'Không gửi được OTP', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Xác thực OTP
    const verifyOtp = async (otp) => {
        if (otp.length !== 6) {
            showToast('OTP phải có 6 số', 'error');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/verify-otp/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ otp }),
            });
            showToast('Xác thực thành công!', 'success');
            setStep(3);
        } catch (err) {
            showToast(err?.response?.data?.message || 'OTP không đúng', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Reset password
    const resetPassword = async (newPassword) => {
        if (!newPassword) {
            showToast('Vui lòng nhập mật khẩu mới', 'error');
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/forgotpassword/`, {
                email: email,
                password: newPassword,
            });

            showToast('Đổi mật khẩu thành công!', 'success');
            setStep(1); // reset về bước đầu
            navigate('/login');
        } catch (err) {
            showToast(err?.response?.data?.message || 'Không đổi được mật khẩu', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
                {step === 1 && <ForgotEmailForm onSendOtp={sendOtp} />}
                {step === 2 && <OtpForm email={email} onVerify={verifyOtp} />}
                {step === 3 && <ResetPasswordForm onReset={resetPassword} />}
            </div>
            <LoadingOverlay show={loading} />
        </div>
    );
}
