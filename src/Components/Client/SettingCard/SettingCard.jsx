import { LogOut } from 'lucide-react';

export default function ProfileSettings() {
    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Cài đặt</h2>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-gray-600">Bật thông báo</span>
                    <input type="checkbox" />
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-gray-600">Chế độ tối</span>
                    <input type="checkbox" />
                </div>
            </div>
        </div>
    );
}
