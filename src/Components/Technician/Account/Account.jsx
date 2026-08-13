import { Camera } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import getCookie from '../../../utils/getToken';
import { useToast } from '../../../Context/ToastContext';
import LoadingOverlay from '../../../Layouts/LoadingOverLay/LoadingOverlay';
import avatarDefault from '../../../assets/default-avatar.jpg';
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../../../Context/UserContext';
import { API_BASE_URL } from '../../../utils/api';

export default function AccountPage() {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const [profile, setProfile] = useState(null);
    const [originalProfile, setOriginalProfile] = useState(null);
    const { user, setUser } = useContext(UserContext);

    // payment states
    const [showBankModal, setShowBankModal] = useState(false);
    const [selectedBank, setSelectedBank] = useState('');
    const [bankList, setBankList] = useState([]);
    const [loadingBank, setLoadingBank] = useState(false);
    const [payAmount, setPayAmount] = useState('');

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
            const res = await axios.get(`${API_BASE_URL}/technician/profile/id=${id_user}`, {
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

    useEffect(() => {
        if (!showBankModal) return;

        const fetchBanks = async () => {
            try {
                setLoadingBank(true);
                const res = await fetch('https://api.vietqr.io/v2/banks');
                const data = await res.json();

                if (data.code === '00') {
                    //Thêm NCB thủ công để test
                    const mockNCB = {
                        id: 999,
                        name: 'Ngân hàng Quốc Dân',
                        shortName: 'NCB',
                        code: 'NCB',
                        logo: 'https://api.vietqr.io/img/NCB.png',
                    };

                    setBankList([mockNCB, ...data.data]);
                } else {
                    showToast('Không lấy được ngân hàng', 'error');
                }
            } catch {
                showToast('Lỗi tải ngân hàng', 'error');
            } finally {
                setLoadingBank(false);
            }
        };

        fetchBanks();
    }, [showBankModal, showToast]);

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

                await axios.put(`${API_BASE_URL}/technician/profile/avatar/`, formData, {
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

    const formatDobForPayload = (dob) => {
        if (!dob) return null;

        // Nếu backend trả về [year, month, day]
        if (Array.isArray(dob)) {
            const [year, month, day] = dob;

            return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }

        // Nếu đang là dd-MM-yyyy
        if (/^\d{2}-\d{2}-\d{4}$/.test(dob)) {
            const [day, month, year] = dob.split('-');

            return `${year}-${month}-${day}`;
        }

        // Nếu đã là yyyy-MM-dd
        if (/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
            return dob;
        }

        return null;
    };

    // HÀM UPDATE PROFILE
    const handleUpdateProfile = async () => {
        if (!profile) return;

        try {
            setLoading(true);

            const payload = {
                id_user: profile.id_user,
                full_name: profile.full_name,
                address: profile.address,
                phone_number: profile.phone_number,
                dob: formatDobForPayload(profile.dob),
                gender: profile.gender,
                working_area: profile.working_area,
                experience_year: profile.experience_year,
            };

            console.log('PAYLOAD UPDATE:', payload);
            console.log('DOB:', payload.dob);
            console.log('DOB TYPE:', typeof payload.dob);

            const res = await axios.put(`${API_BASE_URL}/technician/profile/`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            showToast('Cập nhật thông tin thành công!', 'success');

            await fetchProfile();
        } catch (err) {
            console.error('UPDATE PROFILE ERROR:', err);

            showToast('Lỗi cập nhật: ' + (err.response?.data?.message || err.message), 'error');
        } finally {
            setLoading(false);
        }
    };

    //thanh toán công nợ
    const openPaymentDebt = () => {
        setSelectedBank('');
        setPayAmount(profile.technician_debt);
        setShowBankModal(true);
    };

    const handlePaymentDebt = async () => {
        if (!selectedBank) {
            return showToast('Vui lòng chọn ngân hàng', 'error');
        }

        if (!payAmount || Number(payAmount) <= 0) {
            return showToast('Nhập số tiền hợp lệ', 'error');
        }

        if (Number(payAmount) > profile.technician_debt) {
            return showToast('Số tiền vượt quá công nợ', 'error');
        }

        try {
            const payload = {
                bank: selectedBank,
                amount: Number(payAmount),
                id_technician: String(id_user),
            };

            const res = await fetch(`${API_BASE_URL}/technician/payment/debt/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const paymentUrl = await res.text();

            window.location.href = paymentUrl;
        } catch {
            showToast('Thanh toán thất bại', 'error');
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
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1">Công nợ</label>

                            <div
                                className={`p-4 rounded-xl font-semibold
        ${
            profile.technician_debt > 0
                ? 'bg-red-50 text-red-600 border border-red-200'
                : 'bg-green-50 text-green-600 border border-green-200'
        }`}
                            >
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                }).format(profile.technician_debt || 0)}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        {profile.technician_debt > 0 && (
                            <button
                                onClick={openPaymentDebt}
                                className="px-6 py-2 rounded-lg font-medium shadow-sm text-white bg-red-500 hover:bg-red-600"
                            >
                                Thanh toán công nợ
                            </button>
                        )}

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
            {showBankModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white max-w-md w-full rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-4">Thanh toán công nợ</h2>

                        <div className="mb-4">
                            <label className="text-sm text-gray-600">Số tiền thanh toán</label>

                            <input
                                type="number"
                                value={payAmount}
                                onChange={(e) => setPayAmount(e.target.value)}
                                className="w-full p-3 border rounded-lg mt-2"
                            />
                        </div>

                        <div className="space-y-3 max-h-72 overflow-y-auto">
                            {loadingBank && <p className="text-center">Đang tải...</p>}

                            {!loadingBank &&
                                bankList.map((bank) => (
                                    <div
                                        key={bank.code}
                                        onClick={() => setSelectedBank(bank.code)}
                                        className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer
                        ${selectedBank === bank.code ? 'border-orange-500 bg-orange-50' : 'hover:bg-gray-50'}`}
                                    >
                                        <img src={bank.logo} className="w-10 h-10 object-contain" />

                                        <div className="flex-1">
                                            <p className="font-semibold">{bank.shortName}</p>

                                            <p className="text-sm text-gray-500">{bank.name}</p>
                                        </div>

                                        {selectedBank === bank.code && (
                                            <div className="w-4 h-4 rounded-full bg-orange-500" />
                                        )}
                                    </div>
                                ))}
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={() => {
                                    setShowBankModal(false);
                                }}
                                className="flex-1 bg-gray-300 py-2 rounded-lg"
                            >
                                Hủy
                            </button>

                            <button
                                disabled={!selectedBank}
                                onClick={handlePaymentDebt}
                                className="flex-1 bg-green-600 text-white py-2 rounded-lg disabled:opacity-50"
                            >
                                Thanh toán
                            </button>
                        </div>
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
    let formatted = '';

    // Backend: [yyyy, MM, dd]
    if (Array.isArray(value) && value.length >= 3) {
        const [year, month, day] = value;

        formatted = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    // Backend: dd-MM-yyyy
    else if (typeof value === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(value)) {
        const [day, month, year] = value.split('-');

        formatted = `${year}-${month}-${day}`;
    }

    // Backend: yyyy-MM-dd
    else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        formatted = value;
    }

    // Backend: yyyyMMdd
    else if (typeof value === 'string' && /^\d{8}$/.test(value)) {
        formatted = `${value.substring(0, 4)}-${value.substring(4, 6)}-${value.substring(6, 8)}`;
    }

    // Hiển thị DD/MM/YYYY
    const displayDate = formatted ? formatted.split('-').reverse().join('/') : '';

    return (
        <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">{label}</label>

            <div className="relative">
                {/* Ô hiển thị DD/MM/YYYY */}
                <input
                    type="text"
                    value={displayDate}
                    readOnly
                    onClick={(e) => {
                        const dateInput = e.currentTarget.nextElementSibling;

                        if (dateInput?.showPicker) {
                            dateInput.showPicker();
                        } else {
                            dateInput?.click();
                        }
                    }}
                    placeholder="DD/MM/YYYY"
                    disabled={!editable}
                    className="p-4 rounded-xl border border-gray-300 outline-orange-500 mb-4 text-gray-800 w-full cursor-pointer"
                />

                {/* Input date thật để mở calendar */}
                <input
                    type="date"
                    value={formatted}
                    onChange={(e) => {
                        onChange && onChange(name, e.target.value);
                    }}
                    disabled={!editable}
                    className="absolute right-3 top-1/2 opacity-0 w-8 h-8 cursor-pointer"
                />
            </div>
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
