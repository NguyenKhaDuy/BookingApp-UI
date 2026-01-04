import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import axios from 'axios';
import { UserContext } from '../../../Context/UserContext';

const formatTime = (arr) => {
    if (!arr || arr.length < 6) return '';
    return new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]).toLocaleString();
};

export default function NotificationDetail() {
    const { id } = useParams(); // id_notify
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await axios.get(`http://localhost:8081/api/user/notification/`, {
                    params: {
                        id_user: user.id_user,
                        id_notify: id,
                    },
                    withCredentials: true,
                });

                const n = res.data.data;

                setNotification({
                    title: n.title,
                    content: n.message,
                    createdAt: formatTime(n.created_at),
                    type: n.type,
                    idType: n.id_type,
                });
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id, user]);

    if (loading) return null;
    if (!notification) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0">
                <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
                        <ArrowLeft size={20} />
                    </button>
                    <Bell className="text-orange-500" />
                    <span className="font-semibold text-lg">Chi tiết thông báo</span>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-4 py-6">
                <div className="bg-white rounded-2xl shadow p-6">
                    <h1 className="text-xl font-semibold mb-2">{notification.title}</h1>

                    <p className="text-sm text-gray-400 mb-5">{notification.createdAt}</p>

                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">{notification.content}</div>

                    {notification.type === 'ACCEPTED_REQUEST' && (
                        <div className="mt-6 text-right">
                            <button
                                onClick={() => navigate(`/request/${notification.idType}`)}
                                className="px-5 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600"
                            >
                                Xem đơn sửa chữa
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
