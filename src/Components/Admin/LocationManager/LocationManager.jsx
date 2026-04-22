import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Search, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import getCookie from '../../../utils/getToken';
import { useToast } from '../../../Context/ToastContext';
import LoadingOverlay from '../../../Layouts/LoadingOverLay/LoadingOverlay';
import {API_BASE_URL} from '../../../utils/api.js';

export default function LocationManager() {
    const [locations, setLocations] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ province: '', district: '', ward: '' });

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const token = getCookie('token');

    const loadData = async (pageNo = 1) => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/admin/location/?pageNo=${pageNo}`, {
                headers: { Authorization: token ? `Bearer ${token}` : '' },
            });

            const json = await res.json();
            setLocations(json.data || []);
            setTotalPage(json.total_page || 1);
            setPage(json.current_page || 1);
        } catch (err) {
            console.error('Failed to load locations:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(1);
        loadProvinces();
    }, []);

    // ================== API PROVINCE MỚI ===================
    const loadProvinces = async () => {
        try {
            const res = await fetch(`https://provinces.open-api.vn/api/p/`);
            const json = await res.json();
            setProvinces(json || []);
        } catch (err) {
            console.error('Failed to load provinces:', err);
        }
    };

    console.log(provinces)

    const loadDistricts = async (provinceCode) => {
        try {
            const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
            const json = await res.json();
            setDistricts(json.districts || []);
        } catch (err) {
            console.error('Failed to load districts:', err);
        }
    };

    const loadWards = async (districtCode) => {
        try {
            const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
            const json = await res.json();
            setWards(json.wards || []);
        } catch (err) {
            console.error('Failed to load wards:', err);
        }
    };

    // ================== FILTER FRONTEND ===================
    const filtered = locations.filter(
        (x) =>
            x.district.toLowerCase().includes(search.toLowerCase()) ||
            x.ward.toLowerCase().includes(search.toLowerCase()) ||
            x.conscious.toLowerCase().includes(search.toLowerCase()),
    );

    // ================== HANDLERS ===================
    const openModal = async (item = null) => {
        setEditing(item);
        setModalOpen(true);

        loadProvinces();
        if (item) {
            setForm({
                province: item.conscious,
                district: item.district,
                ward: item.ward,
            });

            const p = provinces.find((x) => x.name === item.conscious);
            if (p) {
                const resD = await fetch(`https://provinces.open-api.vn/api/p/${p.code}?depth=2`);
                const jsonD = await resD.json();
                setDistricts(jsonD.districts || []);

                const d = (jsonD.districts || []).find((x) => x.name === item.district);
                if (d) {
                    const resW = await fetch(`https://provinces.open-api.vn/api/d/${d.code}?depth=2`);
                    const jsonW = await resW.json();
                    setWards(jsonW.wards || []);
                } else {
                    setWards([]);
                }
            } else {
                setDistricts([]);
                setWards([]);
            }
        } else {
            setForm({ province: '', district: '', ward: '' });
            setDistricts([]);
            setWards([]);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditing(null);
        setForm({ province: '', district: '', ward: '' });
        setDistricts([]);
        setWards([]);
    };

    const handleProvinceChange = async (e) => {
        const provinceName = e.target.value;
        setForm({ province: provinceName, district: '', ward: '' });
        setDistricts([]);
        setWards([]);

        const p = provinces.find((x) => x.name === provinceName);
        if (p) await loadDistricts(p.code);
    };

    const handleDistrictChange = async (e) => {
        const districtName = e.target.value;
        setForm({ ...form, district: districtName, ward: '' });
        setWards([]);

        const d = districts.find((x) => x.name === districtName);
        if (d) await loadWards(d.code);
    };

    const handleSave = async () => {
        if (!form.province || !form.district || !form.ward) {
            return showToast('Vui lòng nhập đủ thông tin!', 'error');
        }

        const payload = {
            id_location: editing ? editing.id_location : null,
            district: form.district,
            ward: form.ward,
            conscious: form.province,
        };

        try {
            setLoading(true);
            const method = editing ? 'PUT' : 'POST';
            const res = await fetch(`${API_BASE_URL}/admin/location/`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(payload),
            });

            const json = await res.json();

            if (!res.ok) {
                console.error('Save failed:', json);
                alert(json.message || 'Thao tác thất bại!');
                return;
            }

            setLoading(false);
            showToast(editing ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'success');
            closeModal();
            loadData(page);
        } catch (error) {
            console.error('Save location error:', error);
            showToast('Lỗi hệ thống!', 'error');
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setConfirmOpen(true);
    };

    const confirmDelete = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/admin/location/id-location=${deleteId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                },
            });

            const json = await res.json();
            if (!res.ok) {
                showToast(json.message || 'Xóa thất bại!', 'error');
                setConfirmOpen(false);
                return;
            }

            showToast('Xóa thành công!', 'success');
            loadData(page);
        } catch (err) {
            console.error('Delete error:', err);
            showToast('Lỗi hệ thống!', 'error');
        } finally {
            setLoading(false);
            setConfirmOpen(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-orange-500" /> Quản lý Vị trí
                </h2>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                    <Plus className="w-4 h-4" /> Thêm mới
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 text-gray-500" />
                <input
                    placeholder="Tìm kiếm..."
                    className="pl-9 pr-3 py-2 border rounded-lg w-80 focus:outline-none focus:ring focus:ring-orange-300"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-2 text-left">Quận/Huyện</th>
                            <th className="px-4 py-2 text-left">Phường/Xã</th>
                            <th className="px-4 py-2 text-left">Tỉnh/TP</th>
                            <th className="px-4 py-2 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading && filtered.length > 0 ? (
                            filtered.map((x) => (
                                <tr key={x.id_location} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2">{x.district}</td>
                                    <td className="px-4 py-2">{x.ward}</td>
                                    <td className="px-4 py-2">{x.conscious}</td>
                                    <td className="px-4 py-2 flex justify-center gap-3">
                                        <button
                                            onClick={() => openModal(x)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(x.id_location)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-gray-500">
                                    {loading ? 'Đang tải...' : 'Không có dữ liệu'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-center gap-2 select-none mt-4">
                <button
                    disabled={page <= 1}
                    onClick={() => loadData(page - 1)}
                    className="p-2 rounded-lg border hover:bg-orange-50 disabled:opacity-40"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPage }).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => loadData(idx + 1)}
                        className={`px-3 py-1 rounded-lg text-sm border ${
                            idx + 1 === page ? 'bg-orange-500 text-white border-orange-500' : 'hover:bg-orange-50'
                        }`}
                    >
                        {idx + 1}
                    </button>
                ))}
                <button
                    disabled={page >= totalPage}
                    onClick={() => loadData(page + 1)}
                    className="p-2 rounded-lg border hover:bg-orange-50 disabled:opacity-40"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 !mt-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white w-[460px] rounded-2xl shadow-2xl p-6 relative border border-gray-100">
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                        >
                            <X size={22} />
                        </button>

                        <h3 className="text-xl font-semibold mb-4">
                            {editing ? 'Chỉnh sửa vị trí' : 'Thêm vị trí mới'}
                        </h3>

                        <div className="space-y-3">
                            <select
                                className="w-full p-4 rounded-xl border border-gray-300 outline-orange-500 px-3 py-2 text-sm"
                                value={form.province}
                                onChange={handleProvinceChange}
                            >
                                <option value="">-- Chọn Tỉnh/Thành phố --</option>
                                {provinces.map((p) => (
                                    <option key={p.code} value={p.name}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="w-full p-4 rounded-xl border border-gray-300 outline-orange-500 px-3 py-2 text-sm"
                                value={form.district}
                                onChange={handleDistrictChange}
                                disabled={!districts.length}
                            >
                                <option value="">-- Chọn Quận/Huyện --</option>
                                {districts.map((d) => (
                                    <option key={d.code} value={d.name}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="w-full p-4 rounded-xl border border-gray-300 outline-orange-500 px-3 py-2 text-sm"
                                value={form.ward}
                                onChange={(e) => setForm({ ...form, ward: e.target.value })}
                                disabled={!wards.length}
                            >
                                <option value="">-- Chọn Phường/Xã --</option>
                                {wards.map((w) => (
                                    <option key={w.code} value={w.name}>
                                        {w.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full mt-5 bg-orange-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-orange-700"
                        >
                            {editing ? 'Lưu thay đổi' : 'Thêm mới'}
                        </button>
                    </div>
                </div>
            )}

            {confirmOpen && (
                <div className="fixed inset-0 !mt-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white w-[400px] p-6 rounded-xl shadow-xl">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Xác nhận xóa</h3>
                        <p className="text-gray-600 mb-5">
                            Bạn có chắc chắn muốn xóa vị trí này? Dữ liệu sẽ không thể phục hồi!
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmOpen(false)}
                                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                            >
                                Hủy
                            </button>

                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <LoadingOverlay show={loading} />
        </div>
    );
}
