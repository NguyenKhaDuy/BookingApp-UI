import { useState } from 'react';
import { Menu, Home, Users, Settings, BarChart3 } from 'lucide-react';
import logo from '../../../assets/logo.png';

export default function Sidebar() {
    const [open, setOpen] = useState(true);

    const items = [
        { icon: Home, label: 'Dashboard' },
        { icon: Users, label: 'Users' },
        { icon: BarChart3, label: 'Reports' },
        { icon: Settings, label: 'Settings' },
    ];

    return (
        <div
            className={`${
                open ? 'w-64' : 'w-20'
            } bg-white border-r shadow-sm h-screen flex flex-col transition-all duration-300 relative`}
        >
            {/* Header */}
            <div className={`flex items-center gap-3 border-b ${open ? 'p-4' : 'p-2'} `}>
                <img
                    src={logo}
                    alt="logo"
                    className={`transition-all duration-300 
                        ${open ? 'w-10 h-10' : 'w-10 h-10'}
                    `}
                />

                <h1
                    className={`text-xl font-semibold text-orange-500 transition-all duration-200
                    ${!open && 'opacity-0 translate-x-5 pointer-events-none'}`}
                >
                    Booking App
                </h1>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setOpen(!open)}
                className="absolute -right-3 top-5 bg-white border rounded-full p-1 shadow hover:bg-gray-100"
            >
                <Menu size={18} />
            </button>

            {/* Menu */}
            <div className="mt-4 flex flex-col gap-2 px-3">
                {items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div key={index} className="group relative">
                            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-orange-100 text-gray-700">
                                <Icon size={20} />
                                <span className={`${!open && 'hidden'}`}>{item.label}</span>
                            </button>

                            {/* Tooltip khi thu nhỏ */}
                            {!open && (
                                <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {item.label}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
