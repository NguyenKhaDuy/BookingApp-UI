import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function Invoice() {
    const [status, setStatus] = useState('unpaid');
    const [selectedInvoice, setSelectedInvoice] = useState(null); // POPUP DATA
    const [showModal, setShowModal] = useState(false); // POPUP STATE

    const invoiceList = {
        unpaid: [
            {
                id: 1,
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

    const openDetail = (bill) => {
        setSelectedInvoice(bill);
        setShowModal(true);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 bg-white shadow rounded-xl p-5 border">
            {/* STATUS FILTER */}
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

            {/* INVOICE LIST */}
            <div className="space-y-4">
                {invoiceList[status].map((bill) => (
                    <div key={bill.id} className="border p-4 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg">{bill.service}</h3>
                                <p className="text-sm text-gray-500">
                                    Thợ: {bill.technician} • Ngày: {bill.date}
                                </p>
                                <p className="font-semibold text-orange-600 mt-1">{bill.amount.toLocaleString()} đ</p>
                            </div>

                            {/* ICON */}
                            {status === 'paid' ? (
                                <CheckCircle className="text-green-500" size={32} />
                            ) : (
                                <XCircle className="text-red-500" size={32} />
                            )}
                        </div>

                        {/* BUTTONS */}
                        <div className="flex gap-3 mt-4">
                            {/* XEM CHI TIẾT */}
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                onClick={() => openDetail(bill)}
                            >
                                Xem chi tiết
                            </button>

                            {/* PAY BUTTON */}
                            {status === 'unpaid' && (
                                <button
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    onClick={() => alert('Đi tới trang thanh toán chuyển khoản')}
                                >
                                    Thanh toán ngay
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {showModal && selectedInvoice && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
                        <h2 className="text-xl font-bold mb-3">Chi tiết hóa đơn</h2>
                        <p>
                            <strong>Dịch vụ:</strong> {selectedInvoice.service}
                        </p>
                        <p>
                            <strong>Thợ:</strong> {selectedInvoice.technician}
                        </p>
                        <p>
                            <strong>Ngày:</strong> {selectedInvoice.date}
                        </p>
                        <p>
                            <strong>Số tiền:</strong> {selectedInvoice.amount.toLocaleString()} đ
                        </p>
                        <p className="mt-2 text-gray-600 text-sm">
                            <strong>Ghi chú:</strong> {selectedInvoice.note}
                        </p>

                        <button
                            className="mt-6 w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                            onClick={() => setShowModal(false)}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
