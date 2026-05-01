import React, { useState, useEffect } from 'react';
import { EyeIcon, Plus, User } from 'lucide-react';
import getCookie from '../../../../utils/getToken';
import avatarDefault from '../../../../assets/default-avatar.jpg';
import LoadingOverlay from '../../../../Layouts/LoadingOverLay/LoadingOverlay';
import {API_BASE_URL} from '../../../../utils/api';

const formatDateTime = (arr) => {
    if (!arr || arr.length < 6) return '';
    const [year, month, day, hour, minute, second] = arr;
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} ${hour
        .toString()
        .padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
};

const formatDate = (arr) => {
    if (!arr || arr.length < 3) return '';
    const [year, month, day] = arr;
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
};

export default function AdminCustomer() {
    const [query, setQuery] = useState('');
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [showDetail, setShowDetail] = useState(false);
    const [detail, setDetail] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const token = getCookie('token');

    // LOAD CUSTOMER LIST
    useEffect(() => {
        setLoading(true);
        fetch(`${API_BASE_URL}/admin/customers/?pageNo=${currentPage}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.data) {
                    setCustomers(res.data);
                    setTotalPages(res.total_page);
                }
                setLoading(false);
            })
            .catch((err) => console.error(err));
    }, [currentPage, token]);

    // LOCAL SEARCH FILTER
    const filtered = customers.filter((c) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;

        return (
            String(c.id_user).toLowerCase().includes(q) ||
            String(c.full_name || '')
                .toLowerCase()
                .includes(q) ||
            String(c.email || '')
                .toLowerCase()
                .includes(q) ||
            String(c.phone_number || '')
                .toLowerCase()
                .includes(q)
        );
    });

    // API GET DETAIL
    const openDetail = async (c) => {
        setShowDetail(true);
        setLoadingDetail(true);

        try {
            const res = await fetch(`${API_BASE_URL}/admin/customer/id=${c.id_user}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            if (json.data) setDetail(json.data);
        } catch (err) {
            console.error(err);
        }

        setLoadingDetail(false);
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
                    <User className="w-6 h-6 text-orange-600" />
                    Quản lý khách hàng
                </h2>

                {/* <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-orange-500 text-white border border-orange-500 hover:bg-white hover:text-orange-500 transition">
                    <Plus size={18} />
                    Add Customer
                </button> */}
            </div>

            {/* Search */}
            <div className="flex items-center justify-between mb-4 mt-4">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="text"
                    placeholder="Search by id, name, email or phone..."
                    className="px-4 py-2 border rounded-lg w-80 focus:outline-none focus:ring focus:ring-orange-300"
                />
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto bg-white shadow rounded-lg border">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                        <tr>
                            <th className="p-3 text-left">Avatar</th>
                            <th className="p-3 text-left">Full Name</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((c) => (
                            <tr key={c.id_user} className="border-t hover:bg-gray-50">
                                <td className="p-3">
                                    <img
                                        src={
                                            c.avatarBase64
                                                ? c.avatarBase64.startsWith('data:image')
                                                    ? c.avatarBase64
                                                    : `data:image/jpeg;base64,${c.avatarBase64}`
                                                : avatarDefault
                                        }
                                        className="w-12 h-12 rounded-full object-cover border"
                                        alt="avatar"
                                    />
                                </td>
                                <td className="p-3">{c.full_name}</td>
                                <td className="p-3">{c.email}</td>
                                <td className="p-3 flex gap-2">
                                    <button
                                        onClick={() => openDetail(c)}
                                        className="flex items-center gap-2 px-3 py-1 rounded-md bg-orange-500/15 text-orange-600 font-semibold hover:bg-orange-500 hover:text-white transition"
                                    >
                                        <EyeIcon size={16} />
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-2 py-4 mt-4">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-md border bg-white text-gray-600 hover:bg-orange-100 hover:text-orange-600 disabled:opacity-40"
                    >
                        Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`min-w-[36px] h-9 rounded-md border font-semibold ${
                                currentPage === page
                                    ? 'bg-orange-500 text-white border-orange-500'
                                    : 'bg-white text-gray-700 hover:bg-orange-100 hover:text-orange-600'
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-md border bg-white text-gray-600 hover:bg-orange-100 hover:text-orange-600 disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            </div>

            <LoadingOverlay show={loading} />

            {/* DETAIL MODAL */}
            {showDetail && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white w-[600px] rounded-2xl shadow-lg p-6 relative animate-fadeIn">
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
                            onClick={() => setShowDetail(false)}
                        >
                            ✕
                        </button>

                        {loadingDetail && <p className="text-center py-6 text-gray-600">Đang tải...</p>}

                        {!loadingDetail && detail && (
                            <>
                                <div className="flex flex-col items-center gap-3 mb-6">
                                    <img
                                        src={
                                            detail.avatarBase64
                                                ? detail.avatarBase64.startsWith('data:image')
                                                    ? detail.avatarBase64
                                                    : `data:image/jpeg;base64,${detail.avatarBase64}`
                                                : avatarDefault
                                        }
                                        className="w-28 h-28 rounded-full object-cover border"
                                        alt="avatar"
                                    />
                                    <h2 className="text-xl font-semibold text-gray-800">{detail.full_name}</h2>
                                    <span className="text-gray-500 text-sm">ID: {detail.id_user}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Email</p>
                                        <p className="font-medium">{detail.email || '-'}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500">Số điện thoại</p>
                                        <p className="font-medium">{detail.phone_number || '-'}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500">Giới tính</p>
                                        <p className="font-medium">{detail.gender || '-'}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500">Ngày sinh</p>
                                        <p className="font-medium">{formatDate(detail.dob) || '-'}</p>
                                    </div>

                                    <div className="col-span-2">
                                        <p className="text-gray-500">Địa chỉ</p>
                                        <p className="font-medium">{detail.address || '-'}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500">Ngày tạo</p>
                                        <p className="font-medium">{formatDateTime(detail.created_at)}</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500">Ngày cập nhật</p>
                                        <p className="font-medium">{formatDateTime(detail.updated_at)}</p>
                                    </div>

                                    <div className="col-span-2">
                                        <p className="text-gray-500">Vai trò</p>
                                        <p className="font-medium">
                                            {detail.roleDTOS?.map((r) => r.role_name).join(', ')}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition"
                                        onClick={() => setShowDetail(false)}
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
