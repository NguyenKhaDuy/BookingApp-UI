import React, { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export default function BookingTechnicianForm() {
    const [form, setForm] = useState({
        description: '',
        location: '',
        id_customer: '',
        id_service: '',
    });

    const [scheduledDate, setScheduledDate] = useState(null);
    const [scheduledTime, setScheduledTime] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);

    const [images, setImages] = useState([]);
    const calendarRef = useRef(null);

    // 🟦 Demo danh sách dịch vụ — bạn đổi theo API backend
    const serviceList = [
        { id: 1, name: 'Sửa điện' },
        { id: 2, name: 'Sửa nước' },
        { id: 3, name: 'Sửa máy lạnh' },
        { id: 4, name: 'Sửa đồ gia dụng' },
    ];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // --- Image Upload ---
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 5) {
            alert('Tối đa 5 ảnh!');
            return;
        }
        setImages([...images, ...files]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    // --- Click outside calendar ---
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (calendarRef.current && !calendarRef.current.contains(e.target)) {
                setShowCalendar(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(form).forEach((key) => formData.append(key, form[key]));

        if (scheduledDate) {
            formData.append('scheduled_date', scheduledDate.toLocaleDateString('en-GB'));
        }
        if (scheduledTime) {
            formData.append('scheduled_time', scheduledTime + ':00');
        }

        images.forEach((file) => formData.append('imageRequest', file));

        try {
            const res = await fetch('https://your-server.com/api/request', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Lỗi gửi yêu cầu');
            alert('Đặt thợ thành công!');
        } catch (err) {
            alert('Gửi thất bại: ' + err.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border mt-10 relative">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Đặt thợ sửa chữa</h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Description */}
                <div>
                    <label className="font-semibold">Mô tả vấn đề</label>
                    <textarea
                        name="description"
                        className="w-full mt-2 p-3 border rounded-xl"
                        rows="3"
                        placeholder="Mô tả vấn đề..."
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Date + Time */}
                <div className="flex gap-5">
                    {/* DATE PICKER */}
                    <div className="flex-1 relative">
                        <label className="font-semibold">Ngày sửa</label>
                        <input
                            className="w-full mt-2 p-3 border rounded-xl"
                            placeholder="Chọn ngày"
                            readOnly
                            onClick={() => setShowCalendar(!showCalendar)}
                            value={scheduledDate ? scheduledDate.toLocaleDateString('vi-VN') : ''}
                        />

                        {showCalendar && (
                            <div
                                ref={calendarRef}
                                className="absolute z-50 bg-white shadow-lg p-3 border rounded-xl mt-2"
                            >
                                <DayPicker
                                    mode="single"
                                    selected={scheduledDate}
                                    onSelect={(d) => {
                                        setScheduledDate(d);
                                        setShowCalendar(false);
                                    }}
                                    fromDate={new Date()}
                                />
                            </div>
                        )}
                    </div>

                    {/* TIME PICKER */}
                    <div className="flex-1">
                        <label className="font-semibold">Giờ sửa</label>
                        <input
                            type="time"
                            className="w-full mt-2 p-3 border rounded-xl"
                            onChange={(e) => setScheduledTime(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className="font-semibold">Địa chỉ</label>
                    <input
                        type="text"
                        name="location"
                        className="w-full mt-2 p-3 border rounded-xl"
                        placeholder="Nhập địa chỉ sửa chữa"
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* ⭐ SERVICE SELECT BOX */}
                <div>
                    <label className="font-semibold">Chọn dịch vụ</label>
                    <select
                        name="id_service"
                        className="w-full mt-2 p-3 border rounded-xl"
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Chọn dịch vụ --</option>

                        {serviceList.map((service) => (
                            <option key={service.id} value={service.id}>
                                {service.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Images */}
                <div>
                    <label className="font-semibold">Ảnh yêu cầu sửa (tối đa 5)</label>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="mt-2" />
                </div>

                {/* Image Preview */}
                {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-3">
                        {images.map((img, index) => (
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
                    type="submit"
                    className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold text-lg hover:bg-orange-600"
                >
                    Gửi yêu cầu
                </button>
            </form>
        </div>
    );
}
