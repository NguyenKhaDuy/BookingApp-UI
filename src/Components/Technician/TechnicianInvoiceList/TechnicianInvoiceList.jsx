import { useState } from 'react';
import { Eye } from 'lucide-react';
import InvoiceDetailModal from '../InvoiceDetailModal/InvoiceDetailModal';

export default function TechnicianInvoiceList() {
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    // MOCK DATA
    const invoices = [
        {
            id: 1001,
            orderId: 501,
            date: '12/12/2025',
            laborCost: 200000,
            items: [
                { name: 'Ốc vít', quantity: 5, price: 2000 },
                { name: 'Dây điện', quantity: 3, price: 12000 },
                { name: 'Dây điện', quantity: 3, price: 12000 },
                { name: 'Dây điện', quantity: 3, price: 12000 },
                { name: 'Dây điện', quantity: 3, price: 12000 },
                { name: 'Dây điện', quantity: 3, price: 12000 },
            ],
            total: 200000 + (5 * 2000 + 3 * 12000),
        },
        {
            id: 1002,
            orderId: 502,
            date: '12/12/2025',
            laborCost: 300000,
            items: [{ name: 'Bộ lọc nước', quantity: 1, price: 450000 }],
            total: 300000 + 450000,
        },
        {
            id: 1003,
            orderId: 503,
            date: '13/12/2025',
            laborCost: 150000,
            items: [
                { name: 'Bóng đèn', quantity: 2, price: 35000 },
                { name: 'Công tắc', quantity: 1, price: 45000 },
            ],
            total: 150000 + (2 * 35000 + 45000),
        },
    ];

    return (
        <>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Danh sách hóa đơn đã tạo</h2>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-3">Mã HĐ</th>
                                <th className="p-3">Mã đơn hàng</th>
                                <th className="p-3">Tổng tiền</th>
                                <th className="p-3">Ngày tạo</th>
                                <th className="p-3 text-center">Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {invoices.map((inv) => (
                                <tr key={inv.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium text-orange-600">#{inv.id}</td>
                                    <td className="p-3">#{inv.orderId}</td>
                                    <td className="p-3 font-semibold">{inv.total.toLocaleString()} đ</td>
                                    <td className="p-3 text-gray-600">{inv.date}</td>
                                    <td className="p-3 text-center">
                                        <button
                                            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg mx-auto"
                                            onClick={() => setSelectedInvoice(inv)}
                                        >
                                            <Eye size={18} />
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal detail */}
            <InvoiceDetailModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
        </>
    );
}
