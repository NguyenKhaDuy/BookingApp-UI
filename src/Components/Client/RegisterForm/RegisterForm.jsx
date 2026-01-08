import { useState } from 'react';
import logo from '../../../assets/logo.png';
import { User, Mail, Phone, Lock, MapPin, Calendar, Users } from 'lucide-react';

export default function RegisterForm({ onRegisterSuccess }) {
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

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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
            setLoading(true);
            const res = await fetch('http://localhost:8081/api/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // ⭐⭐⭐ QUAN TRỌNG
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error(await res.text());

            onRegisterSuccess(form.email);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <div className="text-center mb-6">
                <img src={logo} className="w-20 h-20 mx-auto" />
                <h1 className="text-2xl font-bold mt-4">Đăng ký</h1>
            </div>

            <div className="space-y-4">
                <Input icon={User} name="full_name" placeholder="Họ tên" onChange={handleChange} />
                <Input icon={Mail} name="email" placeholder="Email" onChange={handleChange} />
                <Input icon={Phone} name="phone_number" placeholder="SĐT" onChange={handleChange} />
                <Input icon={MapPin} name="address" placeholder="Địa chỉ" onChange={handleChange} />

                <input type="date" name="dob" onChange={handleChange} className="w-full border p-3 rounded" />

                <select name="gender" onChange={handleChange} className="w-full border p-3 rounded">
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                </select>

                <Input icon={Lock} type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} />
                <Input
                    icon={Lock}
                    type="password"
                    name="confirmPassword"
                    placeholder="Xác nhận mật khẩu"
                    onChange={handleChange}
                />

                {error && <p className="text-red-500">{error}</p>}

                <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg"
                >
                    {loading ? 'Đang xử lý...' : 'Đăng ký'}
                </button>
            </div>
        </div>
    );
}

function Input({ icon: Icon, ...props }) {
    return (
        <div className="relative">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input {...props} className="w-full pl-10 p-3 border rounded" />
        </div>
    );
}
