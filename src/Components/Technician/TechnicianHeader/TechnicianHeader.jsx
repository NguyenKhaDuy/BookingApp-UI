import axios from 'axios';
import { Bell, LogOut, User } from 'lucide-react';
import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import avatarDefault from '../../../assets/default-avatar.jpg';

export default function TechnicianHeader() {
    const { user, setUser } = useContext(UserContext);
    const [openMenu, setOpenMenu] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('http://localhost:8081/api/me/', {
                    withCredentials: true,
                });

                if (typeof res.data === 'object') {
                    setUser(res.data);
                    localStorage.setItem('user', JSON.stringify(res.data));
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.log('Chưa login');
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        localStorage.removeItem('user');
        setUser(null);
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        navigate('/login');
    };

    const avatarSrc = user?.avatar_base64 ? `data:image/jpeg;base64,${user.avatar_base64}` : avatarDefault;

    return (
        <header className="bg-white shadow-sm border-b px-6 py-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Chào mừng {user?.full_name || ''}</h2>

            <div className="flex items-center gap-4 relative">

                {/* Avatar + Dropdown */}
                <div className="relative group">
                    {/* Avatar */}
                    <img
                        src={avatarSrc}
                        alt="avatar"
                        className="
            w-10 h-10 rounded-full
            border-2 border-green-500
            cursor-pointer object-cover
        "
                    />
                </div>
            </div>
        </header>
    );
}
