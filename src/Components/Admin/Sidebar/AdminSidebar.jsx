import { useState } from 'react';
import {
    Menu, ClipboardList, Users, BarChart3, Settings, ChevronDown,
    User, Wrench        // ➜ THÊM ICON CHO SUBMENU
} from 'lucide-react';
import logo from '../../../assets/logo.png';

export default function TechnicianSidebar({ active, setActive }) {
    const [open, setOpen] = useState(true);
    const [openUserSubmenu, setOpenUserSubmenu] = useState(false);

    const menu = [
        { key: 'dashboard', label: 'Dashboard', icon: ClipboardList },
        {
            key: 'users',
            label: 'Users',
            icon: Users,
            submenu: [
                { key: 'users-customer', label: 'Customer', icon: User },
                { key: 'users-technician', label: 'Technician', icon: Wrench }
            ]
        },
        { key: 'reports', label: 'Reports', icon: BarChart3 },
        { key: 'settings', label: 'Settings', icon: Settings }
    ];

    return (
        <div
            className={`${open ? 'w-64' : 'w-20'}
                bg-white border-r shadow-sm h-screen flex flex-col transition-all duration-300 relative`}
        >
            {/* Header */}
            <div className={`flex items-center gap-3 border-b ${open ? 'p-4' : 'p-2'}`}>
                <img src={logo} alt="logo" className="w-10 h-10" />
                <h1
                    className={`text-xl font-semibold text-orange-500 transition-all duration-200
                    ${!open && 'opacity-0 translate-x-5 pointer-events-none'}`}
                >
                    Booking App
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
                    const hasSubmenu = !!m.submenu;

                    return (
                        <div key={m.key}>
                            {/* Menu chính */}
                            <button
                                onClick={() => {
                                    if (hasSubmenu) setOpenUserSubmenu(!openUserSubmenu);
                                    else setActive(m.key);
                                }}
                                className={`flex items-center justify-between p-3 rounded-lg transition-colors w-full
                                    ${active === m.key ? 'bg-orange-200 text-orange-700 font-medium' : 'text-gray-700 hover:bg-orange-100'}
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

                            {/* Submenu */}
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
            </div>
        </div>
    );
}
