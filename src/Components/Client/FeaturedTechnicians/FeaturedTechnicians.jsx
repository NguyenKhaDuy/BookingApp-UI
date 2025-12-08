// src/components/FeaturedTechnicians.jsx
export default function FeaturedTechnicians() {
    const techs = [
        {
            name: 'Nguyễn Văn Tùng',
            role: 'Kỹ thuật điện',
            stars: 5,
            img: 'https://i.pravatar.cc/300?img=12',
        },
        {
            name: 'Lê Minh Sơn',
            role: 'Điện lạnh - máy lạnh',
            stars: 5,
            img: 'https://i.pravatar.cc/300?img=32',
        },
        {
            name: 'Trần Quốc Huy',
            role: 'Sửa nước - đường ống',
            stars: 4,
            img: 'https://i.pravatar.cc/300?img=45',
        },
        {
            name: 'Phan Đức Lợi',
            role: 'Camera - Wifi',
            stars: 5,
            img: 'https://i.pravatar.cc/300?img=56',
        },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Title */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900">Kỹ Thuật Viên Nổi Bật</h2>
                    <p className="mt-4 text-gray-600 text-lg">
                        Đội ngũ giàu kinh nghiệm – tay nghề cao – được khách hàng đánh giá xuất sắc
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {techs.map((tech, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6
              hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 text-center"
                        >
                            {/* Avatar */}
                            <img
                                src={tech.img}
                                alt={tech.name}
                                className="w-28 h-28 object-cover rounded-full mx-auto shadow-md mb-5"
                            />

                            {/* Name */}
                            <h3 className="text-xl font-bold text-gray-900">{tech.name}</h3>

                            {/* Role */}
                            <p className="text-blue-700 font-medium mt-1">{tech.role}</p>

                            {/* Stars */}
                            <div className="flex justify-center mt-3">
                                {[...Array(tech.stars)].map((_, i) => (
                                    <span key={i} className="text-yellow-400 text-xl">
                                        ★
                                    </span>
                                ))}
                                {[...Array(5 - tech.stars)].map((_, i) => (
                                    <span key={i} className="text-gray-300 text-xl">
                                        ★
                                    </span>
                                ))}
                            </div>

                            {/* Button */}
                            <button className="mt-6 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                                Xem hồ sơ
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
