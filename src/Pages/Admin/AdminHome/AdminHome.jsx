import AdminCustomers from '../../../Components/Admin/AdminUsers/AdminCustomers/AdminCustomers';
import AdminTechnicians from '../../../Components/Admin/AdminUsers/AdminTechnicians/AdminTechnicians';
import { Fragment } from 'react/jsx-runtime';
import ManageLevel from '../../../Components/Admin/ManageLevel/ManageLevel';
import ManageFeedback from '../../../Components/Admin/ManageFeedback/ManageFeedback';
import ManageRequest from '../../../Components/Admin/ManageRequest/ManageRequest';
import LocationManager from '../../../Components/Admin/LocationManager/LocationManager';
import NotificationManager from '../../../Components/Admin/NotificationManager/NotificationManager';
import NotificationTypeManager from '../../../Components/Admin/NotificationTypeManager/NotificationTypeManager';
import OtpManager from '../../../Components/Admin/OtpManager/OtpManager';
import PaymentMethodManager from '../../../Components/Admin/PaymentMethodManager/PaymentMethodManager';
import RoleManager from '../../../Components/Admin/RoleManager/RoleManager';
import ServiceManager from '../../../Components/Admin/ServiceManager/ServiceManager';
import SkillManager from '../../../Components/Admin/SkillManager/SkillManager';
import StatusManager from '../../../Components/Admin/StatusManager/StatusManager';
import StatisticsChart from '../../../Components/Admin/StatisticsChart/StatisticsChart';


export default function AdminHome({ active }) {
    return (
        <Fragment>
            {active === 'dashboard' && <StatisticsChart />}
            {active === 'users-customer' && <AdminCustomers />}
            {active === 'users-technician' && <AdminTechnicians />}

            {active === 'manage-level' && <ManageLevel />}
            {active === 'manage-feedback' && <ManageFeedback />}
            {active === 'manage-requests' && <ManageRequest />}
            {active === 'manage-location' && <LocationManager />}
            {active === 'manage-notification' && <NotificationManager />}
            {active === 'manage-notification-type' && <NotificationTypeManager />}
            {active === 'manage-otp' && <OtpManager />}
            {active === 'manage-payment-method' && <PaymentMethodManager />}
            {active === 'manage-role' && <RoleManager />}
            {active === 'manage-service' && <ServiceManager />}
            {active === 'manage-skill' && <SkillManager />}
            {active === 'manage-status' && <StatusManager />}
        </Fragment>
    );
}
