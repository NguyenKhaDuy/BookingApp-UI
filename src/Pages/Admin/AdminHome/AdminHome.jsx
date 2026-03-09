import StatsGrid from '../../../Components/Admin/StatsGrid/StatsGrid';
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

// export default function SendNotificationForm() {
//     const [stompClient, setStompClient] = useState(null);
//     const [activeTab, setActiveTab] = useState('all');
//     const [message, setMessage] = useState('');

//     const [formAll, setFormAll] = useState({ title: '', body: '' });
//     const [formPrivate, setFormPrivate] = useState({ title: '', body: '', userName: '' });

//     return (
//         <div className="bg-white shadow rounded-xl p-6">
//             {/* Tabs */}
//             <div className="flex gap-3 mb-6">
//                 <button
//                     onClick={() => setActiveTab('all')}
//                     className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
//                         activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
//                     }`}
//                 >
//                     <Users size={18} /> Gửi toàn bộ
//                 </button>

//                 <button
//                     onClick={() => setActiveTab('private')}
//                     className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
//                         activeTab === 'private' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
//                     }`}
//                 >
//                     <User size={18} /> Gửi riêng
//                 </button>
//             </div>

//             {/* Form all */}
//             {activeTab === 'all' && (
//                 <form className="space-y-4" onSubmit={sendAll}>
//                     <div>
//                         <label className="block font-medium mb-1">Tiêu đề</label>
//                         <input
//                             value={formAll.title}
//                             onChange={(e) => setFormAll({ ...formAll, title: e.target.value })}
//                             className="w-full border rounded-lg px-3 py-2"
//                             placeholder="Nhập tiêu đề"
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label className="block font-medium mb-1">Nội dung</label>
//                         <textarea
//                             value={formAll.body}
//                             onChange={(e) => setFormAll({ ...formAll, body: e.target.value })}
//                             className="w-full border rounded-lg px-3 py-2 h-24"
//                             placeholder="Nhập nội dung"
//                             required
//                         />
//                     </div>
//                     <button className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2">
//                         <Send size={18} /> Gửi thông báo
//                     </button>
//                 </form>
//             )}

//             {/* Form private */}
//             {activeTab === 'private' && (
//                 <form className="space-y-4" onSubmit={sendPrivate}>
//                     <div>
//                         <label className="block font-medium mb-1">Tên user</label>
//                         <input
//                             value={formPrivate.userName}
//                             onChange={(e) => setFormPrivate({ ...formPrivate, userName: e.target.value })}
//                             className="w-full border rounded-lg px-3 py-2"
//                             placeholder="Nhập username cần gửi"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label className="block font-medium mb-1">Tiêu đề</label>
//                         <input
//                             value={formPrivate.title}
//                             onChange={(e) => setFormPrivate({ ...formPrivate, title: e.target.value })}
//                             className="w-full border rounded-lg px-3 py-2"
//                             placeholder="Nhập tiêu đề"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label className="block font-medium mb-1">Nội dung</label>
//                         <textarea
//                             value={formPrivate.body}
//                             onChange={(e) => setFormPrivate({ ...formPrivate, body: e.target.value })}
//                             className="w-full border rounded-lg px-3 py-2 h-24"
//                             placeholder="Nhập nội dung"
//                             required
//                         />
//                     </div>

//                     <button className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2">
//                         <Send size={18} /> Gửi thông báo riêng
//                     </button>
//                 </form>
//             )}

//             {message && <p className="mt-4 text-green-600 text-sm">{message}</p>}
//         </div>
//     );
// }
