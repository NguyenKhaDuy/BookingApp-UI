import { useState } from 'react';
import { User, Mail, Phone, Lock, MapPin, X } from 'lucide-react';

import LoadingOverlay from '../../../Layouts/LoadingOverLay/LoadingOverlay.jsx';
import { API_BASE_URL } from '../../../utils/api.js';
import getCookie from '../../../utils/getToken.js';
import { useToast } from '../../../Context/ToastContext.jsx';

export default function AddTechnicianModal({ show, onClose, onSuccess }) {
    const token = getCookie('token');
    const [loadingOverLay, setLoadingOverLay] = useState(false);
 const { showToast } = useToast();
    const [form, setForm] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        address: '',
        dob: '',
        gender: 'Nam',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!show) return null;

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {
        setForm({
            full_name: '',
            email: '',
            phone_number: '',
            address: '',
            dob: '',
            gender: 'Nam',
        });

        setError('');
    };

    const handleSubmit = async () => {
        setError('');

        if (!form.full_name || !form.email || !form.phone_number) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        const payload = {
            full_name: form.full_name,
            email: form.email,
            phone_number: form.phone_number,
            address: form.address,
            dob: form.dob,
            gender: form.gender,
        };

        try {
            setLoading(true);
            setLoadingOverLay(true);

            const res = await fetch(`${API_BASE_URL}/admin/register/technician/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Thêm technician thất bại');
            }

            resetForm();

            showToast("Thêm thợ thành công", 'success');

            onSuccess?.();

            onClose();
        } catch (err) {
            showToast("Thêm thợ không thành công", 'error');
            setError(err.message);
        } finally {
            setLoading(false);
            setLoadingOverLay(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
                <div className="bg-white rounded-xl w-full max-w-xl p-6 relative">
                    {/* Close */}
                    <button onClick={onClose} className="absolute right-4 top-4">
                        <X size={20} />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold mt-3">Add Technician</h2>
                    </div>

                    <div className="space-y-4">
                        <Input
                            icon={User}
                            name="full_name"
                            value={form.full_name}
                            placeholder="Họ tên"
                            onChange={handleChange}
                        />

                        <Input
                            icon={Mail}
                            name="email"
                            value={form.email}
                            placeholder="Email"
                            onChange={handleChange}
                        />

                        <Input
                            icon={Phone}
                            name="phone_number"
                            value={form.phone_number}
                            placeholder="Số điện thoại"
                            onChange={handleChange}
                        />

                        <Input
                            icon={MapPin}
                            name="address"
                            value={form.address}
                            placeholder="Địa chỉ"
                            onChange={handleChange}
                        />

                        <div className="relative">
                            {/* Ô hiển thị DD/MM/YYYY */}
                            <input
                                type="text"
                                name="dob_display"
                                value={form.dob ? form.dob.split('-').reverse().join('/') : ''}
                                placeholder="DD/MM/YYYY"
                                readOnly
                                onClick={(e) => {
                                    const dateInput = e.currentTarget.nextElementSibling;

                                    if (dateInput?.showPicker) {
                                        dateInput.showPicker();
                                    } else {
                                        dateInput?.click();
                                    }
                                }}
                                className="w-full p-3 border rounded-lg 
                   focus:border-orange-500 
                   focus:ring-2 focus:ring-orange-300 
                   outline-none transition cursor-pointer"
                            />

                            {/* Input thật để chọn ngày */}
                            <input
                                type="date"
                                value={form.dob || ''}
                                onChange={(e) => {
                                    const selectedDate = e.target.value;

                                    setForm((prev) => ({
                                        ...prev,
                                        dob: selectedDate,
                                    }));
                                }}
                                className="absolute right-3 top-1/2 
                   -translate-y-1/2 opacity-0 
                   w-8 h-8 cursor-pointer"
                            />
                        </div>

                        <select
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-300 outline-none transition
                        required"
                        >
                            <option value="Nam">Nam</option>

                            <option value="Nữ">Nữ</option>
                        </select>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            disabled={loading}
                            onClick={handleSubmit}
                            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
                        >
                            {loading ? 'Đang xử lý...' : 'Thêm Technician'}
                        </button>
                    </div>
                </div>
            </div>

            <LoadingOverlay show={loadingOverLay} />
        </>
    );
}

function Input({ icon: Icon, ...props }) {
    return (
        <div className="relative">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input {...props} className="w-full pl-10 p-3 border rounded-lg bg-white
                        focus:border-orange-500 focus:ring-2 focus:ring-orange-300 outline-none transition
                        required" />
        </div>
    );
}
