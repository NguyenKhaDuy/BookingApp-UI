import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function Testimonials() {
    const reviews = [
        {
            name: 'Nguyễn Minh Tuấn',
            role: 'Khách hàng sửa điều hòa',
            img: 'https://i.pravatar.cc/100?img=1',
            review: 'Dịch vụ cực kỳ nhanh và chuyên nghiệp! Kỹ thuật viên đến chỉ sau 20 phút. Rất hài lòng!',
            rating: 5,
        },
        {
            name: 'Trần Lan Anh',
            role: 'Vệ sinh máy lạnh',
            img: 'https://i.pravatar.cc/100?img=5',
            review: 'Giá hợp lý, làm việc sạch sẽ và có bảo hành đầy đủ. Sẽ dùng lại!',
            rating: 5,
        },
        {
            name: 'Phạm Hoàng',
            role: 'Sửa chữa điện nước',
            img: 'https://i.pravatar.cc/100?img=3',
            review: 'Kỹ thuật viên thân thiện, xử lý nhanh gọn. 10/10!',
            rating: 5,
        },
    ];

    return (
        <section className="py-24 bg-gray-50" id="testimonials">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-16">Khách Hàng Nói Gì?</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {reviews.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white shadow-lg rounded-3xl p-8 border border-gray-100 hover:shadow-2xl transition"
                        >
                            <img src={item.img} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" />

                            <div className="flex justify-center mb-4">
                                {Array.from({ length: item.rating }).map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-orange-500 fill-orange-500" />
                                ))}
                            </div>

                            <p className="text-gray-700 mb-6 italic">“{item.review}”</p>

                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <span className="text-sm text-gray-500">{item.role}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
