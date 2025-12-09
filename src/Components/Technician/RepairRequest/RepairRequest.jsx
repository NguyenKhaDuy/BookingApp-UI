import { useState } from 'react';
import InvoiceCreate from '../InvoiceCreate/InvoiceCreate';

export default function RepairRequest() {
    const [openInvoice, setOpenInvoice] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const orders = [
        { id: 1, customer: 'Nguyễn Văn A', service: 'Sửa điện', status: 'Hoàn thành' },
        { id: 2, customer: 'Trần B', service: 'Sửa máy lạnh', status: 'Đang làm' },
        { id: 3, customer: 'Ngô C', service: 'Sửa ống nước', status: 'Hoàn thành' },
    ];

    const openModal = (id) => {
        setSelectedOrder(id);
        setOpenInvoice(true);
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Đơn hàng</h1>

            <div className="bg-white p-4 rounded-xl shadow">
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b">
                            <th className="p-3">Khách hàng</th>
                            <th>Dịch vụ</th>
                            <th>Trạng thái</th>
                            <th>Tạo hóa đơn</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((o) => (
                            <tr key={o.id} className="border-b">
                                <td className="p-3">{o.customer}</td>
                                <td>{o.service}</td>
                                <td className="text-orange-500 font-semibold">{o.status}</td>

                                <td className="p-3">
                                    {o.status === 'Hoàn thành' && (
                                        <button
                                            onClick={() => openModal(o.id)}
                                            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded"
                                        >
                                            Tạo hóa đơn
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {openInvoice && <InvoiceCreate orderId={selectedOrder} onClose={() => setOpenInvoice(false)} />}
        </div>
    );
}
