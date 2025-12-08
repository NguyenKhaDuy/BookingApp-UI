// src/components/Services.jsx
export default function Services() {
    const services = [
        {
            title: 'Sửa điện',
            desc: 'Xử lý nhanh các sự cố chập điện, mất điện, thay CB, ổ cắm… an toàn tuyệt đối.',
            icon: '⚡',
        },
        {
            title: 'Sửa nước',
            desc: 'Khắc phục rò rỉ, nghẹt nước, thay vòi sen, bồn cầu… chuẩn kỹ thuật.',
            icon: '💧',
        },
        {
            title: 'Điện lạnh',
            desc: 'Vệ sinh – sửa – bơm gas máy lạnh, tủ lạnh, máy giặt tại nhà.',
            icon: '❄️',
        },
        {
            title: 'Camera – Wifi',
            desc: 'Lắp đặt camera, tối ưu mạng Wifi, cấu hình router chuyên nghiệp.',
            icon: '📹',
        },
    ];

    return (
        <section className="py-24 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                {/* Title */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dịch Vụ Nổi Bật</h2>
                    <p className="mt-4 text-gray-600 text-lg">
                        Giải pháp nhanh – chuẩn – giá tốt, được khách hàng tin tưởng nhất
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {services.map((item, index) => (
                        <div
                            key={index}
                            className="group bg-white/60 backdrop-blur-xl shadow-lg rounded-2xl p-8 border border-gray-100 hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl cursor-pointer"
                        >
                            {/* Icon */}
                            <div className="w-16 h-16 flex items-center justify-center text-4xl rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg mb-6 group-hover:scale-110 transition">
                                {item.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>

                            {/* Desc */}
                            <p className="text-gray-600 leading-relaxed">{item.desc}</p>

                            {/* Button */}
                            <button className="mt-6 inline-block px-4 py-2 text-sm font-semibold text-blue-700 group-hover:text-blue-900 transition">
                                Xem chi tiết →
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
