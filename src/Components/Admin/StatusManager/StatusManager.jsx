import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, X, ListChecks } from 'lucide-react';

export default function StatusManager() {
    const [statuses, setStatuses] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ nameStatus: '', description: '' });

    const loadData = (pageNum = 0) => {
        const mockData = Array.from({ length: 23 }).map((_, i) => ({
            id_status: i + 1,
            nameStatus: `Trạng thái ${i + 1}`,
            description: `Mô tả trạng thái số ${i + 1}`,
            created_at: '2026-01-01 12:00:00',
        }));

        const size = 6;
        setPage(pageNum);
        setTotalPages(Math.ceil(mockData.length / size));
        setStatuses(mockData.slice(pageNum * size, (pageNum + 1) * size));
    };

    useEffect(() => {
        loadData();
    }, []);

    const openAdd = () => {
        setEditing(null);
        setForm({ nameStatus: '', description: '' });
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setForm({ nameStatus: item.nameStatus, description: item.description });
        setModalOpen(true);
    };

    const handleSave = () => {
        if (!form.nameStatus.trim()) return alert('Tên trạng thái không được bỏ trống!');

        if (editing) {
            setStatuses((prev) => prev.map((s) => (s.id_status === editing.id_status ? { ...s, ...form } : s)));
        } else {
            setStatuses((prev) => [...prev, { id_status: Date.now(), ...form }]);
        }

        setModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa trạng thái này?')) {
            setStatuses((prev) => prev.filter((s) => s.id_status !== id));
        }
    };

    return (
        <div className="p-6 space-y-5">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                    <ListChecks className="w-6 h-6 text-orange-600" />
                    Quản lý trạng thái
                </h2>

                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                >
                    <Plus className="w-4 h-4" /> Thêm mới
                </button>
            </div>

            <div className="bg-white rounded-xl shadow border overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-700">
                        <tr>
                            <th className="px-3 py-2 border">ID</th>
                            <th className="px-3 py-2 border text-left">Tên trạng thái</th>
                            <th className="px-3 py-2 border text-left">Mô tả</th>
                            <th className="px-3 py-2 border text-left">Ngày tạo</th>
                            <th className="px-3 py-2 border text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statuses.map((s, i) => (
                            <tr key={s.id_status} className="hover:bg-gray-50">
                                <td className="px-3 py-2 border text-center">{page * 6 + i + 1}</td>
                                <td className="px-3 py-2 border">{s.nameStatus}</td>
                                <td className="px-3 py-2 border">{s.description}</td>
                                <td className="px-3 py-2 border">{s.created_at}</td>
                                <td className="px-3 py-2 border">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => openEdit(s)}
                                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(s.id_status)}
                                            className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {statuses.length === 0 && (
                            <tr>
                                <td colSpan="5" className="py-4 text-center text-gray-500">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border shadow-sm">
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
                    <div className="bg-white w-[420px] p-5 rounded-xl shadow-xl space-y-4 relative">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-lg font-semibold">
                            {editing ? 'Chỉnh sửa trạng thái' : 'Thêm trạng thái'}
                        </h3>

                        <input
                            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="Tên trạng thái"
                            value={form.nameStatus}
                            onChange={(e) => setForm({ ...form, nameStatus: e.target.value })}
                        />

                        <textarea
                            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                            rows={3}
                            placeholder="Mô tả"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
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
