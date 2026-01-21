import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, ChevronLeft, ChevronRight, X, Bell } from 'lucide-react';

export default function NotificationTypeManager() {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const [form, setForm] = useState({
        type: '',
        description: '',
    });

    // Mock data để demo
    const mockData = [
        { id: 1, type: 'INFO', description: 'Thông báo thông tin', created_at: '01-01-2026 10:00:00' },
        { id: 2, type: 'WARNING', description: 'Cảnh báo hệ thống', created_at: '02-01-2026 09:22:00' },
        { id: 3, type: 'PROMO', description: 'Khuyến mãi', created_at: '03-01-2026 14:22:50' },
        { id: 4, type: 'URGENT', description: 'Thông báo khẩn', created_at: '10-01-2026 18:11:10' },
        { id: 5, type: 'SYSTEM', description: 'Thông báo hệ thống', created_at: '11-01-2026 11:45:20' },
        { id: 6, type: 'EVENT', description: 'Sự kiện', created_at: '12-01-2026 21:33:20' },
    ];

    const loadData = (pageIndex = 0) => {
        setPage(pageIndex);
        const paginated = mockData.slice(pageIndex * size, pageIndex * size + size);
        setData(paginated);
        setTotalPages(Math.ceil(mockData.length / size));
    };

    useEffect(() => {
        loadData(0);
    }, []);

    const openAdd = () => {
        setEditing(null);
        setForm({ type: '', description: '' });
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setEditing(item.id);
        setForm({ type: item.type, description: item.description });
        setModalOpen(true);
    };

    const handleSave = () => {
        console.log('SAVE:', form, 'EDIT:', editing);
        setModalOpen(false);
    };

    const handleDelete = (id) => {
        console.log('DELETE:', id);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
                    <Bell className="w-6 h-6 text-orange-600" />
                    Quản lý loại thông báo
                </h2>

                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg shadow transition-all"
                >
                    <Plus className="w-4 h-4" /> Thêm loại thông báo
                </button>
            </div>

            <div className="border rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-700">
                        <tr>
                            <th className="p-3 text-left">Loại</th>
                            <th className="p-3 text-left">Mô tả</th>
                            <th className="p-3 text-left">Ngày tạo</th>
                            <th className="p-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id} className="border-t hover:bg-gray-50 transition">
                                <td className="p-3 font-medium">{item.type}</td>
                                <td className="p-3 max-w-[260px] whitespace-nowrap overflow-hidden text-ellipsis">
                                    {item.description}
                                </td>
                                <td className="p-3">{item.created_at}</td>
                                <td className="p-3 flex justify-center gap-2">
                                    <button
                                        onClick={() => openEdit(item)}
                                        className="p-2 rounded-md hover:bg-orange-50"
                                    >
                                        <Edit3 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 rounded-md hover:bg-red-50 text-red-500"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex items-center justify-center gap-2 p-3 bg-white">
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
            </div>

            {/* MODAL CRUD */}
            {modalOpen && (
                <div className="fixed inset-0 !mt-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[400px] p-6 rounded-xl shadow-xl relative space-y-4">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-lg font-semibold">{editing ? 'Chỉnh sửa loại' : 'Thêm loại thông báo'}</h3>

                        <div className="space-y-3">
                            <input
                                className="w-full border p-2 rounded-lg"
                                placeholder="Loại (ví dụ: WARNING, INFO...)"
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                            />

                            <textarea
                                className="w-full border p-2 rounded-lg h-24"
                                placeholder="Mô tả..."
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            ></textarea>
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
                        >
                            {editing ? 'Lưu thay đổi' : 'Thêm mới'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
