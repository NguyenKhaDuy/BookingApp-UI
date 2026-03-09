import { useEffect, useState } from 'react';
import { X, Search, SlidersHorizontal, Eye, ChevronLeft, ChevronRight, FileWarning, Receipt } from 'lucide-react';
import getCookie from '../../../utils/getToken';
import { formatDateTimeArray, formatDateArray, formatTime } from '../../../utils/formatDate';
import LoadingOverlay from '../../../Layouts/LoadingOverLay/LoadingOverlay';
export default function ManageRequest() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    const [page, setPage] = useState(0);
    const size = 5;
    const [totalPages, setTotalPages] = useState(0);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const [open, setOpen] = useState(false);
    const [detail, setDetail] = useState(null);

    const token = getCookie('token');

    // Fetch API
    const loadData = async (p) => {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:8081/api/admin/request/?pageNo=${p + 1}`, {
                headers: { Authorization: token ? `Bearer ${token}` : '' },
            });
            const json = await res.json();
            setRequests(json.data || []);
            setTotalPages(json.total_page || 0);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(page);
    }, [page]);

    const filteredRequests = requests.filter((r) => {
        let ok = true;

        if (search.trim() !== '') {
            ok =
                ok &&
                (r.customer?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
                    r.id_request?.toString().includes(search));
        }
        if (statusFilter.trim() !== '') {
            ok = ok && r.status_code === statusFilter;
        }
        return ok;
    });

    const badge = (st) =>
        ({
            PENDING: 'bg-yellow-500',
            RECEIVED: 'bg-blue-500',
            COMPLETED: 'bg-green-600',
            INCOMPLETE: 'bg-orange-500',
            RECEIVING: 'bg-purple-600',
            CANCEL: 'bg-red-500',
            CLOSED: 'bg-gray-500',
        })[st] || 'bg-gray-400';


    return (
        <div className="p-6">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
                <FileWarning className="w-6 h-6 text-orange-600" />
                Quản lý yêu cầu
            </h2>

            {/* FILTER */}
            <div className="flex items-center flex-wrap gap-3 mb-5">
                <div className="flex items-center bg-white border rounded-lg px-3 py-2 shadow-sm">
                    <Search className="w-4 text-gray-500 mr-2" />
                    <input
                        placeholder="Tìm tên khách/mã..."
                        className="outline-none text-sm w-52"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center bg-white border rounded-lg px-3 py-2 shadow-sm">
                    <SlidersHorizontal className="w-4 text-gray-500 mr-2" />
                    <select
                        className="outline-none text-sm bg-transparent"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Tất cả</option>
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
                                <td colSpan="7" className="text-center py-4">
                                    Loading...
                                </td>
                            </tr>
                        ) : filteredRequests.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-4 italic text-gray-500">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            filteredRequests.map((r) => (
                                <tr key={r.id_request} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">{r.id_request}</td>
                                    <td className="px-4 py-3">{r.customer?.full_name}</td>
                                    <td className="px-4 py-3">{r.name_service}</td>
                                    <td className="px-4 py-3">
                                        {formatDateArray(r.scheduled_date)} {formatTime(r.scheduled_time)}
                                    </td>
                                    <td className="px-4 py-3">{r.technicicanDTO?.full_name || 'Chưa gán'}</td>
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
                                            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1 mx-auto"
                                        >
                                            <Eye size={14} /> Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-center gap-2 mt-5">
                <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className="p-2 border rounded disabled:opacity-40"
                >
                    <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`px-3 py-1 border rounded text-sm ${i === page ? 'bg-orange-500 text-white' : ''}`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    disabled={page === totalPages - 1}
                    onClick={() => setPage(page + 1)}
                    className="p-2 border rounded disabled:opacity-40"
                >
                    <ChevronRight size={16} />
                </button>
            </div>

            {/* DETAIL MODAL */}
            {open && detail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
                        {/* HEADER */}
                        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50/80">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 tracking-wide uppercase">
                                    Chi tiết yêu cầu
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Mã yêu cầu: <span className="font-medium text-gray-700">{detail.id_request}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-200 transition"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* BODY SCROLL */}
                        <div className="px-6 py-5 space-y-5 text-sm text-gray-700 overflow-y-auto max-h-[75vh]">
                            {/* INFO GRID */}
                            <div className="grid grid-cols-2 gap-5">
                                <InfoItem label="Khách hàng" value={detail.customer?.full_name} />
                                <InfoItem label="Số điện thoại" value={detail.customer?.phone_number} />
                                <InfoItem label="Dịch vụ" value={detail.name_service} />
                                <InfoItem
                                    label="Trạng thái"
                                    value={
                                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                                            {detail.status_code}
                                        </span>
                                    }
                                />
                                <InfoItem
                                    label="Kỹ thuật viên"
                                    value={detail.technicicanDTO?.full_name || 'Chưa gán'}
                                />

                                <InfoItem
                                    label="SĐT kỹ thuật"
                                    value={detail.technicicanDTO?.phone_number || 'Chưa có'}
                                />

                                <InfoItem label="Email kỹ thuật" value={detail.technicicanDTO?.email || 'Chưa có'} />

                                <InfoItem
                                    label="Thời gian hẹn"
                                    value={`${formatDateArray(detail.scheduled_date)} ${formatTime(detail.scheduled_time)}`}
                                />
                            </div>

                            {/* DESCRIPTION */}
                            <div>
                                <Label>Mô tả</Label>
                                <div className="mt-1 bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 leading-relaxed">
                                    {detail.description}
                                </div>
                            </div>

                            {/* IMAGES */}
                            <div>
                                <Label>Hình ảnh</Label>
                                {detail.image_request?.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-3 mt-2">
                                        {detail.image_request.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={`data:image/jpeg;base64,${img}`}
                                                onClick={() => setPreview(`data:image/jpeg;base64,${img}`)}
                                                className="h-24 w-full object-cover rounded-md border cursor-pointer hover:opacity-80 transition"
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="italic text-gray-500 mt-1">Không có hình</p>
                                )}
                            </div>

                            {/* INVOICE */}
                            {detail.invoices && (
                                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/70">
                                    {/* HEADER */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <Receipt size={16} className="text-gray-700" />
                                        <p className="font-semibold text-gray-800">Hóa đơn</p>
                                    </div>

                                    {/* INFO */}
                                    <div className="grid grid-cols-2 gap-y-1 text-sm mb-2">
                                        <InfoItem label="Mã hóa đơn" value={detail.invoices.id_invoices} />
                                        <InfoItem
                                            label="Phương thức thanh toán"
                                            value={detail.invoices.payment_method ?? '—'}
                                        />

                                        <InfoItem
                                            label="Trạng thái thanh toán"
                                            value={
                                                detail.invoices.name_status === 'PAID' ? (
                                                    <span className="text-green-600 font-medium">Đã thanh toán</span>
                                                ) : (
                                                    <span className="text-red-600 font-medium">Chưa thanh toán</span>
                                                )
                                            }
                                        />

                                        <InfoItem
                                            label="Tổng tiền"
                                            value={
                                                <span className="font-semibold text-green-600">
                                                    {detail.invoices.total_amount.toLocaleString()} VND
                                                </span>
                                            }
                                        />

                                        <InfoItem
                                            label="Ngày thanh toán"
                                            value={formatDateArray(detail.invoices.paid_at) ?? '—'}
                                        />
                                    </div>

                                    {/* CHI TIẾT HÓA ĐƠN */}
                                    {detail.invoices.detailInvoiceDTOS?.length > 0 && (
                                        <div className="mt-3 bg-white border border-gray-200 rounded-md overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-100 border-b text-gray-700 font-medium">
                                                    <tr>
                                                        <th className="px-3 py-2 text-left">Tên mặt hàng</th>
                                                        <th className="px-3 py-2 text-center">SL</th>
                                                        <th className="px-3 py-2 text-right">Đơn giá</th>
                                                        <th className="px-3 py-2 text-right">Thành tiền</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {detail.invoices.detailInvoiceDTOS.map((d, i) => (
                                                        <tr key={i} className="border-b">
                                                            <td className="px-3 py-2">{d.name}</td>
                                                            <td className="px-3 py-2 text-center">{d.quantity}</td>
                                                            <td className="px-3 py-2 text-right">
                                                                {d.price.toLocaleString()} VND
                                                            </td>
                                                            <td className="px-3 py-2 text-right font-medium">
                                                                {d.total_price.toLocaleString()} VND
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* FEEDBACK */}
                            {detail.feedback?.length > 0 && (
                                <div>
                                    <Label>Feedback từ khách hàng</Label>
                                    <div className="space-y-2 mt-2">
                                        {detail.feedback.map((f) => (
                                            <div
                                                key={f.id_feedback}
                                                className="border border-gray-200 rounded-md p-3 bg-white shadow-sm"
                                            >
                                                <p className="font-medium text-gray-800">{f.name_customer}</p>
                                                <p className="text-gray-600 text-sm mt-1">{f.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* FOOTER */}
                        <div className="px-6 py-4 border-t bg-white flex justify-end">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 rounded-md bg-gray-900 text-white text-xs font-medium hover:bg-black transition"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* IMAGE PREVIEW OVERLAY */}
            {preview && (
                <div
                    onClick={() => setPreview(null)}
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000]"
                >
                    <img src={preview} className="max-h-[90vh] max-w-[90vw] rounded-lg" />
                </div>
            )}
            <LoadingOverlay show={loading} />
        </div>
    );
}

const InfoItem = ({ label, value }) => (
    <div className="flex flex-col">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="font-medium text-gray-800">{value}</span>
    </div>
);

const Label = ({ children }) => (
    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{children}</p>
);

