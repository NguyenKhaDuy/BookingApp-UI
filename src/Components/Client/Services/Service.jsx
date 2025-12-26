import { useState, useEffect } from 'react';
import axios from 'axios';

// src/components/Services.jsx
export default function Services() {
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get('http://localhost:8081/api/service/all/');
                const allServices = res.data.data || [];

                const shuffled = [...allServices].sort(() => 0.5 - Math.random());
                setServices(shuffled.slice(0, 4));
            } catch (error) {
                console.error('Failed to fetch services:', error);
            }
        };

        fetchServices();
    }, []);

    return (
        <section className="py-28 bg-gradient-to-b from-white via-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-6">
                {/* Title */}
                <div className="text-center mb-20">
                    <h2 className="text-5xl font-extrabold text-gray-900 tracking-tight">Dịch Vụ Nổi Bật</h2>
                    <p className="mt-5 text-gray-600 text-lg">Chuẩn kỹ thuật – Phục vụ tận tâm</p>
                </div>

                {/* Grid – ALWAYS CENTER */}
                <div
                    className="grid gap-10 justify-center
                               grid-cols-[repeat(auto-fit,minmax(260px,1fr))]"
                >
                    {services.map((service, index) => (
                        <div
                            key={service.id_service ?? index}
                            className="relative group overflow-hidden rounded-3xl
                                       bg-white/70 backdrop-blur-xl border border-white/60
                                       shadow-lg hover:shadow-2xl
                                       transition-all duration-500 hover:-translate-y-3
                                       w-[260px]"
                        >
                            {/* Glow */}
                            <div
                                className="absolute inset-0 bg-gradient-to-br
                                            from-blue-500/10 to-indigo-600/10
                                            opacity-0 group-hover:opacity-100 transition"
                            />

                            {/* Index */}
                            <span
                                className="absolute -top-6 -right-4 text-8xl font-extrabold
                                             text-gray-200/40 select-none"
                            >
                                {index + 1}
                            </span>

                            {/* Content */}
                            <div className="relative z-10 h-48 flex items-center justify-center">
                                <h3
                                    className="text-3xl font-extrabold text-gray-900
                                               text-center group-hover:text-orange-700 transition"
                                >
                                    {service.name_service}
                                </h3>
                            </div>

                            {/* Bottom line */}
                            <div className="relative h-1 overflow-hidden">
                                <div
                                    className="absolute inset-0 w-0 rounded-full
                                               bg-gradient-to-r from-orange-500 via-orange-400 to-indigo-600
                                               shadow-[0_0_12px_rgba(249,115,22,0.6)]
                                               group-hover:w-full transition-all duration-500"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
