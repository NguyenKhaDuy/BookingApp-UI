import { motion } from 'framer-motion';
export default function ServiceHeader() {
    return (
        <section className="w-full bg-[#0a1a2f] text-white py-24 px-6 rounded-b-3xl shadow-xl">
            <div className="max-w-6xl mx-auto text-center space-y-6">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-extrabold"
                >
                     Dịch vụ
                    <span className="text-orange-500"> chuyên nghiệp</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-gray-300 max-w-2xl mx-auto text-lg"
                >
                    Chọn dịch vụ phù hợp – kỹ thuật viên đến tận nơi. An toàn, nhanh chóng, giá minh bạch.
                </motion.p>
            </div>
        </section>
    );
}
