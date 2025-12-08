import { useState } from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import RequestDetailModal from '../RequestDetailModal/RequestDetailModal';
import RatingModal from '../RatingModal/RatingModal'; // 🔥 popup đánh giá

export default function RepairStatusPage() {
    const [active, setActive] = useState('waiting');
    const [selected, setSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showRating, setShowRating] = useState(false); // 🔥 popup đánh giá

    const statusList = [
        {
            key: 'waiting',
            label: 'Đang chờ thợ nhận',
            icon: <Clock size={22} className="text-gray-500" />,
        },
        {
            key: 'accepted',
            label: 'Kỹ thuật viên đã nhận',
            icon: <CheckCircle size={22} className="text-green-500" />,
        },
        {
            key: 'fixing',
            label: 'Đang sửa chữa',
            icon: <CheckCircle size={22} className="text-green-500" />,
        },
        {
            key: 'done',
            label: 'Hoàn thành',
            icon: <CheckCircle size={22} className="text-orange-500" />,
        },
        {
            key: 'canceled',
            label: 'Đã hủy',
            icon: <XCircle size={22} className="text-red-500" />,
        },
    ];

    const mockData = {
        waiting: [
            { id: 1, name: 'Sửa ống nước bị rò rỉ', customer: 'Nguyễn Văn A' },
            { id: 2, name: 'Thay CB điện', customer: 'Trần Văn B' },
        ],
        accepted: [
            {
                id: 3,
                name: 'Lắp máy bơm mới',
                customer: 'Lê Văn C',
                technician: {
                    name: 'Thợ Minh',
                    phone: '0987 654 321',
                    avatar: 'https://i.pravatar.cc/150?img=12',
                },
            },
        ],
        fixing: [
            {
                id: 4,
                name: 'Sửa máy lạnh không lạnh',
                customer: 'Hồ Văn D',
                technician: {
                    name: 'Thợ Hùng',
                    phone: '0912 345 678',
                    avatar: 'https://i.pravatar.cc/150?img=15',
                },
            },
        ],
        done: [
            {
                id: 5,
                name: 'Thông tắc lavabo',
                customer: 'Phạm Văn E',
                technician: {
                    name: 'Thợ Bảo',
                    phone: '0901 223 344',
                    avatar: 'https://i.pravatar.cc/150?img=22',
                },
            },
        ],
        canceled: [
            {
                id: 6,
                name: 'Sửa máy giặt kêu lớn',
                customer: 'Võ Văn H',
                reason: 'Khách hàng hủy lịch',
            },
        ],
    };

    // TRẠNG THÁI NÀO HIỂN THỊ KỸ THUẬT VIÊN?
    const showTech = active !== 'waiting' && active !== 'canceled';

    return (
        <div className="max-w-6xl mx-auto mt-10 px-4 flex flex-col md:flex-row gap-6">
            {/* LEFT SIDEBAR STATUS */}
            <div className="w-full md:w-1/3 bg-white shadow rounded-xl p-5 border">
                <h2 className="text-lg font-semibold mb-4">Tiến trình đơn hàng</h2>

                <div className="space-y-4">
                    {statusList.map((s) => (
                        <div
                            key={s.key}
                            className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition border 
                                ${active === s.key ? 'bg-orange-50 border-orange-400' : 'hover:bg-gray-100 border-transparent'}
                            `}
                            onClick={() => setActive(s.key)}
                        >
                            {s.icon}

                            <div>
                                <p className={`font-medium ${active === s.key ? 'text-orange-600' : 'text-gray-700'}`}>
                                    {s.label}
                                </p>

                                {active === s.key && s.key === 'fixing' && (
                                    <p className="text-orange-500 text-sm">• Đang xử lý...</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="w-full md:w-2/3 bg-white shadow rounded-xl p-5 border">
                <h2 className="text-lg font-semibold mb-3">
                    Yêu cầu đang ở giai đoạn:{' '}
                    <span className="text-orange-600">{statusList.find((x) => x.key === active)?.label}</span>
                </h2>

                <div className="space-y-4 mt-4">
                    {mockData[active].map((item) => (
                        <div key={item.id} className="border p-4 rounded-lg hover:shadow-sm transition">
                            <p className="font-semibold text-gray-800 text-lg">{item.name}</p>
                            <p className="text-gray-500 text-sm">Khách hàng: {item.customer}</p>

                            {/* REASON FOR CANCELED */}
                            {active === 'canceled' && item.reason && (
                                <p className="text-red-500 text-sm mt-2">Lý do: {item.reason}</p>
                            )}

                            {/* TECHNICIAN */}
                            {showTech && item.technician && (
                                <div className="mt-3 flex items-center gap-4 bg-gray-50 p-3 rounded-lg border">
                                    <img
                                        src={item.technician.avatar}
                                        className="w-14 h-14 rounded-full border"
                                        alt="Technician"
                                    />
                                    <div>
                                        <p className="font-semibold">{item.technician.name}</p>
                                        <p className="text-gray-600 text-sm">SĐT: {item.technician.phone}</p>
                                    </div>
                                </div>
                            )}

                            {/* BUTTONS */}
                            <div className="flex gap-3 mt-3">
                                {/* VIEW DETAIL */}
                                <button
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                                    onClick={() => {
                                        setSelected(item);
                                        setShowModal(true);
                                    }}
                                >
                                    Xem chi tiết
                                </button>

                                {/* RATING BUTTON */}
                                {active === 'done' && (
                                    <button
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        onClick={() => {
                                            setSelected(item);
                                            setShowRating(true);
                                        }}
                                    >
                                        Đánh giá thợ
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* DETAIL MODAL */}
            <RequestDetailModal open={showModal} data={selected} onClose={() => setShowModal(false)} />

            {/* RATING MODAL */}
            <RatingModal open={showRating} data={selected} onClose={() => setShowRating(false)} />
        </div>
    );
}
