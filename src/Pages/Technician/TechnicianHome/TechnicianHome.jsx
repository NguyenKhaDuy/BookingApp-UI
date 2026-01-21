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
import { connectWebSocket, addWebSocketListener } from '../../../utils/stompClient';
import { useToast } from '../../../Context/ToastContext';
import getCookie from '../../../utils/getToken';
import TechnicianScheduleList from '../../../Components/Technician/TechnicianScheduleList/TechnicianScheduleList';
import EmailManager from '../../../Components/Technician/EmailManager/EmailManager'
import PasswordManager from '../../../Components/Technician/PasswordManager/PasswordManager';
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
                   const res = await axios.get('http://localhost:8081/api/me/', { withCredentials: true });
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
    
    console.log(user)


    // ===================== AUTH + WEBSOCKET =====================
    useEffect(() => {

        const token = getCookie('token');

        if (!token) {
            navigate('/login');
            return;
        }

        let decoded;
        try {
            decoded = jwtDecode(token);
        } catch (err) {
            navigate('/login');
            return;
        }

        const roles = decoded.roles || [];

        if (!roles.includes('TECHNICIAN')) {
            navigate('/login');
            return;
        }

        const unsubscribe = addWebSocketListener((msg) => {
            setNotification(msg);
            if (msg.type === "REQUEST_CANCEL") {
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
   


    // ===================== COUNTDOWN 60s =====================
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

    // ===================== ACTIONS =====================
    const handleAccept = async () => {
        if (!notification) return;
        try {
            // Lấy id_technician từ token
            const token = getCookie('token');;
            const id_technician = getTechnicianId(); 

            // Lấy id_request từ notification
            const id_request = notification.id_request;

            // Gọi API
            const res = await fetch('http://localhost:8081/api/technician/accept-request/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id_technician, id_request })
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
            setNotification(null);// đóng popup
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
            const res = await fetch('http://localhost:8081/api/technician/refuse-request/', {
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
    return (
        <>
            {/* ===== POPUP NOTIFICATION ===== */}
            {open && notification && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[90%] max-w-md rounded-xl p-5 shadow-xl animate-fadeIn">
                        <h2 className="text-lg font-semibold mb-2">🔔 {notification.title}</h2>

                        <p className="text-gray-600 mb-3">{notification.body}</p>

                        <p className="text-sm text-red-500 mb-4">Tự đóng sau {countdown}s</p>

                        <div className="flex justify-end gap-3">
                            <button onClick={handleReject} className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                                Từ chối
                            </button>

                            <button
                                onClick={handleAccept}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Chấp nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== MAIN CONTENT ===== */}
            <div className="space-y-6">
                {active === 'dashboard' && <TechnicianDashboard />}
                {active === 'orders' && <RepairRequest />}
                {active === 'notifications' && <Notification />}
                {active === 'schedules' && <TechnicianScheduleList />}
                {active === 'location' && <LocationManager />}
                {active === 'skills' && <SkillManager />}
                {active === 'email' && <EmailManager />}
                {active === 'password' && <PasswordManager />}
                {active === 'account' && <Account />}
            </div>
        </>
    );
}
