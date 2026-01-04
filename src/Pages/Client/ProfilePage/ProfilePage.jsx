import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { ProfileSidebar } from '../../../Components/Client/SidebarProfile/SidebarProfile';
import { ProfileMobileTabs } from '../../../Components/Client/ProfileMobileTabs/ProfileMobileTabs';
import ProfileInfo from '../../../Components/Client/ProfileInfoCard/ProfileInfoCard';
import ProfilePassword from '../../../Components/Client/SecurityCard/SecurityCard';
import ProfileSettings from '../../../Components/Client/SettingCard/SettingCard';
import ProfileMobileHeader from '../../../Components/Client/ProfileMobileHeader/ProfileMobileHeader';
import ProfileEmail from '../../../Components/Client/ProfileEmail/ProfileEmail';

export default function ProfilePage() {
    const navigate = useNavigate();

    const [active, setActive] = useState('profile');
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    /* ================= CHECK LOGIN ================= */
    useEffect(() => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!user || !token) {
            navigate('/login', { replace: true });
            return;
        }

        setLoading(false);
    }, [navigate]);

    /* ================= FETCH PROFILE ================= */
    const fetchProfile = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));
            const idCustomer = user?.id_user;

            if (!idCustomer) return;

            const res = await axios.get(`http://localhost:8081/api/customer/profile/id=${idCustomer}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setProfile(res.data.data);
        } catch (error) {
            console.error('Lỗi lấy profile:', error);
        }
    }, []);

    /* ================= INIT ================= */
    useEffect(() => {
        if (!loading) {
            fetchProfile();
        }
    }, [loading, fetchProfile]);

    /* ================= LOADING ================= */
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">Đang kiểm tra đăng nhập...</div>
        );
    }

    /* ================= UI ================= */
    return (
        <div className="container mx-auto px-4 pt-24 pb-10 flex gap-6">
            {/* Desktop Sidebar */}
            <ProfileSidebar active={active} setActive={setActive} profile={profile} onAvatarUpdated={fetchProfile} />

            <div className="flex-1">
                {/* Mobile Avatar + Name */}
                <ProfileMobileHeader profile={profile} />

                {/* Mobile Tabs */}
                <ProfileMobileTabs active={active} setActive={setActive} />

                {/* Content */}
                {active === 'profile' && <ProfileInfo profile={profile} onProfileUpdated={fetchProfile} />}

                {active === 'email' && <ProfileEmail profile={profile} onEmailUpdated={fetchProfile} />}

                {active === 'password' && <ProfilePassword />}
                {active === 'settings' && <ProfileSettings />}
            </div>
        </div>
    );
}
