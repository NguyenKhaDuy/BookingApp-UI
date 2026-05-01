import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../../../Components/Client/RegisterForm/RegisterForm';
import OtpForm from '../../../Components/Client/OtpForm/OtpForm';
import { useToast } from '../../../Context/ToastContext';
import LoadingOverlay from '../../../Layouts/LoadingOverLay/LoadingOverlay';
import { API_BASE_URL } from '../../../utils/api';
import { type } from '@testing-library/user-event/dist/type';

export default function Register() {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
     const { showToast } = useToast();
    const navigate = useNavigate();

    const onRegisterSuccess = (userEmail) => {
        setEmail(userEmail);
        setStep(2);
    };

    const verifyOtp = async (otp) => {
        if (otp.length !== 6) {
            showToast('OTP phải có 6 số', 'error');
            return;
        }

        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/verify-otp/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ otp, email: email, type: "REGISTER" }),
        });

        const data = await res.json();

        if (!res.ok) {
            showToast(data.message, 'error');
            setStep(1);
            setLoading(false);
            navigate('/register')
            return;
        } else {
            setLoading(false);
            showToast('Đăng ký thành công!', 'success');
            navigate('/login');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
                {step === 1 && <RegisterForm onRegisterSuccess={onRegisterSuccess} />}
                {step === 2 && <OtpForm email={email} onVerify={verifyOtp} />}
            </div>
            <LoadingOverlay show={loading} />
        </div>
    );
}
