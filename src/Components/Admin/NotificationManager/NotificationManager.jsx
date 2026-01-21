import { useEffect, useState } from 'react';
import { X, Plus, Edit3, Trash2, ChevronLeft, ChevronRight, Send, Bell } from 'lucide-react';

export default function NotificationManager() {
    const [data, setData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    const [form, setForm] = useState({
        title: '',
        message: '',
        sendTo: 'ALL',
        userId: '',
    });

    const mockData = [
        {
            id_notify: 1,
            title: 'Khuyến mãi 30%',
            message: 'Áp dụng đến 30/12',
            type: 'INFO',
            name_status: 'ACTIVE',
            created_at: '01-01-2026 10:22:32',
        },
        {
            id_notify: 2,
            title: 'Bảo trì hệ thống',
            message: 'Bảo trì lúc 23:00',
            type: 'WARNING',
            name_status: 'ACTIVE',
            created_at: '02-01-2026 09:15:10',
        },
        {
            id_notify: 3,
            title: 'Tặng voucher 50k',
            message: 'Áp dụng cho đơn từ 200k',
            type: 'INFO',
            name_status: 'ACTIVE',
            created_at: '03-01-2026 15:30:22',
        },
    ];

    const loadData = async (pageIndex = 0) => {
        setPage(pageIndex);

        const paginated = mockData.slice(pageIndex * size, pageIndex * size + size);
        setData(paginated);
        setTotalPages(Math.ceil(mockData.length / size));
    };

    useEffect(() => {
        loadData(0);
    }, []);

    const sendNotification = () => {
        console.log('>>> SEND NOTIFICATION:', form);
        alert('Đã gửi thông báo!');
        setForm({ title: '', message: '', sendTo: 'ALL', userId: '' });
    };

    const selectNotification = (item) => {
        setForm({
            title: item.title,
            message: item.message,
            sendTo: 'ALL',
            userId: '',
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const openAdd = () => {
        setEditing(null);
        setForm({ title: '', message: '', sendTo: 'ALL', userId: '' });
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setEditing(item.id_notify);
        setForm({
            title: item.title,
            message: item.message,
            sendTo: 'ALL',
            userId: '',
        });
        setModalOpen(true);
    };

    const handleDelete = (id) => {
        console.log('Deleting:', id);
    };

    const handleSave = () => {
        console.log('SAVING DATA:', form, 'EDIT MODE:', editing);
        setModalOpen(false);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
                    <Bell className="w-6 h-6 text-orange-600" />
                    Quản lý thông báo
                </h2>

                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg shadow transition-all"
                >
                    <Plus className="w-4 h-4" /> Thêm thông báo
                </button>
            </div>

            <div className="border rounded-xl p-4 bg-white shadow-sm space-y-4">
                <h3 className="text-lg font-medium">
                    Gửi thông báo {form.title && <span className="text-orange-600">(đang chọn)</span>}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input
                        className="border p-2 rounded-lg col-span-1"
                        placeholder="Tiêu đề"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />

                    <input
                        className="border p-2 rounded-lg col-span-1"
                        placeholder="Nội dung"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />

                    <select
                        className="border p-2 rounded-lg col-span-1"
                        value={form.sendTo}
                        onChange={(e) => setForm({ ...form, sendTo: e.target.value })}
                    >
                        <option value="ALL">Toàn bộ người dùng</option>
                        <option value="USER">Người dùng cụ thể</option>
                    </select>

                    <button
                        onClick={sendNotification}
                        className="bg-orange-600 text-white rounded-lg col-span-1 px-3 py-2 flex items-center justify-center gap-1 hover:bg-orange-700"
                    >
                        <Send size={18} /> Gửi thông báo
                    </button>
                </div>

                {form.sendTo === 'USER' && (
                    <input
                        className="border p-2 rounded-lg w-full"
                        placeholder="Nhập ID hoặc Email người nhận"
                        value={form.userId}
                        onChange={(e) => setForm({ ...form, userId: e.target.value })}
                    />
                )}
            </div>

            <div className="border rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-700">
                        <tr>
                            <th className="p-3 text-left">Tiêu đề</th>
                            <th className="p-3 text-left">Nội dung</th>
                            <th className="p-3 text-left">Ngày tạo</th>
                            <th className="p-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr
                                key={item.id_notify}
                                className="border-t hover:bg-orange-50 transition cursor-pointer"
                                onClick={() => selectNotification(item)}
                            >
                                <td className="p-3">{item.title}</td>
                                <td className="p-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[260px]">
                                    {item.message}
                                </td>
                                <td className="p-3">{item.created_at}</td>
                                <td className="p-3 flex justify-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openEdit(item);
                                        }}
                                        className="p-2 rounded-md hover:bg-orange-50"
                                    >
                                        <Edit3 size={18} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(item.id_notify);
                                        }}
                                        className="p-2 rounded-md hover:bg-red-50 text-red-500"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex items-center justify-center gap-2 select-none p-3 bg-white">
                    <button
                        disabled={page === 0}
                        onClick={() => loadData(page - 1)}
                        className="p-2 rounded-lg border hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => loadData(i)}
                                className={`px-3 py-1 rounded-lg text-sm border transition
                                ${i === page ? 'bg-orange-500 text-white border-orange-500' : 'hover:bg-orange-50'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        disabled={page === totalPages - 1}
                        onClick={() => loadData(page + 1)}
                        className="p-2 rounded-lg border hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 !mt-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[460px] p-6 rounded-xl shadow-xl relative space-y-4">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-lg font-semibold">{editing ? 'Chỉnh sửa thông báo' : 'Thêm thông báo'}</h3>

                        <div className="space-y-3">
                            <input
                                className="w-full border p-2 rounded-lg"
                                placeholder="Tiêu đề"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />
                            <textarea
                                className="w-full border p-2 rounded-lg h-24"
                                placeholder="Nội dung..."
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
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
