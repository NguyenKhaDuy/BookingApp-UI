import { Search, SlidersHorizontal } from 'lucide-react';

export default function RequestHeader() {
    return (
        <div className="w-full bg-white shadow-sm border-b px-6 py-4 rounded-xl">

            {/* TITLE + ACTIONS */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý yêu cầu sửa chữa</h1>

                {/* SEARCH + FILTER */}
                <div className="flex items-center gap-3">
                    {/* SEARCH BOX */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm yêu cầu..."
                            className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:border-orange-500"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>

                    {/* FILTER BUTTON */}
                    <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                        <SlidersHorizontal size={18} />
                        <span>Bộ lọc</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
