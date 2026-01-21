import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, X, Grid2X2 } from 'lucide-react';

export default function ServiceManager() {
    const [services, setServices] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name_service: '' });

    // ❗ Fake API load (bạn thay bằng axios)
    const loadData = (pageNumber = 0) => {
        const mock = Array.from({ length: 23 }).map((_, i) => ({
            id_service: i + 1,
            name_service: `Dịch vụ ${i + 1}`,
            created_at: '2025-03-20 12:00:00',
        }));

        const size = 5;
        setPage(pageNumber);
        setTotalPages(Math.ceil(mock.length / size));
        setServices(mock.slice(pageNumber * size, (pageNumber + 1) * size));
    };

    useEffect(() => {
        loadData();
    }, []);

    const openAdd = () => {
        setEditing(null);
        setForm({ name_service: '' });
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setForm({ name_service: item.name_service });
        setModalOpen(true);
    };

    const handleSave = () => {
        if (editing) {
            // Update
            setServices((prev) => prev.map((s) => (s.id_service === editing.id_service ? { ...s, ...form } : s)));
        } else {
            // Create (fake id)
            setServices((prev) => [...prev, { id_service: Date.now(), ...form }]);
        }
        setModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa dịch vụ này?')) {
            setServices((prev) => prev.filter((s) => s.id_service !== id));
        }
    };

    const closeModal = () => setModalOpen(false);

    return (
        <div className="p-5 space-y-4">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                    <Grid2X2 className="w-6 h-6 text-orange-600" />
                    Quản lý dịch vụ
                </h2>

                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                >
                    <Plus className="w-4 h-4" /> Thêm mới
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-700">
                        <tr>
                            <th className="px-4 py-2 border">#</th>
                            <th className="px-4 py-2 border text-left">Tên dịch vụ</th>
                            <th className="px-4 py-2 border text-left">Ngày tạo</th>
                            <th className="px-4 py-2 border text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((s, i) => (
                            <tr key={s.id_service} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border text-center">{page * 5 + i + 1}</td>
                                <td className="px-4 py-2 border">{s.name_service}</td>
                                <td className="px-4 py-2 border">{s.created_at}</td>
                                <td className="px-4 py-2 border text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => openEdit(s)}
                                            className="p-2 rounded-lg hover:bg-orange-50 text-orange-600"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(s.id_service)}
                                            className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {services.length === 0 && (
                            <tr>
                                <td colSpan="4" className="py-4 text-center text-gray-500">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-lg border">
                <button
                    disabled={page === 0}
                    onClick={() => loadData(page - 1)}
                    className="p-2 rounded-lg border hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => loadData(i)}
                        className={`px-3 py-1 rounded-lg text-sm border ${
                            i === page ? 'bg-orange-600 text-white border-orange-600' : 'hover:bg-orange-50'
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    disabled={page === totalPages - 1}
                    onClick={() => loadData(page + 1)}
                    className="p-2 rounded-lg border hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* MODAL */}
            {modalOpen && (
                <div className="fixed inset-0 !mt-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[400px] p-6 rounded-xl shadow-xl space-y-4 relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-lg font-semibold">{editing ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ'}</h3>

                        <input
                            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="Tên dịch vụ"
                            value={form.name_service}
                            onChange={(e) => setForm({ ...form, name_service: e.target.value })}
                        />

                        <button
                            onClick={handleSave}
                            className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 font-medium"
                        >
                            {editing ? 'Lưu thay đổi' : 'Thêm mới'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
