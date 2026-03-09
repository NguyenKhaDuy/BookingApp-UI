import axios from 'axios';
import { useEffect, useState } from 'react';
import getCookie from '../../../utils/getToken';
import { Bell, ChevronLeft, ChevronRight } from 'lucide-react';


export default function Notifications({ onAcceptOrder }) {
    const [notifications, setNotifications] = useState([]);
    const [acceptedOrders, setAcceptedOrders] = useState([]);

    // ===== POPUP DETAIL =====
    const [openDetail, setOpenDetail] = useState(false);
    const [detail, setDetail] = useState(null);

    // ===== PAGINATION =====
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    const token = getCookie('token');

    useEffect(() => {
        fetchNotifications(page);
    }, [page]);

    // ===== FORMAT DATE =====
    const formatTimeFromArray = (arr) => {
        if (!arr || arr.length < 6) return '';
        const date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
        return date.toLocaleString();
    };

    
    // ===== FETCH NOTIFICATION LIST =====
    const fetchNotifications = async (pageNo = 1) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user?.id_user) return;

            const res = await axios.get(`http://localhost:8081/api/notification/id_user=${user.id_user}`, {
                params: { pageNo },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setNotifications(res.data?.data || []);
            setPage(res.data?.current_page || 1);
            setTotalPage(res.data?.total_page || 1);
        } catch (err) {
            console.error('Fetch notifications error:', err);
        }
    };

    // ===== CLICK → READ + DETAIL =====
    const handleClickNotification = async (msg) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user?.id_user) return;

            const res = await axios.get('http://localhost:8081/api/user/notification/', {
                params: {
                    id_user: user.id_user,
                    id_notify: msg.id_notify,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // popup detail
            setDetail(res.data.data);
            setOpenDetail(true);

            // update UI → đã đọc
            setNotifications((prev) => prev.map((n) => (n.id_notify === msg.id_notify ? { ...n, status_id: 1 } : n)));

            // update badge sidebar
            window.dispatchEvent(new Event('notification-read'));
        } catch (err) {
            console.error('Read notification error:', err);
        }
    };

    // ===== ACCEPT ORDER =====
    const handleAccept = (orderId) => {
        setAcceptedOrders((prev) => [...prev, orderId]);
        onAcceptOrder?.(orderId);
    };


    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Thông báo</h1>

            <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-3">
                {notifications.length === 0 && <p className="text-center text-gray-500">Không có thông báo</p>}

                {notifications.map((msg) => {
                    const isUnread = msg.status_id === 2;
                    const isAccepted = acceptedOrders.includes(msg.order_id);

                    return (
                        <div
                            key={msg.id_notify}
                            onClick={() => handleClickNotification(msg)}
                            className={`cursor-pointer relative p-3 border-b flex items-start justify-between gap-4 rounded-xl transition
                                ${isUnread ? 'bg-orange-50 border-l-4 border-orange-500' : 'bg-white hover:bg-gray-50'}
                            `}
                        >
                            {/* DOT */}
                            {isUnread && (
                                <span className="absolute left-2 top-5 w-2.5 h-2.5 bg-orange-500 rounded-full"></span>
                            )}

                            <div className="flex flex-col gap-1 pl-4">
                                <span
                                    className={`text-sm ${isUnread ? 'font-semibold text-gray-900' : 'text-gray-700'}`}
                                >
                                    {msg.title}
                                </span>

                                <span className="text-gray-600 text-sm truncate block max-w-[300px]">
                                    {msg.message}
                                </span>

                                <span className="text-[11px] text-gray-400">{formatTimeFromArray(msg.created_at)}</span>
                            </div>

                            {msg.type === 'NEW_ORDER' &&
                                (!isAccepted ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAccept(msg.order_id);
                                        }}
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 h-9 rounded-lg text-sm"
                                    >
                                        Nhận đơn
                                    </button>
                                ) : (
                                    <span className="text-green-600 font-semibold">✓ Đã nhận đơn</span>
                                ))}
                        </div>
                    );
                })}
            </div>

            {/* ===== PAGINATION ===== */}
            {totalPage > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {/* Nút Trước */}
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-3 py-2 border rounded flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={18} />
                        Trước
                    </button>

                    {/* Nút số trang */}
                    {[...Array(totalPage)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-2 rounded ${page === i + 1 ? 'bg-orange-500 text-white' : 'border'}`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    {/* Nút Sau */}
                    <button
                        disabled={page === totalPage}
                        onClick={() => setPage(page + 1)}
                        className="px-3 py-2 border rounded flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Sau
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}

            {/* ===== POPUP DETAIL ===== */}
            {openDetail && detail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setOpenDetail(false)}
                    />

                    {/* Card */}
                    <div className="relative w-[460px] max-w-[90%] bg-white rounded-2xl shadow-2xl p-6 animate-[fadeIn_.2s_ease-out]">
                        {/* Close */}
                        <button
                            onClick={() => setOpenDetail(false)}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full
                           bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-black transition"
                        >
                            ✕
                        </button>

                        {/* Header */}
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-100 text-orange-600">
                                <Bell size={20} strokeWidth={2} />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 leading-snug">{detail.title}</h2>
                                <p className="text-xs text-gray-400 mt-0.5">{formatTimeFromArray(detail.created_at)}</p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-200 mb-4" />

                        {/* Content */}
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{detail.message}</p>

                        {/* Footer */}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setOpenDetail(false)}
                                className="px-4 py-2 text-sm rounded-lg
                               bg-orange-500 hover:bg-orange-600 text-white transition"
                            >
                                Đã hiểu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
