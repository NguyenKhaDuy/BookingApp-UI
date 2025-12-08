import { useEffect, useRef, useState } from 'react';

export default function OtpForm({ email, onVerify }) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(300);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => setTimer((t) => t - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = () => {
        const m = Math.floor(timer / 60);
        const s = timer % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleChange = (v, index) => {
        if (!/^\d?$/.test(v)) return;

        const newOtp = [...otp];
        newOtp[index] = v;
        setOtp(newOtp);

        if (v && index < 5) inputRefs.current[index + 1].focus();
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const resendOtp = () => {
        if (timer > 0) return;
        setTimer(300);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0].focus();
        alert('Mã OTP mới đã được gửi');
    };

    const handleVerify = () => {
        onVerify(otp.join(''));
    };

    return (
        <div className="w-full max-w-md mx-auto text-center">
            <h2 className="text-xl font-semibold mb-2">Xác thực OTP</h2>
            <p className="text-gray-600 mb-4">
                Mã OTP đã gửi đến <b>{email}</b>
            </p>

            {/* OTP GRID */}
            <div className="flex justify-between gap-2 mt-4">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="
                            w-12 h-12 md:w-14 md:h-14 text-xl font-semibold
                            text-center bg-white border rounded-xl shadow-sm
                            focus:border-orange-500 focus:ring-2 focus:ring-orange-300
                            transition outline-none
                        "
                    />
                ))}
            </div>

            {/* VERIFY */}
            <button
                onClick={handleVerify}
                className="w-full bg-orange-500 text-white py-3 rounded-xl mt-6 
                font-semibold text-lg shadow-md hover:bg-orange-600 transition"
            >
                Xác nhận
            </button>

            {/* RESEND OTP BUTTON */}
            <div className="mt-4 flex flex-col items-center text-sm">
                <p className="text-gray-600 mb-1">
                    {timer > 0 ? `Gửi lại mã sau: ${formatTime()}` : 'Bạn chưa nhận được mã?'}
                </p>

                <button
                    onClick={resendOtp}
                    disabled={timer > 0}
                    className={`
                        px-4 py-2 rounded-lg font-medium transition 
                        ${
                            timer > 0
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md'
                        }
                    `}
                >
                    Gửi lại mã OTP
                </button>
            </div>
        </div>
    );
}
