import React, { Fragment, useState, useEffect } from 'react';
import RepairStatus from '../../../Components/Client/RepairStatus/RepairStatus';
import RequestHeader from '../../../Components/Client/RequestHeader/RequestHeader';
import Invoice from '../../../Components/Client/Invoice/Invoice';

export default function RequestPage() {
    const [tab, setTab] = useState('request');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('vnp_ResponseCode');
        const txnRef = params.get('vnp_TxnRef');

        if (code === '00' && txnRef) {
            // ✅ tự chuyển sang tab hóa đơn
            setTab('invoice');

            // ✅ gọi backend cập nhật trạng thái
            fetch(`http://localhost:8081/api/payment-info/?vnp_ResponseCode=${code}&vnp_TxnRef=${txnRef}`);

            // ✅ xoá query param cho sạch URL
            window.history.replaceState({}, document.title, '/request');
        }
    }, []);

    return (
        <Fragment>
            <RequestHeader />

            {/* TAB SELECTOR */}
            <div className="max-w-6xl mx-auto px-4 mt-6">
                <div className="flex gap-3 border-b pb-2">
                    <button
                        onClick={() => setTab('request')}
                        className={`pb-2 px-4 font-semibold ${
                            tab === 'request' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500'
                        }`}
                    >
                        Yêu cầu sửa chữa
                    </button>

                    <button
                        onClick={() => setTab('invoice')}
                        className={`pb-2 px-4 font-semibold ${
                            tab === 'invoice' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500'
                        }`}
                    >
                        Hóa đơn
                    </button>
                </div>
            </div>

            {/* TAB CONTENT */}
            <div className="mt-6 mb-10">{tab === 'request' ? <RepairStatus /> : <Invoice />}</div>
        </Fragment>
    );
}
