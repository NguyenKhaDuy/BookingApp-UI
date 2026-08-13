import axios from 'axios';
import { useEffect, useState } from 'react';
import getCookie from '../../../utils/getToken';
import { Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { X } from 'lucide-react';

export default function Notifications({ onAcceptOrder }) {
    const [notifications, setNotifications] = useState([]);
    const [acceptedOrders, setAcceptedOrders] = useState([]);

    const [openDetail, setOpenDetail] = useState(false);
    const [detail, setDetail] = useState(null);

    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    const token = getCookie('token');

    const parseDateTime = (dateTime) => {
        if (!dateTime) {
            return 0;
        }

        if (typeof dateTime === 'string') {
            const parts = dateTime.trim().split(' ');

            if (parts.length !== 2) {
                return 0;
            }

            const datePart = parts[0];
            const timePart = parts[1];

            const dateParts = datePart.split('-');
            const timeParts = timePart.split(':');

            if (dateParts.length !== 3 || timeParts.length !== 3) {
                return 0;
            }

            const day = Number(dateParts[0]);
            const month = Number(dateParts[1]);
            const year = Number(dateParts[2]);

            const hour = Number(timeParts[0]);
            const minute = Number(timeParts[1]);
            const second = Number(timeParts[2]);

            const date = new Date(year, month - 1, day, hour, minute, second);

            return date.getTime();
        }

        return 0;
    };

    useEffect(() => {
        fetchNotifications(page);
    }, [page]);

    const fetchNotifications = async (pageNo = 1) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));

            if (!user?.id_user) {
                return;
            }

            const res = await axios.get(`http://localhost:8082/api/user/notification/id_user=${user.id_user}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    page: pageNo,
                },
            });

            const data = res.data?.data || [];

            const sortedData = [...data].sort((a, b) => {
                return parseDateTime(b.dateTime) - parseDateTime(a.dateTime);
            });

            setNotifications(sortedData);

            setPage(res.data?.current_page || pageNo);
            setTotalPage(res.data?.total_page || 1);
        } catch (err) {
            console.error('Fetch notifications error:', err);
        }
    };

    const handleClickNotification = async (msg) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));

            if (!user?.id_user) {
                return;
            }

            console.log('Clicked notification:', msg);

            const res = await axios.get('http://localhost:8082/api/user/notification/', {
                params: {
                    id_user_notifi: msg.id_user_notify,
                    id_notify: msg.id_notify,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setDetail(res.data?.data);
            setOpenDetail(true);

            setNotifications((prev) =>
                prev.map((n) =>
                    n.id_notify === msg.id_notify
                        ? {
                              ...n,
                              status_id: 1,
                          }
                        : n,
                ),
            );

            window.dispatchEvent(new Event('notification-read'));
        } catch (err) {
            console.error('Read notification error:', err);
        }
    };

    const handleAccept = (orderId) => {
        setAcceptedOrders((prev) => {
            // Không thêm trùng order
            if (prev.includes(orderId)) {
                return prev;
            }

            return [...prev, orderId];
        });

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
                            key={msg.id_user_notify}
                            onClick={() => handleClickNotification(msg)}
                            className={`
                                cursor-pointer
                                relative
                                p-3
                                border-b
                                flex
                                items-start
                                justify-between
                                gap-4
                                rounded-xl
                                transition

                                ${isUnread ? 'bg-orange-50 border-l-4 border-orange-500' : 'bg-white hover:bg-gray-50'}
                            `}
                        >
                            {isUnread && (
                                <span
                                    className="
                                        absolute
                                        left-2
                                        top-5
                                        w-2.5
                                        h-2.5
                                        bg-orange-500
                                        rounded-full
                                    "
                                />
                            )}

                            <div className="flex flex-col gap-1 pl-4">
                                <span
                                    className={`
                                        text-sm

                                        ${isUnread ? 'font-semibold text-gray-900' : 'text-gray-700'}
                                    `}
                                >
                                    {msg.title}
                                </span>
                                <span
                                    className="
                                        text-gray-600
                                        text-sm
                                        truncate
                                        block
                                        max-w-[300px]
                                    "
                                >
                                    {msg.message}
                                </span>
                                <span
                                    className="
                                        text-[11px]
                                        text-gray-400
                                    "
                                >
                                    {msg.dateTime}
                                </span>
                            </div>
                            {msg.type === 'NEW_ORDER' &&
                                (!isAccepted ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            handleAccept(msg.order_id);
                                        }}
                                        className="
                                            bg-orange-500
                                            hover:bg-orange-600
                                            text-white
                                            px-4
                                            h-9
                                            rounded-lg
                                            text-sm
                                        "
                                    >
                                        Nhận đơn
                                    </button>
                                ) : (
                                    <span
                                        className="
                                            text-green-600
                                            font-semibold
                                        "
                                    >
                                        Đã nhận đơn
                                    </span>
                                ))}
                        </div>
                    );
                })}
            </div>
            {totalPage > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {/* PREVIOUS */}
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="
                            px-3
                            py-2
                            border
                            rounded
                            flex
                            items-center
                            gap-1
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                    >
                        <ChevronLeft size={18} />
                        Trước
                    </button>
                    {[...Array(totalPage)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`
                                    px-3
                                    py-2
                                    rounded

                                    ${page === i + 1 ? 'bg-orange-500 text-white' : 'border'}
                                `}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        disabled={page === totalPage}
                        onClick={() => setPage(page + 1)}
                        className="
                            px-3
                            py-2
                            border
                            rounded
                            flex
                            items-center
                            gap-1
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                    >
                        Sau
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}

            {openDetail && detail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="
                            absolute
                            inset-0
                            bg-black/50
                            backdrop-blur-sm
                        "
                        onClick={() => setOpenDetail(false)}
                    />
                    <div
                        className="
                            relative
                            w-[460px]
                            max-w-[90%]
                            bg-white
                            rounded-2xl
                            shadow-2xl
                            p-6
                            animate-[fadeIn_.2s_ease-out]
                        "
                    >
                        <button
                            onClick={() => setOpenDetail(false)}
                            className="
        absolute
        top-4
        right-4
        w-8
        h-8
        flex
        items-center
        justify-center
        rounded-full
        bg-gray-100
        hover:bg-gray-200
        text-gray-500
        hover:text-black
        transition
    "
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-start gap-3 mb-4">
                            <div
                                className="
                                    w-10
                                    h-10
                                    flex
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-orange-100
                                    text-orange-600
                                "
                            >
                                <Bell size={20} strokeWidth={2} />
                            </div>
                            <div>
                                <h2
                                    className="
                                        text-lg
                                        font-semibold
                                        text-gray-900
                                        leading-snug
                                    "
                                >
                                    {detail.title}
                                </h2>

                                <p
                                    className="
                                        text-xs
                                        text-gray-400
                                        mt-0.5
                                    "
                                >
                                    {detail.dateTime}
                                </p>
                            </div>
                        </div>

                        <div
                            className="
                                h-px
                                bg-gray-200
                                mb-4
                            "
                        />
                        <p
                            className="
                                text-gray-700
                                text-sm
                                leading-relaxed
                                whitespace-pre-line
                            "
                        >
                            {detail.message}
                        </p>

                        {/* FOOTER */}
                        <div
                            className="
                                mt-6
                                flex
                                justify-end
                            "
                        >
                            <button
                                onClick={() => setOpenDetail(false)}
                                className="
                                    px-4
                                    py-2
                                    text-sm
                                    rounded-lg
                                    bg-orange-500
                                    hover:bg-orange-600
                                    text-white
                                    transition
                                "
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
