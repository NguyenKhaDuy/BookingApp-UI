import React, { Fragment } from 'react';
import Hero from '../../Components/Hero/Hero';
import Service from '../../Components/Services/Service';
import FeaturedTechnicians from '../../Components/FeaturedTechnicians/FeaturedTechnicians';
import WhyChooseUs from '../../Components/WhyChooseUs/WhyChooseUs';
import Testimonials from '../../Components/Testimonials/Testimonials';
import QuickBooking from '../../Components/QuickBooking/QuickBooking';
import Process from '../../Components/Process/Process';

export default function HomePage() {
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
