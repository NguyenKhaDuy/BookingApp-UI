import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell } from 'lucide-react';
import { Link} from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function HeaderBooking() {
    const [open, setOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const isLoggedIn = true; // giả lập login
    const user = {
        avatar: 'https://i.pravatar.cc/100',
        name: 'Nguyễn Văn A',
    };

    const notifications = [
        {
            id: 1,
            title: 'Đơn sửa chữa đã được xác nhận',
            time: '5 phút trước',
            unread: true,
        },
        {
            id: 2,
            title: 'Kỹ thuật viên đang trên đường',
            time: '20 phút trước',
            unread: false,
        },
        {
            id: 3,
            title: 'Hoàn tất dịch vụ – vui lòng đánh giá',
            time: '1 giờ trước',
            unread: false,
        },
    ];

    return (
        <header className="w-full bg-[#0a1a2f]/80 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-white/10 ">
            <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
                {/* Logo */}
                <Link to={'/'}>
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
                <nav className="hidden md:flex items-center gap-10 text-gray-200 font-medium">
                    {[
                        { label: 'Dịch vụ', href: '/services' },
                        { label: 'Kỹ thuật viên', href: '/technicians' },
                        { label: 'Bảng giá', href: '/pricing' },
                        { label: 'Liên hệ', href: '/contact' },
                    ].map((item) => (
                        <Link key={item.href} to={item.href} className="relative group transition-all">
                            <span className="group-hover:text-orange-500 transition">{item.label}</span>
                            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-orange-500 rounded-full group-hover:w-full transition-all"></span>
                        </Link>
                    ))}
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-4">
                    {/* Notification icon */}
                    {isLoggedIn && (
                        <div className="relative mt-auto">
                            <button
                                onClick={() => {
                                    setNotifOpen(!notifOpen);
                                    setOpen(false);
                                }}
                                className="relative"
                            >
                                <Bell className="w-7 h-7 text-white hover:text-orange-500 transition" />
                                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                    {notifications.filter((n) => n.unread).length}
                                </span>
                            </button>

                            {/* Notification dropdown */}
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
                                                    to='/notification'
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

                    {/* ⭐ NEW – REQUEST MANAGER ICON */}
                    {isLoggedIn && (
                        <Link to="/request" className="relative group">
                            <div className="relative mt-auto">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-7 h-7 text-white group-hover:text-orange-500 transition"
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

                                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full shadow">
                                    3
                                </span>
                            </div>
                        </Link>
                    )}

                    {/* Avatar */}
                    {isLoggedIn && (
                        <Link to="/profile">
                            <img
                                src={user.avatar}
                                alt="avatar"
                                className="w-10 h-10 rounded-full border border-white/20 cursor-pointer"
                            />
                        </Link>
                    )}

                    {/* Nếu chưa đăng nhập → Hiện 2 nút login / register */}
                    {!isLoggedIn && (
                        <div className="hidden md:flex items-center gap-3">
                            <Link
                                to="/login"
                                className="bg-transparent border border-orange-500 text-orange-500 px-5 py-2.5 rounded-xl font-semibold 
            hover:bg-orange-500 hover:text-white transition shadow"
                            >
                                Đăng nhập
                            </Link>

                            <Link
                                to="/register"
                                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold 
            hover:opacity-90 transition shadow"
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
                            <a href="#services" className="hover:text-orange-500 transition">
                                Dịch vụ
                            </a>
                            <a href="#technicians" className="hover:text-orange-500 transition">
                                Kỹ thuật viên
                            </a>
                            <a href="#pricing" className="hover:text-orange-500 transition">
                                Bảng giá
                            </a>
                            <a href="#contact" className="hover:text-orange-500 transition">
                                Liên hệ
                            </a>

                            {/* Login / Avatar mobile */}
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
                                <Link to="/profile" className="flex items-center gap-3 mt-3 cursor-pointer">
                                    <img src={user.avatar} className="w-10 h-10 rounded-full" />
                                    <span>{user.name}</span>
                                </Link>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
