import { Wrench, Timer, ClipboardCheck, Handshake } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Process() {
    const steps = [
        {
            icon: <ClipboardCheck className="w-10 h-10 text-orange-500" />,
            title: 'Tiếp Nhận Yêu Cầu',
            desc: 'Hệ thống ghi nhận thông tin và phân tích nhu cầu của bạn.',
        },
        {
            icon: <Timer className="w-10 h-10 text-orange-500" />,
            title: 'Phân Công Nhanh',
            desc: 'Tìm kỹ thuật viên phù hợp trong vòng 30 giây.',
        },
        {
            icon: <Wrench className="w-10 h-10 text-orange-500" />,
            title: 'Tiến Hành Sửa Chữa',
            desc: 'Kỹ thuật viên đến tận nơi và thực hiện công việc.',
        },
        {
            icon: <Handshake className="w-10 h-10 text-orange-500" />,
            title: 'Bàn Giao & Bảo Hành',
            desc: 'Hoàn tất công việc kèm bảo hành rõ ràng.',
        },
    ];

    return (
        <section className="py-24 bg-white" id="process">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-16">Quy Trình Làm Việc</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-gray-50 rounded-3xl p-10 shadow-lg hover:shadow-xl transition-all border border-gray-100"
                        >
                            <div className="w-20 h-20 mx-auto rounded-2xl bg-orange-100 flex items-center justify-center mb-6 shadow-md">
                                {step.icon}
                            </div>

                            <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
