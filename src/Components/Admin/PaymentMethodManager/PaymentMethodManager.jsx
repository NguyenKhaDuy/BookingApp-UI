import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import getCookie from '../../../utils/getToken';
import { useToast } from '../../../Context/ToastContext';
import LoadingOverlay from '../../../Layouts/LoadingOverLay/LoadingOverlay';
import {API_BASE_URL} from '../../../utils/api.js';

export default function PaymentMethodManager() {
    const [methods, setMethods] = useState([]);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Modal fields
    const [name, setName] = useState('');
    const [provider, setProvider] = useState('');
    const [iconFile, setIconFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // Confirm delete popup
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const token = getCookie('token');

    const loadData = async (p = 0) => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/admin/paymentmethod/?pageNo=${p + 1}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMethods(res.data.data || []);
            setTotalPages(res.data.total_page || 0);
            setPage(p);
        } catch (err) {
            console.error(err);
            showToast('Không thể tải dữ liệu phương thức thanh toán!', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const openAdd = () => {
        setEditData(null);
        setName('');
        setProvider('');
        setIconFile(null);
        setPreview(null);
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setEditData(item);
        setName(item.name_method);
        setProvider(item.provider);
        setPreview(item.iconBase64 ? `data:image/png;base64,${item.iconBase64}` : null);
        setIconFile(null);
        setModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIconFile(file);

        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const saveModal = async () => {
        if (!name.trim()) {
            showToast('Tên phương thức không được để trống!', 'error');
            return;
        }

        const formData = new FormData();
        if (editData) formData.append('id_method', editData.id_method);
        formData.append('name_method', name);
        formData.append('provider', provider);

        if (iconFile) {
            formData.append('iconBase64', iconFile);
        }

        try {
            setLoading(true);
            await axios({
                method: editData ? 'put' : 'post',
                url: '${API_BASE_URL}/admin/payment/',
                data: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
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

    const deletePayment = async () => {
        if (!deleteId) return;
        try {
            setLoading(true);
            await axios.delete(`${API_BASE_URL}/admin/payment/id-payment=${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            showToast('Xoá thành công!', 'success');
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
                        <CreditCard className="w-6 h-6 text-orange-600" />
                        Quản lý phương thức thanh toán
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
                                <th className="p-3">Tên phương thức</th>
                                <th className="p-3">Nhà cung cấp</th>
                                <th className="p-3">Icon</th>
                                <th className="p-3">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center">
                                        Đang tải...
                                    </td>
                                </tr>
                            ) : methods.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-gray-500">
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            ) : (
                                methods.map((item) => (
                                    <tr key={item.id_method} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{item.id_method}</td>
                                        <td className="p-3 font-medium">{item.name_method}</td>
                                        <td className="p-3">{item.provider}</td>
                                        <td className="p-3">
                                            {item.iconBase64 ? (
                                                <img
                                                    src={`data:image/png;base64,${item.iconBase64}`}
                                                    className="w-8 h-8 rounded"
                                                />
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">No Icon</span>
                                            )}
                                        </td>
                                        <td className="p-3 flex gap-2">
                                            <button
                                                onClick={() => openEdit(item)}
                                                className="p-2 rounded bg-blue-50 hover:bg-blue-100 text-blue-600"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => openDeleteConfirm(item.id_method)}
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

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 p-4 bg-white">
                    <button
                        disabled={page === 0}
                        onClick={() => loadData(page - 1)}
                        className="p-2 rounded-lg border disabled:opacity-40"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => loadData(i)}
                            className={`px-3 py-1 rounded-lg text-sm border ${
                                i === page ? 'bg-orange-600 text-white border-orange-600' : ''
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={page === totalPages - 1}
                        onClick={() => loadData(page + 1)}
                        className="p-2 rounded-lg border disabled:opacity-40"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white w-[450px] p-5 rounded-xl shadow animate-scaleIn">
                        <h3 className="text-lg font-semibold mb-3">
                            {editData ? 'Sửa phương thức' : 'Thêm phương thức'}
                        </h3>

                        <div className="flex flex-col gap-3">
                            <input
                                className="p-4 rounded-xl border border-gray-300 outline-orange-500"
                                placeholder="Tên phương thức"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <input
                                className="p-4 rounded-xl border border-gray-300 outline-orange-500"
                                placeholder="Nhà cung cấp"
                                value={provider}
                                onChange={(e) => setProvider(e.target.value)}
                            />

                            <div>
                                <label className="block text-sm font-medium mb-1">Icon</label>
                                <input type="file" accept="image/*" onChange={handleFileChange} />
                                {preview && (
                                    <img src={preview} className="w-16 h-16 mt-2 rounded border object-cover" />
                                )}
                            </div>
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

            {/* Confirm Delete Popup */}
            {confirmOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white w-[380px] p-6 rounded-2xl shadow-xl animate-scaleIn">
                        <h3 className="text-xl font-semibold text-gray-800">Xác nhận xóa</h3>
                        <p className="text-gray-600 mt-2 leading-relaxed">
                            Bạn có chắc chắn muốn xóa phương thức thanh toán này không?
                            <br />
                            Hành động này <span className="font-semibold">không thể hoàn tác</span>.
                        </p>

                        <div className="flex justify-end gap-2 mt-5">
                            <button
                                onClick={() => setConfirmOpen(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                            >
                                Hủy
                            </button>

                            <button
                                onClick={deletePayment}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <LoadingOverlay show={loading}/>
        </div>
    );
}
