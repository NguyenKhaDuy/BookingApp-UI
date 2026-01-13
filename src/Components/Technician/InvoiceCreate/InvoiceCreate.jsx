import axios from 'axios';
import { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useToast } from '../../../Context/ToastContext';
import getCookie from '../../../utils/getToken';

export default function InvoiceCreate({customer, orderId, onClose, onSuccess }) {
    const [paid, setPaid] = useState(false);
    const [items, setItems] = useState([{ name: '', quantity: 1, price: 0 }]);
    const [laborCost, setLaborCost] = useState(0);
    const [loading, setLoading] = useState(false);
    
    /* ===== PAYMENT ===== */
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [paymentMethodId, setPaymentMethodId] = useState('');

    const { showToast } = useToast();
    const token = getCookie('token');

    /* ================== LOAD PAYMENT METHOD ================== */
    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    const fetchPaymentMethods = async () => {
        try {
            const res = await axios.get('http://localhost:8081/api/paymentmethod/', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const methods = res.data?.data || [];
            setPaymentMethods(methods);

            // auto chọn cái đầu tiên
            if (methods.length > 0) {
                setPaymentMethodId(methods[0].id_method);
            }
        } catch (err) {
            showToast('Không lấy được phương thức thanh toán', 'error');
        }
    };

    /* ================== MATERIAL ================== */
    const addItem = () => setItems([...items, { name: '', quantity: 1, price: 0 }]);
    const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));

    const updateItem = (i, field, value) => {
        const updated = [...items];
        updated[i][field] = value;
        setItems(updated);
    };

    /* ================== TOTAL ================== */
    const totalMaterial = items.reduce((s, it) => s + it.quantity * it.price, 0);
    const total = totalMaterial + Number(laborCost || 0);

    /* ================== API CREATE ================== */
    const createInvoice = async () => {
        try {
            if (!paymentMethodId) {
                showToast('Vui lòng chọn phương thức thanh toán', 'error');
                return;
            }

            if (items.some((i) => !i.name || i.quantity <= 0 || i.price <= 0)) {
                showToast('Vui lòng nhập đầy đủ thông tin vật liệu', 'error');
                return;
            }

            setLoading(true);

            // ===== MATERIAL DETAILS =====
            const detailInvoiceDTOS = items.map((it) => ({
                name: it.name,
                quantity: it.quantity,
                price: it.price,
                total_price: it.quantity * it.price,
            }));

            // ===== ADD LABOR COST AS DETAIL =====
            if (Number(laborCost) > 0) {
                detailInvoiceDTOS.push({
                    name: 'Công thợ',
                    quantity: 1,
                    price: Number(laborCost),
                    total_price: Number(laborCost),
                });
            }

            const payload = {
                request_id: orderId,
                customer_id: customer.id_user,
                payment_method_id: paymentMethodId,
                detailInvoiceDTOS, //CÔNG THỢ NẰM Ở ĐÂY
            };

            await axios.post('http://localhost:8081/api/technician/invoices/', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setPaid(true);
            showToast('Tạo hóa đơn thành công!', 'success');
            onSuccess?.();
            onClose();
        } catch (err) {
            showToast(err.response?.data?.message || 'Tạo hóa đơn thất bại', 'error');
        } finally {
            setLoading(false);
        }
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

                {/* ======= BODY ======= */}
                <div className="overflow-y-auto max-h-[70vh] pr-2">
                    {/* Payment method */}
                    <div className="mb-6">
                        <label className="font-semibold block mb-1">Phương thức thanh toán</label>
                        <select
                            value={paymentMethodId}
                            onChange={(e) => setPaymentMethodId(Number(e.target.value))}
                            className="p-4 rounded-xl border border-gray-300 outline-orange-500 w-full"
                        >
                            {paymentMethods.map((pm) => (
                                <option key={pm.id_method} value={pm.id_method}>
                                    {pm.name_method} {pm.provider ? `- ${pm.provider}` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Header row */}
                    <div className="grid grid-cols-12 gap-4 font-semibold text-gray-700 mb-2">
                        <div className="col-span-5">Tên vật liệu</div>
                        <div className="col-span-2">Số lượng</div>
                        <div className="col-span-3">Giá</div>
                        <div className="col-span-2">Xóa</div>
                    </div>

                    {/* Materials */}
                    <div className={`${items.length >= 2 ? 'max-h-32 overflow-y-auto' : ''} pr-2 mb-4`}>
                        {items.map((item, i) => (
                            <div key={i} className="grid grid-cols-12 gap-4 mb-3 items-center">
                                <input
                                    className="col-span-5 p-4 rounded-xl border border-gray-300 outline-orange-500"
                                    placeholder="VD: Ốc vít, dây điện..."
                                    value={item.name}
                                    onChange={(e) => updateItem(i, 'name', e.target.value)}
                                />
                                <input
                                    type="number"
                                    className="col-span-2 p-4 rounded-xl border border-gray-300 outline-orange-500"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(i, 'quantity', Number(e.target.value))}
                                />
                                <input
                                    type="number"
                                    className="col-span-3 p-4 rounded-xl border border-gray-300 outline-orange-500"
                                    value={item.price}
                                    onChange={(e) => updateItem(i, 'price', Number(e.target.value))}
                                />
                                <button
                                    className="col-span-2 text-red-500 hover:text-red-600 align-content-center"
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
                            className="p-4 rounded-xl border border-gray-300 outline-orange-500 w-full"
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

                {/* ======= FOOTER ======= */}
                <button
                    disabled={loading || paid}
                    onClick={createInvoice}
                    className={`p-3 rounded font-semibold w-full mt-2 text-white
                        ${paid ? 'bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}
                    `}
                >
                    {paid ? 'Đã thanh toán' : loading ? 'Đang tạo...' : 'Tạo hóa đơn'}
                </button>
            </div>
        </div>
    );
}
