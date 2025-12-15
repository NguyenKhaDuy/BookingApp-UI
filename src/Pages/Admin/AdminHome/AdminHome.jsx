import { useEffect, useState } from 'react';
import { Send, Users, User } from 'lucide-react';
// import { connectStomp } from '../../../utils/stompClient';

export default function SendNotificationForm() {
    const [stompClient, setStompClient] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [message, setMessage] = useState('');

    const [formAll, setFormAll] = useState({ title: '', body: '' });
    const [formPrivate, setFormPrivate] = useState({ title: '', body: '', userName: '' });

    // useEffect(() => {
    //     connectStomp((client) => {
    //         setStompClient(client);
    //     });
    // }, []);

    const sendAll = (e) => {
    //     e.preventDefault();
    //     if (!stompClient) return setMessage('❌ Chưa kết nối WebSocket');

    //     stompClient.publish({
    //         destination: '/app/application',
    //         body: JSON.stringify({ ...formAll, dateTime: new Date() }),
    //     });

    //     setMessage('✔ Đã gửi thông báo đến TẤT CẢ người dùng');
    //     setFormAll({ title: '', body: '' });
    };

    const sendPrivate = (e) => {
    //     e.preventDefault();
    //     if (!stompClient) return setMessage('❌ Chưa kết nối WebSocket');

    //     stompClient.publish({
    //         destination: '/app/private',
    //         body: JSON.stringify({ ...formPrivate, dateTime: new Date() }),
    //     });

    //     setMessage(`✔ Đã gửi thông báo riêng cho: ${formPrivate.userName}`);
    //     setFormPrivate({ title: '', body: '', userName: '' });
    };

    return (
        <div className="bg-white shadow rounded-xl p-6">
            {/* Tabs */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                        activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                >
                    <Users size={18} /> Gửi toàn bộ
                </button>

                <button
                    onClick={() => setActiveTab('private')}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                        activeTab === 'private' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                >
                    <User size={18} /> Gửi riêng
                </button>
            </div>

            {/* Form all */}
            {activeTab === 'all' && (
                <form className="space-y-4" onSubmit={sendAll}>
                    <div>
                        <label className="block font-medium mb-1">Tiêu đề</label>
                        <input
                            value={formAll.title}
                            onChange={(e) => setFormAll({ ...formAll, title: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="Nhập tiêu đề"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Nội dung</label>
                        <textarea
                            value={formAll.body}
                            onChange={(e) => setFormAll({ ...formAll, body: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 h-24"
                            placeholder="Nhập nội dung"
                            required
                        />
                    </div>
                    <button className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2">
                        <Send size={18} /> Gửi thông báo
                    </button>
                </form>
            )}

            {/* Form private */}
            {activeTab === 'private' && (
                <form className="space-y-4" onSubmit={sendPrivate}>
                    <div>
                        <label className="block font-medium mb-1">Tên user</label>
                        <input
                            value={formPrivate.userName}
                            onChange={(e) => setFormPrivate({ ...formPrivate, userName: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="Nhập username cần gửi"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Tiêu đề</label>
                        <input
                            value={formPrivate.title}
                            onChange={(e) => setFormPrivate({ ...formPrivate, title: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="Nhập tiêu đề"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Nội dung</label>
                        <textarea
                            value={formPrivate.body}
                            onChange={(e) => setFormPrivate({ ...formPrivate, body: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 h-24"
                            placeholder="Nhập nội dung"
                            required
                        />
                    </div>

                    <button className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2">
                        <Send size={18} /> Gửi thông báo riêng
                    </button>
                </form>
            )}

            {message && <p className="mt-4 text-green-600 text-sm">{message}</p>}
        </div>
    );
}
