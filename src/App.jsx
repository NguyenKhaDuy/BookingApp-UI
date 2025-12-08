import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Components/Client/Header/Header';
import Footer from './Components/Client/Footer/Footer';
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
function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/notification" element={<Notification />} />
                <Route path="/services" element={<ServicePage />} />
                <Route path="/technicians" element={<TechnicianPage />} />
                <Route path="/technicians/techniciandetail/" element={<TechnicianDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/request" element={<RequestPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/Booking" element={<BookingPage />} />
                <Route path="/contact" element={<ContactPage />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
