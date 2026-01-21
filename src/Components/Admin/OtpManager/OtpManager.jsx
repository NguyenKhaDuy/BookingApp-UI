import { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, User, Mail, ChevronLeft, ChevronRight, KeyRound } from 'lucide-react';

export default function OtpManager() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);

    // Pagination
    const [page, setPage] = useState(0);
    const limit = 5;
    const totalPages = Math.ceil(list.length / limit);
    const paginatedData = list.slice(page * limit, (page + 1) * limit);

    useEffect(() => {
        fetchMockOtp();
    }, []);

    const fetchMockOtp = () => {
        const mock = [
            {
                id_otp: 1,
                otp_code: '482159',
                status: 'USED',
                expires_at: '20-01-2026 15:32:10',
                created_at: '20-01-2026 15:27:10',
                userDTO: {
                    id_user: 'U001',
                    full_name: 'Nguyễn Khả Duy',
                    email: 'duy@gmail.com',
                    phone_number: '0123456789',
                },
            },
            {
                id_otp: 2,
                otp_code: '953014',
                status: 'EXPIRED',
                expires_at: '20-01-2026 10:10:10',
                created_at: '20-01-2026 10:05:00',
                userDTO: {
                    id_user: 'U002',
                    full_name: 'Trần Minh',
                    email: 'minh@gmail.com',
                    phone_number: '0987654321',
                },
            },
            {
                id_otp: 3,
                otp_code: '775421',
                status: 'VALID',
                expires_at: '21-01-2026 09:00:00',
                created_at: '20-01-2026 22:20:10',
                userDTO: {
                    id_user: 'U003',
                    full_name: 'Lê Hồng',
                    email: 'hong@gmail.com',
                    phone_number: '077777777',
                },
            },
        ];
        setList(mock);
    };

    const fetchRealOtp = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8081/api/otp/');
            setList(res.data.data);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xóa OTP này?')) return;
        setList((prev) => prev.filter((item) => item.id_otp !== id));
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
            <div className="flex justify-between items-center">
                <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
                    <KeyRound className="w-6 h-6 text-orange-600" />
                    Quản lý OTP
                </h2>
            </div>

            <div className="w-full overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs uppercase bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">OTP</th>
                            <th className="px-4 py-3">Trạng thái</th>
                            <th className="px-4 py-3">Hết hạn</th>
                            <th className="px-4 py-3">Tạo lúc</th>
                            <th className="px-4 py-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((item) => (
                            <tr key={item.id_otp} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <User size={16} />
                                        <div>
                                            <div className="font-medium text-gray-800">{item.userDTO.full_name}</div>
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Mail size={14} /> {item.userDTO.email}
                                            </div>
                                            <div className="text-xs text-gray-400">{item.userDTO.phone_number}</div>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-4 py-3 font-semibold text-gray-800">{item.otp_code}</td>

                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-md text-xs ${getStatusStyle(item.status)}`}>
                                        {item.status}
                                    </span>
                                </td>

                                <td className="px-4 py-3 text-gray-700">{item.expires_at}</td>
                                <td className="px-4 py-3 text-gray-700">{item.created_at}</td>

                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => handleDelete(item.id_otp)}
                                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {paginatedData.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION (giống các component trước) */}
            <div className="flex items-center justify-center gap-2 p-3 bg-white">
                <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className="p-2 rounded-lg border hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed"
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
                    onClick={() => setPage(page + 1)}
                    className="p-2 rounded-lg border hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
