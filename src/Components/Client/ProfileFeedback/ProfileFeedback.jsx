import { useState } from 'react';
import axios from 'axios';

export default function ProfileFeedback({ profile }) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            setLoading(true);
            setSuccess(null);

            const token = localStorage.getItem('token');

            await axios.post(
                'http://localhost:8081/api/feedback',
                {
                    content,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            setContent('');
            setSuccess(true);
        } catch (error) {
            console.error('Gửi feedback lỗi:', error);
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#0f1f36] rounded-xl p-6 text-white border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Góp ý & Phản hồi</h2>

            <p className="text-sm text-gray-300 mb-4">
                Chúng tôi rất mong nhận được góp ý của bạn để cải thiện dịch vụ.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Nhập góp ý của bạn..."
                    className="w-full rounded-lg bg-[#091628] border border-white/10 p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <button
                    disabled={loading}
                    className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition disabled:opacity-60"
                >
                    {loading ? 'Đang gửi...' : 'Gửi phản hồi'}
                </button>

                {success === true && <p className="text-green-400 text-sm">Gửi phản hồi thành công 🎉</p>}

                {success === false && <p className="text-red-400 text-sm">Gửi phản hồi thất bại 😢</p>}
            </form>
        </div>
    );
}
