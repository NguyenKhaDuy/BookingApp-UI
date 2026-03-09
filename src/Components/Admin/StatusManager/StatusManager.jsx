import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ListChecks, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import getCookie from '../../../utils/getToken';
import { useToast } from '../../../Context/ToastContext';
import LoadingOverlay from '../../../Layouts/LoadingOverLay/LoadingOverlay';
import { formatDateTimeArray } from '../../../utils/formatDate';

export default function StatusManager() {
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [nameStatus, setNameStatus] = useState('');
    const [description, setDescription] = useState('');

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const token = getCookie('token');

    const loadData = async (p = 0) => {
        try {
            setLoading(true);

            const res = await axios.get(`http://localhost:8081/api/admin/status/?pageNo=${p + 1}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setStatuses(res.data.data || []);
            setTotalPages(res.data.total_page || 0);
            setPage(p);
        } catch (err) {
            console.error(err);
            showToast('Không thể tải dữ liệu Status!', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const openAdd = () => {
        setEditData(null);
        setNameStatus('');
        setDescription('');
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setEditData(item);
        setNameStatus(item.nameStatus || '');
        setDescription(item.description || '');
        setModalOpen(true);
    };

    const saveModal = async () => {
        if (!nameStatus.trim()) {
            showToast('Tên trạng thái không được để trống!', 'error');
            return;
        }

        try {
            setLoading(true);

            const payload = {
                id_status: editData?.id_status,
                nameStatus,
                description,
            };

            await axios({
                method: editData ? 'put' : 'post',
                url: 'http://localhost:8081/api/admin/status/',
                data: payload,
                headers: { Authorization: `Bearer ${token}` },
            });

            showToast(editData ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'success');
            setModalOpen(false);
            loadData(page);
        } catch (err) {
            console.error(err);
            showToast('Lưu thất bại!', 'error');
        } finally {
            setLoading(false);
        }
    };

    const openDeleteConfirm = (id) => {
        setDeleteId(id);
        setConfirmOpen(true);
    };

    const deleteStatus = async () => {
        if (!deleteId) return;

        try {
            setLoading(true);
            await axios.delete(`http://localhost:8081/api/admin/status/id-status=${deleteId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            showToast('Xoá trạng thái thành công!', 'success');
            setConfirmOpen(false);
            loadData(page);
        } catch (err) {
            console.error(err);
            showToast('Xoá thất bại!', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-5xl mx-auto bg-white shadow rounded-xl p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                        <ListChecks className="w-6 h-6 text-orange-600" />
                        Quản lý Trạng thái
                    </h2>

                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                    >
                        <Plus className="w-4 h-4" /> Thêm mới
                    </button>
                </div>

                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700">
                            <tr>
                                <th className="p-3">ID</th>
                                <th className="p-3">Tên trạng thái</th>
                                <th className="p-3">Mô tả</th>
                                <th className="p-3">Ngày tạo</th>
                                <th className="p-3">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center">
                                        Đang tải...
                                    </td>
                                </tr>
                            ) : statuses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-gray-500">
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            ) : (
                                statuses.map((item) => (
                                    <tr key={item.id_status} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{item.id_status}</td>
                                        <td className="p-3 font-medium">{item.nameStatus}</td>
                                        <td className="p-3">{item.description || '-'}</td>
                                        <td className="p-3">{formatDateTimeArray(item.created_at) || '-'}</td>
                                        <td className="p-3 flex gap-2">
                                            <button
                                                onClick={() => openEdit(item)}
                                                className="p-2 rounded bg-blue-50 hover:bg-blue-100 text-blue-600"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => openDeleteConfirm(item.id_status)}
                                                className="p-2 rounded bg-red-50 hover:bg-red-100 text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-center gap-2 p-4 bg-white">
                    <button
                        disabled={page === 0}
                        onClick={() => loadData(page - 1)}
                        className="p-2 rounded border disabled:opacity-40"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => loadData(i)}
                            className={`px-3 py-1 rounded border text-sm ${
                                i === page ? 'bg-orange-600 text-white border-orange-600' : ''
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={page === totalPages - 1}
                        onClick={() => loadData(page + 1)}
                        className="p-2 rounded border disabled:opacity-40"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white w-[450px] p-5 rounded-xl shadow">
                        <h3 className="text-lg font-semibold mb-3">
                            {editData ? 'Sửa Trạng thái' : 'Thêm Trạng thái'}
                        </h3>

                        <div className="flex flex-col gap-3">
                            <input
                                className="p-3 rounded border outline-orange-500"
                                placeholder="Tên trạng thái"
                                value={nameStatus}
                                onChange={(e) => setNameStatus(e.target.value)}
                            />

                            <textarea
                                rows={3}
                                className="p-3 rounded border outline-orange-500"
                                placeholder="Mô tả"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg">
                                Hủy
                            </button>
                            <button onClick={saveModal} className="px-4 py-2 bg-orange-600 text-white rounded-lg">
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Delete */}
            {confirmOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white w-[360px] p-5 rounded-xl shadow">
                        <h3 className="text-lg font-semibold">Xác nhận xóa</h3>
                        <p className="text-gray-600 my-3">Bạn có chắc muốn xóa trạng thái này?</p>

                        <div className="flex justify-end gap-2">
                            <button onClick={() => setConfirmOpen(false)} className="px-4 py-2 border rounded-lg">
                                Hủy
                            </button>
                            <button onClick={deleteStatus} className="px-4 py-2 bg-red-600 text-white rounded-lg">
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
