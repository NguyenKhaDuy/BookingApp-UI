import { Bell } from 'lucide-react';

export default function TechnicianHeader() {
    return (
        <header className="bg-white shadow-sm border-b px-6 py-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Chào mừng, Thợ</h2>

            <div className="flex items-center gap-4">
                <button className="relative">
                    <Bell size={22} className="text-gray-700" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">3</span>
                </button>

                <img src="https://i.pravatar.cc/100" alt="avatar" className="w-10 h-10 rounded-full border" />
            </div>
        </header>
    );
}
