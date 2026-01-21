import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';

// Fake service gọi API mô phỏng
const getPaymentMethods = (page, size) =>
    new Promise((resolve) => {
        setTimeout(() => {
            const total = 32;
            const data = Array.from({ length: size }).map((_, i) => {
                const id = page * size + i + 1;
                return {
                    id_method: id,
                    name_method: `Phương thức ${id}`,
                    provider: id % 2 === 0 ? 'MoMo' : 'VNPay',
                    iconBase64: null,
                    created_at: '01-01-2026 12:00:00',
                };
            });
            resolve({ data, total });
        }, 450);
    });

export default function PaymentMethodManager() {
    const [methods, setMethods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const [page, setPage] = useState(0);
    const size = 10;
    const [totalPages, setTotalPages] = useState(0);

    const loadData = async (p = 0) => {
        setLoading(true);
        const res = await getPaymentMethods(p, size);
        setMethods(res.data);
        setTotalPages(Math.ceil(res.total / size));
        setPage(p);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const openAdd = () => {
        setEditData(null);
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setEditData(item);
        setModalOpen(true);
    };

    const deleteItem = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa phương thức này?')) {
            setMethods((prev) => prev.filter((x) => x.id_method !== id));
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
                                                    alt=""
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
                                                onClick={() => deleteItem(item.id_method)}
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

            {modalOpen && (
                <PaymentMethodModal
                    data={editData}
                    onClose={() => setModalOpen(false)}
                    onSave={(obj) => {
                        if (editData) {
                            setMethods((prev) => prev.map((x) => (x.id_method === obj.id_method ? obj : x)));
                        } else {
                            setMethods((prev) => [...prev, { ...obj, id_method: prev.length + 1 }]);
                        }
                        setModalOpen(false);
                    }}
                />
            )}
        </div>
    );
}

// ===== Modal Component =====
function PaymentMethodModal({ data, onClose, onSave }) {
    const [name, setName] = useState(data?.name_method || '');
    const [provider, setProvider] = useState(data?.provider || '');
    const [iconBase64, setIconBase64] = useState(data?.iconBase64 || null);
    const [preview, setPreview] = useState(data?.iconBase64 ? `data:image/png;base64,${data.iconBase64}` : null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];
            setIconBase64(base64String);
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const submit = () => {
        if (!name.trim()) return alert('Tên phương thức không được bỏ trống');
        onSave({ ...data, name_method: name, provider, iconBase64 });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white w-[450px] p-5 rounded-xl shadow">
                <h3 className="text-lg font-semibold mb-3">{data ? 'Sửa phương thức' : 'Thêm phương thức'}</h3>

                <div className="flex flex-col gap-3">
                    <input
                        className="border p-2 rounded"
                        placeholder="Tên phương thức"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        className="border p-2 rounded"
                        placeholder="Nhà cung cấp (VD: MoMo, VNPay...)"
                        value={provider}
                        onChange={(e) => setProvider(e.target.value)}
                    />

                    {/* Upload Icon */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Icon</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        {preview && (
                            <img src={preview} alt="preview" className="w-16 h-16 mt-2 rounded border object-cover" />
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="px-4 py-2 border rounded-lg">
                        Hủy
                    </button>
                    <button onClick={submit} className="px-4 py-2 bg-orange-600 text-white rounded-lg">
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
}
