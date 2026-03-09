import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { EyeIcon, Plus, X } from 'lucide-react';
import getCookie from '../../../../utils/getToken';
import avatarDefault from '../../../../assets/default-avatar.jpg';
import LoadingOverlay from '../../../../Layouts/LoadingOverLay/LoadingOverlay';

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

const formatTime = (arr) => {
    if (!arr || !Array.isArray(arr) || arr.length < 2) return 'N/A';
    const [h, m] = arr;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export default function AdminTechnicians() {
    const [query, setQuery] = useState('');
    const [technicians, setTechnicians] = useState([]);
    const token = getCookie('token');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(false);

    // MODAL DETAIL
    const [showDetail, setShowDetail] = useState(false);
    const [detailData, setDetailData] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const fetchTechnicians = async (page = 1) => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:8081/api/all/technician/?pageNo=${page}`);
            if (res.data?.data) {
                setTechnicians(res.data.data);
                setTotalPages(res.data.total_page || 1);
                setCurrentPage(res.data.current_page || 1);
            }
        } catch (err) {
            console.error('Error fetching technicians:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTechnicians(currentPage);
    }, [currentPage]);

    const filtered = technicians.filter((c) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
            c.id_user?.toLowerCase().includes(q) ||
            c.full_name?.toLowerCase().includes(q) ||
            c.email?.toLowerCase().includes(q) ||
            c.phone_number?.toLowerCase().includes(q)
        );
    });

    // ================= GET DETAIL API =================
    const openDetail = async (item) => {
        setShowDetail(true);
        setDetailData(null);
        setLoadingDetail(true);
        try {
            const res = await axios.get(`http://localhost:8081/api/detail-technician/id=${item.id_user}`);
            setDetailData(res.data.data);
        } catch (error) {
            console.error('Detail fetch error:', error);
        } finally {
            setLoadingDetail(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-700 mb-4">Technician Management</h1>

            {/* Search */}
            <div className="flex items-center justify-between mb-4 gap-4">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="text"
                    placeholder="Search by id, name, email or phone..."
                    className="px-4 py-2 border rounded-lg w-80 focus:outline-none focus:ring focus:ring-orange-300"
                />

                <button
                    onClick={() => alert('TODO: Open add modal')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-orange-500 text-white"
                >
                    <Plus size={18} />
                    Add Technician
                </button>
            </div>

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
                                <td className="p-3">
                                    <button
                                        onClick={() => openDetail(c)}
                                        className="flex items-center gap-2 px-3 py-1 rounded-md bg-orange-500/15 text-orange-600 font-semibold hover:bg-orange-500 hover:text-white"
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

            {/* ===================== DETAIL MODAL ===================== */}
            {showDetail && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-3xl p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
                        {/* Close button */}
                        <button
                            onClick={() => setShowDetail(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-black"
                        >
                            <X size={20} />
                        </button>

                        {loadingDetail && (
                            <div className="py-20 text-center font-semibold text-gray-600">Loading detail...</div>
                        )}

                        {detailData && (
                            <>
                                {/* HEADER */}
                                <div className="flex items-center gap-4 mb-6">
                                    <img
                                        src={
                                            detailData.avatarBase64
                                                ? detailData.avatarBase64.startsWith('data:image')
                                                    ? detailData.avatarBase64
                                                    : `data:image/jpeg;base64,${detailData.avatarBase64}`
                                                : avatarDefault
                                        }
                                        className="w-20 h-20 rounded-full border object-cover"
                                        alt="avatar"
                                    />

                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">{detailData.full_name}</h2>
                                        <p className="text-gray-600">{detailData.email}</p>
                                        <p className="text-gray-600">{detailData.phone_number}</p>
                                    </div>
                                </div>

                                {/* BODY GRID */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <p>
                                        <b>ID:</b> {detailData.id_user}
                                    </p>
                                    <p>
                                        <b>Gender:</b> {detailData.gender}
                                    </p>
                                    <p>
                                        <b>DOB:</b> {formatDate(detailData.dob)}
                                    </p>
                                    <p>
                                        <b>Experience:</b> {detailData.experience_year} years
                                    </p>
                                    <p>
                                        <b>Status:</b> {detailData.status_technician}
                                    </p>
                                    <p>
                                        <b>Level:</b> {detailData.level}
                                    </p>
                                    <p>
                                        <b>Total Star:</b> {detailData.total_star}
                                    </p>
                                    <p>
                                        <b>Efficiency:</b> {detailData.efficiency}%
                                    </p>
                                </div>

                                {/* WORKING AREA */}
                                <div className="mt-4">
                                    <b>Working Area:</b>
                                    <div className="mt-1 text-gray-700">{detailData.working_area}</div>
                                </div>

                                {/* SERVICES */}
                                <div className="mt-4">
                                    <b>Services:</b>
                                    <div className="flex gap-2 flex-wrap mt-1">
                                        {detailData.nameServiceTechnician?.map((x, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs"
                                            >
                                                {x}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                {/* LOCATION LIST */}
                                <div className="mt-6">
                                    <h3 className="text-md font-semibold text-gray-700 mb-2">Working Locations</h3>
                                    {detailData.locationTechnicianDTOS?.length > 0 ? (
                                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                                            {detailData.locationTechnicianDTOS.map((loc, idx) => (
                                                <div
                                                    key={idx}
                                                    className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700"
                                                >
                                                    {loc.ward}, {loc.district}, {loc.conscious}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm">No locations</p>
                                    )}
                                </div>

                                {/* SCHEDULE LIST */}
                                <div className="mt-6">
                                    <h3 className="text-md font-semibold text-gray-700 mb-2">Schedules</h3>
                                    {detailData.technicianScheduleDTOS?.length > 0 ? (
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                            {detailData.technicianScheduleDTOS.map((s, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-3 border rounded-lg flex justify-between items-center"
                                                >
                                                    <div>
                                                        <div className="text-gray-800 font-medium">
                                                            {formatDate(s.date)}
                                                        </div>
                                                        <div className="text-gray-600 text-sm">
                                                            {formatTime(s.time_start)} → {formatTime(s.time_end)}
                                                        </div>
                                                    </div>
                                                    <span
                                                        className={`text-xs px-2 py-1 rounded ${
                                                            s.status_code === 'ACTIVE'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-gray-200 text-gray-700'
                                                        }`}
                                                    >
                                                        {s.status_code}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm">No schedules</p>
                                    )}
                                </div>

                                {/* ============== WALLET INFO ============== */}
                                <div className="mt-6">
                                    <h3 className="text-md font-semibold text-gray-700 mb-2">Technician Wallet</h3>
                                    {detailData.technicianWalletDTO ? (
                                        <div className="p-4 border rounded-lg bg-gray-50">
                                            <p>
                                                <b>Wallet ID:</b> {detailData.technicianWalletDTO.idWallet}
                                            </p>
                                            <p>
                                                <b>Balance:</b> {detailData.technicianWalletDTO.balance} VND
                                            </p>
                                            <p>
                                                <b>Code:</b> {detailData.technicianWalletDTO.code}
                                            </p>
                                            <p>
                                                <b>Technician:</b> {detailData.technicianWalletDTO.technician_name}
                                            </p>

                                            {/* Linked Banks */}
                                            <div className="mt-2">
                                                <b>Linked Bank Accounts:</b>
                                                {detailData.technicianWalletDTO.linkBankAccountDTOS?.length > 0 ? (
                                                    <ul className="list-disc list-inside text-sm mt-1">
                                                        {detailData.technicianWalletDTO.linkBankAccountDTOS.map(
                                                            (b, i) => (
                                                                <li key={i}>
                                                                    {b.bank_name} - {b.account_no}
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                ) : (
                                                    <p className="text-gray-500 text-sm">No linked banks</p>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm">No wallet info</p>
                                    )}
                                </div>

                                {/* ============== RATINGS LIST ============== */}
                                <div className="mt-6">
                                    <h3 className="text-md font-semibold text-gray-700 mb-2">Ratings</h3>
                                    {detailData.ratingDTOS?.length > 0 ? (
                                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                            {detailData.ratingDTOS.map((r, idx) => (
                                                <div key={idx} className="p-3 border rounded-lg flex gap-3">
                                                    <img
                                                        src={
                                                            r.avatarBase64
                                                                ? r.avatarBase64.startsWith('data:image')
                                                                    ? r.avatarBase64
                                                                    : `data:image/jpeg;base64,${r.avatarBase64}`
                                                                : avatarDefault
                                                        }
                                                        className="w-10 h-10 rounded-full border object-cover"
                                                        alt="avatar"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="font-medium">{r.full_name}</div>
                                                        <div className="text-yellow-500 text-sm">
                                                            {'★'.repeat(r.stars)}
                                                        </div>
                                                        <div className="text-gray-700 text-sm">{r.comment}</div>
                                                        <div className="text-xs text-gray-400 mt-1">
                                                            {formatDateTime(r.created_at)}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm">No ratings yet</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
