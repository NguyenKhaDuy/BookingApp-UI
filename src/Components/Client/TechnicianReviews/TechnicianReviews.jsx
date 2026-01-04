const formatDateTime = (arr) => {
    if (!Array.isArray(arr)) return '';

    const [year, month, day, hour, minute] = arr;

    return `${day}/${month}/${year} ${hour}:${minute.toString().padStart(2, '0')}`;
};

export default function TechnicianRatings({ ratings }) {
    const maxStars = 5;

    console.log(ratings);

    if (ratings.length === 0) {
        return <p className="text-gray-400 text-center mt-4">Chưa có đánh giá nào</p>;
    }

    return (
        <div className="bg-white rounded-3xl p-6 shadow-md mt-6">
            <h2 className="text-xl font-bold mb-4">Đánh giá từ khách hàng</h2>

            <div className="space-y-4">
                {ratings.map((rating) => (
                    <div key={rating.id_rating} className="flex gap-4 border-b pb-4 last:border-b-0">
                        {/* Avatar */}
                        <img
                            src={`data:image/jpeg;base64,${rating.avatarBase64}`}
                            alt={rating.id_user}
                            className="w-12 h-12 rounded-full object-cover"
                        />

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold">{rating.full_name}</span>

                                <div className="flex items-center gap-3">
                                    {/* Thời gian */}
                                    <span className="text-xs text-gray-400">{formatDateTime(rating.created_at)}</span>

                                    {/* Stars */}
                                    <div className="flex">
                                        {[...Array(maxStars)].map((_, index) => (
                                            <span
                                                key={index}
                                                className={index < rating.stars ? 'text-yellow-500' : 'text-gray-300'}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm mt-1">{rating.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
