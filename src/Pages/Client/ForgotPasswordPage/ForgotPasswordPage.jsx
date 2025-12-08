import React, { useState } from 'react';
import ForgotEmailForm from '../../../Components/Client/ForgotEmailForm/ForgotEmailForm';
import OtpForm from '../../../Components/Client/OtpForm/OtpForm';
import ResetPasswordForm from '../../../Components/Client/ResetPasswordForm/ResetPasswordForm';

export default function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');

    const sendOtp = (userEmail) => {
        if (!userEmail) return alert('Vui lòng nhập email');

        setEmail(userEmail);
        alert('Mã OTP đã gửi về email của bạn!');
        setStep(2);
    };

    const verifyOtp = (otp) => {
        if (otp.length !== 6) {
            return alert('OTP phải có 6 số');
        }

        alert('Xác thực thành công!');
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
