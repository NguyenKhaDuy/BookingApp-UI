import TechnicianSidebar from '../../Components/Technician/TechnicianSidebar/TechnicianSidebar';
import TechnicianHeader from '../../Components/Technician/TechnicianHeader/TechnicianHeader';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import TechnicianHome from '../../Pages/Technician/TechnicianHome/TechnicianHome';

export default function TechnicianLayout() {
    const [active, setActive] = useState('dashboard');

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div className="h-full overflow-y-auto border-r">
                <TechnicianSidebar active={active} setActive={setActive} />
            </div>

            {/* Main */}
            <div className="flex-1 flex flex-col">
                <TechnicianHeader />

                {/* MAIN CONTENT scroll riêng */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <TechnicianHome active={active} />
                </div>
            </div>
        </div>
    );
}

