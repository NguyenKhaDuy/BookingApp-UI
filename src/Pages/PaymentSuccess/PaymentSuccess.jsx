import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const payment = params.get('payment');

        if (payment === 'success') {
            setStatus('success');
        } else if (payment === 'failed') {
            setStatus('failed');
        } else {
            setStatus('error');
        }

        setLoading(false);

        const timer = setTimeout(() => {
            navigate('/request', { replace: true });
        }, 2000);

        return () => clearTimeout(timer);
    }, [location.search, navigate]);

    if (loading) {
        return (
            <div style={styles.container}>
                <h2>Đang xử lý thanh toán...</h2>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {status === 'success' && (
                    <>
                        <h1 style={{ color: 'green' }}>Thanh toán thành công</h1>
                        <p>Giao dịch đã được thanh toán thành công.</p>
                        <p>Đang chuyển về trang yêu cầu...</p>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <h1 style={{ color: 'red' }}>Thanh toán thất bại</h1>
                        <p>Giao dịch chưa được thanh toán thành công.</p>
                        <p>Đang quay lại...</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <h1 style={{ color: 'orange' }}>Không xác định được trạng thái</h1>
                        <p>Vui lòng kiểm tra lại giao dịch.</p>
                    </>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f5f5f5',
    },

    card: {
        background: '#fff',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
};

export default PaymentSuccess;
