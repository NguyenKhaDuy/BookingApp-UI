import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceSelect from '../ServiceSelect/ServiceSelect';
import { useToast } from '../../../Context/ToastContext';
import getCookie from '../../../utils/getToken';
import { API_BASE_URL } from '../../../utils/api.js';

export default function QuickBooking() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        id_service: '',
        scheduled_date: '',
        scheduled_time: '',
        location: '',
        description: '',
    });

    useEffect(() => {
        fetch(`${API_BASE_URL}/service/all/`)
            .then((res) => res.json())
            .then((data) => {
                if (data?.data) {
                    setServices(data.data);
                }
            })
            .catch((err) => console.error('Fetch services error:', err));
    }, []);

    const getCustomerId = () => {
        const user = localStorage.getItem('user');

        if (!user) return null;

        try {
            return JSON.parse(user).id_user;
        } catch (error) {
            console.error('User data không hợp lệ:', error);
            return null;
        }
    };

    const getCustomerName = () => {
        const user = localStorage.getItem('user');

        if (!user) return null;

        try {
            return JSON.parse(user).full_name;
        } catch (error) {
            console.error('User data không hợp lệ:', error);
            return null;
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        const token = getCookie('token');
        const idCustomer = getCustomerId();
        const nameCustomer = getCustomerName();

        if (!token || !idCustomer) {
            showToast('Vui lòng đăng nhập để đặt lịch!', 'warning');

            navigate('/login', {
                state: {
                    from: '/',
                },
            });

            return;
        }

        if (!form.id_service || !form.scheduled_date || !form.scheduled_time || !form.location) {
            showToast('Vui lòng nhập đầy đủ thông tin', 'error');
            return;
        }

        const formData = {
            id_service: Number(form.id_service),
            id_customer: idCustomer,
            name_customer: nameCustomer,
            location: form.location,
            description: form.description,

            scheduled_date: form.scheduled_date.split('-').reverse().join('-'),

            scheduled_time: `${form.scheduled_time}:00`,
        };

        navigate('/request', {
            state: {
                formData,
            },
        });
    };

    return (
        <section className="py-24 bg-gray-50" id="quick-booking">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-10">Đặt Lịch Nhanh</h2>

                <div className="bg-white shadow-xl rounded-3xl p-10 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Dịch vụ */}
                        <ServiceSelect
                            services={services}
                            selectedService={form.id_service}
                            setSelectedService={(value) =>
                                setForm({
                                    ...form,
                                    id_service: value,
                                })
                            }
                        />

                        {/* Ngày hiển thị */}
                        <input
                            type="text"
                            readOnly
                            value={
                                form.scheduled_date
                                    ? new Date(form.scheduled_date + 'T00:00:00').toLocaleDateString('vi-VN')
                                    : ''
                            }
                            placeholder="Chọn ngày sửa chữa"
                            onClick={(e) => {
                                const dateInput = e.currentTarget.nextElementSibling;

                                if (dateInput?.showPicker) {
                                    dateInput.showPicker();
                                } else {
                                    dateInput?.click();
                                }
                            }}
                            className="w-full p-4 rounded-xl 
                            border border-gray-300 
                            focus:border-orange-500 
                            focus:ring-2 focus:ring-orange-300 
                            outline-none transition cursor-pointer"
                        />

                        {/* Input date thật */}
                        <input
                            type="date"
                            name="scheduled_date"
                            value={form.scheduled_date || ''}
                            onChange={(e) => {
                                setForm((prev) => ({
                                    ...prev,
                                    scheduled_date: e.target.value,
                                }));
                            }}
                            className="absolute opacity-0 
                            w-0 h-0 pointer-events-none"
                        />

                        {/* Giờ */}
                        <input
                            type="time"
                            name="scheduled_time"
                            value={form.scheduled_time}
                            onChange={handleChange}
                            className="p-4 rounded-xl border border-gray-300 outline-orange-500"
                        />

                        {/* Địa chỉ */}
                        <input
                            type="text"
                            name="location"
                            placeholder="Địa chỉ"
                            value={form.location}
                            onChange={handleChange}
                            className="p-4 rounded-xl border border-gray-300 outline-orange-500 md:col-span-2"
                        />

                        {/* Mô tả */}
                        <textarea
                            name="description"
                            placeholder="Mô tả vấn đề"
                            value={form.description}
                            onChange={handleChange}
                            className="p-4 rounded-xl border border-gray-300 outline-orange-500 md:col-span-2 h-32"
                        />
                    </div>

                    {/* Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`mt-8 w-full py-4 rounded-xl text-lg font-semibold transition shadow-md
                            ${
                                loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                            }`}
                    >
                        {loading ? 'Đang xử lý...' : 'Đặt Lịch Ngay'}
                    </button>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4">
                        <div className="w-14 h-14 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>

                        <span className="text-gray-700 font-medium">Đang xử lý, vui lòng chờ...</span>
                    </div>
                </div>
            )}
        </section>
    );
}
