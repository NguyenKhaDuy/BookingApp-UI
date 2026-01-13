import React, { Fragment, useEffect } from 'react';
import Hero from '../../../Components/Client/Hero/Hero';
import Service from '../../../Components/Client/Services/Service';
import FeaturedTechnicians from '../../../Components/Client/FeaturedTechnicians/FeaturedTechnicians';
import WhyChooseUs from '../../../Components/Client/WhyChooseUs/WhyChooseUs';
import Testimonials from '../../../Components/Client/Testimonials/Testimonials';
import QuickBooking from '../../../Components/Client/QuickBooking/QuickBooking';
import Process from '../../../Components/Client/Process/Process';
import { Navigate } from 'react-router-dom';

export default function HomePage() {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user?.roles?.[0];

    //CHỈ redirect nếu đã đăng nhập
    if (user) {
        if (role === 'ADMIN') {
            return <Navigate to="/admin/home" replace />;
        }

        if (role === 'TECHNICIAN') {
            return <Navigate to="/technician/home" replace />;
        }
    }
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

