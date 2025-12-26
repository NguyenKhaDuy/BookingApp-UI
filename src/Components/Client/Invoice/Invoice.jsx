import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function Invoice() {
    const [status, setStatus] = useState('unpaid');

    // xem chi tiết
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // thanh toán
    const [showBankModal, setShowBankModal] = useState(false);
    const [selectedBank, setSelectedBank] = useState('');
    const [payInvoice, setPayInvoice] = useState(null);

    const invoiceList = {
        unpaid: [
            {
                id: 'INV004',
                service: 'Thông tắc lavabo',
                technician: 'Thợ Bảo',
                amount: 250000,
                date: '10/12/2025',
                note: 'Dịch vụ thông tắc lavabo với bảo hành 7 ngày.',
            },
        ],
        paid: [
            {
                id: 2,
                service: 'Thay CB điện',
                technician: 'Thợ Minh',
                amount: 180000,
                date: '05/12/2025',
                note: 'Thay cầu dao điện loại 30A.',
            },
        ],
    };

    const bankList = [
        { code: 'NCB', name: 'Ngân hàng NCB' },
        { code: 'VCB', name: 'Vietcombank' },
        { code: 'ACB', name: 'ACB' },
        { code: 'BIDV', name: 'BIDV' },
        { code: 'TECHCOMBANK', name: 'Techcombank' },
    ];

    const openDetail = (bill) => {
        setSelectedInvoice(bill);
        setShowDetailModal(true);
    };

    const openPayment = (bill) => {
        setPayInvoice(bill);
        setSelectedBank('');
        setShowBankModal(true);
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const token = getCookie('token');

    

    const handlePayment = async () => {
        console.log("toeken: " + token);
        const payload = {
            bank: selectedBank,
            amount: payInvoice.amount,
            id_request: String(payInvoice.id),
            requestType: 'invoice',
        };

        try {
            const res = await fetch('http://localhost:8081/api/customer/payment/', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const paymentUrl = await res.text();

            // redirect sang VNPAY
            window.location.href = paymentUrl;
        } catch (err) {
            console.error(err);
            alert('Thanh toán thất bại');
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 bg-white shadow rounded-xl p-5 border">
            {/* FILTER */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setStatus('unpaid')}
                    className={`px-4 py-2 rounded-lg ${
                        status === 'unpaid' ? 'bg-orange-500 text-white' : 'bg-gray-100'
                    }`}
                >
                    Chưa thanh toán
                </button>

                <button
                    onClick={() => setStatus('paid')}
                    className={`px-4 py-2 rounded-lg ${status === 'paid' ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}
                >
                    Đã thanh toán
                </button>
            </div>

            {/* LIST */}
            <div className="space-y-4">
                {invoiceList[status].map((bill) => (
                    <div key={bill.id} className="border p-4 rounded-xl shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg">{bill.service}</h3>
                                <p className="text-sm text-gray-500">
                                    Thợ: {bill.technician} • Ngày: {bill.date}
                                </p>
                                <p className="font-semibold text-orange-600 mt-1">{bill.amount.toLocaleString()} đ</p>
                            </div>

                            {status === 'paid' ? (
                                <CheckCircle className="text-green-500" size={32} />
                            ) : (
                                <XCircle className="text-red-500" size={32} />
                            )}
                        </div>

                        <div className="flex gap-3 mt-4">
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                onClick={() => openDetail(bill)}
                            >
                                Xem chi tiết
                            </button>

                            {status === 'unpaid' && (
                                <button
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                                    onClick={() => openPayment(bill)}
                                >
                                    Thanh toán ngay
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL CHI TIẾT */}
            {showDetailModal && selectedInvoice && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white max-w-md w-full rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-3">Chi tiết hóa đơn</h2>
                        <p>
                            <b>Dịch vụ:</b> {selectedInvoice.service}
                        </p>
                        <p>
                            <b>Thợ:</b> {selectedInvoice.technician}
                        </p>
                        <p>
                            <b>Ngày:</b> {selectedInvoice.date}
                        </p>
                        <p>
                            <b>Số tiền:</b> {selectedInvoice.amount.toLocaleString()} đ
                        </p>
                        <p className="mt-2 text-sm text-gray-600">
                            <b>Ghi chú:</b> {selectedInvoice.note}
                        </p>

                        <button
                            className="mt-5 w-full bg-orange-500 text-white py-2 rounded-lg"
                            onClick={() => setShowDetailModal(false)}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL CHỌN NGÂN HÀNG */}
            {showBankModal && payInvoice && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white max-w-md w-full rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-4">Chọn ngân hàng</h2>

                        <select
                            className="w-full border p-2 rounded-lg mb-4"
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                        >
                            <option value="">-- Chọn ngân hàng --</option>
                            {bankList.map((bank) => (
                                <option key={bank.code} value={bank.code}>
                                    {bank.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex gap-3">
                            <button
                                className="flex-1 bg-gray-300 py-2 rounded-lg"
                                onClick={() => setShowBankModal(false)}
                            >
                                Hủy
                            </button>

                            <button
                                className="flex-1 bg-green-600 text-white py-2 rounded-lg disabled:opacity-50"
                                disabled={!selectedBank}
                                onClick={handlePayment}
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
