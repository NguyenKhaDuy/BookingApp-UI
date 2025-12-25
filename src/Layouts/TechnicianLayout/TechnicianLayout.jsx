import TechnicianSidebar from '../../Components/Technician/TechnicianSidebar/TechnicianSidebar';
import TechnicianHeader from '../../Components/Technician/TechnicianHeader/TechnicianHeader';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import TechnicianHome from '../../Pages/Technician/TechnicianHome/TechnicianHome';

export default function TechnicianLayout() {
    const [active, setActive] = useState('dashboard');
    return (
        <div className="flex">
            {/* Sidebar */}
            <TechnicianSidebar active={active} setActive={setActive} />

            {/* Main */}
            <div className="flex-1 flex flex-col">
                <TechnicianHeader />

                {/* Nội dung trang hiển thị theo active */}
                <div className="p-6">
                    <TechnicianHome active={active} />
                </div>
            </div>
        </div>
    );
}
