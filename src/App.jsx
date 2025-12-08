import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './Pages/Client/HomePage/HomePage';
import Notification from './Pages/Client/Notification/Notification';
import ServicePage from './Pages/Client/ServicePage/ServicePage';
import TechnicianPage from './Pages/Client/TechnicianPage/TechnicianPage';
import TechnicianDetailPage from './Pages/Client/TechnicianDetailPage/TechnicianDetailPage';
import Register from './Pages/Client/Register/RegisterPage';
import LoginPage from './Pages/Client/Login/LoginPage';
import ProfilePage from './Pages/Client/ProfilePage/ProfilePage';
import RequestPage from './Pages/Client/RequestPage/RequestPage';
import ForgotPassword from './Pages/Client/ForgotPasswordPage/ForgotPasswordPage';
import BookingPage from './Pages/Client/BookingPage/BookingPage';
import ContactPage from './Pages/Client/ContactPage/ContactPage';
import AdminHome from './Pages/Admin/AdminHome/AdminHome';
import ClientLayout from './Layouts/ClientLayout/ClientLayout';
import DashboardLayout from './Layouts/AdminLayout/DashboardLayout';
function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ================= CLIENT LAYOUT ================= */}
                <Route element={<ClientLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/notification" element={<Notification />} />
                    <Route path="/services" element={<ServicePage />} />
                    <Route path="/technicians" element={<TechnicianPage />} />
                    <Route path="/technicians/techniciandetail" element={<TechnicianDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/request" element={<RequestPage />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/booking" element={<BookingPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                </Route>

                {/* ================= ADMIN LAYOUT ================= */}
                <Route element={<DashboardLayout />}>
                    <Route path="/admin/home" element={<AdminHome />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
