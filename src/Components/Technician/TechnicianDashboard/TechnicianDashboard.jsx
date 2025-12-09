export default function TechnicianDashboard() {
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Tổng quan</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-white rounded-xl shadow">
                    <p className="text-gray-500">Đơn đang chờ</p>
                    <h2 className="text-3xl font-bold text-orange-500">4</h2>
                </div>

                <div className="p-5 bg-white rounded-xl shadow">
                    <p className="text-gray-500">Đơn đã hoàn thành</p>
                    <h2 className="text-3xl font-bold text-green-500">12</h2>
                </div>

                <div className="p-5 bg-white rounded-xl shadow">
                    <p className="text-gray-500">Doanh thu tháng</p>
                    <h2 className="text-3xl font-bold text-blue-500">6.2M</h2>
                </div>
            </div>
        </div>
    );
}
