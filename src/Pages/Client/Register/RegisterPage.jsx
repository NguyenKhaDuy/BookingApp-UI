import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../../../Components/Client/RegisterForm/RegisterForm';
import OtpForm from '../../../Components/Client/OtpForm/OtpForm';

export default function Register() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const onRegisterSuccess = (userEmail) => {
        setEmail(userEmail);
        setStep(2);
    };

    const verifyOtp = async (otp) => {
        if (otp.length !== 6) {
            return alert('OTP phải có 6 số');
        }

        const res = await fetch('http://localhost:8081/api/verify-otp/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ otp }),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message);
            setStep(1);
            navigate('/register')
            return;
        } else {
            alert('🎉 Đăng ký thành công!');
            navigate('/login'); // ✅ CHUYỂN SANG TRANG LOGIN
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
                {step === 1 && <RegisterForm onRegisterSuccess={onRegisterSuccess} />}
                {step === 2 && <OtpForm email={email} onVerify={verifyOtp} />}
            </div>
        </div>
    );
}
