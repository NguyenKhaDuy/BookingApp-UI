import { useEffect, useState } from 'react';
import { X, Search, SlidersHorizontal, Eye, ChevronLeft, ChevronRight, ClipboardList, FileWarning } from 'lucide-react';

export default function ManageRequest() {
    const [allData, setAllData] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(0);
    const size = 5;
    const [totalPages, setTotalPages] = useState(0);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const [open, setOpen] = useState(false);
    const [detail, setDetail] = useState(null);

    const mockData = [
        {
            id_request: 1,
            customer: { name: 'Nguyễn Văn A' },
            name_service: 'Sửa máy lạnh',
            scheduled_date: '2026-01-20',
            scheduled_time: '14:00',
            technicicanDTO: { name: 'KTV Hùng' },
            status_code: 'PENDING',
            description: 'Máy lạnh chảy nước',
            image_request: ['https://picsum.photos/200/200?random=1', 'https://picsum.photos/200/200?random=2'],
        },
        {
            id_request: 2,
            customer: { name: 'Trần Thị B' },
            name_service: 'Sửa nước',
            scheduled_date: '2026-01-22',
            scheduled_time: '10:00',
            technicicanDTO: null,
            status_code: 'ACCEPTED',
            description: 'Ống nước bể',
            image_request: ['https://picsum.photos/200/200?random=3'],
        },
    ];

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setAllData(mockData);
            setTotalPages(Math.ceil(mockData.length / size));
            setLoading(false);
        }, 500);
    }, []);

    useEffect(() => {
        let filtered = [...allData];

        if (search.trim() !== '')
            filtered = filtered.filter(
                (item) =>
                    item.customer?.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.id_request.toString().includes(search),
            );

        if (statusFilter.trim() !== '') filtered = filtered.filter((item) => item.status_code === statusFilter);

        setTotalPages(Math.ceil(filtered.length / size));

        const start = page * size;
        setRequests(filtered.slice(start, start + size));
    }, [page, search, statusFilter, allData]);

    const badge = (st) => {
        const color = {
            PENDING: 'bg-yellow-500',
            ACCEPTED: 'bg-blue-500',
            DONE: 'bg-green-600',
            CANCEL: 'bg-red-500',
            CLOSED: 'bg-gray-500',
        };
        return color[st] || 'bg-gray-400';
    };

    return (
        <div className="p-6">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
                <FileWarning className="w-6 h-6 text-orange-600" />
                Quản lý yêu cầu
            </h2>

            {/* FILTER BAR */}
            <div className="flex items-center flex-wrap gap-3 mb-5">
                {/* Ô tìm kiếm */}
                <div className="flex items-center bg-white border rounded-lg px-3 py-2 shadow-sm hover:shadow focus-within:ring-2 focus-within:ring-orange-400 transition">
                    <Search className="w-4 text-gray-500 mr-2" />
                    <input
                        placeholder="Tìm bằng tên khách hoặc mã..."
                        className="outline-none text-sm w-44 md:w-64"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Filter trạng thái */}
                <div className="flex items-center bg-white border rounded-lg px-3 py-2 shadow-sm hover:shadow focus-within:ring-2 focus-within:ring-orange-400 transition">
                    <SlidersHorizontal className="w-4 text-gray-500 mr-2" />
                    <select
                        className="outline-none text-sm bg-transparent"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="PENDING">PENDING</option>
                        <option value="ACCEPTED">ACCEPTED</option>
                        <option value="DONE">DONE</option>
                        <option value="CANCEL">CANCEL</option>
                        <option value="CLOSED">CLOSED</option>
                    </select>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-lg shadow border">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                        <tr>
                            <th className="px-4 py-3 text-left">Mã</th>
                            <th className="px-4 py-3 text-left">Khách hàng</th>
                            <th className="px-4 py-3 text-left">Dịch vụ</th>
                            <th className="px-4 py-3 text-left">Ngày hẹn</th>
                            <th className="px-4 py-3 text-left">KTV</th>
                            <th className="px-4 py-3 text-left">Trạng thái</th>
                            <th className="px-4 py-3 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="text-center py-4 text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        ) : requests.length > 0 ? (
                            requests.map((r) => (
                                <tr key={r.id_request} className="border-b hover:bg-gray-50 transition">
                                    <td className="px-4 py-3">{r.id_request}</td>
                                    <td className="px-4 py-3">{r.customer?.name}</td>
                                    <td className="px-4 py-3">{r.name_service}</td>
                                    <td className="px-4 py-3">{r.scheduled_date + ' ' + r.scheduled_time}</td>
                                    <td className="px-4 py-3">{r.technicicanDTO?.name || 'Chưa gán'}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`${badge(r.status_code)} text-white px-2 py-1 rounded-full text-xs`}
                                        >
                                            {r.status_code}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => {
                                                setDetail(r);
                                                setOpen(true);
                                            }}
                                            className="flex items-center gap-1 mx-auto bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md text-xs transition"
                                        >
                                            <Eye size={14} />
                                            Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4 text-gray-500">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-center gap-2 mt-5 select-none">
                {/* Prev */}
                <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className={`p-2 rounded-lg border transition
            ${page === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-orange-50 border-orange-400 text-orange-600'}`}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setPage(idx)}
                            className={`px-3 py-1.5 rounded-lg text-sm border transition 
                    ${
                        idx === page
                            ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                            : 'hover:bg-orange-50 border-orange-300 text-orange-700'
                    }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>

                {/* Next */}
                <button
                    disabled={page === totalPages - 1 || totalPages === 0}
                    onClick={() => setPage(page + 1)}
                    className={`p-2 rounded-lg border transition
            ${
                page === totalPages - 1 || totalPages === 0
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:bg-orange-50 border-orange-400 text-orange-600'
            }`}
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* MODAL */}
            {open && detail && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        {/* HEADER */}
                        <div className="flex justify-between items-center px-5 py-3 border-b bg-gray-50">
                            <div>
                                <h3 className="font-semibold text-xl text-gray-800">Chi tiết yêu cầu</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Mã: {detail.id_request}</p>
                            </div>
                            <button
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition"
                                onClick={() => setOpen(false)}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* BODY */}
                        <div className="px-5 py-4 space-y-4 text-sm text-gray-700">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="font-medium text-gray-600">Khách hàng</p>
                                    <p className="text-gray-900">{detail.customer?.name}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-600">Dịch vụ</p>
                                    <p className="text-gray-900">{detail.name_service}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="font-medium text-gray-600">Ngày hẹn</p>
                                    <p className="text-gray-900">{detail.scheduled_date}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-600">Giờ hẹn</p>
                                    <p className="text-gray-900">{detail.scheduled_time}</p>
                                </div>
                            </div>

                            <div>
                                <p className="font-medium text-gray-600">Kỹ thuật viên</p>
                                <p className="text-gray-900">{detail.technicicanDTO?.name || 'Chưa gán'}</p>
                            </div>

                            <div>
                                <p className="font-medium text-gray-600">Mô tả</p>
                                <div className="bg-gray-50 border rounded-lg p-3 text-gray-800 text-sm leading-relaxed">
                                    {detail.description}
                                </div>
                            </div>

                            {/* IMAGE BLOCK */}
                            <div>
                                <p className="font-medium text-gray-600 mb-2">Hình ảnh minh họa</p>
                                {detail.image_request.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-3">
                                        {detail.image_request.map((img, i) => (
                                            <div
                                                key={i}
                                                className="rounded-xl overflow-hidden border border-gray-200 shadow-sm"
                                            >
                                                <img
                                                    src={img}
                                                    className="w-full h-24 object-cover hover:scale-105 transition"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">Không có hình ảnh đính kèm</p>
                                )}
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="px-5 py-3 border-t flex justify-end">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm shadow hover:bg-gray-900 transition"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
