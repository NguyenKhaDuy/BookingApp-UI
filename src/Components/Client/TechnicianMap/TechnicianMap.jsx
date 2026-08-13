import { useEffect, useState } from 'react';
import { MapPin, CheckCircle } from 'lucide-react';

export default function TechnicianMap({ locations = [] }) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        setSelectedIndex(0);
    }, [locations]);

    if (!locations || locations.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center">
                        <MapPin className="text-orange-500" size={24} />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Khu vực làm việc</h2>

                        <p className="text-sm text-gray-500">Chưa có thông tin khu vực làm việc</p>
                    </div>
                </div>

                <div className="h-40 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <span className="text-gray-500">Kỹ thuật viên chưa cập nhật khu vực làm việc</span>
                </div>
            </div>
        );
    }

    const selectedLocation = locations[selectedIndex];

    // Tạo địa chỉ đầy đủ
    const address = [selectedLocation.ward, selectedLocation.district, selectedLocation.conscious]
        .filter(Boolean)
        .join(', ');

    
    const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

    // Click chọn khu vực
    const handleSelectLocation = (index) => {
        setSelectedIndex(index);
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-md">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center">
                        <MapPin className="text-orange-500" size={24} />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Khu vực làm việc</h2>

                        <p className="text-sm text-gray-500">Kỹ thuật viên nhận sửa chữa tại các khu vực</p>
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-xl">
                    <MapPin size={16} className="text-orange-500" />

                    <span className="text-sm font-medium text-orange-600">{locations.length} khu vực</span>
                </div>
            </div>

            {/* DANH SÁCH KHU VỰC */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {locations.map((location, index) => {
                    const locationName = [location.ward, location.district, location.conscious]
                        .filter(Boolean)
                        .join(', ');

                    const isSelected = selectedIndex === index;

                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleSelectLocation(index)}
                            className={`
                                w-full
                                text-left
                                p-4
                                rounded-2xl
                                border-2
                                transition-all
                                ${
                                    isSelected
                                        ? 'border-orange-500 bg-orange-50 shadow-sm'
                                        : 'border-gray-100 bg-gray-50 hover:border-orange-300 hover:bg-orange-50/50'
                                }
                            `}
                        >
                            <div className="flex items-start gap-3">
                                {/* ICON */}
                                <div
                                    className={`
                                        shrink-0
                                        w-10
                                        h-10
                                        rounded-xl
                                        flex
                                        items-center
                                        justify-center
                                        ${isSelected ? 'bg-orange-500 text-white' : 'bg-white text-orange-500'}
                                    `}
                                >
                                    <MapPin size={20} />
                                </div>

                                {/* ĐỊA CHỈ */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <span
                                            className={`
                                                text-sm font-semibold
                                                ${isSelected ? 'text-orange-700' : 'text-gray-800'}
                                            `}
                                        >
                                            Khu vực {index + 1}
                                        </span>

                                        {isSelected && <CheckCircle size={18} className="text-orange-500 shrink-0" />}
                                    </div>

                                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{locationName}</p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* ĐỊA CHỈ ĐANG CHỌN */}
            <div className="mb-4 p-4 rounded-2xl bg-orange-50 border border-orange-100">
                <div className="flex items-center gap-2 mb-1">
                    <MapPin size={18} className="text-orange-500" />

                    <span className="text-sm font-medium text-gray-500">Đang xem vị trí</span>
                </div>

                <p className="font-semibold text-gray-800">{address}</p>
            </div>

            {/* GOOGLE MAP */}
            <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden border shadow-inner">
                <iframe
                    key={address}
                    title={`Bản đồ ${address}`}
                    src={mapUrl}
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                />
            </div>
        </div>
    );
}
