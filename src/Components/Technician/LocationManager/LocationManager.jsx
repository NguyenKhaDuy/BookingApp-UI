import { MapPin, Plus, Trash2, Check } from 'lucide-react';
import { useState } from 'react';

export default function LocationManager() {
    const [locations, setLocations] = useState(['123 Nguyễn Trãi, Hà Nội', '45 Lê Lợi, Đà Nẵng']);

    const [selected, setSelected] = useState(0);
    const [input, setInput] = useState(locations[0]);

    // Chọn vị trí
    const changeSelected = (index) => {
        setSelected(index);
        setInput(locations[index]);
    };

    // Thêm vị trí
    const addLocation = () => {
        setLocations([...locations, '']);
        setSelected(locations.length);
        setInput('');
    };

    // Cập nhật vị trí
    const updateLocation = () => {
        const updated = [...locations];
        updated[selected] = input;
        setLocations(updated);
    };

    // Xóa vị trí
    const deleteLocation = () => {
        if (locations.length === 1) return;
        const newList = locations.filter((_, i) => i !== selected);
        setLocations(newList);
        setSelected(0);
        setInput(newList[0]);
    };

    return (
        <div className="max-w-4xl">
            {/* Title + Add Button */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Quản lý vị trí</h2>

                <button
                    onClick={addLocation}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                >
                    <Plus size={18} /> Thêm vị trí
                </button>
            </div>

            <div className="grid grid-cols-3 gap-5">
                {/* LIST */}
                <div className="col-span-1 bg-white border rounded-xl shadow p-4">
                    <h3 className="font-semibold mb-3">Danh sách</h3>

                    <div className="space-y-2">
                        {locations.map((loc, index) => (
                            <div
                                key={index}
                                onClick={() => changeSelected(index)}
                                className={`p-2 rounded-lg cursor-pointer border
                                    ${selected === index ? 'bg-orange-100 border-orange-400' : 'hover:bg-orange-50'}`}
                            >
                                <span className="text-sm">{loc || 'Vị trí mới'}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* EDIT */}
                <div className="col-span-2 bg-white border rounded-xl shadow p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <MapPin className="text-orange-500" />
                        <span className="font-medium">{input || 'Vị trí mới'}</span>
                    </div>

                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full p-2 border rounded-lg mb-4"
                        placeholder="Nhập địa chỉ..."
                    />

                    <div className="flex gap-3 mb-4">
                        <button
                            onClick={updateLocation}
                            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg"
                        >
                            <Check size={18} /> Cập nhật
                        </button>

                        {locations.length > 0 && (
                            <button
                                onClick={deleteLocation}
                                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
                            >
                                <Trash2 size={18} /> Xóa
                            </button>
                        )}
                    </div>

                    <div className="w-full h-52 bg-gray-200 flex items-center justify-center rounded-lg">
                        <span className="text-gray-600">[ Google Map Preview ]</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
