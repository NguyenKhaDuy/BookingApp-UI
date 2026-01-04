import { useState, useEffect, useCallback, useRef } from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import RequestDetailModal from '../RequestDetailModal/RequestDetailModal';
import RatingModal from '../RatingModal/RatingModal';
import { connectWebSocket, addWebSocketListener } from '../../../utils/stompClient';
import { useToast } from '../../../Context/ToastContext';
import { m } from 'framer-motion';

/* ================= UTILS ================= */
const formatDateTime = (dateArr, timeArr) => {
    if (!dateArr || !timeArr) return '';
    const [y, m, d] = dateArr;
    const [h, min] = timeArr;
    return `${d}/${m}/${y} ${h}:${String(min).padStart(2, '0')}`;
};

export default function RepairStatusPage() {
    const [active, setActive] = useState('WAITING_FOR_TECHNICIAN');
    const [requests, setRequests] = useState([]);
    const [selected, setSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showRating, setShowRating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [requestId, setRequestId] = useState(null);
    const { showToast } = useToast();
    const location = useLocation();
    const navigate = useNavigate();
    const formData = location.state?.formData;
    const images = location.state?.image_request;

    // console.log(formData)

    // 🔥 FLAG chặn create chạy 2 lần (React 18 StrictMode)
    const hasCreatedRef = useRef(false);

    /* ================= FETCH REQUESTS ================= */
    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));

            if (!token || !user?.id_user) return;

            const res = await fetch(`http://localhost:8081/api/customer/request/id_customer=${user.id_user}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const json = await res.json();

            if (json.message === 'Success') {
                setRequests(json.data);
            } else {
                showToast(json.message || 'Không lấy được danh sách yêu cầu', 'error');
            }
        } catch (err) {
            showToast('Lỗi kết nối server', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    /* ================= LOAD FIRST TIME ================= */
    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    /* ================= CREATE REQUEST (RUN ONLY ONCE) ================= */
    useEffect(() => {
        if (!formData) return;

        if (hasCreatedRef.current) return;
        hasCreatedRef.current = true;

        const createRequest = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const fd = new FormData();
                // Thêm các field formData
                Object.keys(formData).forEach((key) => {
                    fd.append(key, formData[key]);
                });

                // 🔥 Thêm ảnh nếu có
                if (images && images.length > 0) {
                    images.forEach((file, index) => {
                        fd.append('imageRequest', file); // key 'images' giống backend nhận array
                    });
                }

                const res = await fetch('http://localhost:8081/api/customer/request/', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: fd,
                });

                const data = await res.json();

                if (data.message === 'SUCCESS') {
                    await fetchRequests();
                    setActive('WAITING_FOR_TECHNICIAN');
                } else {
                    showToast(data.message || 'Tạo yêu cầu thất bại', 'error');
                    setActive('CANCEL');
                }
            } catch (err) {
                showToast('Lỗi hệ thống', 'error');
                setActive('CANCEL');
            } finally {
                navigate(location.pathname, { replace: true, state: {} });
            }
        };

        createRequest();
    }, [formData, images, fetchRequests, navigate, location.pathname]);


    useEffect(() => {
            // Lấy cookie token/email sau khi redirect OAuth2
            const getCookie = (name) => {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop().split(';').shift();
            };
    
            const token = getCookie('token');
            console.log(token);
    
            if (token) {
                localStorage.setItem('token', token);
            }
    
            // Kết nối WS với token mới
            connectWebSocket(token);
    
            addWebSocketListener((msg) => {
                showToast(`🔔 ${msg.title}\n${msg.body}`, 'success');
                if (msg) {
                    fetchRequests();
                }
            });
        }, []); // Chỉ chạy một lần khi mount

    /* ================= STATUS LIST ================= */
    const statusList = [
        {
            key: 'WAITING_FOR_TECHNICIAN',
            label: 'Đang chờ thợ nhận',
            icon: <Clock size={22} className="text-gray-500" />,
        },
        {
            key: 'RECEIVED',
            label: 'Kỹ thuật viên đã nhận',
            icon: <CheckCircle size={22} className="text-green-500" />,
        },
        {
            key: 'RECEIVING',
            label: 'Đang sửa chữa',
            icon: <CheckCircle size={22} className="text-blue-500" />,
        },
        {
            key: 'COMPLETED',
            label: 'Hoàn thành',
            icon: <CheckCircle size={22} className="text-orange-500" />,
        },
        {
            key: 'CANCEL',
            label: 'Đã hủy',
            icon: <XCircle size={22} className="text-red-500" />,
        },
    ];

    /* ================= FILTER ================= */
    const filteredRequests = requests.filter((r) => r.status_code === active);

    /* ================= UI ================= */
    return (
        <div className="max-w-6xl mx-auto mt-10 px-4 flex flex-col md:flex-row gap-6">
            {/* LEFT */}
            <div className="w-full md:w-1/3 bg-white shadow rounded-xl p-5 border">
                <h2 className="text-lg font-semibold mb-4">Tiến trình đơn hàng</h2>

                <div className="space-y-4">
                    {statusList.map((s) => (
                        <div
                            key={s.key}
                            onClick={() => setActive(s.key)}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition border
                                ${
                                    active === s.key
                                        ? 'bg-orange-50 border-orange-400'
                                        : 'hover:bg-gray-100 border-transparent'
                                }
                            `}
                        >
                            {s.icon}
                            <span className={`font-medium ${active === s.key ? 'text-orange-600' : 'text-gray-700'}`}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT */}
            <div className="w-full md:w-2/3 bg-white shadow rounded-xl p-5 border">
                <h2 className="text-lg font-semibold mb-4">
                    Trạng thái:{' '}
                    <span className="text-orange-600">{statusList.find((s) => s.key === active)?.label}</span>
                </h2>

                {loading && <p className="text-center text-gray-500">Đang tải dữ liệu...</p>}

                {!loading && filteredRequests.length === 0 && (
                    <p className="text-center text-gray-500 py-6">Không có yêu cầu nào</p>
                )}

                <div className="space-y-4">
                    {filteredRequests.map((item) => (
                        <div key={item.id_request} className="border p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-lg">{item.name_service}</p>
                                <p className="text-sm text-gray-500">{item.description}</p>
                                <p className="text-sm text-gray-400">📍 {item.location}</p>
                                <p className="text-sm text-gray-400">
                                    🕒 {formatDateTime(item.scheduled_date, item.scheduled_time)}
                                </p>

                                {item.name_techinician && (
                                    <p className="text-sm mt-1">👨‍🔧 Thợ: {item.name_techinician}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                {item.status_code === 'WAITING_FOR_TECHNICIAN' && (
                                    <div className="flex items-center gap-2 text-orange-500">
                                        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                        <span>Đang tìm thợ</span>
                                    </div>
                                )}

                                <button
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                                    onClick={() => {
                                        setRequestId(item.id_request);
                                        setShowModal(true);
                                    }}
                                >
                                    Chi tiết
                                </button>
                                {/* ⭐ Đánh giá - CHỈ KHI HOÀN THÀNH */}
                                {item.status_code === 'COMPLETED' && (
                                    <button
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        onClick={() => {
                                            setSelected(item); // 👈 truyền item cho RatingModal
                                            setShowRating(true);
                                        }}
                                    >
                                        Đánh giá
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <RequestDetailModal
                open={showModal}
                requestId={requestId}
                onClose={() => {
                    setShowModal(false);
                    setRequestId(null); // 👈 FIX BUG NGẦM
                }}
            />

            <RatingModal open={showRating} data={selected} onClose={() => setShowRating(false)} />
        </div>
    );
}
