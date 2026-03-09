import { useState } from 'react';
import { X, Star } from 'lucide-react';
import { useToast } from '../../../Context/ToastContext';
import axios from 'axios';
import getCookie from '../../../utils/getToken';

export default function RatingModal({ open, data, onClose }) {
    const [rating, setRating] = useState(0);
    const [hoverStar, setHoverStar] = useState(null);
    const [comment, setComment] = useState('');
    const { showToast } = useToast();

    // console.log(data)

    if (!open || !data) return null;

    // 🔥 HÀM GỌI API
    const handleSubmitRating = async () => {
        if (rating === 0) {
            showToast('Vui lòng chọn số sao đánh giá', 'error');
            return;
        }

        try {
              const token = getCookie('token');
              if (!token) return;

            await axios.post(
                'http://localhost:8081/api/customer/rating/',
                {
                    stars: rating,
                    comment: comment,
                    customer_id: data.customer.id_user,
                    technician_id: data.technicicanDTO.id_user,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            showToast('Đánh giá thành công', 'success');
            onClose();
        } catch (err) {
            // console.error(err);
            showToast('Gửi đánh giá thất bại', 'error');
        }
    };


    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-xl p-6">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold">Đánh giá dịch vụ</h2>
                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                <div className="flex justify-center gap-3 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => {
                        const active = (hoverStar || rating) >= s;

                        return (
                            <Star
                                key={s}
                                size={36}
                                onClick={() => setRating(s)}
                                onMouseEnter={() => setHoverStar(s)}
                                onMouseLeave={() => setHoverStar(null)}
                                fill="currentColor"
                                className={`
                    cursor-pointer transition-all duration-200
                    ${
                        active
                            ? 'text-yellow-400 scale-110 drop-shadow-[0_4px_6px_rgba(250,204,21,0.6)]'
                            : 'text-gray-300'
                    }
                `}
                            />
                        );
                    })}
                </div>

                <textarea
                    className="w-full border p-2"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Nhận xét..."
                />

                <div className="flex justify-end mt-4">
                    <button className="bg-orange-500 text-white px-4 py-2 rounded" onClick={handleSubmitRating}>
                        Gửi đánh giá
                    </button>
                </div>
            </div>
        </div>
    );
}
