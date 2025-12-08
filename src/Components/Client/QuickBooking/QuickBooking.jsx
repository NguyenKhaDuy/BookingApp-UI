export default function QuickBooking() {
    return (
        <section className="py-24 bg-gray-50" id="quick-booking">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-10">Đặt Lịch Nhanh</h2>

                <div className="bg-white shadow-xl rounded-3xl p-10 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            type="text"
                            placeholder="Họ và tên"
                            className="p-4 rounded-xl border border-gray-300 outline-orange-500"
                        />
                        <input
                            type="text"
                            placeholder="Số điện thoại"
                            className="p-4 rounded-xl border border-gray-300 outline-orange-500"
                        />
                        <input
                            type="text"
                            placeholder="Địa chỉ"
                            className="p-4 rounded-xl border border-gray-300 outline-orange-500 md:col-span-2"
                        />
                        <textarea
                            placeholder="Mô tả vấn đề"
                            className="p-4 rounded-xl border border-gray-300 outline-orange-500 md:col-span-2 h-32"
                        />
                    </div>

                    <button className="mt-8 w-full bg-orange-500 text-white py-4 rounded-xl text-lg font-semibold hover:bg-orange-600 transition shadow-md">
                        Đặt Lịch Ngay
                    </button>
                </div>
            </div>
        </section>
    );
}
