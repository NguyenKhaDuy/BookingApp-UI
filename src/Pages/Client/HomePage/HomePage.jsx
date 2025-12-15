import React, { Fragment, useEffect } from 'react';
import Hero from '../../../Components/Client/Hero/Hero';
import Service from '../../../Components/Client/Services/Service';
import FeaturedTechnicians from '../../../Components/Client/FeaturedTechnicians/FeaturedTechnicians';
import WhyChooseUs from '../../../Components/Client/WhyChooseUs/WhyChooseUs';
import Testimonials from '../../../Components/Client/Testimonials/Testimonials';
import QuickBooking from '../../../Components/Client/QuickBooking/QuickBooking';
import Process from '../../../Components/Client/Process/Process';
import { connectWebSocket, addWebSocketListener } from '../../../utils/stompClient';
export default function HomePage() {
    useEffect(() => {
        const token = localStorage.getItem('token');

        // LUÔN kết nối WS (dù login hay chưa)
        connectWebSocket(token);

        addWebSocketListener((msg) => {
            alert(`🔔 ${msg.title}\n${msg.body}`);
        });
    }, []);
    return (
        <Fragment>
            <Hero />
            <Service />
            <FeaturedTechnicians />
            <WhyChooseUs />
            <Testimonials />
            <QuickBooking />
            <Process />
        </Fragment>
    );
}
