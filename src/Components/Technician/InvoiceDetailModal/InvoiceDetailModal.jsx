import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function InvoiceDetailModal({ invoice, onClose }) {
    if (!invoice) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/40 z-[9999] flex justify-center items-center">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-xl shadow-xl p-6 relative overflow-y-auto">
                {/* Close button */}
                <button className="absolute top-3 right-3 text-gray-500 hover:text-black" onClick={onClose}>
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-semibold mb-4">Chi tiết hóa đơn</h2>

                {/* Info */}
                <div className="mb-4">
                    <p className="text-lg">
                        Mã HĐ: <span className="font-semibold text-orange-600">#{invoice.id}</span>
                    </p>
                    <p className="text-lg">
                        Mã đơn hàng: <span className="font-semibold">#{invoice.orderId}</span>
                    </p>
                    <p className="text-lg text-gray-600">Ngày tạo: {invoice.date}</p>
                </div>

                {/* Material list */}
                <div>
                    <h3 className="text-xl font-semibold mb-2">Danh sách vật liệu</h3>

                    <div className="border rounded-lg p-3 max-h-24 overflow-y-auto">
                        {invoice.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between border-b py-2 text-gray-700">
                                <span>
                                    {it.name} x{it.quantity}
                                </span>
                                <span>{(it.price * it.quantity).toLocaleString()} đ</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Labor cost */}
                <div className="mt-4 flex justify-between text-lg font-medium">
                    <span>Tiền công thợ:</span>
                    <span>{invoice.laborCost.toLocaleString()} đ</span>
                </div>

                {/* Total */}
                <div className="mt-4 border-t pt-4 flex justify-between text-xl font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-orange-600">{invoice.total.toLocaleString()} đ</span>
                </div>

                <button
                    onClick={onClose}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg mt-6"
                >
                    Đóng
                </button>
            </div>
        </div>,
        document.body,
    );
}
