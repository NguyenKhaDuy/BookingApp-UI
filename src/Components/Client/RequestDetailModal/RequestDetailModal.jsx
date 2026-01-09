import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import getCookie from '../../../utils/getToken';

export default function RequestDetailModal({ open, requestId, onClose }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open || !requestId) return;

        setLoading(true);
        setData(null);

        const token = getCookie('token');

        axios
            .get(`http://localhost:8081/api/request/id=${requestId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setData(res.data.data);
            })
            .catch((err) => {
                console.error('Lỗi load chi tiết:', err);
            })
            .finally(() => setLoading(false));
    }, [open, requestId]);

    if (!open) return null;

    const customer = data?.customer;
    const technician = data?.technicicanDTO; // ✅ đúng BE
    const images = data?.image_request || []; // ✅ đúng BE

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[95%] md:w-[650px] max-h-[90vh] overflow-y-auto rounded-xl shadow-xl p-5 relative">
                {/* CLOSE */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-1 bg-gray-100 hover:bg-gray-200 rounded-full"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-semibold mb-4">Chi tiết yêu cầu #{data?.id_request}</h2>

                {/* LOADING */}
                {loading && <div className="text-center py-10">Đang tải dữ liệu...</div>}

                {/* DATA */}
                {!loading && data && (
                    <div className="space-y-5">
                        {/* SERVICE */}
                        <div>
                            <p className="font-medium">Dịch vụ:</p>
                            <p className="text-gray-700">{data.name_service}</p>
                        </div>

                        {/* STATUS */}
                        <div>
                            <p className="font-medium">Trạng thái:</p>
                            <span className="inline-block px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
                                {data.status_code}
                            </span>
                        </div>

                        {/* DESCRIPTION */}
                        <div>
                            <p className="font-medium">Mô tả:</p>
                            <p className="text-gray-700">{data.description}</p>
                        </div>

                        {/* CUSTOMER */}
                        {customer && (
                            <div>
                                <p className="font-medium">Khách hàng:</p>
                                <div className="flex items-center gap-3 mt-2">
                                    {customer.avatarBase64 ? (
                                        <img
                                            src={`data:image/jpeg;base64,${customer.avatarBase64}`}
                                            className="w-14 h-14 rounded-full border"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-gray-200" />
                                    )}

                                    <div>
                                        <p className="font-semibold">{customer.full_name}</p>
                                        <p className="text-sm text-gray-600">📞 {customer.phone_number}</p>
                                        <p className="text-sm text-gray-500">{customer.address}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TECHNICIAN */}
                        {technician && (
                            <div>
                                <p className="font-medium">Kỹ thuật viên:</p>
                                <div className="flex items-center gap-3 mt-2">
                                    {technician.avatarBase64 ? (
                                        <img
                                            src={`data:image/jpeg;base64,${technician.avatarBase64}`}
                                            className="w-14 h-14 rounded-full border"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-gray-200" />
                                    )}

                                    <div>
                                        <p className="font-semibold">{technician.full_name}</p>
                                        <p className="text-sm text-gray-600">📞 {technician.phone_number}</p>
                                        <p className="text-sm text-gray-500">
                                            Kinh nghiệm: {technician.experience_year} năm
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TIME */}
                        <div>
                            <p className="font-medium">Thời gian:</p>
                            <p className="text-gray-700">
                                {data.scheduled_date?.join('/')} &nbsp;
                                {data.scheduled_time?.join(':')}
                            </p>
                        </div>

                        {/* LOCATION */}
                        <div>
                            <p className="font-medium">Địa điểm:</p>
                            <p className="text-gray-700">{data.location}</p>
                        </div>

                        {/* IMAGES */}
                        {images.length > 0 && (
                            <div>
                                <p className="font-medium mb-2">Ảnh minh họa khách hàng gửi:</p>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {images.map((img, index) => (
                                        <img
                                            key={index}
                                            src={`data:image/jpeg;base64,${img}`}
                                            className="w-full h-32 object-cover rounded-lg border"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* FOOTER */}
                <div className="mt-6 text-right">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
