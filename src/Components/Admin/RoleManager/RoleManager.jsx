import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

// Fake API mô phỏng lấy danh sách role + phân trang
const getRoles = (page, size) =>
    new Promise((resolve) => {
        setTimeout(() => {
            const total = 47;
            const data = Array.from({ length: size }).map((_, i) => {
                const id = page * size + i + 1;
                return {
                    id_role: id,
                    role_name: `Role ${id}`,
                    created_at: '01-01-2026 12:00:00',
                };
            });
            resolve({ data, total });
        }, 400);
    });

export default function RoleManager() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const [page, setPage] = useState(0);
    const size = 10;
    const [totalPages, setTotalPages] = useState(0);

    const loadData = async (p = 0) => {
        setLoading(true);
        const res = await getRoles(p, size);
        setRoles(res.data);
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
        if (window.confirm('Bạn có chắc muốn xóa role này?')) {
            setRoles((prev) => prev.filter((x) => x.id_role !== id));
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white shadow rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                        <Shield className="w-6 h-6 text-orange-600" />
                        Quản lý Role
                    </h2>

                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                    >
                        <Plus className="w-4 h-4" /> Thêm mới
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700">
                            <tr>
                                <th className="p-3">ID</th>
                                <th className="p-3">Tên Role</th>
                                <th className="p-3">Ngày tạo</th>
                                <th className="p-3">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center">
                                        Đang tải...
                                    </td>
                                </tr>
                            ) : roles.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-gray-500">
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            ) : (
                                roles.map((item) => (
                                    <tr key={item.id_role} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{item.id_role}</td>
                                        <td className="p-3 font-medium">{item.role_name}</td>
                                        <td className="p-3">{item.created_at}</td>
                                        <td className="p-3 flex gap-2">
                                            <button
                                                onClick={() => openEdit(item)}
                                                className="p-2 rounded bg-blue-50 hover:bg-blue-100 text-blue-600"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteItem(item.id_role)}
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
                <RoleModal
                    data={editData}
                    onClose={() => setModalOpen(false)}
                    onSave={(obj) => {
                        if (editData) {
                            setRoles((prev) => prev.map((x) => (x.id_role === obj.id_role ? obj : x)));
                        } else {
                            setRoles((prev) => [...prev, { ...obj, id_role: prev.length + 1 }]);
                        }
                        setModalOpen(false);
                    }}
                />
            )}
        </div>
    );
}

// ===== Modal Component =====
function RoleModal({ data, onClose, onSave }) {
    const [name, setName] = useState(data?.role_name || '');

    const submit = () => {
        if (!name.trim()) return alert('Tên role không được bỏ trống');
        onSave({ ...data, role_name: name });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white w-[400px] p-5 rounded-xl shadow">
                <h3 className="text-lg font-semibold mb-3">{data ? 'Sửa Role' : 'Thêm Role'}</h3>

                <input
                    className="border p-2 w-full rounded"
                    placeholder="Tên role (VD: ADMIN, USER...)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

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
