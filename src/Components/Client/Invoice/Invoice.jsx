import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '../../../Context/ToastContext';
import getCookie from '../../../utils/getToken';
import {API_BASE_URL} from '../../../utils/api.js';

const formatDate = (date) => {
    if (!date) return 'Chưa thanh toán';

    // Nếu backend trả dạng yyyyMMdd (20251118)
    if (/^\d{8}$/.test(date)) {
        const y = date.slice(0, 4);
        const m = date.slice(4, 6);
        const d = date.slice(6, 8);
        return `${d}/${m}/${y}`;
    }

    // ISO date: yyyy-MM-dd
    const parsed = new Date(date);
    if (isNaN(parsed)) return 'Chưa thanh toán';

    return parsed.toLocaleDateString('vi-VN');
};

export default function Invoice() {
    const { showToast } = useToast();

    /* ================= STATE ================= */
    const [status, setStatus] = useState('unpaid');
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const [showBankModal, setShowBankModal] = useState(false);
    const [selectedBank, setSelectedBank] = useState('');
    const [payInvoice, setPayInvoice] = useState(null);

    const [bankList, setBankList] = useState([]);
    const [loadingBank, setLoadingBank] = useState(false);

    /* ================= FETCH INVOICES ================= */
    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const token = getCookie('token');
            const user = JSON.parse(localStorage.getItem('user'));

            if (!token || !user?.id_user) {
                showToast('Vui lòng đăng nhập', 'error');
                return;
            }

            const res = await fetch(`${API_BASE_URL}/customer/invoices/id=${user.id_user}?pageNo=${pageNo}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const json = await res.json();

            if (json.message === 'Success') {
                setInvoices(json.data || []);
                setTotalPage(json.total_page || 1);
            } else {
                showToast(json.message || 'Không lấy được hóa đơn', 'error');
            }
        } catch (err) {
            showToast('Lỗi kết nối server', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, [pageNo]);

    /* ================= FILTER ================= */
    const filteredInvoices = invoices.filter((inv) =>
        status === 'paid' ? inv.name_status === 'PAID' : inv.name_status === 'UNPAID',
    );

    /* ================= DETAIL ================= */
    const openDetail = (invoice) => {
        setSelectedInvoice(invoice);
        setShowDetailModal(true);
    };

    /* ================= PAYMENT ================= */
    const openPayment = (invoice) => {
        setPayInvoice(invoice);
        setSelectedBank('');
        setShowBankModal(true);
    };

    /* ================= FETCH BANK ================= */
    useEffect(() => {
        if (!showBankModal) return;

        const fetchBanks = async () => {
            try {
                setLoadingBank(true);
                const res = await fetch('https://api.vietqr.io/v2/banks');
                const data = await res.json();

                if (data.code === '00') {
                    //Thêm NCB thủ công để test
                    const mockNCB = {
                        id: 999,
                        name: 'Ngân hàng Quốc Dân',
                        shortName: 'NCB',
                        code: 'NCB',
                        logo: 'https://api.vietqr.io/img/NCB.png',
                    };

                    setBankList([mockNCB, ...data.data]);
                } else {
                    showToast('Không lấy được ngân hàng', 'error');
                }
            } catch {
                showToast('Lỗi tải ngân hàng', 'error');
            } finally {
                setLoadingBank(false);
            }
        };

        fetchBanks();
    }, [showBankModal, showToast]);


    /* ================= PAY ================= */
    const handlePayment = async () => {
        if (!payInvoice || !selectedBank) return;

        try {
            const token = getCookie('token');
            const payload = {
                bank: selectedBank,
                amount: payInvoice.total_amount,
                id_request: String(payInvoice.id_invoices),
                requestType: 'invoice',
            };

            const res = await fetch(`${API_BASE_URL}/customer/payment/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const paymentUrl = await res.text();
            window.location.href = paymentUrl;
            fetchInvoices();
        } catch {
            showToast('Thanh toán thất bại', 'error');
        }
    };

    const unpaidCount = invoices.filter((i) => i.name_status === 'UNPAID').length;
    const paidCount = invoices.filter((i) => i.name_status === 'PAID').length;


    /* ================= UI ================= */
    return (
        <div className="max-w-5xl mx-auto px-4 bg-white shadow rounded-2xl p-6 border">
            {/* FILTER */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setStatus('unpaid')}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2
            ${status === 'unpaid' ? 'bg-orange-500 text-white' : 'bg-gray-100'}
        `}
                >
                    Chưa thanh toán
                    <span
                        className={`px-2 py-0.5 text-xs rounded-full font-semibold
                ${status === 'unpaid' ? 'bg-white text-orange-600' : 'bg-gray-300 text-gray-700'}
            `}
                    >
                        {unpaidCount}
                    </span>
                </button>

                <button
                    onClick={() => setStatus('paid')}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2
            ${status === 'paid' ? 'bg-orange-500 text-white' : 'bg-gray-100'}
        `}
                >
                    Đã thanh toán
                    <span
                        className={`px-2 py-0.5 text-xs rounded-full font-semibold
                ${status === 'paid' ? 'bg-white text-orange-600' : 'bg-gray-300 text-gray-700'}
            `}
                    >
                        {paidCount}
                    </span>
                </button>
            </div>

            {/* LIST */}
            {loading && <p className="text-center text-gray-500">Đang tải hóa đơn...</p>}
            {!loading && filteredInvoices.length === 0 && <p className="text-center text-gray-500">Không có hóa đơn</p>}

            <div className="space-y-4">
                {!loading &&
                    filteredInvoices.map((bill) => (
                        <div key={bill.id_invoices} className="border p-4 rounded-xl shadow-sm">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg">Hóa đơn #{bill.id_invoices}</h3>
                                    <p className="text-sm text-gray-500">Thợ: {bill.name_tech}</p>
                                    <p className="text-sm text-gray-500">
                                        Ngày thanh toán: {formatDate(bill.paid_at) || 'Chưa thanh toán'}
                                    </p>
                                    <p className="font-semibold text-orange-600 mt-1">
                                        {bill.total_amount.toLocaleString()} đ
                                    </p>
                                </div>

                                {bill.name_status === 'PAID' ? (
                                    <CheckCircle className="text-green-500" size={32} />
                                ) : (
                                    <XCircle className="text-red-500" size={32} />
                                )}
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => openDetail(bill)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                >
                                    Xem chi tiết
                                </button>

                                {bill.name_status === 'UNPAID' && (
                                    <button
                                        onClick={() => openPayment(bill)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg"
                                    >
                                        Thanh toán
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center gap-4 mt-6">
                <button
                    disabled={pageNo === 1}
                    onClick={() => setPageNo(pageNo - 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Trước
                </button>
                <span className="font-medium">
                    {pageNo} / {totalPage}
                </span>
                <button
                    disabled={pageNo === totalPage}
                    onClick={() => setPageNo(pageNo + 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Sau
                </button>
            </div>

            {/* ================= DETAIL MODAL ================= */}
            {showDetailModal && selectedInvoice && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-xl">
                        <h2 className="text-xl font-bold mb-4 text-orange-600">
                            Chi tiết hóa đơn #{selectedInvoice.id_invoices}
                        </h2>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                                <p className="text-gray-500">Thợ</p>
                                <p className="font-medium">{selectedInvoice.name_tech}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Trạng thái</p>
                                <p
                                    className={`font-semibold ${
                                        selectedInvoice.name_status === 'PAID' ? 'text-green-600' : 'text-red-500'
                                    }`}
                                >
                                    {selectedInvoice.name_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Ngày</p>
                                <p className="font-medium">{formatDate(selectedInvoice.paid_at) || '—'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Phương thức</p>
                                <p className="font-medium">{selectedInvoice.payment_method || '—'}</p>
                            </div>
                        </div>

                        <div className="border rounded-xl overflow-hidden mb-4">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-3 py-2 text-left">Dịch vụ</th>
                                        <th className="px-3 py-2 text-center">SL</th>
                                        <th className="px-3 py-2 text-right">Đơn giá</th>
                                        <th className="px-3 py-2 text-right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedInvoice.detailInvoiceDTOS.map((d) => (
                                        <tr key={d.id_detail_invoice} className="border-t">
                                            <td className="px-3 py-2">{d.name}</td>
                                            <td className="px-3 py-2 text-center">{d.quantity}</td>
                                            <td className="px-3 py-2 text-right">{d.price.toLocaleString()} đ</td>
                                            <td className="px-3 py-2 text-right font-medium">
                                                {d.total_price.toLocaleString()} đ
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-lg">Tổng cộng</span>
                            <span className="font-bold text-xl text-orange-600">
                                {selectedInvoice.total_amount.toLocaleString()} đ
                            </span>
                        </div>

                        <button
                            onClick={() => setShowDetailModal(false)}
                            className="w-full bg-orange-500 text-white py-2 rounded-xl font-semibold"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            {/* ================= BANK MODAL ================= */}
            {showBankModal && payInvoice && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white max-w-md w-full rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-4">Chọn ngân hàng</h2>

                        <div className="space-y-3 max-h-72 overflow-y-auto mb-4">
                            {loadingBank && <p className="text-center">Đang tải...</p>}
                            {!loadingBank &&
                                bankList.map((bank) => (
                                    <div
                                        key={bank.code}
                                        onClick={() => setSelectedBank(bank.code)}
                                        className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition
        ${selectedBank === bank.code ? 'border-orange-500 bg-orange-50' : 'hover:bg-gray-50'}
    `}
                                    >
                                        <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg border">
                                            <img
                                                src={bank.logo}
                                                alt={bank.shortName}
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <p className="font-semibold">{bank.shortName}</p>
                                            <p className="text-sm text-gray-500">{bank.name}</p>
                                        </div>

                                        {selectedBank === bank.code && (
                                            <CheckCircle className="text-orange-500" size={26} />
                                        )}
                                    </div>
                                ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowBankModal(false)}
                                className="flex-1 bg-gray-300 py-2 rounded-lg"
                            >
                                Hủy
                            </button>
                            <button
                                disabled={!selectedBank}
                                onClick={handlePayment}
                                className="flex-1 bg-green-600 text-white py-2 rounded-lg disabled:opacity-50"
                            >
                                Thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
