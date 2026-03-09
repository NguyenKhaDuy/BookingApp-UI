import { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '../../../Context/ToastContext';
import getCookie from '../../../utils/getToken';

/* ================= FORMAT DOB ================= */
const formatDobToInput = (dob) => {
    if (!dob || dob.length < 3) return '';
    const [year, month, day] = dob;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const formatDobToApi = (dateStr) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`; // dd-MM-yyyy
};

export default function ProfileInfo({ profile, onProfileUpdated }) {
    const [formData, setFormData] = useState({});
    const [isDirty, setIsDirty] = useState(false);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    /* ================= INIT FORM ================= */
    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                phone_number: profile.phone_number || '',
                email: profile.email || '',
                gender: profile.gender || '',
                address: profile.address || '',
                date_of_birth: formatDobToInput(profile.dob),
            });
            setIsDirty(false);
        }
    }, [profile]);

    /* ================= CHECK CHANGE ================= */
    useEffect(() => {
        if (!profile) return;

        const changed =
            formData.full_name !== profile.full_name ||
            formData.phone_number !== profile.phone_number ||
            formData.gender !== profile.gender ||
            formData.address !== profile.address ||
            formData.date_of_birth !== formatDobToInput(profile.dob);

        setIsDirty(changed);
    }, [formData, profile]);

    /* ================= HANDLE CHANGE ================= */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /* ================= SUBMIT ================= */
    const handleSubmit = async () => {
        if (!isDirty) return;

        try {
            setLoading(true);

            const token = getCookie('token');
            const user = JSON.parse(localStorage.getItem('user'));

            const payload = {
                id_user: user.id_user,
                full_name: formData.full_name,
                phone_number: formData.phone_number,
                address: formData.address,
                gender: formData.gender,
                dob: formData.date_of_birth,
            };

            await axios.put('http://localhost:8081/api/customer/profile/', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            showToast('Cập nhật thông tin thành công', 'success');
            setIsDirty(false);
            onProfileUpdated && onProfileUpdated(); // reload profile
        } catch (error) {
            showToast('Cập nhật thất bại', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!profile) return null;

    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Thông tin cá nhân</h2>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm text-gray-500">Họ và tên</label>
                    <input
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className="mt-1 w-full p-4 rounded-xl border border-gray-300 outline-orange-500"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-500">Số điện thoại</label>
                    <input
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="mt-1 w-full p-4 rounded-xl border border-gray-300 outline-orange-500"
                    />
                </div>

                {/* <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <input
                        value={formData.email}
                        readOnly
                        className="mt-1 w-full p-4 rounded-xl border border-gray-300 outline-orange-500 bg-gray-100"
                    />
                </div> */}

                <div>
                    <label className="text-sm text-gray-500">Ngày sinh</label>
                    <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        className="mt-1 w-full p-4 rounded-xl border border-gray-300 outline-orange-500"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-500">Giới tính</label>
                    <input
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="mt-1 w-full p-4 rounded-xl border border-gray-300 outline-orange-500"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="text-sm text-gray-500">Địa chỉ</label>
                    <input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="mt-1 w-full p-4 rounded-xl border border-gray-300 outline-orange-500"
                    />
                </div>
            </div>

            {/* ================= SAVE BUTTON ================= */}
            <button
                onClick={handleSubmit}
                disabled={!isDirty || loading}
                className={`
                    mt-5 w-full py-3 rounded-xl font-semibold transition
                    ${
                        isDirty && !loading
                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                `}
            >
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
        </div>
    );
}
