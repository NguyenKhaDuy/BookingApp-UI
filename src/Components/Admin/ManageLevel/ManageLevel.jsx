import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import getCookie from '../../../utils/getToken';
import LoadingOverlay from '../../../Layouts/LoadingOverLay/LoadingOverlay';
import { formatDateTimeArray } from '../../../utils/formatDate';
import { useToast } from '../../../Context/ToastContext';
export default function ManageLevel() {
    const [levels, setLevels] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [formData, setFormData] = useState({
        id_level: null,
        level: '',
        description: '',
    });

    const token = getCookie('token');


    // LOAD DATA
    const loadData = async (pageNum = 1) => {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:8081/api/admin/level/?pageNo=${pageNum}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : '',
                },
            });

            const data = await res.json();
            if (data?.data) {
                
                setLevels(data.data);
                setPage(data.current_page);
                setTotalPages(data.total_page);
            } else {
                setLevels([]);
            }
        } catch (err) {
            console.error('Lỗi load level:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(1);
    }, []);

    // OPEN ADD MODAL
    const handleAdd = () => {
        setIsEdit(false);
        setFormData({ id_level: null, level: '', description: '' });
        setModalOpen(true);
    };

    // OPEN EDIT MODAL
    const handleEdit = (item) => {
        setIsEdit(true);
        setFormData({
            id_level: item.id_level,
            level: item.level,
            description: item.description,
        });
        setModalOpen(true);
    };


    // SAVE (ADD OR EDIT)
    const handleSave = async () => {
        try {
            setLoading(true);
            const url = isEdit
                ? 'http://localhost:8081/api/admin/level/'
                : 'http://localhost:8081/api/admin/level/';

            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(formData),
            });

            await res.json();
            setModalOpen(false);
            showToast(`Lưu thành công`, 'success');
            loadData(page);
            
        } catch (err) {
            showToast(`Lỗi lưu level: ${err}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    // DELETE
    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await fetch(`http://localhost:8081/api/admin/level/id-level=${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                },
            });
            setConfirmDeleteId(null);
            showToast(`Xóa thành công`, 'success');
            loadData(page);
        } catch (err) {
            showToast(`Lỗi xoá level: ${err}`, 'error');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="p-6 space-y-5">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
                    <Layers className="w-6 h-6 text-orange-600" />
                    Quản lý level
                </h2>

                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg shadow transition-all"
                >
                    <Plus className="w-4 h-4" /> Thêm Level
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase border-b">
                        <tr>
                            <th className="px-6 py-3 text-left">ID</th>
                            <th className="px-6 py-3 text-left">Level</th>
                            <th className="px-6 py-3 text-left">Mô tả</th>
                            <th className="px-6 py-3 text-left">Ngày tạo</th>
                            <th className="px-6 py-3 text-left">Ngày cập nhật</th>
                            <th className="px-6 py-3 text-center">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {levels.length > 0 ? (
                            levels.map((lv) => (
                                <tr key={lv.id_level} className="border-b hover:bg-gray-50 transition">
                                    <td className="px-6 py-3">{lv.id_level}</td>
                                    <td className="px-6 py-3 font-medium">{lv.level}</td>
                                    <td className="px-6 py-3">{lv.description}</td>
                                    <td className="px-6 py-3">{formatDateTimeArray(lv.created_at)}</td>
                                    <td className="px-6 py-3">{formatDateTimeArray(lv.updated_at)}</td>
                                    <td className="px-6 py-3 flex items-center justify-center gap-3">
                                        <button
                                            onClick={() => handleEdit(lv)}
                                            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-full transition"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setConfirmDeleteId(lv.id_level)}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-400 italic">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <LoadingOverlay show={loading} />

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 select-none mt-4">
                <button
                    disabled={page === 0}
                    onClick={() => loadData(page - 1)}
                    className="p-2 rounded-lg border hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => loadData(idx)}
                            className={`px-3 py-1 rounded-lg text-sm border transition 
                                ${idx + 1 === page ? 'bg-orange-500 text-white border-orange-500' : 'hover:bg-orange-50'}`}
                        >
                            {idx + 1}
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

            {confirmDeleteId !== null && (
                <div className="fixed inset-0 !mt-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center select-none">
                        <h3 className="text-lg font-semibold mb-3">Xác nhận xoá</h3>
                        <p className="text-gray-600 mb-6">Bạn có chắc muốn xoá mục này?</p>

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-4 py-2 border rounded-md hover:bg-gray-100 transition"
                            >
                                Hủy
                            </button>

                            <button
                                onClick={() => handleDelete(confirmDeleteId)}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                            >
                                Xoá
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL (GỘP CHUNG ADD + EDIT) */}
            {modalOpen && (
                <div className="fixed inset-0 !mt-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg w-[420px] p-5 space-y-4 shadow-xl">
                        <h2 className="text-lg font-semibold">{isEdit ? 'Chỉnh sửa Level' : 'Thêm Level'}</h2>

                        <div className="space-y-1">
                            <label className="text-sm">Level</label>
                            <input
                                className="w-full px-3 py-2 p-4 rounded-xl border border-gray-300 outline-orange-500"
                                value={formData.level}
                                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm">Mô tả</label>
                            <textarea
                                className="w-full px-3 py-2 p-4 rounded-xl border border-gray-300 outline-orange-500"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg">
                                Hủy
                            </button>
                            <button onClick={handleSave} className="px-4 py-2 bg-orange-600 text-white rounded-lg">
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
