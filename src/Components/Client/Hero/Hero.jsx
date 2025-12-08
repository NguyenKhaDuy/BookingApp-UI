import technician from '../../../assets/technician.png';
export default function HomeHero() {
    return (
        <section className="w-full bg-[#0a1a2f] text-white py-20 md:py-28 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
                {/* Text Content */}
                <div className="space-y-6 text-center md:text-left">
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight drop-shadow">
                        Dịch vụ sửa chữa <span className="text-orange-500">chuyên nghiệp</span> tại nhà
                    </h1>

                    <p className="text-base sm:text-lg text-gray-300 max-w-md mx-auto md:mx-0">
                        Đặt lịch nhanh chóng – Kỹ thuật viên đến tận nơi. Minh bạch chi phí, uy tín hàng đầu.
                    </p>

                    <div className="flex md:block justify-center">
                        <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:opacity-90 transition">
                            Đặt lịch ngay
                        </button>
                    </div>
                </div>

                {/* Hero Image Modern */}
                <div className="flex justify-center md:justify-end w-full mt-3">
                    <div
                        className="relative w-[420px] sm:w-[520px] md:w-[720px] lg:w-[900px] xl:w-[1100px]"
                    >
                        {/* Orange Glow Behind */}
                        <div className="absolute inset-0 -z-10">
                            <div className="w-full h-full bg-orange-500/20 blur-3xl rounded-3xl"></div>
                        </div>

                        {/* Glass Card */}
                        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8 pb-3 relative">
                            {/* Image: bigger, responsive */}
                            <img
                                src={technician}
                                alt="Technician Team"
                                className="
                    w-full
                    object-contain
                    drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)]
                    scale-[1.3]
                    -mt-8"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Accent */}
            <div className="absolute w-80 h-80 sm:w-[420px] sm:h-[420px] bg-orange-600/20 rounded-full blur-3xl -top-10 -right-16 md:-top-16 md:-right-20"></div>
        </section>
    );
}
