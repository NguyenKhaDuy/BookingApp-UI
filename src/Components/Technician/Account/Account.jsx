import { Camera } from 'lucide-react';

export default function AccountPage() {
    return (
        <div className="max-w-xl">
            <h2 className="text-2xl font-semibold mb-4">Tài khoản</h2>

            {/* Avatar */}
            <div className="flex items-center gap-5 mb-6">
                <div className="relative">
                    <img src="https://i.pravatar.cc/150" className="w-28 h-28 rounded-full object-cover border" />
                    <button className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow border">
                        <Camera size={18} />
                    </button>
                </div>

                <div>
                    <p className="text-lg font-medium">Nguyễn Văn A</p>
                    <p className="text-gray-500 text-sm">Kỹ thuật viên</p>
                </div>
            </div>

            {/* Info Form */}
            <div className="space-y-4">
                <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <input className="w-full p-2 border rounded-lg" defaultValue="a@gmail.com" />
                </div>
                <div>
                    <label className="text-sm text-gray-600">Số điện thoại</label>
                    <input className="w-full p-2 border rounded-lg" defaultValue="0123456789" />
                </div>
                <div>
                    <label className="text-sm text-gray-600">Mật khẩu</label>
                    <input type="password" className="w-full p-2 border rounded-lg" defaultValue="******" />
                </div>

                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg">
                    Lưu thay đổi
                </button>
            </div>
        </div>
    );
}
