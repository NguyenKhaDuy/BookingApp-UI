import formatDate from "../../../utils/formatDate";
export default function RepairRequestDetail({ data, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[700px] rounded-xl shadow-lg p-6 relative">
                <h2 className="text-xl font-semibold mb-4">Chi tiết đơn hàng</h2>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <b>Khách hàng:</b> {data.customer.full_name}
                    </div>
                    <div>
                        <b>SĐT:</b> {data.customer.phone_number}
                    </div>
                    <div>
                        <b>Dịch vụ:</b> {data.name_service}
                    </div>
                    <div>
                        <b>Trạng thái:</b> {data.status_code}
                    </div>
                    <div>
                        <b>Ngày hẹn:</b> {formatDate(data.scheduled_date)}
                    </div>
                    <div>
                        <b>Giờ hẹn:</b> {data.scheduled_time}
                    </div>
                    <div className="col-span-2">
                        <b>Địa chỉ:</b> {data.location}
                    </div>
                    <div className="col-span-2">
                        <b>Mô tả:</b> {data.description}
                    </div>
                </div>

                {/* Hình ảnh */}
                {data.image_request?.length > 0 && (
                    <div className="mt-4">
                        <b>Hình ảnh đính kèm</b>
                        <div className="flex gap-3 mt-2">
                            {data.image_request.map((img, i) => (
                                <img
                                    key={i}
                                    src={`data:image/jpeg;base64,${img}`}
                                    className="w-24 h-24 object-cover rounded border"
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-6 text-right">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
