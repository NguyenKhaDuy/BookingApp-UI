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

                {/* Hero Image */}
                <div className="flex justify-center md:justify-end">
                    <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-[#13283f] rounded-3xl shadow-xl flex items-center justify-center border border-white/10">
                        <span className="text-gray-400">(Ảnh minh họa)</span>
                    </div>
                </div>
            </div>

            {/* Background Accent */}
            <div className="absolute w-80 h-80 sm:w-[420px] sm:h-[420px] bg-orange-600/20 rounded-full blur-3xl -top-10 -right-16 md:-top-16 md:-right-20"></div>
        </section>
    );
}
