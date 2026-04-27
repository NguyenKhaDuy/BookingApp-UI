import { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { ProfileSidebar } from '../../../Components/Client/SidebarProfile/SidebarProfile';
import { ProfileMobileTabs } from '../../../Components/Client/ProfileMobileTabs/ProfileMobileTabs';
import ProfileInfo from '../../../Components/Client/ProfileInfoCard/ProfileInfoCard';
import ProfilePassword from '../../../Components/Client/SecurityCard/SecurityCard';
import ProfileSettings from '../../../Components/Client/SettingCard/SettingCard';
import ProfileMobileHeader from '../../../Components/Client/ProfileMobileHeader/ProfileMobileHeader';
import ProfileEmail from '../../../Components/Client/ProfileEmail/ProfileEmail';
import ProfileFeedback from '../../../Components/Client/ProfileFeedback/ProfileFeedback';

import { UserContext } from '../../../Context/UserContext';
import getCookie from '../../../utils/getToken';
import { API_BASE_URL } from '../../../utils/api';
export default function ProfilePage() {
    const navigate = useNavigate();
    const { user, initialized } = useContext(UserContext);

    const [active, setActive] = useState('profile');
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    /* ================= FETCH PROFILE ================= */
    const fetchProfile = useCallback(async () => {
        const token = getCookie('token');

        if (!token || !user?.id_user) return;

        try {
            const res = await axios.get(
                `${API_BASE_URL}/customer/profile/id=${user.id_user}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setProfile(res.data.data);
        } catch (error) {
            console.error('Lỗi lấy profile:', error);
        }
    }, [user?.id_user]);

    /* ================= CHECK LOGIN ================= */
    useEffect(() => {
        if (!initialized) return;

        const token = getCookie('token');

        // chưa có token => logout ngay
        if (!token) {
            navigate('/login', { replace: true });
            return;
        }

        // chờ user hydrate xong mới xử lý tiếp
        if (!user) return;

        setLoading(false);
    }, [initialized, user, navigate]);

    /* ================= FETCH DATA ================= */
    useEffect(() => {
        if (!loading) {
            fetchProfile();
        }
    }, [loading, fetchProfile]);

    /* ================= LOADING ================= */
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Đang tải thông tin tài khoản...
            </div>
        );
    }

    /* ================= UI ================= */
    return (
        <div className="container mx-auto px-4 pt-24 pb-10 flex gap-6">
            {/* Sidebar */}
            <ProfileSidebar
                active={active}
                setActive={setActive}
                profile={profile}
                onAvatarUpdated={fetchProfile}
            />

            <div className="flex-1">
                {/* Mobile Header */}
                <ProfileMobileHeader profile={profile} />

                {/* Mobile Tabs */}
                <ProfileMobileTabs active={active} setActive={setActive} />

                {/* Content */}
                {active === 'profile' && (
                    <ProfileInfo
                        profile={profile}
                        onProfileUpdated={fetchProfile}
                    />
                )}

                {active === 'email' && (
                    <ProfileEmail
                        profile={profile}
                        onEmailUpdated={fetchProfile}
                    />
                )}

                {active === 'help' && (
                    <ProfileFeedback profile={profile} />
                )}

                {active === 'password' && (
                    <ProfilePassword profile={profile} />
                )}

                {active === 'settings' && <ProfileSettings />}
            </div>
        </div>
    );
}