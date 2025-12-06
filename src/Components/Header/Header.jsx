import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

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
                <div className="flex items-center gap-3 cursor-pointer">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-xl"
                    >
                        T
                    </motion.div>
                    <span className="text-2xl font-bold text-white tracking-tight drop-shadow-md">TechBooking</span>
                </div>

                {/* Navigation Desktop */}
                <nav className="hidden md:flex items-center gap-10 text-gray-200 font-medium">
                    {[
                        { label: 'Dịch vụ', href: '/services' },
                        { label: 'Kỹ thuật viên', href: '/technicians' },
                        { label: 'Bảng giá', href: '/pricing' },
                        { label: 'Liên hệ', href: '/contact' },
                    ].map((item) => (
                        <a key={item.href} href={item.href} className="relative group transition-all">
                            <span className="group-hover:text-orange-500 transition">{item.label}</span>
                            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-orange-500 rounded-full group-hover:w-full transition-all"></span>
                        </a>
                    ))}
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-4">
                    {/* Notification icon */}
                    {isLoggedIn && (
                        <div className="relative">
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
                                                <button
                                                    key={n.id}
                                                    onClick={() => (window.location.href = '/notification')}
                                                    className={`w-full text-left px-4 py-3 flex flex-col gap-1 border-b border-white/5 hover:bg-white/5 transition ${
                                                        n.unread ? 'bg-orange-500/10' : ''
                                                    }`}
                                                >
                                                    <span className="font-medium">{n.title}</span>
                                                    <span className="text-xs text-gray-400">{n.time}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* User avatar / Login – Register buttons */}
                    {!isLoggedIn ? (
                        <div className="hidden md:flex items-center gap-3">
                            import {Link} from "react-router-dom";
                            <Link to="/login">
                                <button className="bg-transparent border border-orange-500 text-orange-500 px-5 py-2.5 rounded-xl font-semibold hover:bg-orange-500 hover:text-white transition shadow-md">
                                    Đăng nhập
                                </button>
                            </Link>
                            <Link to="/register">
                                <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition shadow-md">
                                    Đăng ký
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <Link to="/profile">
                            <img
                                src={user.avatar}
                                alt="avatar"
                                className="w-10 h-10 rounded-full border border-white/20 cursor-pointer"
                            />
                        </Link>
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
