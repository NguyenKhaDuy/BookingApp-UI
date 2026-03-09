import { Camera } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import getCookie from '../../../utils/getToken';
import { useToast } from '../../../Context/ToastContext';
import LoadingOverlay from '../../../Layouts/LoadingOverLay/LoadingOverlay';
import avatarDefault from '../../../assets/default-avatar.jpg';
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../../../Context/UserContext';

export default function AccountPage() {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const [profile, setProfile] = useState(null);
    const [originalProfile, setOriginalProfile] = useState(null);
    const { user, setUser } = useContext(UserContext);

    const token = getCookie('token');

    const getTechnicianId = () => {
        const localUser = localStorage.getItem('user');
        if (!localUser) return null;
        return JSON.parse(localUser).id_user;
    };

    const id_user = getTechnicianId();

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:8081/api/technician/profile/id=${id_user}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.data?.data) throw new Error('Không có dữ liệu trả về');
            setProfile(res.data.data);
            setOriginalProfile(res.data.data);
        } catch (err) {
            showToast('Lỗi load profile: ' + (err.response?.data?.message || err.message), 'error');
        } finally {
            setLoading(false);
        }
    }, [id_user, token]);

    useEffect(() => {
        if (id_user) fetchProfile();
    }, [fetchProfile, id_user]);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');

            setProfile((prev) => ({ ...prev, avatarBase64: base64String }));

            try {
                setLoading(true);

                const formData = new FormData();
                formData.append('id_user', id_user);
                formData.append('avatar', file);

                await axios.put('http://localhost:8081/api/technician/profile/avatar/', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                showToast('Cập nhật avatar thành công!', 'success');
                await fetchProfile();
                setUser((prev) => ({ ...prev, avatarBase64: base64String }));
                localStorage.setItem(
                    'user',
                    JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), avatarBase64: base64String }),
                );
            } catch (err) {
                showToast('Lỗi cập nhật avatar: ' + (err.response?.data?.message || err.message), 'error');
            } finally {
                setLoading(false);
            }
        };

        reader.readAsDataURL(file);
    };

    const handleChange = (field, value) => {
        setProfile((prev) => ({ ...prev, [field]: value }));
    };

    const hasChanged = () => {
        if (!profile || !originalProfile) return false;
        return JSON.stringify(profile) !== JSON.stringify(originalProfile);
    };

    // HÀM UPDATE PROFILE — FULL CODE 
    const handleUpdateProfile = async () => {
        if (!profile) return;

        try {
            setLoading(true);

            const payload = {
                id_user: profile.id_user,
                full_name: profile.full_name,
                address: profile.address,
                phone_number: profile.phone_number,
                dob: profile.dob
                    ? `${profile.dob[0].toString().padStart(2, '0')}-${profile.dob[1].toString().padStart(2, '0')}-${profile.dob[2]}`
                    : null,
                gender: profile.gender,
                working_area: profile.working_area,
                experience_year: profile.experience_year,
            };

            const res = await axios.put(`http://localhost:8081/api/technician/profile/`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            showToast('Cập nhật thông tin thành công!', 'success');
            await fetchProfile();
        } catch (err) {
            showToast('Lỗi cập nhật: ' + (err.response?.data?.message || err.message), 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Thông tin tài khoản</h2>

            {!profile && !loading && <div className="text-gray-500 italic">Đang tải dữ liệu...</div>}

            {profile && (
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                        <div className="relative group">
                            <img
                                src={
                                    profile?.avatarBase64
                                        ? `data:image/jpeg;base64,${profile.avatarBase64}`
                                        : avatarDefault
                                }
                                className="w-28 h-28 rounded-full object-cover  border-4 border-orange-500 shadow-sm"
                            />

                            <input type="file" accept="image/*" id="avatarInput" hidden onChange={handleAvatarChange} />

                            <button
                                onClick={() => document.getElementById('avatarInput').click()}
                                className="absolute bottom-1 right-1 bg-white p-2 rounded-full border shadow-sm hover:bg-gray-100"
                            >
                                <Camera size={18} />
                            </button>
                        </div>

                        <div>
                            <p className="text-xl font-semibold text-gray-800">{profile.full_name}</p>
                            <p className="text-gray-500 text-sm">Kỹ thuật viên</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5 mt-6">
                        <Field
                            label="Họ và tên"
                            name="full_name"
                            value={profile.full_name}
                            editable
                            onChange={handleChange}
                        />
                        <Field label="Email" name="email" value={profile.email} />
                        <Field
                            label="Số điện thoại"
                            name="phone_number"
                            value={profile.phone_number}
                            editable
                            onChange={handleChange}
                        />
                        <Field
                            label="Địa chỉ"
                            name="address"
                            value={profile.address}
                            editable
                            onChange={handleChange}
                        />

                        <DateField label="Ngày sinh" name="dob" value={profile.dob} editable onChange={handleChange} />

                        <SelectField
                            label="Giới tính"
                            name="gender"
                            value={profile.gender}
                            options={['Nam', 'Nữ', 'Khác']}
                            editable
                            onChange={handleChange}
                        />

                        <Field
                            label="Kinh nghiệm (năm)"
                            name="experience_year"
                            value={profile.experience_year}
                            editable
                            onChange={handleChange}
                        />
                        <Field
                            label="Khu vực làm việc"
                            name="working_area"
                            value={profile.working_area}
                            editable
                            onChange={handleChange}
                        />

                        <Field label="Hiệu suất" value={profile.efficiency} />
                        <Field label="Trạng thái" value={profile.status_technician} />
                        <Field label="Level" value={profile.level} />
                        <Field label="Công nợ" value={profile.technician_debt + ' VND'} />
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleUpdateProfile}
                            className={`px-6 py-2 rounded-lg font-medium shadow-sm text-white 
                                ${hasChanged() ? 'bg-orange-500 hover:bg-orange-600 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'}`}
                            disabled={!hasChanged()}
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
            )}

            <LoadingOverlay show={loading} />
        </div>
    );
}

/* COMPONENTS */
function Field({ label, value, editable, onChange, name }) {
    return (
        <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">{label}</label>
            <input
                className="p-4 rounded-xl border border-gray-300 outline-orange-500 mb-4 text-gray-800"
                value={value || ''}
                onChange={(e) => onChange && onChange(name, e.target.value)}
                disabled={!editable}
            />
        </div>
    );
}

function DateField({ label, value, editable, onChange, name }) {
    const formatted = toDateInputValue(value);
    return (
        <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">{label}</label>
            <input
                type="date"
                className="p-4 rounded-xl border border-gray-300 outline-orange-500 mb-4 text-gray-800"
                value={formatted}
                onChange={(e) => {
                    const parts = e.target.value.split('-');
                    onChange && onChange(name, [Number(parts[0]), Number(parts[1]), Number(parts[2])]);
                }}
                disabled={!editable}
            />
        </div>
    );
}

function SelectField({ label, value, options, editable, onChange, name }) {
    return (
        <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">{label}</label>
            <select
                className="p-4 rounded-xl border border-gray-300 outline-orange-500 mb-4 text-gray-800"
                value={value || ''}
                onChange={(e) => onChange && onChange(name, e.target.value)}
                disabled={!editable}
            >
                {options.map((o) => (
                    <option key={o} value={o}>
                        {o}
                    </option>
                ))}
            </select>
        </div>
    );
}

/* FORMAT DATE */
function toDateInputValue(arr) {
    if (!Array.isArray(arr) || arr.length < 3) return '';
    const [y, m, d] = arr;
    const mm = String(m).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
}
