import { useState } from 'react';

export default function Notifications({ onAcceptOrder }) {
    const [acceptedOrders, setAcceptedOrders] = useState([]);

    const list = [
        { type: 'new-order', text: 'Bạn có đơn hàng mới!', orderId: 9876 },
        { type: 'payment', text: 'Khách hàng đã thanh toán.' },
        { type: 'done', text: 'Đơn hàng #1234 đã hoàn tất.' },
    ];

    const handleAccept = (orderId) => {
        setAcceptedOrders([...acceptedOrders, orderId]); // lưu order đã nhận
        onAcceptOrder(orderId); // callback ra ngoài
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Thông báo</h1>

            <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-3">
                {list.map((msg, i) => {
                    const isAccepted = acceptedOrders.includes(msg.orderId);

                    return (
                        <div key={i} className="p-3 border-b last:border-none flex items-center justify-between">
                            <span>{msg.text}</span>

                            {/* Nếu là đơn hàng mới */}
                            {msg.type === 'new-order' && (
                                <>
                                    {!isAccepted ? (
                                        <button
                                            onClick={() => handleAccept(msg.orderId)}
                                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm"
                                        >
                                            Nhận đơn
                                        </button>
                                    ) : (
                                        <span className="text-green-600 font-semibold">✓ Đã nhận đơn</span>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
