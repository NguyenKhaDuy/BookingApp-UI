import React, { useState } from 'react';
import ForgotEmailForm from '../../../Components/Client/ForgotEmailForm/ForgotEmailForm';
import OtpForm from '../../../Components/Client/OtpForm/OtpForm';
import ResetPasswordForm from '../../../Components/Client/ResetPasswordForm/ResetPasswordForm';
import { useToast } from '../../../Context/ToastContext';

export default function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const { showToast } = useToast();

    const sendOtp = (userEmail) => {
        if (!userEmail) {
            showToast('Vui lòng nhập email', 'error');
            return;
        }

        setEmail(userEmail);
        showToast('Mã OTP đã gửi về email của bạn!', 'success');
        setStep(2);
    };

    const verifyOtp = (otp) => {
        if (otp.length !== 6) {
            showToast('OTP phải có 6 số', 'error');
        }
        showToast('Xác thực thành công!', 'success');
        setStep(3); // 👉 chuyển sang form reset password
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
                {step === 1 && <ForgotEmailForm onSendOtp={sendOtp} />}
                {step === 2 && <OtpForm email={email} onVerify={verifyOtp} />}
                {step === 3 && <ResetPasswordForm />}
            </div>
        </div>
    );
}
