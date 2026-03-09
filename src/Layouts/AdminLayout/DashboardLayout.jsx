import AdminSidebar from '../../Components/Admin/Sidebar/AdminSidebar';
import Header from '../../Components/Admin/Header/Header';
import AdminHome from '../../Pages/Admin/AdminHome/AdminHome';
import { useEffect, useState } from 'react';

export default function DashboardLayout() {
    useEffect(() => {
        document.title = 'Admin Dashboard - Booking app';
    }, []);

    const [active, setActive] = useState('dashboard');
    const [open, setOpen] = useState(true); // điều khiển mở/đóng sidebar

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <AdminSidebar active={active} setActive={setActive} open={open} setOpen={setOpen} />

            {/* Main content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${open ? 'ml-64' : 'ml-20'}`}>
                <Header />
                <div className="p-6 overflow-y-auto">
                    <AdminHome active={active} />
                </div>
            </div>
        </div>
    );
}
