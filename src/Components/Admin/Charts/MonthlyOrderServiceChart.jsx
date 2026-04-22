import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
    BarChart,
    Bar,
    LabelList,
} from 'recharts';
import getCookie from '../../../utils/getToken';
import {API_BASE_URL} from '../../../utils/api.js';

export default function MonthlyOrderStatistic() {
    const [tab, setTab] = useState('MONTH');
    const [year, setYear] = useState(new Date().getFullYear());
    const [status, setStatus] = useState(8);

    const [dataMonth, setDataMonth] = useState([]);
    const [dataService, setDataService] = useState([]);

    const statusList = [
        { id: 8, label: 'COMPLETED' },
        { id: 9, label: 'INCOMPLETE' },
        { id: 14, label: 'CANCE' },
    ];

    const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

    const fetchMonthly = async () => {
        const res = await axios.get(`${API_BASE_URL}/admin/statistic/monthlyOrder/`, {
            params: { year, id_status: status },
            headers: { Authorization: `Bearer ${getCookie('token')}` },
        });
        setDataMonth(res.data);
    };

    const fetchService = async () => {
        const res = await axios.get(`${API_BASE_URL}/admin/statistic/monthlyOrderOfService/`, {
            params: { year, id_status: status },
            headers: { Authorization: `Bearer ${getCookie('token')}` },
        });
        setDataService(res.data);
    };
    console.log(dataMonth)


    useEffect(() => {
        if (tab === 'MONTH') fetchMonthly();
        else fetchService();
    }, [tab, year, status]);

    return (
        <div className="w-full bg-[#0f1f36] text-white p-6 rounded-2xl border border-white/10">
            <h2 className="text-3xl font-bold text-orange-400 mb-6">Thống kê số lượng đơn</h2>

            <div className="flex items-center gap-3 mb-5">
                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="px-3 py-2 rounded bg-[#1a2a44] border border-white/10"
                >
                    {years.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-3 py-2 rounded bg-[#1a2a44] border border-white/10"
                >
                    {statusList.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.label}
                        </option>
                    ))}
                </select>

                <div className="flex gap-2 ml-auto">
                    <button
                        className={`px-4 py-2 rounded ${tab === 'MONTH' ? 'bg-orange-500' : 'bg-[#1a2a44]'}`}
                        onClick={() => setTab('MONTH')}
                    >
                        Theo tháng
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${tab === 'SERVICE' ? 'bg-orange-500' : 'bg-[#1a2a44]'}`}
                        onClick={() => setTab('SERVICE')}
                    >
                        Theo dịch vụ
                    </button>
                </div>
            </div>

            <div className="w-full h-[400px]">
                {tab === 'MONTH' &&
                    (dataMonth.length <= 0 ? (
                        <h1>Không có dữ liệu</h1>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dataMonth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="month" stroke="#ddd" />
                                <YAxis stroke="#ddd" />
                                <Tooltip
                                    contentStyle={{ background: '#1e1e1e', border: '1px solid #F97316' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Legend />
                                <Line
                                    dataKey="totalRequest"
                                    name="Tổng đơn"
                                    stroke="#F97316"
                                    strokeWidth={3}
                                    dot={{ fill: '#F97316', strokeWidth: 2, r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ))}

                {tab === 'SERVICE' &&
                    (dataService.length <= 0 ? (
                        <h1>Không có dữ liệu</h1>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={dataService} margin={{ left: 80 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis type="number" stroke="#ddd" />
                                <YAxis dataKey="serviceName" type="category" width={150} stroke="#ddd" />
                                <Tooltip
                                    contentStyle={{ background: '#1e1e1e', border: '1px solid #F97316' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Legend />
                                <Bar dataKey="totalRequest" name="Số yêu cầu" fill="#F97316" radius={[0, 10, 10, 0]}>
                                    <LabelList dataKey="totalRequest" position="right" style={{ fill: '#fff' }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ))}
            </div>
        </div>
    );
}
