import { useEffect, useState } from 'react';
import { X, Plus, Edit3, Trash2, ChevronLeft, ChevronRight, Send, Bell } from 'lucide-react';
import getCookie from '../../../utils/getToken';
import { formatDateTimeArray } from '../../../utils/formatDate';
import LoadingOverlay from '../../../Layouts/LoadingOverLay/LoadingOverlay';
import { useToast } from '../../../Context/ToastContext';

export default function NotificationManager() {
    const [data, setData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const [deleteId, setDeleteId] = useState(null);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const [types, setTypes] = useState([]);

    const [form, setForm] = useState({
        title: '',
        message: '',
        id_type: '',
        sendTo: 'ALL',
        userId: '',
    });

    const token = getCookie('token');

    const loadTypes = async () => {
        try {
            const res = await fetch(`http://localhost:8081/api/admin/notification-type/select/`, {
                headers: { Authorization: token ? `Bearer ${token}` : '' },
            });
            const json = await res.json();
            setTypes(json.data || []);
        } catch (err) {
            console.error('Load type error:', err);
        }
    };

    const loadData = async (pageIndex = 0) => {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:8081/api/admin/notifications/?pageNo=${pageIndex + 1}`, {
                headers: { Authorization: token ? `Bearer ${token}` : '' },
            });

            const json = await res.json();
            if (!res.ok) return console.error('Load error:', json);

            setData(json.data || []);
            setTotalPages(json.total_page || 1);
            setPage((json.current_page || 1) - 1);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(0);
        loadTypes();
    }, []);

    const selectNotification = (item) => {
        setForm({
            id_notifi: item.id_notify,
            title: item.title,
            message: item.message,
            type: item.type,
            id_type: '',
            sendTo: 'ALL',
            userId: '',
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const openAdd = () => {
        setEditing(null);
        setForm({ title: '', message: '', id_type: '', sendTo: 'ALL', userId: '' });
        setModalOpen(true);
    };

    const openEdit = async (item) => {
        if (types.length === 0) await loadTypes();
        setEditing(item);

        setForm({
            title: item.title,
            message: item.message,
            id_type: item.id_type,
            sendTo: 'ALL',
            userId: '',
        });

        setModalOpen(true);
    };

    const handleDelete = (id) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setLoadingDelete(true);

        try {
            setLoading(true);
            const res = await fetch(`http://localhost:8081/api/admin/notifications/id=${deleteId}`, {
                method: 'DELETE',
                headers: { Authorization: token ? `Bearer ${token}` : '' },
            });

            const json = await res.json();
            if (!res.ok) {
                console.error('Delete error:', json);
                return;
            }

            loadData(page);
            showToast('Xóa thành công!', 'success');
        } catch (err) {
            showToast('Xóa không thành công!', 'error');
        } finally {
            setLoading(false);
        }

        setLoadingDelete(false);
        setDeleteId(null);
    };

    const cancelDelete = () => setDeleteId(null);

    const handleSave = async () => {
        const method = editing ? 'PUT' : 'POST';
        const url = `http://localhost:8081/api/admin/notification/`;

        const body = {
            id_notify: editing?.id_notify || null,
            title: form.title,
            message: form.message,
            id_type: Number(form.id_type) || null,
        };

        try {
            setLoading(true);
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(body),
            });

            const json = await res.json();
            if (!res.ok) {
                console.error('Save error:', json);
                return;
            }

            loadData(page);
            setModalOpen(false);
            setEditing(null);
            showToast('Lưu thành công!', 'success');
        } catch (err) {
            showToast('Lưu không thành công!', 'error');
        } finally {
            setLoading(false);
        }
    };

    const renderType = (t) => {
        if (!t) {
            return <span className="px-2 py-0.5 rounded text-xs bg-gray-200 text-gray-600">UNDEFINED</span>;
        }

        const typeStr = typeof t === 'object' ? t.type : t;

        return (
            <span
                className={`px-2 py-0.5 rounded text-xs
                ${
                    typeStr === 'INFO'
                        ? 'bg-blue-100 text-blue-700'
                        : typeStr === 'WARNING'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                }
            `}
            >
                {typeStr}
            </span>
        );
    };

    // ====== GỬI THÔNG BÁO ======

    const sendToAll = async () => {
        const body = {
            id_notification: form.id_notifi,
            dateTime: null,
            emailUser: [],
        };


        try {
            setLoading(true);
            const res = await fetch(`http://localhost:8081/api/admin/notification/send/all/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(body),
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.message);
            showToast('Đã gửi thông báo cho toàn bộ người dùng!', 'success');
        } catch (err) {
            console.error(err);
            showToast('Gửi thông báo thất bại!', 'error');
        } finally {
            setLoading(false);
        }
    };

    const sendToUser = async () => {
        const body = {
            id_notification: form.id_notifi,
            dateTime: null,
            emailUser: [form.userId],
        };


        try {
            setLoading(true);
            const res = await fetch(`http://localhost:8081/api/admin/notification/send/user/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(body),
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.message);
            showToast(`Đã gửi thông báo cho ${form.userId}!`, 'success');
        } catch (err) {
            console.error(err);
            showToast('Gửi thông báo thất bại!', 'error');
        } finally {
            setLoading(false);
        }
    };

    const sendNotification = async () => {
        if (!form.title || !form.message) {
            showToast('Vui lòng nhập tiêu đề và nội dung!', 'warning');
            return;
        }

        if (form.sendTo === 'USER' && !form.userId) {
            showToast('Vui lòng nhập Email/UserId người nhận!', 'warning');
            return;
        }

        if (form.sendTo === 'ALL') {
            await sendToAll();
        } else {
            await sendToUser();
        }

        // reset form sau khi gửi
        setForm({id_notifi: '', title: '', message: '', id_type: '', sendTo: 'ALL', userId: '' });
    };

    console.log(form)

    return (
        <div className="p-6 space-y-6">
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
                        className="border p-4 rounded-xl border border-gray-300 outline-orange-500 col-span-1"
                        placeholder="Tiêu đề"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />

                    <input
                        className="border p-4 rounded-xl border border-gray-300 outline-orange-500 col-span-1"
                        placeholder="Nội dung"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />

                    <select
                        className="border p-4 rounded-xl border border-gray-300 outline-orange-500 col-span-1"
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
                        className="border p-4 rounded-xl border border-gray-300 outline-orange-500 w-full"
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
                            <th className="p-3 text-left">Loại</th>
                            <th className="p-3 text-left">Ngày tạo</th>
                            <th className="p-3 text-center">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.length > 0 ? (
                            data.map((item) => (
                                <tr
                                    key={item.id_notify}
                                    className="border-t hover:bg-orange-50 transition cursor-pointer"
                                    onClick={() => selectNotification(item)}
                                >
                                    <td className="p-3">{item.title}</td>
                                    <td className="p-3 max-w-[240px] overflow-hidden text-ellipsis whitespace-nowrap">
                                        {item.message}
                                    </td>
                                    <td className="p-3">{renderType(item.type)}</td>
                                    <td className="p-3">{formatDateTimeArray(item.created_at)}</td>

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
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-gray-500 italic">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="flex items-center justify-center gap-2 select-none p-3 bg-white">
                    <button
                        disabled={page === 0}
                        onClick={() => loadData(page - 1)}
                        className="p-2 rounded-lg border hover:bg-orange-50 disabled:opacity-40"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => loadData(i)}
                            className={`px-3 py-1 rounded-lg text-sm border transition
                                ${i === page ? 'bg-orange-500 text-white border-orange-500' : 'hover:bg-orange-50'}
                            `}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={page === totalPages - 1}
                        onClick={() => loadData(page + 1)}
                        className="p-2 rounded-lg border hover:bg-orange-50 disabled:opacity-40"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 !mt-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[460px] max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-xl relative space-y-4">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-lg font-semibold">{editing ? 'Chỉnh sửa thông báo' : 'Thêm thông báo'}</h3>

                        <input
                            className="w-full p-4 rounded-xl border border-gray-300 outline-orange-500"
                            placeholder="Tiêu đề"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />

                        <textarea
                            className="w-full p-4 rounded-xl border border-gray-300 outline-orange-500 h-24"
                            placeholder="Nội dung..."
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                        ></textarea>

                        <select
                            className="w-full p-4 rounded-xl border border-gray-300 outline-orange-500"
                            value={form.id_type}
                            onChange={(e) => setForm({ ...form, id_type: e.target.value })}
                        >
                            <option value="">-- Chọn loại thông báo --</option>
                            {types.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.type} - {t.description}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={handleSave}
                            className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
                        >
                            {editing ? 'Lưu thay đổi' : 'Thêm mới'}
                        </button>
                    </div>
                </div>
            )}

            {deleteId && (
                <div className="fixed inset-0 !mt-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[380px] p-6 rounded-xl shadow-xl text-center space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Xoá thông báo?</h3>
                        <p className="text-gray-600 text-sm">
                            Hành động này không thể hoàn tác. Bạn chắc chắn muốn xoá?
                        </p>

                        <div className="flex justify-center gap-3 pt-2">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                                disabled={loadingDelete}
                            >
                                Huỷ
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-40"
                                disabled={loadingDelete}
                            >
                                {loadingDelete ? 'Đang xoá...' : 'Xoá'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <LoadingOverlay show={loading} />
        </div>
    );
}
