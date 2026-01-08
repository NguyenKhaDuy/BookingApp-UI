import { useNavigate } from "react-router-dom";
import avatar from '../../../assets/default-avatar.jpg'

export default function TechnicianProfileHeader({ tech }) {
    const maxStars = 5;
    const isOnline = tech.status_technician === 'ONLINE';
    const navigate = useNavigate();
    return (
        <div className="bg-white rounded-3xl p-6 shadow-md flex flex-col items-center text-center relative">
            {/* Status badge */}
            <span
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold
          ${isOnline ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}
        `}
            >
                {isOnline ? 'Đang hoạt động' : 'Ngoại tuyến'}
            </span>

            {/* Avatar */}
            <img
                src={tech.avatarBase64 ? `data:image/jpeg;base64,${tech.avatarBase64}` : avatar}
                alt={tech.full_name || 'Technician'}
                className="w-28 h-28 rounded-full object-cover shadow-md"
            />

            <h1 className="text-2xl font-bold mt-4">{tech.full_name || '—'}</h1>
            <p className="text-gray-500">{tech.specialty || '—'}</p>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-2">
                {[...Array(maxStars)].map((_, index) => (
                    <span
                        key={index}
                        className={index < Math.round(tech?.total_star ?? 0) ? 'text-yellow-500' : 'text-gray-300'}
                    >
                        ★
                    </span>
                ))}

                <span className="ml-1 font-semibold">{(tech?.total_star ?? 0).toFixed(1)}</span>
                <span className="text-gray-400 text-sm">({tech?.totalReviews ?? 0} đánh giá)</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
                <button
                    onClick={() => navigate(`/booking/${tech.id_user}`)}
                    disabled={!isOnline}
                    className={`px-5 py-2 rounded-xl shadow
            ${
                isOnline
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
                >
                    Đặt lịch
                </button>

                <button className="px-5 py-2 bg-gray-200 text-gray-700 rounded-xl shadow hover:bg-gray-300">
                    Nhắn tin
                </button>
            </div>
        </div>
    );
}
