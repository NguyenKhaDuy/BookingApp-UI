import StatsGrid from '../../../Components/Admin/StatsGrid/StatsGrid';
import AdminCustomers from '../../../Components/Admin/AdminUsers/AdminCustomers/AdminCustomers';
import { Fragment } from 'react/jsx-runtime';

export default function AdminHome({ active }) {
    return (
        <Fragment>
            {active === 'dashboard' && <StatsGrid />}
            {active === 'users-customer' && <AdminCustomers />}
        </Fragment>
    );
}
