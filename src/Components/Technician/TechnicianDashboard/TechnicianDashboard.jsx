import { useEffect, useState } from 'react';
import axios from 'axios';
import getCookie from '../../../utils/getToken';
import { API_BASE_URL } from '../../../utils/api';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, LabelList } from 'recharts';
import { motion } from 'framer-motion';
import { Legend } from 'recharts';
import LoadingOverlay from '../../../Layouts/LoadingOverLay/LoadingOverlay';
import { CalendarDays } from 'lucide-react';
export default function TechnicianDashboard() {
    const [statistic, setStatistic] = useState({
        month: 0,
        requestIncompleted: 0,
        requestReceiving: 0,
        requestCompleted: 0,
        requestReceived: 0,
        invoiceUnpaid: 0,
        invoicePaid: 0,
    });
    const [revenue, setRevenue] = useState({
        month: 0,
        totalRevenue: 0,
    });
    const [loading, setLoading] = useState(true);
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [revenueChart, setRevenueChart] = useState([]);
    const [requestChart, setRequestChart] = useState([]);

    useEffect(() => {
        fetchStatistic();
    }, []);

    useEffect(() => {
        fetchRevenueChart(selectedYear);
        fetchRequestChart(selectedYear);
    }, [selectedYear]);

    const fetchStatistic = async () => {
        try {
            const token = getCookie('token');

            const payload = JSON.parse(atob(token.split('.')[1]));
            const technicianId = payload.id;

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const [statisticRes, revenueRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/technician/statistic/request/idTechnician=${technicianId}`, { headers }),
                axios.get(`${API_BASE_URL}/technician/statistic/revenue/idTechnician=${technicianId}`, { headers }),
            ]);

            setStatistic(statisticRes.data);
            setRevenue(revenueRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRevenueChart = async (year = selectedYear) => {
        try {
            const token = getCookie('token');

            const payload = JSON.parse(atob(token.split('.')[1]));
            const technicianId = payload.id;

            const res = await axios.post(
                `${API_BASE_URL}/technician/statistic/revenue/`,
                {
                    year,
                    idTechnician: technicianId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const chartData = Array.from({ length: 12 }, (_, index) => {
                const item = res.data.revenueDTOS.find((x) => x.month === index + 1);

                return {
                    month: `T${index + 1}`,
                    revenue: item?.totalRevenue ?? 0,
                };
            });

            setRevenueChart(chartData);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRequestChart = async (year = selectedYear) => {
        try {
            const token = getCookie('token');

            const payload = JSON.parse(atob(token.split('.')[1]));
            const technicianId = payload.id;

            const res = await axios.post(
                `${API_BASE_URL}/technician/statistic/request/`,
                {
                    year,
                    idTechnician: technicianId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const chartData = Array.from({ length: 12 }, (_, index) => {
                const item = res.data.statisticTechnicianDTOS.find((x) => x.month === index + 1);

                return {
                    month: `T${index + 1}`,
                    receiving: item?.requestReceiving ?? 0,
                    received: item?.requestReceived ?? 0,
                    completed: item?.requestCompleted ?? 0,
                    incompleted: item?.requestIncompleted ?? 0,
                };
            });

            setRequestChart(chartData);
        } catch (err) {
            console.error(err);
        }
    };


    const formatMoney = (value) => {
        return Number(value || 0).toLocaleString('vi-VN') + ' đ';
    };
    const formatCurrency = (value) => {
        return Number(value || 0).toLocaleString('vi-VN') + ' ₫';
    };
    const formatAxisMoney = (value) => {
        return Number(value).toLocaleString('vi-VN');
    };

    return (
        <div>
            <div className="mb-8 flex items-center justify-between rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 p-6 text-white shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                        <CalendarDays size={30} />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold">Dashboard Kỹ thuật viên</h1>
                        <p className="mt-1 text-white/80">
                            Tổng quan hoạt động tháng <span className="font-semibold">{statistic.month}</span> /{' '}
                            {selectedYear}
                        </p>
                    </div>
                </div>

                <div className="rounded-xl bg-white/15 px-5 py-3 text-center backdrop-blur">
                    <p className="text-sm text-white/70">Thời gian</p>
                    <p className="text-xl font-bold">
                        {statistic.month}/{selectedYear}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 bg-white rounded-xl shadow">
                    <p className="text-gray-500">Đơn đang nhận</p>
                    <h2 className="text-3xl font-bold text-blue-500">{statistic.requestReceiving}</h2>
                </div>

                <div className="p-5 bg-white rounded-xl shadow">
                    <p className="text-gray-500">Đơn đã tiếp nhận</p>
                    <h2 className="text-3xl font-bold text-orange-500">{statistic.requestReceived}</h2>
                </div>

                <div className="p-5 bg-white rounded-xl shadow">
                    <p className="text-gray-500">Đơn chưa hoàn thành</p>
                    <h2 className="text-3xl font-bold text-red-500">{statistic.requestIncompleted}</h2>
                </div>

                <div className="p-5 bg-white rounded-xl shadow">
                    <p className="text-gray-500">Đơn đã hoàn thành</p>
                    <h2 className="text-3xl font-bold text-green-500">{statistic.requestCompleted}</h2>
                </div>

                <div className="p-5 bg-white rounded-xl shadow">
                    <p className="text-gray-500">Hóa đơn chưa thanh toán</p>
                    <h2 className="text-3xl font-bold text-yellow-500">{statistic.invoiceUnpaid}</h2>
                </div>

                <div className="p-5 bg-white rounded-xl shadow">
                    <p className="text-gray-500">Hóa đơn đã thanh toán</p>
                    <h2 className="text-3xl font-bold text-emerald-500">{statistic.invoicePaid}</h2>
                </div>
                <div className="p-5 bg-white rounded-xl shadow">
                    <p className="text-gray-500">Doanh thu tháng {revenue.month}</p>
                    <h2 className="text-3xl font-bold text-indigo-600">{formatCurrency(revenue.totalRevenue)}</h2>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 w-full rounded-3xl shadow-lg border border-orange-400/30 bg-[#0f1f36] p-8"
            >
                <div className="flex justify-between items-center mb-7">
                    <h2 className="text-3xl font-bold text-orange-400">Doanh thu theo tháng</h2>

                    <select
                        value={selectedYear}
                        onChange={(e) => {
                            setSelectedYear(Number(e.target.value));
                        }}
                        className="bg-white/10 border border-orange-400/30 rounded-xl px-4 py-2 text-white outline-none"
                    >
                        {Array.from({ length: 5 }, (_, i) => currentYear - i).map((year) => (
                            <option key={year} value={year} className="text-black">
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-full h-[420px] rounded-3xl border border-white/10 bg-[#0f1f36] p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueChart}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a3f63" />

                            <XAxis dataKey="month" stroke="#fff" />

                            <YAxis stroke="#fff" tickFormatter={formatAxisMoney} />

                            <Legend wrapperStyle={{ color: '#fff' }} />

                            <Tooltip
                                cursor={{
                                    fill: 'rgba(255,255,255,0.05)',
                                }}
                                formatter={(value) => formatMoney(value)}
                                contentStyle={{
                                    background: '#0f1f36',
                                    border: '1px solid rgba(255,255,255,.3)',
                                    borderRadius: '10px',
                                }}
                                labelStyle={{
                                    color: '#fff',
                                }}
                                itemStyle={{
                                    color: '#fff',
                                }}
                            />

                            <Bar
                                dataKey="revenue"
                                name="Doanh thu"
                                fill="#F97316"
                                stroke="#F97316"
                                strokeWidth={2}
                                radius={[10, 10, 0, 0]}
                                maxBarSize={60}
                            >
                                <LabelList
                                    dataKey="revenue"
                                    position="top"
                                    formatter={(v) => (v === 0 ? '' : formatMoney(v))}
                                    style={{
                                        fill: '#fff',
                                        fontWeight: 600,
                                        fontSize: 12,
                                        textShadow: '0px 0px 6px rgba(0,0,0,.8)',
                                    }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 rounded-3xl shadow-lg border border-blue-400/30 bg-[#0f1f36] p-8"
            >
                <h2 className="text-3xl font-bold text-orange-400 mb-6">Thống kê đơn theo tháng</h2>

                <div className="h-[450px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={requestChart}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a3f63" />

                            <XAxis dataKey="month" stroke="#fff" />

                            <YAxis stroke="#fff" />

                            <Legend wrapperStyle={{ color: '#fff' }} />

                            <Tooltip
                                contentStyle={{
                                    background: '#0f1f36',
                                    border: '1px solid rgba(255,255,255,.3)',
                                    borderRadius: '10px',
                                }}
                                labelStyle={{
                                    color: '#fff',
                                }}
                                itemStyle={{
                                    color: '#fff',
                                }}
                            />

                            <Bar dataKey="received" name="Đã tiếp nhận" fill="#3B82F6" radius={[6, 6, 0, 0]} />

                            <Bar dataKey="receiving" name="Đang nhận" fill="#F59E0B" radius={[6, 6, 0, 0]} />

                            <Bar dataKey="completed" name="Hoàn thành" fill="#22C55E" radius={[6, 6, 0, 0]} />

                            <Bar dataKey="incompleted" name="Chưa hoàn thành" fill="#EF4444" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
            <LoadingOverlay show={loading} />
        </div>
    );
}
