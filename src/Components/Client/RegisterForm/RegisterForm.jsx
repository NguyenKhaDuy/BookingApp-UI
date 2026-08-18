import { useState } from 'react';
import logo from '../../../assets/logo.png';
import { User, Mail, Phone, Lock, MapPin, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import LoadingOverlay from '../../../Layouts/LoadingOverLay/LoadingOverlay';
import { API_BASE_URL } from '../../../utils/api.js';
import { Link } from 'react-router-dom';

export default function RegisterForm({ onRegisterSuccess }) {
    const [loadingOverLay, setLoadingOverLay] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [form, setForm] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        address: '',
        password: '',
        confirmPassword: '',
        dob: '',
        gender: 'MALE',
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async () => {
        setError('');

        if (form.password !== form.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        const payload = {
            full_name: form.full_name,
            email: form.email,
            phone_number: form.phone_number,
            address: form.address,
            password: form.password,
            dob: form.dob,
            gender: form.gender,
        };

        try {
            setLoadingOverLay(true);
            setLoading(true);

            const res = await fetch(`${API_BASE_URL}/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(await res.text());
            }

            onRegisterSuccess(form.email);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setLoadingOverLay(false);
        }
    };

    return (
        <div>
            <div className="text-center mb-6">
                <img src={logo} className="w-20 h-20 mx-auto" alt="Logo" />

                <h1 className="text-2xl font-bold mt-4">Đăng ký</h1>
            </div>

            <div className="space-y-4">
                <Input icon={User} name="full_name" placeholder="Họ tên" onChange={handleChange} />

                <Input icon={Mail} type="email" name="email" placeholder="Email" onChange={handleChange} />

                <Input icon={Phone} name="phone_number" placeholder="SĐT" onChange={handleChange} />

                <Input icon={MapPin} name="address" placeholder="Địa chỉ" onChange={handleChange} />

                <input
                    type="date"
                    name="dob"
                    onChange={handleChange}
                    className="
                        w-full
                        border
                        border-gray-300
                        p-3
                        rounded-lg
                        outline-none
                        transition
                        focus:border-orange-500
                        focus:ring-2
                        focus:ring-orange-200
                    "
                />

                <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="
                        w-full
                        border
                        border-gray-300
                        p-3
                        rounded-lg
                        outline-none
                        transition
                        focus:border-orange-500
                        focus:ring-2
                        focus:ring-orange-200
                    "
                >
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                </select>

                <PasswordInput
                    name="password"
                    placeholder="Mật khẩu"
                    value={form.password}
                    onChange={handleChange}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                />

                <PasswordInput
                    name="confirmPassword"
                    placeholder="Xác nhận mật khẩu"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    showPassword={showConfirmPassword}
                    setShowPassword={setShowConfirmPassword}
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="
                        w-full
                        bg-gradient-to-r
                        from-orange-500
                        to-orange-600
                        hover:from-orange-600
                        hover:to-orange-700
                        text-white
                        py-3
                        rounded-lg
                        font-semibold
                        transition
                        disabled:opacity-60
                    "
                >
                    {loading ? 'Đang xử lý...' : 'Đăng ký'}
                </button>

                <button
                    type="button"
                    onClick={() => onRegisterSuccess(null)}
                    className="
                        w-full
                        flex
                        items-center
                        justify-center
                        gap-2
                        text-gray-600
                        hover:text-orange-500
                        transition
                        py-2
                    "
                >

                    <Link
                        to="/login"
                        className="
        w-full
        flex
        items-center
        justify-center
        gap-2
        text-gray-600
        hover:text-orange-500
        transition
        py-2
    "
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Quay lại đăng nhập</span>
                    </Link>
                </button>
            </div>

            <LoadingOverlay show={loadingOverLay} />
        </div>
    );
}

function Input({ icon: Icon, ...props }) {
    return (
        <div className="relative">
            <Icon
                className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                    w-5
                    h-5
                "
            />

            <input
                {...props}
                className="
                    w-full
                    pl-10
                    pr-4
                    p-3
                    border
                    border-gray-300
                    rounded-lg
                    outline-none
                    transition
                    focus:border-orange-500
                    focus:ring-2
                    focus:ring-orange-200
                "
            />
        </div>
    );
}

function PasswordInput({ name, placeholder, value, onChange, showPassword, setShowPassword }) {
    return (
        <div className="relative">
            <Lock
                className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                    w-5
                    h-5
                "
            />

            <input
                type={showPassword ? 'text' : 'password'}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="
                    w-full
                    pl-10
                    pr-12
                    p-3
                    border
                    border-gray-300
                    rounded-lg
                    outline-none
                    transition
                    focus:border-orange-500
                    focus:ring-2
                    focus:ring-orange-200
                "
            />

            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                    hover:text-orange-500
                    transition
                "
            >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
        </div>
    );
}
