export default function TechnicianReviews({ reviews }) {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Đánh giá từ khách hàng</h2>

            <div className="space-y-5">
                {reviews.map((r, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-gray-50 border shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold">{r.name}</span>

                            {/* ⭐⭐⭐⭐☆ */}
                            <span className="text-yellow-500 text-lg">
                                {'★'.repeat(r.rating)}
                                {'☆'.repeat(5 - r.rating)}
                            </span>
                        </div>

                        <p className="text-gray-600">{r.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
