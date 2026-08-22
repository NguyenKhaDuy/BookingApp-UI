import hero from '../../../assets/hero.png';
import { Star, BadgeCheck, Zap, ShieldCheck } from 'lucide-react';

export default function HomeHero() {
    return (
        <section className="relative w-full overflow-hidden bg-[#071426] text-white">
            {/* BACKGROUND */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Orange glow */}
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-orange-500/20 blur-[120px]" />

                <div className="absolute -bottom-40 -left-40 w-[450px] h-[450px] rounded-full bg-blue-500/10 blur-[120px]" />

                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
                        backgroundSize: '50px 50px',
                    }}
                />
            </div>

            {/* CONTENT */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
                <div className="min-h-[680px] lg:min-h-[720px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center py-20 lg:py-24">
                    {/* LEFT */}
                    <div className="max-w-2xl text-center lg:text-left">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-7 rounded-full border border-orange-500/20 bg-orange-500/10 backdrop-blur-md">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75 animate-ping"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                            </span>

                            <span className="text-sm font-medium text-orange-300">Dịch vụ sửa chữa tận nơi</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight">
                            Sửa chữa
                            <br />
                            <span className="relative inline-block mt-2">
                                <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                                    chuyên nghiệp
                                </span>

                                {/* underline */}
                                <span className="absolute -bottom-2 left-0 w-2/3 h-1 rounded-full bg-gradient-to-r from-orange-500 to-transparent" />
                            </span>
                            <br />
                            <span className="text-white">ngay tại nhà</span>
                        </h1>

                        {/* Description */}
                        <p className="mt-7 text-base sm:text-lg lg:text-xl leading-relaxed text-slate-300 max-w-xl mx-auto lg:mx-0">
                            Đặt lịch sửa chữa nhanh chóng, kết nối với
                            <span className="text-white font-semibold"> kỹ thuật viên chuyên nghiệp </span>
                            và nhận hỗ trợ ngay tại nhà.
                        </p>

                        {/* Buttons */}
                        <div className="mt-9 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
                            <button
                                onClick={() => {
                                    document.getElementById('quick-booking')?.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'start',
                                    });
                                }}
                                className="
                                    group
                                    relative
                                    overflow-hidden
                                    flex items-center justify-center gap-2
                                    px-7 py-3.5
                                    rounded-xl
                                    bg-gradient-to-r from-orange-500 to-orange-600
                                    text-white
                                    font-bold
                                    shadow-[0_15px_40px_rgba(249,115,22,0.3)]
                                    hover:shadow-[0_20px_50px_rgba(249,115,22,0.45)]
                                    hover:-translate-y-1
                                    transition-all duration-300
                                "
                            >
                                <span className="relative z-10">Đặt lịch ngay</span>

                                <svg
                                    className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>

                                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                            </button>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-7 gap-y-4 text-sm text-slate-400">
                            {/* Kỹ thuật viên uy tín */}
                            <div className="flex items-center gap-2.5">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 border border-green-500/10">
                                    <BadgeCheck className="w-4 h-4 text-green-400" />
                                </div>

                                <span className="font-medium">Kỹ thuật viên uy tín</span>
                            </div>

                            {/* Đặt lịch nhanh chóng */}
                            <div className="flex items-center gap-2.5">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/10">
                                    <Zap className="w-4 h-4 text-orange-400" />
                                </div>

                                <span className="font-medium">Đặt lịch nhanh chóng</span>
                            </div>

                            {/* Minh bạch chi phí */}
                            <div className="flex items-center gap-2.5">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/10">
                                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                                </div>

                                <span className="font-medium">Minh bạch chi phí</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="relative flex justify-center lg:justify-end">
                        {/* Main glow */}
                        <div
                            className="
                            absolute
                            w-[320px] h-[320px]
                            sm:w-[450px] sm:h-[450px]
                            lg:w-[550px] lg:h-[550px]
                            rounded-full
                            bg-orange-500/15
                            blur-[100px]
                        "
                        />

                        {/* Decorative circle */}
                        <div
                            className="
                            absolute
                            w-[380px] h-[380px]
                            sm:w-[500px] sm:h-[500px]
                            lg:w-[600px] lg:h-[600px]
                            rounded-full
                            border border-orange-500/10
                        "
                        />

                        {/* Image container */}
                        <div
                            className="
                            relative
                            w-full
                            max-w-[600px]
                            lg:max-w-[650px]
                        "
                        >
                            {/* Floating badge - top */}
                            <div
                                className="
                                absolute
                                z-20
                                top-2
                                left-0
                                sm:left-2
                                lg:-left-6
                                flex items-center gap-3
                                px-4 py-3
                                rounded-2xl
                                bg-[#10233d]/90
                                border border-white/10
                                backdrop-blur-xl
                                shadow-2xl
                                animate-[float_4s_ease-in-out_infinite]
                            "
                            >
                                <div
                                    className="
                                    flex items-center justify-center
                                    w-10 h-10
                                    rounded-xl
                                    bg-orange-500/15
                                    text-orange-400
                                "
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        />
                                    </svg>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400">Đội ngũ</p>
                                    <p className="text-sm font-bold text-white">Kỹ thuật viên chuyên nghiệp</p>
                                </div>
                            </div>

                            {/* Image card */}
                            <div
                                className="
                                relative
                                rounded-[2rem]
                                border border-white/10
                                bg-gradient-to-br from-white/[0.10] to-white/[0.02]
                                backdrop-blur-xl
                                p-5 sm:p-7
                                shadow-[0_30px_100px_rgba(0,0,0,0.35)]
                            "
                            >
                                {/* Top bar */}
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <div className="flex gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                                        <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                                    </div>

                                    <div className="text-xs text-slate-500">KINGTECH SERVICE</div>
                                </div>

                                {/* Image */}
                                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#112640] to-[#08182c]">
                                    <div
                                        className="
                                        absolute
                                        inset-0
                                        bg-gradient-to-t
                                        from-[#071426]
                                        via-transparent
                                        to-transparent
                                        z-10"
                                    />

                                    <img
                                        src={hero}
                                        alt="Đội ngũ kỹ thuật viên"
                                        className="
                                            relative
                                            z-[5]
                                            w-full
                                            h-auto
                                            object-contain
                                            scale-[1.05]
                                            drop-shadow-[0_35px_50px_rgba(0,0,0,0.55)]
                                            transition-transform
                                            duration-700
                                            hover:scale-[1.1]
                                        "
                                    />
                                </div>

                                {/* Bottom info */}
                                <div
                                    className="
                                    flex items-center justify-between
                                    mt-5
                                    px-2
                                "
                                >
                                    <div>
                                        <p className="text-xs text-slate-500">Hỗ trợ tận nơi</p>
                                        <p className="mt-1 font-bold text-white">Nhanh chóng & minh bạch</p>
                                    </div>

                                    <div
                                        className="
                                        flex items-center gap-1.5
                                        px-3 py-2
                                        rounded-xl
                                        bg-green-500/10
                                        border border-green-500/10
                                    "
                                    >
                                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                        <span className="text-xs font-semibold text-green-400">Online</span>
                                    </div>
                                </div>
                            </div>

                            {/* Floating rating */}
                            <div
                                className="
                                absolute
                                z-20
                                -bottom-5
                                right-0
                                sm:-right-3
                                lg:-right-6
                                flex items-center gap-3
                                px-4 py-3
                                rounded-2xl
                                bg-[#10233d]/95
                                border border-white/10
                                backdrop-blur-xl
                                shadow-2xl
                            "
                            >
                                <div className="flex -space-x-2">
                                    <div className="w-9 h-9 rounded-full bg-orange-400 border-2 border-[#10233d] flex items-center justify-center text-xs font-bold">
                                        K
                                    </div>

                                    <div className="w-9 h-9 rounded-full bg-blue-400 border-2 border-[#10233d] flex items-center justify-center text-xs font-bold">
                                        T
                                    </div>

                                    <div className="w-9 h-9 rounded-full bg-green-400 border-2 border-[#10233d] flex items-center justify-center text-xs font-bold">
                                        +
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, index) => (
                                            <Star key={index} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-400">Được khách hàng tin tưởng</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM FADE */}
            <div
                className="
                absolute
                bottom-0
                left-0
                right-0
                h-24
                bg-gradient-to-t
                from-[#071426]
                to-transparent
                pointer-events-none
            "
            />

            {/* FLOAT ANIMATION */}
            <style>
                {`
                    @keyframes float {
                        0%, 100% {
                            transform: translateY(0);
                        }
                        50% {
                            transform: translateY(-8px);
                        }
                    }
                `}
            </style>
        </section>
    );
}