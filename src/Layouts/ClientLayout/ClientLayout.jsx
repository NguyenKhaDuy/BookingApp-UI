import Header from '../../Components/Client/Header/Header';
import Footer from '../../Components/Client/Footer/Footer';
import ChatWidget from '../../Components/Client/ChatWidget/ChatWidget';
import { Outlet } from 'react-router-dom';

export default function ClientLayout() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />

            <ChatWidget />
        </>
    );
}
