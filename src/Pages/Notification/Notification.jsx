import React, { Fragment } from 'react';
import NotificationHeader from '../../Components/NotificationHeader/NotificationHeader';
import NotificationFilter from '../../Components/NotificationFilter/NotificationFilter';
import NotificationList from '../../Components/NotificationList/NotificationList';
export default function Notification() {
    return (
        <Fragment>
            <NotificationHeader />
            <NotificationFilter />
            <NotificationList/>
        </Fragment>
    );
}
