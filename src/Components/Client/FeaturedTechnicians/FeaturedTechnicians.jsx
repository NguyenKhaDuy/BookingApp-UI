import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FeaturedTechnicians() {
    const navigate = useNavigate();
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
        {
            name: 'Đặng Quốc Thắng',
            role: 'Điện dân dụng',
            stars: 5,
            img: 'https://i.pravatar.cc/300?img=18',
        },
        {
            name: 'Nguyễn Minh Đức',
            role: 'Sửa máy bơm',
            stars: 4,
            img: 'https://i.pravatar.cc/300?img=22',
        },
    ];

    const [technicians, setTechnicians] = useState([]);

    useEffect(() => {
        const fetchTechnicians = async () => {
            try {
                const res = await axios.get('http://localhost:8081/api/outstanding/technician/');
                setTechnicians(res.data.data);
            } catch (error) {
                console.error('Failed to fetch technicians:', error);
            }
        };

        fetchTechnicians();
    }, []);

    const [index, setIndex] = useState(0);

    const cardWidth = 280;
    const gap = 32; // gap-8
    const visibleCount = 4;

    const maxIndex = Math.max(techs.length - visibleCount, 0);

    const next = () => setIndex((i) => Math.min(i + 1, maxIndex));
    const prev = () => setIndex((i) => Math.max(i - 1, 0));

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-10 relative">
                {/* Title */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900">Kỹ Thuật Viên Nổi Bật</h2>
                    <p className="mt-4 text-gray-600 text-lg">
                        Đội ngũ giàu kinh nghiệm – tay nghề cao – được đánh giá xuất sắc
                    </p>
                </div>

                {/* Arrow Left */}
                <button
                    onClick={prev}
                    disabled={index === 0}
                    className="absolute -left-4 top-1/2 -translate-y-1/2
                               w-12 h-12 rounded-full bg-white border shadow-xl
                               flex items-center justify-center
                               disabled:opacity-30 disabled:cursor-not-allowed
                               hover:bg-gray-100 transition z-10"
                >
                    ◀
                </button>

                {/* Arrow Right */}
                <button
                    onClick={next}
                    disabled={index === maxIndex}
                    className="absolute -right-4 top-1/2 -translate-y-1/2
                               w-12 h-12 rounded-full bg-white border shadow-xl
                               flex items-center justify-center
                               disabled:opacity-30 disabled:cursor-not-allowed
                               hover:bg-gray-100 transition z-10"
                >
                    ▶
                </button>

                {/* Carousel */}
                <div className="overflow-hidden">
                    <div
                        className="flex gap-8 transition-transform duration-500 ease-in-out"
                        style={{
                            transform: `translateX(-${index * (cardWidth + gap)}px)`,
                        }}
                    >
                        {technicians.map((tech, i) => (
                            <div
                                key={i}
                                className="shrink-0 w-[280px]
                                           bg-white rounded-2xl shadow-xl border border-gray-100
                                           p-6 text-center
                                           hover:-translate-y-2 hover:shadow-2xl
                                           transition-all duration-300"
                            >
                                {/* Avatar */}
                                <img
                                    src={`data:image/jpeg;base64,${tech.avatarBase64}`}
                                    alt={tech.full_name}
                                    className="w-28 h-28 object-cover rounded-full mx-auto shadow-md mb-5"
                                />

                                {/* Name */}
                                <h3 className="text-xl font-bold text-gray-900">{tech.full_name}</h3>

                                {/* Stars */}
                                <div className="flex justify-center mt-3">
                                    {[...Array(tech.total_star)].map((_, j) => (
                                        <span key={j} className="text-yellow-400 text-xl">
                                            ★
                                        </span>
                                    ))}
                                    {[...Array(5 - tech.total_star)].map((_, j) => (
                                        <span key={j} className="text-gray-300 text-xl">
                                            ★
                                        </span>
                                    ))}
                                </div>

                                {/* Button */}
                                <button
                                    onClick={() => navigate(`/technicians/techniciandetail/${tech.id_user}`)}
                                    className="mt-6 px-4 py-2 rounded-xl
             bg-blue-600 text-white font-semibold"
                                >
                                    Xem hồ sơ
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
