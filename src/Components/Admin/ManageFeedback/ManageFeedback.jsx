import { useState, useEffect } from 'react';
import { Eye, X, Send, ChevronLeft, ChevronRight, BadgeInfo } from 'lucide-react';
import getCookie from '../../../utils/getToken';
import { formatDateTimeArray } from '../../../utils/formatDate';
import LoadingOverlay from '../../../Layouts/LoadingOverLay/LoadingOverlay';
import { useToast } from '../../../Context/ToastContext';
export default function ManageFeedback() {
    const [requests, setRequests] = useState([]);
    const [selected, setSelected] = useState(null);
    const [reply, setReply] = useState('');
    const [loadingDetail, setLoadingDetail] = useState(false);
    const token = getCookie('token');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const loadData = async (pageIndex) => {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:8081/api/admin/feedback/?pageNo=${pageIndex + 1}`, {
                headers: { Authorization: token ? `Bearer ${token}` : '' },
            });
            const json = await res.json();
            setRequests(json.data || []);
            setTotalPages(json.total_page);
            setPage(json.current_page - 1);
        } catch {
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(page);
    }, [page]);


    // API LẤY DETAIL
    const openDetail = async (id_feedback) => {
        try {
            setLoadingDetail(true);
            setLoading(true);
            const res = await fetch(`http://localhost:8081/api/admin/feedback/id=${id_feedback}`, {
                headers: { Authorization: token ? `Bearer ${token}` : '' },
            });
            const json = await res.json();
            setSelected(json.data);
        } catch (err) {
            console.error('Lỗi load detail feedback:', err);
        } finally {
            setLoadingDetail(false);
            setLoading(false);
        }
    };

    const handleReply = async () => {
        if (!reply.trim()) return;

        try {
            setLoading(true);
            const res = await fetch(`http://localhost:8081/api/admin/feedback/reply/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify({
                    body: reply.trim(),
                    id_feedback: selected.id_feedback,
                }),
            });

            const json = await res.json();
            console.log('Reply API Response:', json);

            // Xử lý UI sau khi gửi thành công
            setReply('');
            showToast('Gửi phản hồi thành công!', 'success');
            await loadData(page);
            setSelected(null);
        } catch (err) {
            console.error('Lỗi khi gửi reply:', err);
            showToast('Gửi phản hồi thất bại', 'error');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="p-6 space-y-5">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
                <BadgeInfo className="w-6 h-6 text-orange-600" /> Quản lý Feedback
            </h2>

            {/* TABLE */}
            <div className="overflow-x-auto bg-white shadow rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase border-b">
                        <tr>
                            <th className="px-6 py-3 text-left">Mã feedback</th>
                            <th className="px-6 py-3 text-left">Khách hàng</th>
                            <th className="px-6 py-3 text-left">Kỹ thuật</th>
                            <th className="px-6 py-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length > 0 ? (
                            requests.map((r) => (
                                <tr key={r.id_request} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-3">{r.id_request}</td>
                                    <td className="px-6 py-3 font-medium">{r.name_customer}</td>
                                    <td className="px-6 py-3">{r.name_techinician || '—'}</td>
                                    <td className="px-6 py-3 text-center">
                                        <button
                                            onClick={() => openDetail(r.id_feedback)}
                                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
                                        >
                                            <Eye className="w-4 h-4 inline-block mr-1" />
                                            Xem
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-gray-500">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex gap-2 justify-center mt-3">
                <button
                    disabled={page === 0}
                    onClick={() => loadData(page - 1)}
                    className="p-2 border rounded disabled:opacity-40"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => loadData(i)}
                        className={`px-3 py-1 border rounded ${i === page ? 'bg-orange-500 text-white' : ''}`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    disabled={page === totalPages - 1}
                    onClick={() => loadData(page + 1)}
                    className="p-2 border rounded disabled:opacity-40"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* MODAL DETAIL */}
            {(selected || loadingDetail) && (
                <div className="fixed inset-0 z-50 !mt-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
                    <div className="bg-white max-w-3xl w-full rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease]">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <BadgeInfo className="w-5 h-5" />
                                Chi tiết Feedback
                            </h3>
                            {!loadingDetail && (
                                <button
                                    onClick={() => setSelected(null)}
                                    className="opacity-90 hover:opacity-100 transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Body */}
                        <div className="p-5 space-y-6 max-h-[75vh] overflow-y-auto">
                            {loadingDetail ? (
                                <div className="space-y-4">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
                                    <div className="h-24 bg-gray-200 rounded animate-pulse mt-3" />
                                </div>
                            ) : (
                                <>
                                    {/* Customer Info Card */}
                                    <div className="border rounded-xl p-4 bg-gray-50 space-y-1">
                                        <p>
                                            <b>Khách hàng:</b> {selected.name_customer}
                                        </p>
                                        <p>
                                            <b>Email:</b> {selected.email_customer}
                                        </p>
                                        <p>
                                            <b>SĐT:</b> {selected.phone_number_customer}
                                        </p>
                                        <p>
                                            <b>Dịch vụ:</b> {selected.name_service}
                                        </p>
                                        <p>
                                            <b>KTV:</b> {selected.name_techinician || '—'}
                                        </p>
                                        <p>
                                            <b>Mô tả:</b> {selected.description}
                                        </p>
                                    </div>

                                    {/* Feedback */}
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2">Feedback của khách</h4>
                                        {selected.content ? (
                                            <div className="p-3 border rounded-xl bg-white shadow-sm">
                                                <div className="text-sm leading-relaxed">{selected.content}</div>
                                                <div className="text-[11px] text-gray-500 mt-2">
                                                    {formatDateTimeArray(selected.created_at)}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-gray-500 text-sm italic">Chưa có feedback</div>
                                        )}
                                    </div>

                                    {/* Reply */}
                                    <div className="space-y-2">
                                        <textarea
                                            rows={3}
                                            value={reply}
                                            onChange={(e) => setReply(e.target.value)}
                                            placeholder="Nhập phản hồi..."
                                            className="w-full p-4 rounded-xl border border-gray-300 outline-orange-500 text-sm focus:border-blue-500 focus:ring-blue-400 focus:ring-1 transition bg-white"
                                        />
                                        <button
                                            onClick={handleReply}
                                            className="w-full p-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                                        >
                                            <Send className="w-4 h-4" />
                                            Gửi phản hồi
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <LoadingOverlay show={loading} />
        </div>
    );
}
