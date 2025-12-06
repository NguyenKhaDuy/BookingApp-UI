export default function LoginHeader() {
    return (
        <div className="flex flex-col items-center gap-4 mb-8 text-center">
            <div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 
                shadow-lg flex items-center justify-center"
            >
                <span className="text-3xl font-bold text-white">T</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-800">Đăng nhập</h2>

            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                Đăng nhập để tiếp tục sử dụng dịch vụ của
                <span className="font-semibold"> TechBooking</span>.
            </p>
        </div>
    );
}
