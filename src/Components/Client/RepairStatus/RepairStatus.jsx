import { useState, useEffect, useCallback, useRef } from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import RequestDetailModal from '../RequestDetailModal/RequestDetailModal';
import RatingModal from '../RatingModal/RatingModal';
import { addWebSocketListener } from '../../../utils/stompClient';
import { useToast } from '../../../Context/ToastContext';
import getCookie from '../../../utils/getToken';
import LoadingOverlay from '../../../Layouts/LoadingOverLay/LoadingOverlay';

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
    const [loadingOverLay, setLoadingOverLay] = useState(false);
    const { showToast } = useToast();
    const location = useLocation();
    const navigate = useNavigate();
    const formData = location.state?.formData;
    const images = location.state?.image_request;

    const hasCreatedRef = useRef(false);

    /* ================= FETCH REQUESTS ================= */
    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);

            const token = getCookie('token');
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
        } catch {
            showToast('Lỗi kết nối server', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    /* ================= LOAD FIRST TIME ================= */
    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    /* ================= CREATE REQUEST (RUN ONCE) ================= */
    useEffect(() => {
        if (!formData) return;
        if (hasCreatedRef.current) return;
        hasCreatedRef.current = true;

        const createRequest = async () => {
            try {
                const token = getCookie('token');
                if (!token) return;

                const fd = new FormData();
                Object.keys(formData).forEach((key) => {
                    fd.append(key, formData[key]);
                });

                if (images?.length) {
                    images.forEach((file) => {
                        fd.append('imageRequest', file);
                    });
                }

                setLoadingOverLay(true);

                const res = await fetch('http://localhost:8081/api/customer/request/', {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
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
            } catch {
                showToast('Lỗi hệ thống', 'error');
                setActive('CANCEL');
            } finally {
                navigate(location.pathname, { replace: true, state: {} });
                setLoadingOverLay(false);
            }
        };

        createRequest();
    }, [formData, images, fetchRequests, navigate, location.pathname, showToast]);

    /* ================= WEBSOCKET ================= */
    useEffect(() => {
        const unsubscribe = addWebSocketListener((msg) => {
            showToast(`🔔 ${msg.title}\n${msg.body}`, 'success');
            fetchRequests();
        });

        return unsubscribe;
    }, [fetchRequests, showToast]);

    const statusCountMap = requests.reduce((acc, r) => {
        // Gộp SEARCHING vào WAITING_FOR_TECHNICIAN
        const key = r.status_code === 'SEARCHING' ? 'WAITING_FOR_TECHNICIAN' : r.status_code;

        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

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

    /* ================= FILTER (FIX SEARCHING) ================= */
    const filteredRequests = requests.filter((r) =>
        active === 'WAITING_FOR_TECHNICIAN'
            ? r.status_code === 'WAITING_FOR_TECHNICIAN' || r.status_code === 'SEARCHING'
            : r.status_code === active,
    );

    /* ================= CANCEL ================= */
    const handleCancelRequest = async (id) => {
        try {
            const token = getCookie('token');

            setLoadingOverLay(true);

            const res = await fetch(`http://localhost:8081/api/customer/request/cancel/id=${id}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const err = await res.json();
                showToast(err.message || 'Hủy yêu cầu thất bại', 'error');
                return;
            }

            fetchRequests();
        } catch {
            showToast('Có lỗi xảy ra', 'error');
        } finally {
            setLoadingOverLay(false);
        }
    };

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
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition border
        ${active === s.key ? 'bg-orange-50 border-orange-400' : 'hover:bg-gray-100 border-transparent'}`}
                        >
                            <div className="flex items-center gap-3">
                                {s.icon}
                                <span
                                    className={`font-medium ${active === s.key ? 'text-orange-600' : 'text-gray-700'}`}
                                >
                                    {s.label}
                                </span>
                            </div>

                            {/* 🔢 Số lượng */}
                            {statusCountMap[s.key] > 0 && (
                                <span
                                    className={`min-w-[28px] text-center text-sm font-semibold px-2 py-0.5 rounded-full
                ${active === s.key ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                >
                                    {statusCountMap[s.key]}
                                </span>
                            )}
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

                            <div className="flex items-center gap-3">
                                {(item.status_code === 'SEARCHING' ||
                                    item.status_code === 'WAITING_FOR_TECHNICIAN') && (
                                    <>
                                        <div className="flex items-center gap-2 text-orange-500">
                                            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span>
                                                {item.status_code === 'SEARCHING'
                                                    ? 'Đang tìm thợ'
                                                    : 'Đang chờ thợ nhận'}
                                            </span>
                                        </div>

                                        <button
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                            onClick={() => handleCancelRequest(item.id_request)}
                                        >
                                            Hủy
                                        </button>
                                    </>
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

                                {item.status_code === 'COMPLETED' && (
                                    <button
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        onClick={() => {
                                            setSelected(item);
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
                    setRequestId(null);
                }}
            />

            <RatingModal open={showRating} data={selected} onClose={() => setShowRating(false)} />
            <LoadingOverlay show={loadingOverLay} />
        </div>
    );
}
