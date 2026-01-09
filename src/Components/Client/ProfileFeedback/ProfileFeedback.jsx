import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function ProfileFeedback({ profile }) {
    const [content, setContent] = useState('');
    const [requestId, setRequestId] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [success, setSuccess] = useState(null);

    /* ================= FETCH REQUESTS ================= */
    const fetchRequests = useCallback(async () => {
        try {
            setLoadingRequests(true);

            const token = localStorage.getItem('token');
            if (!token || !profile?.id_user) return;

            const res = await fetch(`http://localhost:8081/api/customer/request/id_customer=${profile.id_user}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const json = await res.json();

            if (json.message === 'Success') {
                setRequests(json.data || []);
            } else {
                console.error(json.message);
            }
        } catch (err) {
            console.error('Lỗi lấy danh sách request', err);
        } finally {
            setLoadingRequests(false);
        }
    }, [profile]);

    /* ================= INIT ================= */
    useEffect(() => {
        if (profile?.id_user) {
            fetchRequests();
        }
    }, [profile, fetchRequests]);

    /* ================= SUBMIT FEEDBACK ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            setLoading(true);
            setSuccess(null);

            const token = localStorage.getItem('token');

            await axios.post(
                'http://localhost:8081/api/customer/feedback/',
                {
                    content,
                    customer_id: profile.id_user,
                    request_id: requestId || null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            setContent('');
            setRequestId(null);
            setSuccess(true);
        } catch (error) {
            console.error('Gửi feedback lỗi:', error);
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };
    console.log(requests)

    /* ================= UI ================= */
    return (
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Góp ý & Phản hồi</h2>

            <p className="text-sm text-gray-500 mb-5">Ý kiến của bạn giúp chúng tôi cải thiện dịch vụ tốt hơn</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* ===== SELECT REQUEST ===== */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã yêu cầu (không bắt buộc)</label>

                    <select
                        value={requestId ?? ''}
                        disabled={loadingRequests || requests.length === 0}
                        onChange={(e) => setRequestId(e.target.value ? Number(e.target.value) : null)}
                        className="
                            w-full rounded-xl bg-gray-50 text-gray-800
                            border border-gray-300 p-3
                            focus:outline-none focus:ring-2 focus:ring-orange-500
                            disabled:bg-gray-100 disabled:text-gray-400
                        "
                    >
                        <option value="">
                            {loadingRequests ? 'Đang tải danh sách yêu cầu...' : '— Không chọn mã yêu cầu —'}
                        </option>

                        {requests.map((req) => (
                            <option key={req.id_request} value={req.id_request}>
                                {req.code || `Yêu cầu #${req.id_request} ${req.status_code}`}
                            </option>
                        ))}
                    </select>
                </div>

                {/* ===== CONTENT ===== */}
                <textarea
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Nhập góp ý của bạn tại đây..."
                    className="
                        w-full rounded-xl bg-gray-50 text-gray-800
                        border border-gray-300 p-4
                        placeholder:text-gray-400
                        focus:outline-none focus:ring-2 focus:ring-orange-500
                    "
                />

                <button
                    disabled={loading}
                    className="
                        w-full py-3 rounded-xl font-semibold text-white
                        bg-orange-500 hover:bg-orange-600
                        transition disabled:opacity-60
                    "
                >
                    {loading ? 'Đang gửi phản hồi...' : 'Gửi phản hồi'}
                </button>

                {success === true && (
                    <div className="text-green-700 text-sm bg-green-100 border border-green-200 rounded-lg p-3">
                        Gửi phản hồi thành công. Cảm ơn bạn!
                    </div>
                )}

                {success === false && (
                    <div className="text-red-700 text-sm bg-red-100 border border-red-200 rounded-lg p-3">
                        Gửi phản hồi thất bại. Vui lòng thử lại.
                    </div>
                )}
            </form>
        </div>
    );
}
