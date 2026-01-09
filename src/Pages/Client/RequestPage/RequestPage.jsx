import React, { Fragment, useState, useEffect, useContext } from 'react';
import RepairStatus from '../../../Components/Client/RepairStatus/RepairStatus';
import RequestHeader from '../../../Components/Client/RequestHeader/RequestHeader';
import Invoice from '../../../Components/Client/Invoice/Invoice';
import { UserContext } from '../../../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import getCookie from '../../../utils/getToken';
import { useToast } from '../../../Context/ToastContext';
export default function RequestPage() {
    const [tab, setTab] = useState('request');
    const { showToast } = useToast();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = localStorage.getItem('user');
        const token = getCookie('token');

        if (!user || !token) {
            navigate('/login', { replace: true });
            return;
        }

        setLoading(false);
    }, [navigate]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('vnp_ResponseCode');
        const txnRef = params.get('vnp_TxnRef');

        // ⛔ Không phải redirect từ VNPAY → bỏ qua
        if (!code || !txnRef) return;

        if (code === '00') {
            setTab('invoice');

            fetch(`http://localhost:8081/api/payment-info/?vnp_ResponseCode=${code}&vnp_TxnRef=${txnRef}`);

            showToast('Thanh toán thành công', 'success');
        } else {
            showToast('Thanh toán không thành công', 'error');
        }

        // 🧹 Clear URL
        window.history.replaceState({}, document.title, '/request');
    }, [showToast]);

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
