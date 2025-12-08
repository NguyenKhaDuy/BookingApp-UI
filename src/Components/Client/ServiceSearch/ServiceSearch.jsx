import { Search } from 'lucide-react';

export default function ServiceSearch() {
    return (
        <div className="max-w-4xl mx-auto mt-10 px-6">
            <div className="flex items-center bg-white shadow-xl rounded-2xl px-5 py-4 border border-gray-100">
                <Search className="text-gray-500" size={22} />
                <input
                    type="text"
                    placeholder="Tìm kiếm dịch vụ (VD: sửa điện, máy lạnh...)"
                    className="flex-1 ml-4 text-gray-700 focus:outline-none text-base"
                />
            </div>
        </div>
    );
}
