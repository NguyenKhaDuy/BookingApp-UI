import React, { Fragment } from 'react';
import ServiceHeader from '../../../Components/Client/ServiceHeader/ServiceHeader';
import ServiceSearch from '../../../Components/Client/ServiceSearch/ServiceSearch';
import ServiceCategory from '../../../Components/Client/ServiceCategory/ServiceCategory';
import ServiceGrid from '../../../Components/Client/ServiceGrid/ServiceGrid';
export default function Notification() {
    return (
        <Fragment>
            <ServiceHeader />
            <ServiceSearch />
            <ServiceCategory />
            <ServiceGrid />
        </Fragment>
    );
}
