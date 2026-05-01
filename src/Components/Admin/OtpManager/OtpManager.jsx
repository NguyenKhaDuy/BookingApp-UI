import { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Mail, ChevronLeft, ChevronRight, KeyRound } from 'lucide-react';
import getCookie from '../../../utils/getToken';
import { formatDateTimeArray } from '../../../utils/formatDate';
import LoadingOverlay from '../../../Layouts/LoadingOverLay/LoadingOverlay';
import { useToast } from '../../../Context/ToastContext';
import { API_BASE_URL } from '../../../utils/api.js';

export default function OtpManager() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const token = getCookie('token');
    const { showToast } = useToast();

    const [selectedIds, setSelectedIds] = useState([]);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        fetchRealOtp(page);
    }, [page]);

    const fetchRealOtp = async (pageIndex = 0) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/admin/otp-verification/`, {
                params: { pageNo: pageIndex + 1 },
                headers: { Authorization: token ? `Bearer ${token}` : '' },
                withCredentials: true,
            });

            const json = res.data;

            console.log('CALL PAGE:', pageIndex + 1);
            console.log('RESPONSE:', json);

            setList(json.data || []);
            setTotalPages(json.total_page || 0);

            // ❌ KHÔNG setPage ở đây nữa (tránh loop)

            setSelectedIds([]);
        } catch (err) {
            console.error('FETCH OTP ERROR:', err);
            showToast('Lỗi tải dữ liệu', 'error');
        } finally {
            setLoading(false);
        }
    };

    const toggleSelectOne = (id) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === list.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(list.map((item) => item.id_otp));
        }
    };

    const confirmDeleteAction = async () => {
        try {
            setLoading(true);

            await axios.delete(`${API_BASE_URL}/admin/otp-verification/`, {
                data: { id: selectedIds },
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            setConfirmDelete(false);

            // reload lại page hiện tại
            fetchRealOtp(page);

            showToast('Xóa thành công', 'success');
        } catch (err) {
            console.error('DELETE OTP ERROR:', err);
            showToast('Xóa không thành công', 'error');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'VALID':
                return 'text-green-600 bg-green-100';
            case 'USED':
                return 'text-blue-600 bg-blue-100';
            case 'EXPIRED':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
                    <KeyRound className="w-6 h-6 text-orange-600" /> Quản lý OTP
                </h2>

                {selectedIds.length > 0 && (
                    <button
                        onClick={() => setConfirmDelete(true)}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                    >
                        Xoá {selectedIds.length} mục
                    </button>
                )}
            </div>

            {loading && <div className="text-center py-4 text-gray-500">Đang tải...</div>}

            {!loading && (
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-3 py-3 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.length === list.length && list.length > 0}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="px-4 py-3">User</th>
                                <th className="px-4 py-3">OTP</th>
                                <th className="px-4 py-3">Trạng thái</th>
                                <th className="px-4 py-3">Hết hạn</th>
                                <th className="px-4 py-3">Tạo lúc</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((item) => (
                                <tr key={item.id_otp} className="border-b hover:bg-gray-50">
                                    <td className="px-3 py-3 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(item.id_otp)}
                                            onChange={() => toggleSelectOne(item.id_otp)}
                                        />
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <User size={16} />
                                            <div>
                                                <div className="font-medium text-gray-800">
                                                    {item.userDTO?.full_name || 'Không có tên'}
                                                </div>

                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Mail size={14} /> {item.userDTO?.email || 'Không có email'}
                                                </div>

                                                <div className="text-xs text-gray-400">
                                                    {item.userDTO?.phone_number || 'Không có SĐT'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 font-semibold text-gray-800">{item.otp_code}</td>

                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-md text-xs ${getStatusStyle(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 text-gray-700">{formatDateTimeArray(item.expires_at)}</td>
                                    <td className="px-4 py-3 text-gray-700">{formatDateTimeArray(item.created_at)}</td>
                                </tr>
                            ))}

                            {list.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-gray-500">
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 p-3 bg-white">
                <button
                    disabled={page === 0}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                    className="p-2 rounded-lg border"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`px-3 py-1 rounded-lg text-sm border ${
                            i === page ? 'bg-orange-600 text-white border-orange-600' : 'hover:bg-orange-50'
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    disabled={page === totalPages - 1}
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                    className="p-2 rounded-lg border"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* Confirm Delete */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[350px] rounded-2xl shadow-xl p-6 space-y-5">
                        <p className="text-lg font-semibold text-center">Xác nhận xóa</p>
                        <p className="text-sm text-gray-500 text-center">Xóa {selectedIds.length} OTP?</p>

                        <div className="flex justify-end gap-3">
                            <button onClick={() => setConfirmDelete(false)} className="px-4 py-2 border rounded-lg">
                                Hủy
                            </button>
                            <button
                                onClick={confirmDeleteAction}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg"
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
