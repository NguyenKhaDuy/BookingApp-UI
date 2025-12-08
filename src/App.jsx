import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import HomePage from './Pages//HomePage/HomePage';
import Notification from './Pages/Notification/Notification';
import ServicePage from './Pages/ServicePage/ServicePage'
import TechnicianPage from './Pages/TechnicianPage/TechnicianPage'
import TechnicianDetailPage from './Pages/TechnicianDetailPage/TechnicianDetailPage';
import Register from './Pages/Register/RegisterPage';
import LoginPage from './Pages/Login/LoginPage'
import ProfilePage from './Pages/ProfilePage/ProfilePage';
import RequestPage from './Pages/RequestPage/RequestPage';
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
          </Routes>
          <Footer />
      </BrowserRouter>
  );
}

export default App;
