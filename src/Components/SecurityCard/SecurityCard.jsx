export default function ProfilePassword() {
    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Đổi mật khẩu</h2>

            <div className="space-y-4">
                <div>
                    <label className="text-sm text-gray-500">Mật khẩu hiện tại</label>
                    <input type="password" className="mt-1 w-full p-3 border rounded-xl" />
                </div>

                <div>
                    <label className="text-sm text-gray-500">Mật khẩu mới</label>
                    <input type="password" className="mt-1 w-full p-3 border rounded-xl" />
                </div>

                <div>
                    <label className="text-sm text-gray-500">Nhập lại mật khẩu</label>
                    <input type="password" className="mt-1 w-full p-3 border rounded-xl" />
                </div>
            </div>

            <button className="mt-5 bg-orange-500 text-white w-full py-3 rounded-xl font-semibold">Đổi mật khẩu</button>
        </div>
    );
}
