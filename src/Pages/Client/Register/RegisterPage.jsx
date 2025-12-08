import React, { Fragment, useState } from 'react';
import RegisterForm from '../../../Components/Client/RegisterForm/RegisterForm';
import OtpForm from '../../../Components/Client/OtpForm/OtpForm';
export default function Register() {
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

        alert('Xác thực thành công! Tạo tài khoản hoàn tất.');
    };
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
                {step === 1 && <RegisterForm onSendOtp={sendOtp} />}
                {step === 2 && <OtpForm email={email} onVerify={verifyOtp} />}
            </div>
        </div>
    );
}
