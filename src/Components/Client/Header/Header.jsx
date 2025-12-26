import React, { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../../../assets/logo.png';
import { UserContext } from '../../../Context/UserContext';

export default function HeaderBooking() {
    const [open, setOpen] = useState(false); // mobile menu
    const [notifOpen, setNotifOpen] = useState(false);
    const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
    const [servicesDesktopOpen, setServicesDesktopOpen] = useState(false);
    const [servicesMobileOpen, setServicesMobileOpen] = useState(false);
    const [services, setServices] = useState([]);

    const { user, setUser } = useContext(UserContext);
    const isLoggedIn = !!user;

    const notifications = [
        { id: 1, title: 'Đơn sửa chữa đã được xác nhận', time: '5 phút trước', unread: true },
        { id: 2, title: 'Kỹ thuật viên đang trên đường', time: '20 phút trước', unread: false },
        { id: 3, title: 'Hoàn tất dịch vụ – vui lòng đánh giá', time: '1 giờ trước', unread: false },
    ];

    // Fetch services
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get('http://localhost:8081/api/service/all/');
                setServices(res.data.data);
            } catch (error) {
                console.error('Failed to fetch services:', error);
            }
        };
        fetchServices();
    }, []);


     useEffect(() => {
         const fetchUser = async () => {
             try {
                 const res = await axios.get('http://localhost:8081/api/me/', { withCredentials: true });
                 if (typeof res.data === 'object') {
                     setUser(res.data);
                 } else {
                     setUser(null);
                 }
                //  localStorage.setItem('user', JSON.stringify(res.data));
             } catch (err) {
                 console.log('Chưa login');
             }
         };
         fetchUser();
     }, []);
    
    console.log(user);

    const handleLogout = () => {
        // localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setAvatarMenuOpen(false);
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    };

    return (
        <header className="w-full bg-[#0a1a2f]/80 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-white/10">
            <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
                {/* Logo */}
                <Link to="/">
                    <div className="flex items-center gap-3 cursor-pointer">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-12 h-12 rounded-2xl shadow-xl overflow-hidden flex items-center justify-center"
                        >
                            <img src={logo} alt="Logo" className="w-full h-full object-cover rounded-2xl" />
                        </motion.div>
                        <span className="text-2xl font-bold text-white tracking-tight drop-shadow-md">BookingApp</span>
                    </div>
                </Link>

                {/* Navigation Desktop */}
                <nav className="hidden md:flex items-center gap-10 text-gray-200 font-medium relative">
                    {/* Dịch vụ dropdown desktop */}
                    <div
                        className="relative cursor-pointer"
                        onMouseEnter={() => setServicesDesktopOpen(true)}
                        onMouseLeave={() => setServicesDesktopOpen(false)}
                    >
                        <span className="hover:text-orange-500 transition">Dịch vụ</span>
                        <AnimatePresence>
                            {servicesDesktopOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute left-0 mt-2 bg-[#0f1f36] rounded-xl shadow-xl border border-white/10 overflow-hidden z-50 w-60"
                                >
                                    {services.map((service) => (
                                        <Link
                                            key={service.id_service}
                                            to={`/services/${service.id_service}`}
                                            className="block px-4 py-3 text-white hover:text-orange-500 hover:bg-white/10 transition"
                                        >
                                            {service.name_service}
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Các nav khác */}
                    <Link to="/technicians" className="hover:text-orange-500 transition">
                        Kỹ thuật viên
                    </Link>
                    <Link to="/Booking" className="hover:text-orange-500 transition">
                        Đặt lịch
                    </Link>
                    <Link to="/contact" className="hover:text-orange-500 transition">
                        Liên hệ
                    </Link>
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                        {/* Notification icon */}
                        {isLoggedIn && (
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setNotifOpen(!notifOpen);
                                        setOpen(false);
                                        setAvatarMenuOpen(false);
                                    }}
                                    className="relative flex items-center justify-center w-10 h-10"
                                >
                                    <Bell className="w-7 h-7 text-white hover:text-orange-500 transition" />
                                    {notifications.filter((n) => n.unread).length > 0 && (
                                        <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                            {notifications.filter((n) => n.unread).length}
                                        </span>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {notifOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 mt-3 w-80 bg-[#0f1f36] text-white rounded-xl shadow-xl border border-white/10 overflow-hidden"
                                        >
                                            <div className="p-4 font-bold border-b border-white/10 text-orange-500 uppercase">
                                                Thông báo
                                            </div>
                                            <div className="max-h-80 overflow-y-auto">
                                                {notifications.map((n) => (
                                                    <Link
                                                        key={n.id}
                                                        to="/notification"
                                                        className={`w-full text-left px-4 py-3 flex flex-col gap-1 border-b border-white/5 hover:bg-white/5 transition ${
                                                            n.unread ? 'bg-orange-500/10' : ''
                                                        }`}
                                                    >
                                                        <span className="font-medium">{n.title}</span>
                                                        <span className="text-xs text-gray-400">{n.time}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Request icon */}
                        {isLoggedIn && (
                            <Link to="/request" className="relative flex items-center justify-center w-10 h-10">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-7 h-7 text-white hover:text-orange-500 transition"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                                    <path d="M9 3h6v4H9z" />
                                </svg>
                                <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full shadow">
                                    3
                                </span>
                            </Link>
                        )}

                        {/* Avatar */}
                        {isLoggedIn && user && (
                            <div
                                className="relative flex items-center justify-center w-10 h-10"
                                onMouseEnter={() => setAvatarMenuOpen(true)}
                                onMouseLeave={() => setAvatarMenuOpen(false)}
                            >
                                <button className="w-full h-full">
                                    <img
                                        src={
                                            user.avatarBase64
                                                ? `data:image/png;base64,${user.avatarBase64}`
                                                : '/default-avatar.png'
                                        }
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full border border-white/20 cursor-pointer"
                                    />
                                </button>

                                <AnimatePresence>
                                    {avatarMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 top-full mt-2 w-40 bg-[#0f1f36] text-white rounded-xl shadow-xl border border-white/10 overflow-hidden z-50"
                                        >
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-white/10 transition"
                                            >
                                                {/* SVG icon logout */}
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-5 h-5 text-orange-500"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                                                    />
                                                </svg>
                                                <span className="text-orange-500">Đăng xuất</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Nếu chưa đăng nhập → Hiện login/register */}
                    {!isLoggedIn && (
                        <div className="hidden md:flex items-center gap-3">
                            <Link
                                to="/login"
                                className="bg-transparent border border-orange-500 text-orange-500 px-5 py-2.5 rounded-xl font-semibold hover:bg-orange-500 hover:text-white transition shadow"
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                to="/register"
                                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition shadow"
                            >
                                Đăng ký
                            </Link>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden focus:outline-none text-white"
                        onClick={() => {
                            setOpen(!open);
                            setNotifOpen(false);
                            setAvatarMenuOpen(false);
                        }}
                    >
                        {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="md:hidden bg-[#0a1a2f]/95 backdrop-blur-xl shadow-xl border-t border-white/10"
                    >
                        <nav className="flex flex-col gap-4 py-6 px-6 text-gray-200 font-medium">
                            {/* Mobile dịch vụ */}
                            <div className="flex flex-col">
                                <button
                                    onClick={() => setServicesMobileOpen(!servicesMobileOpen)}
                                    className="text-left hover:text-orange-500 transition"
                                >
                                    Dịch vụ
                                </button>
                                <AnimatePresence>
                                    {servicesMobileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="ml-4 mt-2 flex flex-col gap-1"
                                        >
                                            {services.map((service) => (
                                                <Link
                                                    key={service.id_service}
                                                    to={`/services/${service.id_service}`}
                                                    className="block px-4 py-2 hover:bg-white/10 hover:text-orange-500 rounded transition"
                                                >
                                                    {service.name_service}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <Link to="/technicians" className="hover:text-orange-500 transition">
                                Kỹ thuật viên
                            </Link>
                            <Link to="/Booking" className="hover:text-orange-500 transition">
                                Đặt lịch
                            </Link>
                            <Link to="/contact" className="hover:text-orange-500 transition">
                                Liên hệ
                            </Link>

                            {/* Mobile login/avatar */}
                            {!isLoggedIn ? (
                                <div className="flex flex-col gap-3 mt-3">
                                    <Link
                                        to="/login"
                                        className="block bg-transparent border border-orange-500 text-orange-500 px-6 py-2.5 rounded-xl font-semibold hover:bg-orange-500 hover:text-white transition shadow-md w-full text-center"
                                    >
                                        Đăng nhập
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition shadow-md w-full text-center"
                                    >
                                        Đăng ký
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3 mt-3">
                                    {/* Avatar + Name */}
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-3 cursor-pointer px-4 py-2 hover:bg-white/10 rounded transition"
                                    >
                                        <img
                                            src={
                                                user.avatarBase64
                                                    ? `data:image/png;base64,${user.avatarBase64}`
                                                    : '/default-avatar.png'
                                            }
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <span className="text-white font-medium">{user.full_name}</span>
                                    </Link>

                                    {/* Logout Button */}
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition w-full text-center"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
