import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit3, Trash2, ChevronLeft, ChevronRight, X, Bell } from 'lucide-react';
import getCookie from '../../../utils/getToken';
import { useToast } from '../../../Context/ToastContext';
import LoadingOverlay from '../../../Layouts/LoadingOverLay/LoadingOverlay';
import { formatDateTimeArray } from '../../../utils/formatDate';
import {API_BASE_URL} from '../../../utils/api.js';

export default function NotificationTypeManager() {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const [form, setForm] = useState({
        type: '',
        description: '',
    });
    const [confirmDelete, setConfirmDelete] = useState({
        open: false,
        id: null,
    });

    const token = getCookie('token');

    // Load danh sách loại thông báo
    const loadData = async (pageIndex = 0) => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/admin/notification-type/`, {
                params: { pageNo: pageIndex + 1 },
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            const json = res.data;
            setPage(json.current_page - 1);
            setTotalPages(json.total_page);
            setData(json.data || []);
        } catch (error) {
            console.error('Lỗi load danh sách loại thông báo:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(0);
    }, []);

    // Mở modal thêm
    const openAdd = () => {
        setEditing(null);
        setForm({ type: '', description: '' });
        setModalOpen(true);
    };

    // Mở modal chỉnh sửa
    const openEdit = (item) => {
        setEditing(item.id);
        setForm({ type: item.type, description: item.description });
        setModalOpen(true);
    };

    // API tạo loại thông báo
    const createType = async () => {
        try {
            setLoading(true);
            const res = await axios.post(`${API_BASE_URL}/admin/notification-type/`, form, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            loadData(page);
            setModalOpen(false);
            showToast('Thêm thành công', 'success');
        } catch (err) {
            showToast('Thêm không thành công', 'error');
        } finally {
            setLoading(false);
        }
    };

    // API cập nhật loại thông báo
    const updateType = async () => {
        try {
            const body = {
                id: editing,
                type: form.type,
                description: form.description,
            };
            setLoading(true);
            const res = await axios.put(`${API_BASE_URL}/admin/notification-type/`, body, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            loadData(page);
            setModalOpen(false);
            setEditing(null);
            showToast('Cập nhật thành công', 'success');
        } catch (err) {
            console.error('UPDATE ERROR:', err);
            showToast('Cập nhật không thành công', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Lưu form
    const handleSave = () => {
        if (!form.type.trim()) {
            showToast('Loại thông báo không được để trống!', 'error');
            return;
        }
        if (editing) updateType();
        else createType();
    };

    // API xóa loại thông báo
    const confirmDeleteAction = async () => {
        const id = confirmDelete.id;
        try {
            setLoading(true);
            await axios.delete(`${API_BASE_URL}/admin/notification-type/id-type=${id}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                },
            });

            showToast('Xóa thành công', 'success');
            loadData(page);
        } catch (err) {
            console.error('DELETE ERROR:', err);
            showToast('Xóa thất bại', 'error');
        } finally {
            setConfirmDelete({ open: false, id: null });
            setLoading(false);
        }
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

            {/* Table */}
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
                        {data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item.id} className="border-t hover:bg-gray-50 transition">
                                    <td className="p-3 font-medium">{item.type}</td>
                                    <td className="p-3 max-w-[260px] whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.description}
                                    </td>
                                    <td className="p-3">{formatDateTimeArray(item.created_at) || '---'}</td>
                                    <td className="p-3 flex justify-center gap-2">
                                        <button
                                            onClick={() => openEdit(item)}
                                            className="p-2 rounded-md hover:bg-orange-50"
                                        >
                                            <Edit3 size={18} />
                                        </button>
                                        <button
                                            onClick={() => setConfirmDelete({ open: true, id: item.id })}
                                            className="p-2 rounded-md hover:bg-red-50 text-red-500"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-500">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
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

            {/* Modal */}
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
                                className="w-full p-4 rounded-xl border border-gray-300 outline-orange-500"
                                placeholder="Loại (ví dụ: WARNING, INFO...)"
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                            />

                            <textarea
                                className="w-full p-4 rounded-xl border border-gray-300 outline-orange-500 h-24"
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
            {confirmDelete.open && (
                <div className="fixed inset-0 !mt-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white w-[350px] rounded-2xl shadow-xl p-6 space-y-5">
                        <div className="text-center space-y-2">
                            <p className="text-lg font-semibold text-gray-800">Xác nhận xóa</p>
                            <p className="text-sm text-gray-500">
                                Bạn có chắc muốn xóa loại thông báo này?
                                <br />
                                Hành động này không thể hoàn tác.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => setConfirmDelete({ open: false, id: null })}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                            >
                                Hủy
                            </button>

                            <button
                                onClick={confirmDeleteAction}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
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
