import { useState } from 'react';
import ProfileSidebar from '../../Components/SidebarProfile/SidebarProfile';
import ProfileInfo from '../../Components/ProfileInfoCard/ProfileInfoCard';
import ProfilePassword from '../../Components/SecurityCard/SecurityCard';
import ProfileSettings from '../../Components/SettingCard/SettingCard';

export default function ProfilePage() {
    const [active, setActive] = useState('profile');

    return (
        <div className="pt-24 pb-20 min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 flex gap-6">
                {/* Sidebar */}
                <ProfileSidebar active={active} setActive={setActive} />

                {/* Nội dung */}
                <div className="flex-1">
                    {active === 'profile' && <ProfileInfo />}
                    {active === 'password' && <ProfilePassword />}
                    {active === 'settings' && <ProfileSettings />}
                </div>
            </div>
        </div>
    );
}
