import { useState } from 'react';
import { X, Star } from 'lucide-react';

export default function RatingModal({ open, data, onClose }) {
    const [rating, setRating] = useState(0);
    const [hoverStar, setHoverStar] = useState(null);
    const [comment, setComment] = useState('');

    if (!open || !data) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg animate-fadeIn">
                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Đánh giá dịch vụ</h2>
                    <button onClick={onClose}>
                        <X size={24} className="text-gray-500 hover:text-black" />
                    </button>
                </div>

                {/* SERVICE NAME */}
                <p className="text-gray-700 mb-2">
                    Dịch vụ: <span className="font-semibold">{data.name}</span>
                </p>

                {/* TECH */}
                {data.technician && (
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border mb-4">
                        <img src={data.technician.avatar} className="w-12 h-12 rounded-full" alt="tech" />
                        <div>
                            <p className="font-semibold">{data.technician.name}</p>
                            <p className="text-sm text-gray-500">SĐT: {data.technician.phone}</p>
                        </div>
                    </div>
                )}

                {/* STARS */}
                <div className="flex gap-2 justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                            key={s}
                            size={32}
                            className={`cursor-pointer transition 
                                ${(hoverStar || rating) >= s ? 'text-yellow-400' : 'text-gray-300'}
                            `}
                            onMouseEnter={() => setHoverStar(s)}
                            onMouseLeave={() => setHoverStar(null)}
                            onClick={() => setRating(s)}
                        />
                    ))}
                </div>

                {/* COMMENT */}
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Nhận xét của bạn..."
                    className="w-full border rounded-lg p-3 h-28 focus:border-orange-500"
                />

                {/* ACTION BUTTONS */}
                <div className="flex justify-end gap-3 mt-5">
                    <button className="px-4 py-2 rounded-lg border hover:bg-gray-50" onClick={onClose}>
                        Hủy
                    </button>

                    <button
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                        onClick={() => {
                            console.log({
                                requestId: data.id,
                                rating,
                                comment,
                            });
                            onClose();
                        }}
                    >
                        Gửi đánh giá
                    </button>
                </div>
            </div>
        </div>
    );
}
