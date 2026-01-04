import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useToast } from '../../../Context/ToastContext';

export default function InvoiceCreate({ orderId, onClose }) {
    const [paid, setPaid] = useState(false);
    const [items, setItems] = useState([{ name: '', quantity: 1, price: 0 }]);
    const [laborCost, setLaborCost] = useState(0);
    const { showToast } = useToast();

    const addItem = () => setItems([...items, { name: '', quantity: 1, price: 0 }]);
    const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));

    const updateItem = (i, field, value) => {
        const updated = [...items];
        updated[i][field] = value;
        setItems(updated);
    };

    const totalMaterial = items.reduce((s, it) => s + it.quantity * it.price, 0);
    const total = totalMaterial + Number(laborCost || 0);

    const createInvoice = () => {
        setPaid(true);
         showToast('Khách hàng đã thanh toán thành công!', 'success');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
            <div
                className="bg-white p-6 rounded-xl shadow max-w-5xl w-full relative 
                max-h-[90vh] flex flex-col"
            >
                {/* Close */}
                <button className="absolute top-3 right-3 text-gray-600 hover:text-black" onClick={onClose}>
                    <X size={24} />
                </button>

                {/* Header */}
                <h1 className="text-2xl font-semibold mb-4">Tạo hóa đơn</h1>

                <div className="mb-4 text-lg font-medium">
                    Mã đơn hàng:
                    <span className="text-orange-600 font-semibold"> #{orderId}</span>
                </div>

                {/* ======= BODY SCROLL ======= */}
                <div className="overflow-y-auto max-h-[70vh] pr-2">
                    {/* Header row */}
                    <div className="grid grid-cols-12 gap-4 font-semibold text-gray-700 mb-2">
                        <div className="col-span-5">Tên vật liệu</div>
                        <div className="col-span-2">Số lượng</div>
                        <div className="col-span-3">Giá</div>
                        <div className="col-span-2">Xóa</div>
                    </div>

                    {/* SCROLL materials */}
                    <div
                        className={`
                            pr-2 mb-4 bg-white
                            ${items.length >= 2 ? 'max-h-32 overflow-y-auto' : ''}
                        `}
                    >
                        {items.map((item, i) => (
                            <div key={i} className="grid grid-cols-12 gap-4 mb-3 items-center">
                                <input
                                    className="col-span-5 border p-2 rounded"
                                    placeholder="VD: Ốc vít, dây điện..."
                                    value={item.name}
                                    onChange={(e) => updateItem(i, 'name', e.target.value)}
                                />

                                <input
                                    type="number"
                                    className="col-span-2 border p-2 rounded"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(i, 'quantity', Number(e.target.value))}
                                />

                                <input
                                    type="number"
                                    className="col-span-3 border p-2 rounded"
                                    value={item.price}
                                    onChange={(e) => updateItem(i, 'price', Number(e.target.value))}
                                />

                                <button
                                    className="col-span-2 text-red-500 hover:text-red-600"
                                    onClick={() => removeItem(i)}
                                >
                                    <Trash2 />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addItem}
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg mt-2 mb-6"
                    >
                        <Plus size={18} /> Thêm vật liệu
                    </button>

                    {/* Labor */}
                    <div className="mt-4 mb-6">
                        <label className="font-semibold block mb-1">Tiền công thợ</label>
                        <input
                            type="number"
                            className="border p-3 rounded w-full"
                            value={laborCost}
                            onChange={(e) => setLaborCost(e.target.value)}
                            placeholder="Nhập tiền công"
                        />
                    </div>

                    {/* Total */}
                    <div className="text-xl font-semibold flex justify-between border-t pt-4 mb-4">
                        <span>Tổng tiền:</span>
                        <span className="text-orange-600">{total.toLocaleString()} đ</span>
                    </div>
                </div>

                {/* ======= FOOTER (luôn cố định, không bị mất) ======= */}
                <button
                    onClick={createInvoice}
                    className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded font-semibold w-full mt-2"
                >
                    {paid ? 'Đã thanh toán' : 'Tạo hóa đơn'}
                </button>
            </div>
        </div>
    );
}
