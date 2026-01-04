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
        // Lấy cookie token/email sau khi redirect OAuth2
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        };

        const token = getCookie('token');
        console.log(token);

        if (token) {
            localStorage.setItem('token', token);
        }

        // Kết nối WS với token mới
        connectWebSocket(token);

        // addWebSocketListener((msg) => {
        //     alert(`🔔 ${msg.title}\n${msg.body}`);
        // });
    }, []); // Chỉ chạy một lần khi mount

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
