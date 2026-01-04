import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ServiceSelect from '../../../Components/Client/ServiceSelect/ServiceSelect';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export default function BookingTechnicianForm() {
    const navigate = useNavigate();
    const calendarRef = useRef(null);
    const { idTech } = useParams();

    const [services, setServices] = useState([]);
    const [form, setForm] = useState({
        id_service: '',
        scheduled_date: '',
        scheduled_time: '',
        location: '',
        description: '',
    });
    const [showCalendar, setShowCalendar] = useState(false);
    const [image_request, setImages] = useState([]);

    // Fetch danh sách dịch vụ
    useEffect(() => {
        fetch('http://localhost:8081/api/service/all/')
            .then((res) => res.json())
            .then((data) => {
                if (data?.data) setServices(data.data);
            })
            .catch((err) => console.error('Fetch services error:', err));
    }, []);

    const getCustomerId = () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user).id_user : null;
    };

    const getCustomerName = () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user).full_name : null;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Chọn ngày từ DayPicker, format dd-mm-yyyy
    const handleDateSelect = (date) => {
        if (!date) return;
        const formatted = date.toLocaleDateString('en-GB').replace(/\//g, '-'); // dd-mm-yyyy
        setForm({ ...form, scheduled_date: formatted });
        setShowCalendar(false);
    };

    // Upload ảnh
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (image_request.length + files.length > 5) {
            alert('Tối đa 5 ảnh!');
            return;
        }
        setImages([...image_request, ...files]);
    };

    const removeImage = (index) => {
        setImages(image_request.filter((_, i) => i !== index));
    };

    // Click ngoài calendar để đóng
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (calendarRef.current && !calendarRef.current.contains(e.target)) {
                setShowCalendar(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Submit form
    const handleSubmit = () => {
        const token = localStorage.getItem('token');
        const idCustomer = getCustomerId();
        const nameCustomer = getCustomerName();

        if (!token || !idCustomer) {
            navigate('/login', { state: { from: '/' } });
            return;
        }

        if (!form.id_service || !form.scheduled_date || !form.scheduled_time || !form.location) {
            alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }

         let formData;

         if (idTech) {
             formData = {
                 id_service: Number(form.id_service),
                 id_customer: idCustomer,
                 id_technician: idTech,
                 name_customer: nameCustomer,
                 location: form.location,
                 description: form.description,
                 scheduled_date: form.scheduled_date,
                 scheduled_time: form.scheduled_time + ':00',
             };
         } else {
             formData = {
                 id_service: Number(form.id_service),
                 id_customer: idCustomer,
                 name_customer: nameCustomer,
                 location: form.location,
                 description: form.description,
                 scheduled_date: form.scheduled_date,
                 scheduled_time: form.scheduled_time + ':00',
             };
         }

        navigate('/request', {
            state: {
                formData,
                image_request,
            },
        });
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border mt-10 relative">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Đặt thợ sửa chữa</h2>

            <div className="space-y-6">
                {/* Mô tả */}
                <div>
                    <label className="font-semibold">Mô tả vấn đề</label>
                    <textarea
                        name="description"
                        className="w-full mt-2 p-4 border rounded-xl border border-gray-300 outline-orange-500"
                        rows="3"
                        placeholder="Mô tả vấn đề..."
                        value={form.description}
                        onChange={handleChange}
                    />
                </div>

                {/* Ngày + Giờ */}
                <div className="flex gap-5">
                    {/* Ngày */}
                    <div className="flex-1 relative">
                        <label className="font-semibold">Ngày sửa</label>
                        <input
                            className="w-full mt-2 p-4 border rounded-xl border border-gray-300 outline-orange-500"
                            placeholder="Chọn ngày"
                            readOnly
                            onClick={() => setShowCalendar(!showCalendar)}
                            value={form.scheduled_date || ''}
                        />
                        {showCalendar && (
                            <div
                                ref={calendarRef}
                                className="absolute z-50 bg-white shadow-lg p-3 border rounded-xl mt-2"
                            >
                                <DayPicker
                                    mode="single"
                                    selected={
                                        form.scheduled_date
                                            ? new Date(form.scheduled_date.split('-').reverse().join('-'))
                                            : undefined
                                    }
                                    onSelect={handleDateSelect}
                                    fromDate={new Date()}
                                />
                            </div>
                        )}
                    </div>

                    {/* Giờ */}
                    <div className="flex-1">
                        <label className="font-semibold">Giờ sửa</label>
                        <input
                            type="time"
                            className="w-full mt-2 p-4 border rounded-xl border border-gray-300 outline-orange-500"
                            name="scheduled_time"
                            value={form.scheduled_time}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Địa chỉ */}
                <div>
                    <label className="font-semibold">Địa chỉ</label>
                    <input
                        type="text"
                        name="location"
                        className="w-full mt-2 p-4 border rounded-xl border border-gray-300 outline-orange-500"
                        placeholder="Nhập địa chỉ sửa chữa"
                        value={form.location}
                        onChange={handleChange}
                    />
                </div>

                {/* Dịch vụ */}
                <ServiceSelect
                    services={services}
                    selectedService={form.id_service}
                    setSelectedService={(value) => setForm({ ...form, id_service: value })}
                />

                {/* Ảnh */}
                <div>
                    <label className="font-semibold">Ảnh yêu cầu sửa (tối đa 5)</label>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="mt-2" />
                </div>

                {/* Preview ảnh */}
                {image_request.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-3">
                        {image_request.map((img, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={URL.createObjectURL(img)}
                                    className="w-full h-32 object-cover rounded-xl border shadow"
                                    alt="preview"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-black/60 text-white px-2 rounded opacity-0 group-hover:opacity-100 transition"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold text-lg hover:bg-orange-600"
                >
                    Gửi yêu cầu
                </button>
            </div>
        </div>
    );
}
