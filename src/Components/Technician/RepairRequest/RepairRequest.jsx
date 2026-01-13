import axios from 'axios';
import { useEffect, useState } from 'react';
import { Eye, FileText } from 'lucide-react';
import InvoiceCreate from '../InvoiceCreate/InvoiceCreate';
import RepairRequestDetail from '../RepairRequestDetail/RepairRequestDetail';
import InvoiceDetailModal from '../InvoiceDetailModal/InvoiceDetailModal';
import getCookie from '../../../utils/getToken';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function RepairRequest() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [openInvoice, setOpenInvoice] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [openInvoiceDetail, setOpenInvoiceDetail] = useState(false);

    // ===== PAGINATION =====
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    const token = getCookie('token');

    useEffect(() => {
        fetchOrders(page);
    }, [page]);

    const fetchOrders = async (pageNo = 1) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user?.id_user) return;

            const res = await axios.get(`http://localhost:8081/api/technician/request/id_tech=${user.id_user}`, {
                params: { pageNo },
                headers: { Authorization: `Bearer ${token}` },
            });

            setOrders(res.data?.data || []);
            setPage(res.data?.current_page || 1);
            setTotalPage(res.data?.total_page || 1);
        } catch (err) {
            console.error(err);
        }
    };
    /* ===== STATUS ===== */
    const STATUS = {
        COMPLETED: 'COMPLETED',
        RECEIVING: 'RECEIVING',
        CANCEL: 'CANCEL',
    };

    const isCompleted = (status) => status === STATUS.COMPLETED;
    const hasInvoice = (order) => !!order?.invoices?.id_invoices;

    const statusClass = (status) => {
        switch (status) {
            case STATUS.COMPLETED:
                return 'text-green-600 bg-green-50';
            case STATUS.RECEIVING:
                return 'text-orange-600 bg-orange-50';
            case STATUS.CANCEL:
                return 'text-red-600 bg-red-50';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Đơn hàng</h1>

            <div className="bg-white p-4 rounded-xl shadow">
                {/* DESKTOP */}
                <div className="hidden md:block">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b text-gray-600">
                                <th className="p-3">Khách hàng</th>
                                <th>Dịch vụ</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((o) => (
                                <tr key={o.id_request} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium text-center align-middle">
                                        {o.customer?.full_name}
                                    </td>

                                    <td className="text-center align-middle">{o.name_service}</td>

                                    <td className="text-center align-middle">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-sm ${statusClass(o.status_code)}`}
                                        >
                                            {o.status_code}
                                        </span>
                                    </td>

                                    <td className="p-3">
                                        <div className="flex items-center gap-2 justify-center">
                                            {/* Chi tiết */}
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(o);
                                                    setOpenDetail(true);
                                                }}
                                                className="flex items-center gap-2 px-3 h-9 border rounded-lg text-sm hover:bg-blue-50"
                                            >
                                                <Eye size={16} />
                                                Chi tiết
                                            </button>

                                            {/* Tạo hóa đơn */}
                                            <button
                                                disabled={!isCompleted(o.status_code) || hasInvoice(o)}
                                                onClick={() => {
                                                    setSelectedOrder(o);
                                                    setOpenInvoice(true);
                                                }}
                                                className={`px-3 h-9 rounded-lg text-sm ${
                                                    !isCompleted(o.status_code) || hasInvoice(o)
                                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                        : 'bg-orange-500 text-white hover:bg-orange-600'
                                                }`}
                                            >
                                                Tạo hóa đơn
                                            </button>

                                            {/* Xem hóa đơn */}
                                            <button
                                                disabled={!hasInvoice(o)}
                                                onClick={() => {
                                                    setSelectedOrder(o);
                                                    setOpenInvoiceDetail(true);
                                                }}
                                                className={`flex items-center gap-2 px-3 h-9 rounded-lg text-sm ${
                                                    hasInvoice(o)
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                <FileText size={16} />
                                                Xem hóa đơn
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* MOBILE */}
                <div className="md:hidden space-y-4">
                    {orders.map((o) => (
                        <div key={o.id_request} className="border rounded-xl p-4 shadow-sm bg-white">
                            {/* Khách hàng */}
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-500 text-sm">Khách hàng</span>
                                <span className="font-medium">{o.customer?.full_name}</span>
                            </div>

                            {/* Dịch vụ */}
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-500 text-sm">Dịch vụ</span>
                                <span>{o.name_service}</span>
                            </div>

                            {/* Trạng thái */}
                            <div className="flex justify-between mb-3">
                                <span className="text-gray-500 text-sm">Trạng thái</span>
                                <span className={`px-3 py-1 rounded-full text-xs ${statusClass(o.status_code)}`}>
                                    {o.status_code}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => {
                                        setSelectedOrder(o);
                                        setOpenDetail(true);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 h-9 border rounded-lg text-sm"
                                >
                                    <Eye size={16} />
                                    Chi tiết
                                </button>

                                <button
                                    disabled={!isCompleted(o.status_code) || hasInvoice(o)}
                                    onClick={() => {
                                        setSelectedOrder(o);
                                        setOpenInvoice(true);
                                    }}
                                    className={`flex-1 h-9 rounded-lg text-sm ${
                                        !isCompleted(o.status_code) || hasInvoice(o)
                                            ? 'bg-gray-200 text-gray-400'
                                            : 'bg-orange-500 text-white'
                                    }`}
                                >
                                    Tạo hóa đơn
                                </button>

                                <button
                                    disabled={!hasInvoice(o)}
                                    onClick={() => {
                                        setSelectedOrder(o);
                                        setOpenInvoiceDetail(true);
                                    }}
                                    className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-lg text-sm ${
                                        hasInvoice(o) ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
                                    }`}
                                >
                                    <FileText size={16} />
                                    Xem hóa đơn
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* PAGINATION */}
                {totalPage > 0 && (
                    <div className="flex justify-center gap-2 mt-6">
                        {/* Nút Trước */}
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="px-4 py-2 border rounded flex items-center gap-1 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={18} />
                            <span>Trước</span>
                        </button>

                        {/* Nút số trang */}
                        {[...Array(totalPage)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`px-3 py-2 rounded font-medium min-w-[36px] ${
                                    page === i + 1
                                        ? 'bg-orange-500 text-white shadow'
                                        : 'border text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        {/* Nút Sau */}
                        <button
                            disabled={page === totalPage}
                            onClick={() => setPage(page + 1)}
                            className="px-4 py-2 border rounded flex items-center gap-1 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <span>Sau</span>
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* MODALS */}
            {openDetail && selectedOrder && (
                <RepairRequestDetail data={selectedOrder} onClose={() => setOpenDetail(false)} />
            )}

            {openInvoice && selectedOrder && (
                <InvoiceCreate
                    customer={selectedOrder.customer}
                    orderId={selectedOrder.id_request}
                    onClose={() => setOpenInvoice(false)}
                    onSuccess={() => {
                        setOpenInvoice(false);
                        fetchOrders(page); // 🔥 reload list
                    }}
                />
            )}

            {openInvoiceDetail && selectedOrder && (
                <InvoiceDetailModal invoice={selectedOrder.invoices} onClose={() => setOpenInvoiceDetail(false)} />
            )}
        </div>
    );
}
