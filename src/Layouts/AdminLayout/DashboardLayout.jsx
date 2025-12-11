import Sidebar from '../../Components/Admin/Sidebar/Sidebar';
import AdminSidebar from '../../Components/Admin/Sidebar/AdminSidebar';
import Header from '../../Components/Admin/Header/Header';
import { Outlet } from 'react-router-dom';
import AdminHome from '../../Pages/Admin/AdminHome/AdminHome';
import { useEffect } from 'react';
import { useState } from 'react';

export default function DashboardLayout() {
    useEffect(() => {
        document.title = 'Admin Dashboard - Booking app';
    }, []);

    const [active, setActive] = useState('dashboard');

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <AdminSidebar active={active} setActive={setActive} />

            {/* Main */}
            <div className="flex-1">
                <Header />

                {/* Render trang con */}
                {/* <Outlet /> */}
                {/* Nội dung trang hiển thị theo active */}
                <div className="p-6">
                    <AdminHome active={active} />
                </div>
            </div>
        </div>
    );
}
