// src/components/WhyChooseUs.jsx

import { ShieldCheck, Timer, BadgeCheck, Users } from 'lucide-react';

export default function WhyChooseUs() {
    const reasons = [
        {
            title: 'Kỹ thuật viên chuyên nghiệp',
            desc: 'Được đào tạo bài bản – tay nghề cao – giàu kinh nghiệm thực tế.',
            icon: <Users size={42} className="text-blue-600" />,
        },
        {
            title: 'Uy tín & minh bạch',
            desc: 'Báo giá rõ ràng – không phát sinh – đảm bảo hài lòng 100%.',
            icon: <ShieldCheck size={42} className="text-blue-600" />,
        },
        {
            title: 'Nhanh chóng trong 30 phút',
            desc: 'Tiếp nhận yêu cầu và điều phối kỹ thuật viên nhanh nhất.',
            icon: <Timer size={42} className="text-blue-600" />,
        },
        {
            title: 'Bảo hành dài hạn',
            desc: 'Dịch vụ kèm bảo hành rõ ràng – hỗ trợ tận tâm sau sửa chữa.',
            icon: <BadgeCheck size={42} className="text-blue-600" />,
        },
    ];

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                {/* Heading */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900">Tại Sao Khách Hàng Chọn Chúng Tôi</h2>
                    <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
                        Dịch vụ sửa chữa – bảo trì chuyên nghiệp với đội ngũ chuyên gia cam kết mang lại trải nghiệm tốt
                        nhất cho bạn.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {reasons.map((r, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8
              hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 text-center"
                        >
                            <div className="mb-6 flex justify-center">{r.icon}</div>

                            <h3 className="text-xl font-bold text-gray-900">{r.title}</h3>
                            <p className="text-gray-600 mt-3 leading-relaxed">{r.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
