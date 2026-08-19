import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import TechnicianDashboard from '../../../Components/Technician/TechnicianDashboard/TechnicianDashboard';
import RepairRequest from '../../../Components/Technician/RepairRequest/RepairRequest';
import Notification from '../../../Components/Technician/Notifications/Notifications';
import Account from '../../../Components/Technician/Account/Account';
import SkillManager from '../../../Components/Technician/SkillManager/SkillManager';
import LocationManager from '../../../Components/Technician/LocationManager/LocationManager';
import axios from 'axios';
import { UserContext } from '../../../Context/UserContext';
import { addWebSocketListener } from '../../../utils/stompClient';
import { useToast } from '../../../Context/ToastContext';
import getCookie from '../../../utils/getToken';
import TechnicianScheduleList from '../../../Components/Technician/TechnicianScheduleList/TechnicianScheduleList';
import EmailManager from '../../../Components/Technician/EmailManager/EmailManager';
import PasswordManager from '../../../Components/Technician/PasswordManager/PasswordManager';
import ServiceManager from '../../../Components/Technician/ServiceManager/ServiceManager';
import { API_BASE_URL } from '../../../utils/api';
import { Bell, Clock, X, Check } from 'lucide-react';
export default function TechnicianHome({ active }) {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { user, setUser } = useContext(UserContext);
    const [open, setOpen] = useState(false);

    const [notification, setNotification] = useState(null);
    const [countdown, setCountdown] = useState(60);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/me/`, { withCredentials: true });
                if (typeof res.data === 'object') {
                    setUser(res.data);
                } else {
                    setUser(null);
                }
                localStorage.setItem('user', JSON.stringify(res.data));
            } catch (err) {
                console.log('Chưa login');
            }
        };
        fetchUser();
    }, []);

    //  AUTH + WEBSOCKET 
    useEffect(() => {
        const token = getCookie('token');

        if (!token) {
            // navigate('/login');
            return;
        }

        let decoded;
        try {
            decoded = jwtDecode(token);
        } catch (err) {
            // navigate('/login');
            return;
        }

        const roles = decoded.roles || [];

        if (!roles.includes('TECHNICIAN')) {
            // navigate('/login');
            return;
        }

        const unsubscribe = addWebSocketListener((msg) => {
            setNotification(msg);
            if (msg.type != 'REQUEST_CREATED') {
                showToast(msg.body, 'success');
                setOpen(false);
                setNotification(null);
            } else {
                setOpen(true);
                setCountdown(60);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [navigate]);

    //  COUNTDOWN 60s 
    useEffect(() => {
        if (!notification) return;

        // Khởi tạo countdown 60s
        setCountdown(60);

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    // Gọi API refuse khi hết thời gian
                    handleReject();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [notification]);

    const getTechnicianId = () => {
        // fallback localStorage
        const localUser = localStorage.getItem('user');
        if (!localUser) return null;
        return JSON.parse(localUser).id_user;
    };

    //  ACTIONS 
    const handleAccept = async () => {
        if (!notification) return;
        try {
            // Lấy id_technician từ token
            const token = getCookie('token');
            const id_technician = getTechnicianId();

            // Lấy id_request từ notification
            const id_request = notification.id_request;

            // Gọi API
            const res = await fetch(`${API_BASE_URL}/technician/accept-request/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id_technician, id_request }),
            });

            const data = await res.json();

            if (!res.ok) {
                // console.error('Lỗi khi accept request:', data);
                showToast(`Lỗi: ${data.message || 'Không xác định'}`, 'error');
            } else {
                console.log('ACCEPT JOB SUCCESS:', data);
            }
        } catch (err) {
            showToast(`Có lỗi xảy ra, vui lòng thử lại`, 'error');
        } finally {
            setOpen(false);
            setNotification(null); // đóng popup
        }
    };

    const handleReject = async () => {
        if (!notification) return;

        setOpen(false);
        setNotification(null);

        try {
            // Lấy token và id_technician
            const token = getCookie('token');
            const id_technician = getTechnicianId(); // hàm của bạn lấy từ token

            // Lấy id_request từ notification
            const id_request = notification.id_request;

            // Gọi API refuse
            const res = await fetch(`${API_BASE_URL}/technician/refuse-request/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id_technician, id_request }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error('Lỗi khi refuse request:', data);
                showToast(`Lỗi: ${data.message || 'Không xác định'}`, 'error');
            } else {
                console.log('REJECT JOB SUCCESS:', data);
            }
        } catch (err) {
            console.error('Exception refuse request:', err);
            showToast(`Có lỗi xảy ra, vui lòng thử lại`, 'error');
        }
    };

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);

        const payment = query.get('payment');

        if (payment === 'success') {
            showToast('Thanh toán công nợ thành công', 'success');
        }

        if (payment === 'failed') {
            showToast('Thanh toán công nợ thất bại', 'error');
        }

        window.history.replaceState({}, '', '/technician/home');
    }, []);
    return (
        <>
            {/*  POPUP NOTIFICATION  */}
            {open && notification && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div
                        className="
                bg-white w-full max-w-md
                rounded-2xl shadow-2xl
                overflow-hidden
                animate-fadeIn
            "
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center">
                                    <Bell className="w-5 h-5 text-orange-500" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Yêu cầu đặt lịch</h2>

                                    <p className="text-xs text-gray-400 mt-0.5">Thông báo mới</p>
                                </div>
                            </div>

                            {/* Close */}
                            <button
                                onClick={handleReject}
                                className="
                        w-9 h-9 rounded-full
                        flex items-center justify-center
                        text-gray-400
                        hover:bg-gray-100
                        hover:text-gray-600
                        transition
                    "
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-6">
                            <h3 className="text-base font-semibold text-gray-900 mb-2">{notification.title}</h3>

                            <p className="text-gray-600 text-sm leading-relaxed">{notification.body}</p>

                            {/* Countdown */}
                            <div className="mt-5 flex items-center justify-center">
                                <div
                                    className="
                            inline-flex items-center gap-2
                            px-4 py-2
                            rounded-full
                            bg-red-50
                            text-red-500
                            text-sm font-medium
                        "
                                >
                                    <Clock className="w-4 h-4" />

                                    <span>
                                        Tự đóng sau <strong>{countdown}s</strong>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-5 bg-gray-50 border-t">
                            <div className="flex gap-3">
                                {/* Reject */}
                                <button
                                    onClick={handleReject}
                                    className="
                            flex-1
                            flex items-center justify-center gap-2
                            px-4 py-3
                            rounded-xl
                            border border-gray-300
                            bg-white
                            text-gray-700
                            font-semibold
                            hover:bg-gray-100
                            transition
                        "
                                >
                                    <X className="w-4 h-4" />
                                    Từ chối
                                </button>

                                {/* Accept */}
                                <button
                                    onClick={handleAccept}
                                    className="
                            flex-1
                            flex items-center justify-center gap-2
                            px-4 py-3
                            rounded-xl
                            bg-green-600
                            text-white
                            font-semibold
                            hover:bg-green-700
                            shadow-sm
                            transition
                        "
                                >
                                    <Check className="w-4 h-4" />
                                    Chấp nhận
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/*  MAIN CONTENT  */}
            <div className="space-y-6">
                {active === 'dashboard' && <TechnicianDashboard />}
                {active === 'orders' && <RepairRequest />}
                {active === 'notifications' && <Notification />}
                {active === 'schedules' && <TechnicianScheduleList />}
                {active === 'location' && <LocationManager />}
                {active === 'skills' && <SkillManager />}
                {active === 'services' && <ServiceManager />}
                {active === 'email' && <EmailManager />}
                {active === 'password' && <PasswordManager />}
                {active === 'account' && <Account />}
            </div>
        </>
    );
}
