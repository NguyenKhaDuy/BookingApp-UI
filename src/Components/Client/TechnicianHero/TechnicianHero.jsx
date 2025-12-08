import { motion } from 'framer-motion';

export default function TechnicianHero() {
    return (
        <section className="w-full bg-[#0a1a2f] text-white py-24 px-6 rounded-b-3xl shadow-xl">
            <div className="max-w-6xl mx-auto text-center space-y-6">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-extrabold"
                >
                    Đội ngũ kỹ thuật viên
                    <span className="text-orange-500"> chuyên nghiệp</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-gray-300 max-w-2xl mx-auto text-lg"
                >
                    Tất cả KTV đều được đào tạo bài bản – minh bạch hồ sơ – chấm điểm chất lượng rõ ràng.
                </motion.p>
            </div>
        </section>
    );
}
