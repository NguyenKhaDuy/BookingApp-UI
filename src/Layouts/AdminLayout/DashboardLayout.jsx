import Sidebar from '../../Components/Admin/Sidebar/Sidebar';
import Header from '../../Components/Admin/Header/Header';
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';

export default function DashboardLayout() {
    useEffect(() => {
        document.title = 'Admin Dashboard - Booking app';
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main */}
            <div className="flex-1">
                <Header />

                {/* Render trang con */}
                <Outlet />
            </div>
        </div>
    );
}
