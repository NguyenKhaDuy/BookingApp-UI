import { useEffect, useState } from 'react';
import TechnicianDashboard from '../../../Components/Technician/TechnicianDashboard/TechnicianDashboard';
import RepairRequest from '../../../Components/Technician/RepairRequest/RepairRequest';
import Notification from '../../../Components/Technician/Notifications/Notifications';
import Account from '../../../Components/Technician/Account/Account';
import SkillManager from '../../../Components/Technician/SkillManager/SkillManager';
import LocationManager from '../../../Components/Technician/LocationManager/LocationManager';
import TechnicianInvoiceList from '../../../Components/Technician/TechnicianInvoiceList/TechnicianInvoiceList';

 import { connectWebSocket, addWebSocketListener } from '../../../utils/stompClient';


export default function TechnicianHome({ active }) {


  useEffect(() => {
         const token = localStorage.getItem('token');
 
         // LUÔN kết nối WS (dù login hay chưa)
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
