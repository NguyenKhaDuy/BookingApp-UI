import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, Edit3, Trash, Wifi, WifiOff, Plus, Moon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import getCookie from '../../../utils/getToken';
import { useToast } from '../../../Context/ToastContext';

export default function TechnicianScheduleList() {
    const { showToast } = useToast();

    const getTechnicianId = () => {
        const localUser = localStorage.getItem('user');
        if (!localUser) return null;
        return JSON.parse(localUser).id_user;
    };

    const technicianId = getTechnicianId();
    const token = getCookie('token');

    const [schedules, setSchedules] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const emptyForm = { date: '', start: '', end: '', status: 'OFFLINE' };
    const [form, setForm] = useState(emptyForm);

    const fetchSchedules = async (pageNo) => {
        try {
            const res = await axios.get(
                `http://localhost:8081/api/technician/schedule/id-technician=${technicianId}?pageNo=${pageNo}`,
                { headers: { Authorization: `Bearer ${token}` } },
            );

            const { data, current_page, total_page } = res.data;

            const mapped = data.map((item) => {
                const [year, month, day] = item.date;
                const [startHour, startMin] = item.time_start;
                const [endHour, endMin] = item.time_end;

                return {
                    id: item.idSchedule,
                    date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                    start: `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`,
                    end: `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`,
                    status: item.status_code,
                    overnight: endHour < startHour,
                };
            });

            setSchedules(mapped);
            setPage(current_page);
            setTotalPage(total_page);
        } catch (err) {
            console.error('Lỗi fetch schedule:', err);
        }
    };

    useEffect(() => {
        fetchSchedules(page);
    }, [page]);

    const openAddModal = () => {
        setEditData(null);
        setForm(emptyForm);
        setModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditData(item);
        setForm({ date: item.date, start: item.start, end: item.end, status: item.status });
        setModalOpen(true);
    };

    const handleSave = async () => {
        const payload = {
            id_schedule: editData ? editData.id : null,
            date: form.date,
            time_start: form.start + ':00',
            time_end: form.end + ':00',
            user_id: technicianId,
        };

        try {
            if (editData) {
                await axios.put(`http://localhost:8081/api/technician/schedule/`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                showToast('Cập nhật lịch thành công!', 'success');
            } else {
                await axios.post(`http://localhost:8081/api/technician/schedule/`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                showToast('Thêm lịch mới thành công!', 'success');
            }

            setModalOpen(false);
            setEditData(null);
            fetchSchedules(page);
        } catch (err) {
            console.error('Lỗi khi lưu:', err);
            showToast('Lưu thất bại!', 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/api/technician/schedule/id-schedule=${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            showToast('Xóa lịch thành công!', 'success');
            fetchSchedules(page);
        } catch (err) {
            console.error('Lỗi khi xóa:', err);
            showToast('Xóa thất bại!', 'error');
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
                    <Calendar size={22} /> Lịch làm việc
                </h1>

                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm w-full sm:w-auto justify-center"
                >
                    <Plus size={18} /> Thêm lịch
                </button>
            </div>

            <div className="space-y-4">
                {schedules.map((item) => (
                    <div
                        key={item.id}
                        className="border rounded-xl p-4 bg-white shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
                    >
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-800 font-medium">
                                <Calendar size={18} /> {new Date(item.date).toLocaleDateString('vi-VN')}
                            </div>

                            <div className="flex items-center gap-2 text-gray-900">
                                <Clock size={18} />
                                {item.start} – {item.end}
                                {item.overnight && (
                                    <span className="text-orange-500 flex items-center gap-1 text-sm">
                                        <Moon size={15} /> (qua đêm)
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex sm:flex-col justify-between sm:justify-end sm:text-right items-center gap-3 w-full sm:w-auto">
                            <div
                                className={`flex items-center gap-1 text-sm font-semibold ${item.status === 'ONLINE' ? 'text-green-600' : 'text-gray-500'}`}
                            >
                                {item.status === 'ONLINE' ? <Wifi size={18} /> : <WifiOff size={18} />}
                                {item.status}
                            </div>

                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => openEditModal(item)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                >
                                    <Edit3 size={18} />
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(item.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                >
                                    <Trash size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-center mt-6 gap-2">
                <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                    <ChevronLeft size={18} /> <span>Trước</span>
                </button>

                {[...Array(totalPage)].map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === page;
                    return (
                        <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={
                                'min-w-[36px] px-3 py-1 rounded transition font-semibold flex items-center justify-center ' +
                                (isActive
                                    ? 'bg-orange-500 text-white shadow'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100')
                            }
                        >
                            {pageNum}
                        </button>
                    );
                })}

                <button
                    disabled={page >= totalPage}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                    <span>Sau</span> <ChevronRight size={18} />
                </button>
            </div>

            {/* MODAL THÊM / SỬA */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-md rounded-xl p-5 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">{editData ? 'Cập nhật lịch' : 'Thêm lịch mới'}</h2>
                            <button onClick={() => setModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-sm">Ngày làm</label>
                                <input
                                    type="date"
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={form.date}
                                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="text-sm">Giờ bắt đầu</label>
                                    <input
                                        type="time"
                                        className="w-full border rounded-lg px-3 py-2"
                                        value={form.start}
                                        onChange={(e) => setForm({ ...form, start: e.target.value })}
                                    />
                                </div>

                                <div className="flex-1">
                                    <label className="text-sm">Giờ kết thúc</label>
                                    <input
                                        type="time"
                                        className="w-full border rounded-lg px-3 py-2"
                                        value={form.end}
                                        onChange={(e) => setForm({ ...form, end: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSave}
                                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL XÁC NHẬN DELETE */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-5 w-full max-w-sm shadow-lg">
                        <h3 className="text-lg font-semibold mb-3">Xóa lịch làm việc</h3>
                        <p className="text-sm text-gray-600 mb-5">
                            Bạn có chắc chắn muốn xóa lịch này? Hành động này không thể hoàn tác.
                        </p>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                                Hủy
                            </button>

                            <button
                                onClick={() => {
                                    handleDelete(confirmDelete);
                                    setConfirmDelete(null);
                                }}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
