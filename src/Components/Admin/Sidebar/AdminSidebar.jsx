import {
    Menu,
    ClipboardList,
    Users,
    BarChart3,
    Settings,
    ChevronDown,
    User,
    Wrench,
    MapPin,
    Bell,
    KeyRound,
    Shield,
    ListChecks,
    Layers,
    FileWarning,
    BadgeInfo,
    Grid2X2,
    LogOut,
    CreditCard,
} from 'lucide-react';
import logo from '../../../assets/logo.png';
import { useState } from 'react';

export default function AdminSidebar({ active, setActive, open, setOpen }) {
    const [openUserSubmenu, setOpenUserSubmenu] = useState(false);

    const menu = [
        { key: 'dashboard', label: 'Dashboard', icon: ClipboardList },
        {
            key: 'users',
            label: 'Người dùng',
            icon: Users,
            submenu: [
                { key: 'users-customer', label: 'Khách hàng', icon: User },
                { key: 'users-technician', label: 'Thợ', icon: Wrench },
            ],
        },
        { key: 'manage-level', label: 'Quản lí Level', icon: Layers },
        { key: 'manage-feedback', label: 'Quản lí Feedback', icon: BadgeInfo },
        { key: 'manage-requests', label: 'Quản lí Yêu cầu', icon: FileWarning },
        { key: 'manage-location', label: 'Quản lí Vị trí', icon: MapPin },
        { key: 'manage-notification', label: 'Quản lí Thông báo', icon: Bell },
        { key: 'manage-notification-type', label: 'Loại Thông báo', icon: Bell },
        { key: 'manage-otp', label: 'Quản lí OTP', icon: KeyRound },
        { key: 'manage-payment-method', label: 'PT Thanh toán', icon: CreditCard },
        { key: 'manage-role', label: 'Quản lí Role', icon: Shield },
        { key: 'manage-service', label: 'Quản lí dịch vụ', icon: Grid2X2 },
        { key: 'manage-skill', label: 'Quản lí kĩ năng', icon: Wrench },
        { key: 'manage-status', label: 'Quản lí trạng thái', icon: ListChecks },
        { key: 'reports', label: 'Báo cáo', icon: BarChart3 },
        { key: 'settings', label: 'Cài đặt', icon: Settings },
    ];

    const handleLogout = () => {
        console.log('Logging out...');
    };

    return (
        <div
            className={`
                ${open ? 'w-64' : 'w-20'}
                bg-white border-r shadow-sm
                h-screen fixed top-0 left-0
                flex flex-col transition-all duration-300
            `}
        >
            {/* Header logo */}
            <div className={`flex items-center gap-3 border-b ${open ? 'p-4' : 'p-2'} flex-none`}>
                <img src={logo} alt="logo" className="w-10 h-10" />
                {open && <h1 className="text-xl font-semibold text-orange-500">King Tech</h1>}
            </div>

            {/* Menu scroll */}
            <div className="flex-1 overflow-y-auto px-3 py-4 custom-scroll">
                {menu.map((m) => {
                    const Icon = m.icon;
                    const hasSubmenu = !!m.submenu;
                    const isActive = active === m.key;

                    return (
                        <div key={m.key}>
                            <button
                                onClick={() => {
                                    if (hasSubmenu) setOpenUserSubmenu(!openUserSubmenu);
                                    else setActive(m.key);
                                }}
                                className={`flex items-center justify-between p-3 rounded-lg w-full transition-colors
                                    ${isActive ? 'bg-orange-200 text-orange-700 font-medium' : 'text-gray-700 hover:bg-orange-100'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={20} />
                                    {open && <span>{m.label}</span>}
                                </div>
                                {hasSubmenu && open && (
                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform ${openUserSubmenu ? 'rotate-180' : ''}`}
                                    />
                                )}
                            </button>

                            {hasSubmenu && openUserSubmenu && open && (
                                <div className="ml-10 mt-1 flex flex-col gap-1">
                                    {m.submenu.map((sub) => {
                                        const SubIcon = sub.icon;
                                        return (
                                            <button
                                                key={sub.key}
                                                onClick={() => setActive(sub.key)}
                                                className={`flex items-center gap-2 text-sm p-2 rounded w-full
                                                    ${active === sub.key ? 'bg-orange-200 text-orange-700 font-medium' : 'text-gray-600 hover:bg-orange-100'}
                                                `}
                                            >
                                                <SubIcon size={18} />
                                                {sub.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full p-3 mt-3 text-gray-700 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    {open && <span>Đăng xuất</span>}
                </button>
            </div>

            {/* Toggle button */}
            <button
                onClick={() => setOpen(!open)}
                className="flex-none mx-auto mb-3 bg-white border p-1 rounded-full shadow"
            >
                <Menu size={18} />
            </button>
        </div>
    );
}
