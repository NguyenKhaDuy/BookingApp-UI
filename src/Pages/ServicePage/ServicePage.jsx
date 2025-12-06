import React, { Fragment } from 'react';
import ServiceHeader from '../../Components/ServiceHeader/ServiceHeader';
import ServiceSearch from '../../Components/ServiceSearch/ServiceSearch';
import ServiceCategory from '../../Components/ServiceCategory/ServiceCategory';
import ServiceGrid from '../../Components/ServiceGrid/ServiceGrid';
export default function Notification() {
    return (
        <Fragment>
            <ServiceHeader />
            <ServiceSearch />
            <ServiceCategory />
            <ServiceGrid/>
        </Fragment>
    );
}
