import TechnicianDashboard from '../../../Components/Technician/TechnicianDashboard/TechnicianDashboard';
import RepairRequest from '../../../Components/Technician/RepairRequest/RepairRequest';
import Notification from '../../../Components/Technician/Notifications/Notifications';
import Account from '../../../Components/Technician/Account/Account';
import SkillManager from '../../../Components/Technician/SkillManager/SkillManager';
import LocationManager from '../../../Components/Technician/LocationManager/LocationManager';
import TechnicianInvoiceList from '../../../Components/Technician/TechnicianInvoiceList/TechnicianInvoiceList';
export default function TechnicianHome({ active }) {
    return (
        <div className="space-y-6">
            {active === 'dashboard' && <TechnicianDashboard />}
            {active === 'orders' && <RepairRequest />}
            {active === 'notifications' && (
                <Notification
                    onAcceptOrder={(orderId) => {
                        console.log('Thợ nhận đơn:', orderId);
                        alert('Bạn đã nhận đơn #' + orderId);
                    }}
                />
            )}
            {active === 'invoiceList' && <TechnicianInvoiceList />}
            {active === 'location' && <LocationManager />}
            {active === 'skills' && <SkillManager />}
            {active === 'account' && <Account />}
        </div>
    );
}
