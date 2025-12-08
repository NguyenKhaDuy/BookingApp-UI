import { X } from 'lucide-react';

export default function RequestDetailModal({ open, onClose, data }) {
    if (!open || !data) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] md:w-[500px] rounded-xl shadow-xl p-5 relative animate-fadeIn">
                {/* Close button */}
                <button
                    className="absolute top-3 right-3 p-1 bg-gray-100 hover:bg-gray-200 rounded-full"
                    onClick={onClose}
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-semibold text-gray-800 mb-4">Chi tiết yêu cầu</h2>

                <div className="space-y-3 text-gray-700">
                    <div>
                        <p className="font-medium">Tên dịch vụ:</p>
                        <p>{data.name}</p>
                    </div>

                    <div>
                        <p className="font-medium">Khách hàng:</p>
                        <p>{data.customer}</p>
                    </div>

                    {data.technician && (
                        <div className="mt-3">
                            <p className="font-medium mb-2">Kỹ thuật viên:</p>
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border">
                                <img src={data.technician.avatar} className="w-14 h-14 rounded-full border" />
                                <div>
                                    <p className="font-semibold">{data.technician.name}</p>
                                    <p className="text-sm text-gray-600">SĐT: {data.technician.phone}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer buttons */}
                <div className="mt-5 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
                        Đóng
                    </button>
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                        Liên hệ ngay
                    </button>
                </div>
            </div>
        </div>
    );
}
