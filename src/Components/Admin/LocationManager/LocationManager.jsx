import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Search, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LocationManager() {
    // ---------------- MOCK DATA ----------------
    const mockLocations = [
        {
            id: 1,
            district: 'Quận 1',
            ward: 'Bến Nghé',
            conscious: 'TP. Hồ Chí Minh',
            created_at: '10-01-2026 10:12:20',
            updated_at: '12-01-2026 09:10:03',
        },
        {
            id: 2,
            district: 'Quận 3',
            ward: 'Phường 6',
            conscious: 'TP. Hồ Chí Minh',
            created_at: '08-01-2026 16:25:14',
            updated_at: '09-01-2026 14:55:10',
        },
        {
            id: 3,
            district: 'Ba Đình',
            ward: 'Kim Mã',
            conscious: 'Hà Nội',
            created_at: '05-01-2026 08:45:32',
            updated_at: '11-01-2026 15:11:55',
        },
        {
            id: 4,
            district: 'Hai Bà Trưng',
            ward: 'Bạch Mai',
            conscious: 'Hà Nội',
            created_at: '02-01-2026 09:50:02',
            updated_at: '03-01-2026 12:21:44',
        },
        {
            id: 5,
            district: 'Ninh Kiều',
            ward: 'An Khánh',
            conscious: 'Cần Thơ',
            created_at: '01-01-2026 10:20:10',
            updated_at: '07-01-2026 11:10:50',
        },
        {
            id: 6,
            district: 'Sơn Trà',
            ward: 'An Hải Bắc',
            conscious: 'Đà Nẵng',
            created_at: '15-12-2025 08:12:45',
            updated_at: '20-12-2025 19:10:22',
        },
        {
            id: 7,
            district: 'Thanh Khê',
            ward: 'Xuân Hà',
            conscious: 'Đà Nẵng',
            created_at: '12-12-2025 18:55:03',
            updated_at: '01-01-2026 09:17:55',
        },
        {
            id: 8,
            district: 'Bình Thạnh',
            ward: 'Phường 26',
            conscious: 'TP. Hồ Chí Minh',
            created_at: '20-12-2025 07:45:30',
            updated_at: '29-12-2025 14:50:18',
        },
        {
            id: 9,
            district: 'Thủ Đức',
            ward: 'Hiệp Bình Chánh',
            conscious: 'TP. Hồ Chí Minh',
            created_at: '22-11-2025 12:00:14',
            updated_at: '23-12-2025 10:10:10',
        },
        {
            id: 10,
            district: 'Hồng Bàng',
            ward: 'Minh Khai',
            conscious: 'Hải Phòng',
            created_at: '10-11-2025 15:20:02',
            updated_at: '04-12-2025 09:05:55',
        },
    ];

    // ---------------- STATE ----------------
    const [locations, setLocations] = useState(mockLocations);
    const [page, setPage] = useState(0);
    const [pageSize] = useState(5);

    const [search, setSearch] = useState('');

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const [form, setForm] = useState({ district: '', ward: '', conscious: '' });

    // ---------------- FILTER + PAGING ----------------
    const filtered = locations.filter(
        (x) =>
            x.district.toLowerCase().includes(search.toLowerCase()) ||
            x.ward.toLowerCase().includes(search.toLowerCase()) ||
            x.conscious.toLowerCase().includes(search.toLowerCase()),
    );

    const totalPages = Math.ceil(filtered.length / pageSize);
    const pageData = filtered.slice(page * pageSize, page * pageSize + pageSize);

    // ---------------- HANDLERS ----------------
    const handleSave = () => {
        if (!form.district || !form.ward || !form.conscious) return alert('Điền đủ thông tin!');

        if (editing) {
            setLocations((prev) =>
                prev.map((x) =>
                    x.id === editing.id ? { ...x, ...form, updated_at: new Date().toLocaleString('vi-VN') } : x,
                ),
            );
        } else {
            setLocations((prev) => [
                ...prev,
                {
                    id: prev.length + 1,
                    ...form,
                    created_at: new Date().toLocaleString('vi-VN'),
                    updated_at: new Date().toLocaleString('vi-VN'),
                },
            ]);
        }
        closeModal();
    };

    const handleDelete = (id) => {
        
    };

    const openModal = (item = null) => {
        setEditing(item);
        setForm(item || { district: '', ward: '', conscious: '' });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditing(null);
    };

    // ---------------- UI ----------------
    return (
        <div className="p-6 space-y-6">
            {/* HEADER */}
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

            {/* SEARCH */}
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 text-gray-500" />
                    <input
                        placeholder="Tìm theo Quận / Phường / Tỉnh..."
                        className="pl-9 pr-3 py-2 border rounded-lg w-72 focus:ring-2 focus:ring-orange-400"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-2 text-left">Quận/Huyện</th>
                            <th className="px-4 py-2 text-left">Phường/Xã</th>
                            <th className="px-4 py-2 text-left">Tỉnh/TP</th>
                            <th className="px-4 py-2 text-left">Ngày tạo</th>
                            <th className="px-4 py-2 text-left">Cập nhật</th>
                            <th className="px-4 py-2 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageData.map((x) => (
                            <tr key={x.id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-2">{x.district}</td>
                                <td className="px-4 py-2">{x.ward}</td>
                                <td className="px-4 py-2">{x.conscious}</td>
                                <td className="px-4 py-2">{x.created_at}</td>
                                <td className="px-4 py-2">{x.updated_at}</td>
                                <td className="px-4 py-2 flex items-center justify-center gap-3">
                                    <button onClick={() => openModal(x)} className="text-blue-600 hover:text-blue-800">
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(x.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {pageData.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-gray-500">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-center gap-2 select-none mt-4">
                {/* Prev */}
                <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className="p-2 rounded-lg border hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setPage(idx)}
                            className={`px-3 py-1 rounded-lg text-sm border transition
                    ${idx === page ? 'bg-orange-500 text-white border-orange-500' : 'hover:bg-orange-50'}
                `}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>

                {/* Next */}
                <button
                    disabled={page === totalPages - 1}
                    onClick={() => setPage(page + 1)}
                    className="p-2 rounded-lg border hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* MODAL */}
            {modalOpen && (
                <div className="fixed inset-0 !mt-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white w-[460px] rounded-2xl shadow-2xl p-6 relative animate-fadeIn border border-gray-100">
                        {/* Close Btn */}
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
                        >
                            <X size={22} />
                        </button>

                        {/* Title */}
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                            {editing ? 'Chỉnh sửa vị trí' : 'Thêm vị trí mới'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">Vui lòng nhập đầy đủ thông tin bên dưới</p>

                        {/* FORM */}
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Quận/Huyện</label>
                                <input
                                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
                                    placeholder="Nhập quận/huyện..."
                                    value={form.district}
                                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Phường/Xã</label>
                                <input
                                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
                                    placeholder="Nhập phường/xã..."
                                    value={form.ward}
                                    onChange={(e) => setForm({ ...form, ward: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Tỉnh/Thành phố</label>
                                <input
                                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
                                    placeholder="Nhập tỉnh/thành phố..."
                                    value={form.conscious}
                                    onChange={(e) => setForm({ ...form, conscious: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* ACTION BUTTON */}
                        <button
                            onClick={handleSave}
                            className="w-full mt-5 bg-orange-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-orange-700 transition shadow-sm"
                        >
                            {editing ? 'Lưu thay đổi' : 'Thêm mới'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
