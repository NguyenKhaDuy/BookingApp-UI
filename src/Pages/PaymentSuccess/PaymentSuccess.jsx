import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/api';

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/payment-info${location.search}`);

                if (!res.ok) throw new Error('Verify failed');
                setStatus('success');

                setTimeout(() => {
                    navigate('/request?payment=success', { replace: true });
                }, 2000);
            } catch (err) {
                console.error(err);

                setStatus('error');

                setTimeout(() => {
                    navigate('/request?payment=error', { replace: true });
                }, 2000);
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, []);

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
                        <h1 style={{ color: 'green' }}>✅ Thanh toán thành công</h1>
                        <p>Đang chuyển về trang hóa đơn...</p>
                    </>
                )}

                {status === 'fail' && (
                    <>
                        <h1 style={{ color: 'red' }}>❌ Thanh toán thất bại</h1>
                        <p>Đang quay lại...</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <h1 style={{ color: 'orange' }}>⚠️ Lỗi xác thực</h1>
                        <p>Vui lòng thử lại...</p>
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
