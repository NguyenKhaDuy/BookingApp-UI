export default function ProfileInfo() {
    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Thông tin cá nhân</h2>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm text-gray-500">Họ và tên</label>
                    <input defaultValue="Nguyễn Văn A" className="mt-1 w-full p-3 border rounded-xl" />
                </div>

                <div>
                    <label className="text-sm text-gray-500">Số điện thoại</label>
                    <input defaultValue="0123456789" className="mt-1 w-full p-3 border rounded-xl" />
                </div>

                <div className="md:col-span-2">
                    <label className="text-sm text-gray-500">Địa chỉ</label>
                    <input defaultValue="123 Nguyễn Trãi, Quận 1" className="mt-1 w-full p-3 border rounded-xl" />
                </div>
            </div>

            <button className="mt-5 bg-orange-500 text-white w-full py-3 rounded-xl font-semibold">Lưu thay đổi</button>
        </div>
    );
}
