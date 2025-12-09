import { useState } from 'react';
import { Menu, Bell, ClipboardList, FileText, User, Receipt, Wrench, MapPin, LogOut } from 'lucide-react';
import logo from '../../../assets/logo.png';

export default function TechnicianSidebar({ active, setActive }) {
    const [open, setOpen] = useState(true);

    const notificationCount = 5; // giả lập

    const menu = [
        { key: 'dashboard', label: 'Dashboard', icon: ClipboardList },
        { key: 'orders', label: 'Đơn hàng', icon: FileText },
        { key: 'notifications', label: 'Thông báo', icon: Bell, badge: notificationCount },
        { key: 'invoiceList', label: 'Dánh sách hóa đơn', icon: Receipt },
        { key: 'skills', label: 'Quản lý kỹ năng', icon: Wrench },
        { key: 'location', label: 'Quản lý vị trí', icon: MapPin },
        { key: 'account', label: 'Tài khoản', icon: User, avatar: true },
        { key: 'logout', label: 'Đăng xuất', icon: LogOut },
    ];

    return (
        <div className={`${open ? 'w-64' : 'w-20'} bg-white border-r shadow-sm h-screen transition-all relative`}>
            {/* Logo */}
            <div className={`flex items-center gap-3 border-b p-3`}>
                <img src={logo} className="w-10" />
                <h1
                    className={`text-xl font-semibold text-orange-500 transition-all ${
                        !open && 'opacity-0 translate-x-5 pointer-events-none'
                    }`}
                >
                    TECHNICIAN
                </h1>
            </div>

            {/* Toggle Sidebar */}
            <button
                onClick={() => setOpen(!open)}
                className="absolute -right-3 top-5 bg-white border p-1 rounded-full shadow"
            >
                <Menu size={18} />
            </button>

            {/* Menu list */}
            <div className="mt-4 flex flex-col gap-2 px-3">
                {menu.map((m) => {
                    const Icon = m.icon;

                    return (
                        <button
                            key={m.key}
                            onClick={() => m.key !== 'logout' && setActive(m.key)}
                            className={`flex items-center justify-between p-3 rounded-lg transition-colors
                                ${active === m.key ? 'bg-orange-200 text-orange-700 font-medium' : 'text-gray-700 hover:bg-orange-100'}
                            `}
                        >
                            {/* Icon + Label */}
                            <div className="flex items-center gap-3">
                                {m.avatar ? (
                                    <img src="https://i.pravatar.cc/50" className="w-6 h-6 rounded-full object-cover" />
                                ) : (
                                    <Icon size={20} />
                                )}

                                {open && <span>{m.label}</span>}
                            </div>

                            {/* Badge thông báo */}
                            {m.badge && m.badge > 0 && (
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
