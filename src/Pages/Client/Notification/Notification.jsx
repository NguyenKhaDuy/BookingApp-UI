import React, { Fragment } from 'react';
import NotificationHeader from '../../../Components/Client/NotificationHeader/NotificationHeader';
import NotificationFilter from '../../../Components/Client/NotificationFilter/NotificationFilter';
import NotificationList from '../../../Components/Client/NotificationList/NotificationList';
export default function Notification() {
    return (
        <Fragment>
            <NotificationHeader />
            <NotificationFilter />
            <NotificationList />
        </Fragment>
    );
}
