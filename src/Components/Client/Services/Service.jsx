import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Services() {
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get('http://localhost:8082/api/service/all/');
                const allServices = res.data.data || [];

                const shuffled = [...allServices].sort(() => 0.5 - Math.random());
                setServices(shuffled.slice(0, 4));
            } catch (error) {
                console.error('Failed to fetch services:', error);
            }
        };

        fetchServices();
    }, []);

    // 🔥 FIX CHUẨN
    const getImageSrc = (icon) => {
        if (!icon) return '';

        if (icon.startsWith('data:image')) {
            return icon;
        }

        if (icon.startsWith('/9j/')) {
            return `data:image/jpeg;base64,${icon}`;
        }

        if (icon.startsWith('iVBOR')) {
            return `data:image/png;base64,${icon}`;
        }

        return `data:image/jpeg;base64,${icon}`;
    };

    console.log(services)

    return (
        <section className="py-28 bg-gradient-to-b from-white via-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-20">
                    <h2 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                        Dịch Vụ Nổi Bật
                    </h2>
                    <p className="mt-5 text-gray-600 text-lg">
                        Chuẩn kỹ thuật – Phục vụ tận tâm
                    </p>
                </div>

                <div className="grid gap-10 justify-center grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
                    {services.map((service, index) => (
                        <div
                            key={service.id_service ?? index}
                            className="relative group overflow-hidden rounded-3xl
                                       bg-white/70 backdrop-blur-xl border border-white/60
                                       shadow-lg hover:shadow-2xl
                                       transition-all duration-500 hover:-translate-y-3
                                       w-[260px]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br
                                            from-blue-500/10 to-indigo-600/10
                                            opacity-0 group-hover:opacity-100 transition"
                            />

                            <span className="absolute -top-6 -right-4 text-8xl font-extrabold text-gray-200/40">
                                {index + 1}
                            </span>

                            <div className="relative z-10 h-48 flex flex-col items-center justify-center gap-4">

                                {service.icon && (
                                    <img
                                        src={getImageSrc(service.icon)}
                                        alt={service.name_service}
                                        className="w-16 h-16 object-contain
                                                   transition-transform duration-300
                                                   group-hover:scale-110"
                                    />
                                )}

                                <h3 className="text-2xl font-extrabold text-gray-900 text-center group-hover:text-orange-700 transition">
                                    {service.name_service}
                                </h3>
                            </div>

                            <div className="relative h-1 overflow-hidden">
                                <div className="absolute inset-0 w-0 rounded-full
                                                bg-gradient-to-r from-orange-500 via-orange-400 to-indigo-600
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