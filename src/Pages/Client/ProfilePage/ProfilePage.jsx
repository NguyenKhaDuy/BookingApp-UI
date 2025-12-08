import { useState } from 'react';
import { ProfileSidebar } from '../../../Components/Client/SidebarProfile/SidebarProfile';
import { ProfileMobileTabs } from '../../../Components/Client/ProfileMobileTabs/ProfileMobileTabs';
import ProfileInfo from '../../../Components/Client/ProfileInfoCard/ProfileInfoCard';
import ProfilePassword from '../../../Components/Client/SecurityCard/SecurityCard';
import ProfileSettings from '../../../Components/Client/SettingCard/SettingCard';
import ProfileMobileHeader from '../../../Components/Client/ProfileMobileHeader/ProfileMobileHeader';

export default function ProfilePage() {
    const [active, setActive] = useState('profile');

    return (
        <div className="container mx-auto px-4 pt-24 pb-10 flex gap-6">
            {/* Desktop Sidebar */}
            <ProfileSidebar active={active} setActive={setActive} />

            <div className="flex-1">
                {/* Mobile Avatar + Name */}
                <ProfileMobileHeader />

                {/* Mobile Tabs */}
                <ProfileMobileTabs active={active} setActive={setActive} />

                {/* Content */}
                {active === 'profile' && <ProfileInfo />}
                {active === 'password' && <ProfilePassword />}
                {active === 'settings' && <ProfileSettings />}
            </div>
        </div>
    );
}
