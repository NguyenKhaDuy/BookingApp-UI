import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function Testimonials() {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8081/api/ratings/outstanding/')
            .then((res) => res.json())
            .then((data) => {
                if (data?.data) {
                    const shuffled = [...data.data].sort(() => 0.5 - Math.random());
                    setReviews(shuffled.slice(0, 3));
                }
            })
            .catch((err) => console.error('Fetch ratings error:', err));
    }, []);


    const formatDate = (arr) => {
        if (!arr || arr.length < 3) return '';
        const [y, m, d] = arr;
        return `${d}/${m}/${y}`;
    };

    return (
        <section className="py-24 bg-gray-50" id="testimonials">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-16">Đánh Giá Nổi Bật Từ Khách Hàng</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {reviews.map((item, index) => (
                        <motion.div
                            key={item.id_rating}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white shadow-lg rounded-3xl p-8 border border-gray-100 hover:shadow-2xl transition"
                        >
                            {/* Avatar */}
                            <img
                                src={
                                    item.avatarBase64
                                        ? `data:image/png;base64,${item.avatarBase64}`
                                        : 'https://i.pravatar.cc/100'
                                }
                                alt={item.full_name}
                                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border"
                            />

                            {/* Stars */}
                            <div className="flex justify-center mb-4">
                                {Array.from({ length: item.stars }).map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-orange-500 fill-orange-500" />
                                ))}
                            </div>

                            {/* Comment */}
                            <p className="text-gray-700 mb-6 italic">“{item.comment}”</p>

                            {/* Name */}
                            <h4 className="font-semibold text-gray-900">{item.full_name}</h4>

                            {/* Date */}
                            <span className="text-sm text-gray-500">{formatDate(item.created_at)}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
