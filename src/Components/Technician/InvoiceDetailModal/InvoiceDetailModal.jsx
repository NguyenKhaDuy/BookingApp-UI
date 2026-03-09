import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Package } from 'lucide-react';
import formatDate from '../../../utils/formatDate';

export default function InvoiceDetailModal({ invoice, onClose }) {
    if (!invoice) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/40 z-[9999] flex justify-center items-center">
            <div
                className="bg-white w-full max-w-2xl max-h-[90vh]
                            rounded-xl shadow-xl p-6 relative overflow-y-auto"
            >
                <button className="absolute top-3 right-3 text-gray-500 hover:text-black" onClick={onClose}>
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-semibold mb-4">Chi tiết hóa đơn</h2>

                {/* INFO */}
                <div className="mb-4 space-y-1 text-sm">
                    <p>
                        Mã hóa đơn:
                        <span className="ml-2 font-semibold text-orange-600">#{invoice.id_invoices}</span>
                    </p>
                    <p>
                        Trạng thái:
                        <span className="ml-2 font-medium">{invoice.name_status}</span>
                    </p>
                    <p className="flex items-center">
                        Ngày thanh toán:
                        {invoice.paid_at ? (
                            <span className="ml-2 font-medium text-gray-800">{formatDate(invoice.paid_at)}</span>
                        ) : (
                            <span
                                className="ml-2 px-2 py-1 rounded-full text-sm font-semibold
                         bg-red-100 text-red-600"
                            >
                                Chưa thanh toán
                            </span>
                        )}
                    </p>

                    <p>
                        Phương thức:
                        <span className="ml-2">{invoice.payment_method}</span>
                    </p>
                </div>

                {/* DETAIL LIST */}
                <h3 className="text-lg font-semibold mb-2">Chi tiết hóa đơn</h3>

                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800">
                        <Package size={20} className="text-orange-500" />
                        Chi tiết vật liệu
                    </h3>

                    <div className="border rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="bg-gradient-to-r from-orange-50 to-orange-100">
                                <tr className="text-gray-700">
                                    <th className="p-3 text-left">Vật liệu</th>
                                    <th className="p-3 text-center">Số lượng</th>
                                    <th className="p-3 text-right">Thành tiền</th>
                                </tr>
                            </thead>

                            <tbody>
                                {invoice.detailInvoiceDTOS.map((d, idx) => (
                                    <tr
                                        key={d.id_detail_invoice}
                                        className={`border-t hover:bg-orange-50 transition
                            ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        `}
                                    >
                                        <td className="p-3 font-medium text-gray-800">{d.name}</td>

                                        <td className="p-3 text-center">
                                            <span className="px-2 py-1 rounded bg-gray-100 text-gray-700">
                                                {d.quantity}
                                            </span>
                                        </td>

                                        <td className="p-3 text-right font-semibold text-orange-600">
                                            {d.total_price.toLocaleString()} đ
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* TOTAL */}
                <div className="mt-4 border-t pt-4 flex justify-between text-xl font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-orange-600">{invoice.total_amount.toLocaleString()} đ</span>
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-6 bg-orange-500 hover:bg-orange-600
                               text-white py-3 rounded-lg"
                >
                    Đóng
                </button>
            </div>
        </div>,
        document.body,
    );
}
