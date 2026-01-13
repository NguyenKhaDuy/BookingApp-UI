import { useEffect, useState, useContext } from 'react';
import { Menu, Bell, ClipboardList, FileText, User, Receipt, Wrench, MapPin, LogOut, Calendar } from 'lucide-react';
import logo from '../../../assets/logo.png';
import axios from 'axios';
import getCookie from '../../../utils/getToken';
import { UserContext } from '../../../Context/UserContext';
import { Link, useNavigate } from 'react-router-dom';

export default function TechnicianSidebar({ active, setActive }) {
    const [open, setOpen] = useState(true);
    const [notificationCount, setNotificationCount] = useState(0);
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const menu = [
        { key: 'dashboard', label: 'Dashboard', icon: ClipboardList },
        { key: 'orders', label: 'Đơn hàng', icon: FileText },
        { key: 'notifications', label: 'Thông báo', icon: Bell, badge: notificationCount },
        { key: 'schedules', label: 'Quản lí lịch làm việc', icon: Calendar },
        { key: 'skills', label: 'Quản lý kỹ năng', icon: Wrench },
        { key: 'location', label: 'Quản lý vị trí', icon: MapPin },
        { key: 'account', label: 'Tài khoản', icon: User, avatar: true },
        { key: 'logout', label: 'Đăng xuất', icon: LogOut },
    ];

    // ===== FETCH TOTAL UNREAD =====
    const fetchTotalUnread = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user?.id_user) return;

            const token = getCookie('token');

            let page = 1;
            let totalPages = 1;
            let totalUnread = 0;

            do {
                const res = await axios.get(`http://localhost:8081/api/notification/id_user=${user.id_user}`, {
                    params: { pageNo: page },
                    headers: { Authorization: `Bearer ${token}` },
                });

                const notifications = res.data?.data || [];

                //ĐÚNG LOGIC
                totalUnread += notifications.filter((n) => n.status_id === 2).length;

                totalPages = res.data?.total_page || 1;
                page++;
            } while (page <= totalPages);

            setNotificationCount(totalUnread);
        } catch (err) {
            console.error('Fetch total unread error:', err);
        }
    };

    useEffect(() => {
        fetchTotalUnread();

        const handler = () => fetchTotalUnread();
        window.addEventListener('notification-read', handler);

        return () => window.removeEventListener('notification-read', handler);
    }, []);


     const handleLogout = () => {
         localStorage.removeItem('user');
         setUser(null);
         navigate('/login');
         document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
     };

    return (
        <div className={`${open ? 'w-64' : 'w-20'} bg-white border-r shadow-sm h-screen transition-all relative`}>
            {/* Logo */}
            <div className="flex items-center gap-3 border-b p-3">
                <img src={logo} className="w-10" />
                <h1
                    className={`text-xl font-semibold text-orange-500 transition-all ${
                        !open && 'opacity-0 translate-x-5 pointer-events-none'
                    }`}
                >
                    TECHNICIAN
                </h1>
            </div>

            {/* Toggle */}
            <button
                onClick={() => setOpen(!open)}
                className="absolute -right-3 top-5 bg-white border p-1 rounded-full shadow"
            >
                <Menu size={18} />
            </button>

            {/* Menu */}
            <div className="mt-4 flex flex-col gap-2 px-3">
                {menu.map((m) => {
                    const Icon = m.icon;

                    return (
                        <button
                            key={m.key}
                            onClick={() => {
                                if (m.key === 'logout') {
                                    handleLogout();
                                } else {
                                    setActive(m.key);
                                }
                            }}
                            className={`flex items-center justify-between p-3 rounded-lg transition-colors
                                ${
                                    active === m.key
                                        ? 'bg-orange-200 text-orange-700 font-medium'
                                        : 'text-gray-700 hover:bg-orange-100'
                                }
                            `}
                        >
                            <div className="flex items-center gap-3">
                                {m.avatar ? (
                                    <img src="https://i.pravatar.cc/50" className="w-6 h-6 rounded-full" />
                                ) : (
                                    <Icon size={20} />
                                )}
                                {open && <span>{m.label}</span>}
                            </div>

                            {m.badge > 0 && (
                                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    {m.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
