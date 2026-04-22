import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, LabelList } from 'recharts';
import getCookie from '../../../utils/getToken';
import {API_BASE_URL} from '../../../utils/api.js';

export default function OrderChart() {
    const [mode, setMode] = useState('DAY');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    const [statusId, setStatusId] = useState(14); // default trạng thái

    useEffect(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');

        setDateFrom(`${yyyy}-${mm}-${dd}`);
        setDateTo(`${yyyy}-${mm}-${dd}`);
        setMonth(mm);
        setYear(yyyy);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => fetchData(), 300);
        return () => clearTimeout(timer);
    }, [mode, dateFrom, dateTo, month, year, statusId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = getCookie('token');
            let res;

            if (mode === 'DAY') {
                res = await axios.get(`${API_BASE_URL}/admin/statistic/orderOfDay/`, {
                    params: { dateFrom, dateTo, id_status: statusId },
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else if (mode === 'MONTH') {
                res = await axios.get(`${API_BASE_URL}/admin/statistic/orderOfMonth/`, {
                    params: { currentMonth: month, id_status: statusId },
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                res = await axios.get(`${API_BASE_URL}/admin/statistic/orderOfYear/`, {
                    params: { currentYear: year, id_status: statusId },
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            setData([
                {
                    label:
                        mode === 'DAY'
                            ? `${dateFrom} → ${dateTo}`
                            : mode === 'MONTH'
                              ? `Tháng ${month}`
                              : `Năm ${year}`,
                    orders: res.data.data,
                },
            ]);
        } catch (err) {
            console.error('Fetch error:', err);
        }
        setLoading(false);
    };

    return (
        <div className="w-full h-full flex justify-center p-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-5xl p-8 rounded-3xl shadow-lg border border-orange-400/30 bg-[#0f1f36]"
            >
                <h2 className="text-4xl font-bold text-orange-400 tracking-tight mb-6">Order Statistics Dashboard</h2>

                <div className="flex items-center gap-3 mb-7">
                    {['DAY', 'MONTH', 'YEAR'].map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition
                                ${
                                    mode === m
                                        ? 'bg-orange-500 text-white'
                                        : 'text-gray-200 border border-gray-700 hover:border-orange-400 hover:text-orange-400'
                                }`}
                        >
                            {m === 'DAY' ? 'Theo ngày' : m === 'MONTH' ? 'Theo tháng' : 'Theo năm'}
                        </button>
                    ))}
                </div>

                {/* Filter lựa chọn date/month/year */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 items-center mb-8">
                    {mode === 'DAY' && (
                        <>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="px-3 py-2 bg-white/15 border border-orange-500/20 rounded-xl text-gray-100"
                            />
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="px-3 py-2 bg-white/15 border border-orange-500/20 rounded-xl text-gray-100"
                            />
                        </>
                    )}

                    {mode === 'MONTH' && (
                        <input
                            type="number"
                            min="1"
                            max="12"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="px-3 py-2 bg-white/15 border border-orange-500/20 rounded-xl text-gray-100"
                        />
                    )}

                    {mode === 'YEAR' && (
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="px-3 py-2 bg-white/15 border border-orange-500/20 rounded-xl text-gray-100"
                        />
                    )}

                    {/* Chọn trạng thái đơn */}
                    <select
                        value={statusId}
                        onChange={(e) => setStatusId(e.target.value)}
                        className="border rounded px-3 py-2 bg-[#0f1f36] text-white"
                    >
                        {/* Thêm trạng thái mới */}
                        <option value="8">COMPLETED</option>
                        <option value="9">INCOMPLETE</option>
                        <option value="14">CANCE</option>
                    </select>
                </motion.div>

                <div className="w-full h-[360px] bg-[#0f1f36] rounded-3xl p-4 border border-white/10">
                    {loading ? (
                        <div className="text-center text-orange-400">Đang tải...</div>
                    ) : data.length === 0 ? (
                        <div className="text-gray-400 text-center">Chưa có dữ liệu</div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a3f63" />
                                <XAxis dataKey="label" stroke="#fff" />
                                <YAxis stroke="#fff" />

                                <Legend wrapperStyle={{ color: '#fff' }} />

                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{
                                        background: '#0f1f36',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        borderRadius: '10px',
                                    }}
                                    labelStyle={{ color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />

                                <Bar
                                    dataKey="orders"
                                    name="Số đơn hàng"
                                    fill="#F97316"
                                    stroke="#F97316"
                                    strokeWidth={2}
                                    radius={[10, 10, 0, 0]}
                                >
                                    <LabelList
                                        dataKey="orders"
                                        position="top"
                                        formatter={(v) => v.toLocaleString()}
                                        style={{
                                            fill: '#fff',
                                            fontWeight: 600,
                                            textShadow: '0px 0px 6px rgba(0,0,0,0.8)',
                                        }}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
