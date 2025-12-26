import { useEffect, useState } from 'react';
import TechnicianDashboard from '../../../Components/Technician/TechnicianDashboard/TechnicianDashboard';
import RepairRequest from '../../../Components/Technician/RepairRequest/RepairRequest';
import Notification from '../../../Components/Technician/Notifications/Notifications';
import Account from '../../../Components/Technician/Account/Account';
import SkillManager from '../../../Components/Technician/SkillManager/SkillManager';
import LocationManager from '../../../Components/Technician/LocationManager/LocationManager';
import TechnicianInvoiceList from '../../../Components/Technician/TechnicianInvoiceList/TechnicianInvoiceList';
import { connectWebSocket, addWebSocketListener } from '../../../utils/stompClient';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export default function TechnicianHome({ active }) {
    const navigate = useNavigate();

    useEffect(() => {
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        };

        const token = getCookie('token');

        if (!token) {
            navigate('/login');
            return;
        }

        const decoded = jwtDecode(token);
        const roles = decoded.roles || [];

        // ❌ KHÔNG PHẢI THỢ → CÚT
        if (!roles.includes('TECHNICIAN')) {
            navigate('/login'); // hoặc '/'
            return;
        }

        // ✅ ĐÚNG ROLE → MỚI ĐƯỢC
        localStorage.setItem('token', token);

        connectWebSocket(token);
        addWebSocketListener((msg) => {
            alert(`🔔 ${msg.title}\n${msg.body}`);
        });
    }, []);

    return (
        <div className="space-y-6">
            {active === 'dashboard' && <TechnicianDashboard />}
            {active === 'orders' && <RepairRequest />}
            {active === 'notifications' && <Notification />}
            {active === 'invoiceList' && <TechnicianInvoiceList />}
            {active === 'location' && <LocationManager />}
            {active === 'skills' && <SkillManager />}
            {active === 'account' && <Account />}
        </div>
    );
}