import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../utils/api.js';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

export default function FeaturedTechnicians() {
    const navigate = useNavigate();

    const [technicians, setTechnicians] = useState([]);
    const [index, setIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(4);

    const containerRef = useRef(null);
    useEffect(() => {
        const fetchTechnicians = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/outstanding/technician/`);

                setTechnicians(res.data.data || []);
            } catch (error) {
                console.error('Failed to fetch technicians:', error);
            }
        };

        fetchTechnicians();
    }, []);

    useEffect(() => {
        const updateVisibleCount = () => {
            if (window.innerWidth < 640) {
                // Mobile
                setVisibleCount(1);
            } else if (window.innerWidth < 1024) {
                // Tablet
                setVisibleCount(2);
            } else if (window.innerWidth < 1280) {
                // Laptop
                setVisibleCount(3);
            } else {
                // Desktop
                setVisibleCount(4);
            }
        };

        updateVisibleCount();

        window.addEventListener('resize', updateVisibleCount);

        return () => {
            window.removeEventListener('resize', updateVisibleCount);
        };
    }, []);

    useEffect(() => {
        const maxIndex = Math.max(technicians.length - visibleCount, 0);

        setIndex((current) => Math.min(current, maxIndex));
    }, [visibleCount, technicians.length]);

    const maxIndex = Math.max(technicians.length - visibleCount, 0);

    const next = () => {
        setIndex((current) => Math.min(current + 1, maxIndex));
    };

    const prev = () => {
        setIndex((current) => Math.max(current - 1, 0));
    };

    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current === null || touchEndX.current === null) {
            return;
        }

        const distance = touchStartX.current - touchEndX.current;

        const minSwipeDistance = 50;

        if (Math.abs(distance) >= minSwipeDistance) {
            if (distance > 0) {
                next();
            } else {
                prev();
            }
        }

        touchStartX.current = null;
        touchEndX.current = null;
    };

    return (
        <section className="py-14 sm:py-16 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative">
                <div className="text-center mb-10 sm:mb-12 lg:mb-16">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
                        Kỹ Thuật Viên Nổi Bật
                    </h2>

                   <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                        Đội ngũ giàu kinh nghiệm – tay nghề cao – được đánh giá xuất sắc
                    </p>
                </div>
                <div className="relative">
                    {/* LEFT BUTTON */}
                    <button
                        onClick={prev}
                        disabled={index === 0}
                        aria-label="Kỹ thuật viên trước"
                        className="absolute z-20 left-0 sm:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-all"
                    >
                        <ChevronLeft
                            className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700"
                        />
                    </button>

                    {/* RIGHT BUTTON */}
                    <button
                        onClick={next}
                        disabled={index === maxIndex}
                        aria-label="Kỹ thuật viên tiếp theo"
                        className="absolute z-20 right-0 sm:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-all"
                    >
                        <ChevronRight
                           className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700"
                        />
                    </button>
                    <div
                        ref={containerRef}
                        className="overflow-hidden mx-5 sm:mx-7 lg:mx-0"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${index * (100 / visibleCount)}%)`, }}
                        >
                            {technicians.map((tech, i) => {
                                const rating = tech.total_star ?? 0;

                                return (
                                    <div
                                        key={tech.id_user ?? i}
                                        className="shrink-0 px-2 sm:px-3 lg:px-4"
                                        style={{
                                            width: `${100 / visibleCount}%`,
                                        }}
                                    >
                                        <div
                                            className="h-full bg-white rounded-2xl border border-gray-100 shadow-lg p-4 sm:p-5 lg:p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                                        >
                                            {/* AVATAR */}
                                            <div className="flex justify-center">
                                                <img
                                                    src={`data:image/jpeg;base64,${tech.avatarBase64}`}
                                                    alt={tech.full_name}
                                                    className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 object-cover rounded-full shadow-md mb-4 sm:mb-5 border-4 border-orange-50"
                                                />
                                            </div>

                                            {/* NAME */}
                                            <h3
                                                className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 truncate w-full"
                                                title={tech.full_name}
                                            >
                                                {tech.full_name}
                                            </h3>

                                            {/* RATING */}
                                            <div
                                                className="
                                                    flex
                                                    justify-center
                                                    mt-2
                                                    sm:mt-3
                                                "
                                            >
                                                {[...Array(5)].map((_, j) => (
                                                    <Star
                                                        key={j}
                                                        className={`w-4 h-4 sm:w-5 sm:h-5
                                                                ${
                                                                    j < Math.round(rating)
                                                                        ? 'text-yellow-400 fill-yellow-400'
                                                                        : 'text-gray-300'
                                                                }
                                                            `}
                                                    />
                                                ))}
                                            </div>

                                            {/* RATING NUMBER */}
                                            <p
                                                className="text-xs sm:text-sm text-gray-500 mt-1"
                                            >
                                                {Number(rating).toFixed(1)} / 5.0
                                            </p>

                                            {/* BUTTON */}
                                            <button
                                                onClick={() =>
                                                    navigate(`/technicians/techniciandetail/${tech.id_user}`)
                                                }
                                                className="mt-4 sm:mt-5 lg:mt-6 w-full px-3 sm:px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm sm:text-base font-semibold transition-colors"
                                            >
                                                Xem hồ sơ
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {technicians.length > visibleCount && (
                    <div
                        className="flex justify-center items-center gap-2 mt-6 lg:hidden"
                    >
                        {Array.from({
                            length: maxIndex + 1,
                        }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                aria-label={`Trang ${i + 1}`}
                                className={`
                                    h-2
                                    rounded-full
                                    transition-all
                                    ${index === i ? 'w-6 bg-orange-600' : 'w-2 bg-gray-300'}
                                `}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
