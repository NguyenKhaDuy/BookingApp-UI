import { Wrench, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import getCookie from '../../../utils/getToken';
import { useToast } from '../../../Context/ToastContext';
import LoadingOverlay from '../../../Layouts/LoadingOverLay/LoadingOverlay';

export default function LocationManager() {
    const [allLocations, setAllLocations] = useState([]);
    const [techLocations, setTechLocations] = useState([]);
    const [selected, setSelected] = useState(null);
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    // === Lấy full vị trí ===
    useEffect(() => {
        fetch('http://localhost:8082/api/location/')
            .then((res) => res.json())
            .then((res) => {
                if (res.data) {
                    const list = res.data.map((l) => ({
                        id: l.id_location,
                        name: `${l.ward} - ${l.district} - ${l.conscious}`,
                    }));
                    setAllLocations(list);
                }
            })
            .catch((err) => console.error('Lỗi load vị trí tổng:', err));
    }, []);

    // === Lấy id_user ===
    const getTechnicianId = () => {
        const localUser = localStorage.getItem('user');
        if (!localUser) return null;
        return JSON.parse(localUser).id_user;
    };

    const token = getCookie('token');
    const id_user = getTechnicianId();

    // === Lấy vị trí của thợ ===
    const loadTechLocations = () => {
        fetch(`http://localhost:8082/api/technician/profile/location/id=${id_user}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.data) {
                    const list = res.data.map((l) => ({
                        id: l.id_location,
                        name: `${l.ward} - ${l.district} - ${l.conscious}`,
                    }));
                    setTechLocations(list);
                }
            })
            .catch((err) => console.error('Lỗi load vị trí thợ:', err));
    };

    useEffect(() => {
        if (id_user) {
            loadTechLocations();
        }
    }, [id_user]);

    // === Thêm vị trí (POST) ===
    const addLocation = async () => {
        if (selected === null) {
            showToast('Vui lòng chọn vị trí trước!', 'error');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('http://localhost:8082/api/technician/profile/location/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_user: id_user,
                    id_location: selected,
                }),
            });

            const json = await res.json();
            if (!res.ok) throw json?.message || 'Lỗi API';

            showToast('Thêm vị trí thành công!', 'success');
            await loadTechLocations();
        } catch (err) {
            showToast('Lỗi thêm vị trí: ' + err, 'error');
        } finally {
            setLoading(false);
        }
    };

    // === Xóa vị trí (DELETE) ===
    const deleteLocation = async () => {
        if (selected === null) {
            showToast('Vui lòng chọn vị trí để xóa!', 'error');
            return;
        }

        // Kiểm tra xem selected có nằm trong danh sách vị trí của thợ không
        const exists = techLocations.some((l) => l.id === selected);
        if (!exists) {
            showToast('Vị trí này chưa thuộc thợ nên không thể xóa!', 'warning');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('http://localhost:8082/api/technician/profile/location/', {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_user: id_user,
                    id_location: selected,
                }),
            });

            const json = await res.json();
            if (!res.ok) throw json?.message || 'Lỗi API';

            showToast('Xóa vị trí thành công!', 'success');

            await loadTechLocations(); // load lại danh sách thợ

            // reset select nếu vị trí vừa xóa là đang select
            setSelected(null);
        } catch (err) {
            showToast('Lỗi xóa vị trí: ' + err, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Quản lý vị trí</h2>
            </div>

            <div className="grid grid-cols-3 gap-5">
                {/* LIST vị trí của thợ */}
                <div className="col-span-1 bg-white border rounded-xl shadow p-3">
                    <h3 className="font-semibold mb-3">Vị trí của thợ</h3>

                    <div className="flex flex-wrap gap-2">
                        {techLocations.map((l) => (
                            <button
                                key={l.id}
                                onClick={() => setSelected(l.id)}
                                className={`px-4 py-2 rounded-full text-sm border transition 
                                    ${
                                        selected === l.id
                                            ? 'bg-orange-500 text-white border-orange-500'
                                            : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                                    }
                                `}
                            >
                                {l.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* EDIT PANEL */}
                <div className="col-span-2 p-5 bg-white border rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <Wrench className="text-orange-500" />
                        <span className="font-medium">
                            {selected !== null
                                ? techLocations.find((l) => l.id === selected)?.name || 'Vị trí mới'
                                : 'Chưa chọn'}
                        </span>
                    </div>

                    {/* Select vị trí tổng */}
                    <select
                        value={selected ?? ''}
                        onChange={(e) => {
                            const id = Number(e.target.value);
                            setSelected(id > 0 ? id : null);
                        }}
                        className="w-full p-4 rounded-xl border border-gray-300 outline-orange-500 mb-4 cursor-pointer pr-8"
                    >
                        <option value="">Chọn vị trí</option>

                        {allLocations.map((l) => (
                            <option key={l.id} value={l.id}>
                                {l.name}
                            </option>
                        ))}
                    </select>

                    <div className="flex gap-3 mb-4">
                        <button
                            onClick={addLocation}
                            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                        >
                            <Plus size={18} /> Thêm vị trí
                        </button>

                        <button
                            onClick={deleteLocation}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
                        >
                            <Trash2 size={18} /> Xóa
                        </button>
                    </div>

                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-lg">
                        <span className="text-gray-600">[ Location Preview ]</span>
                    </div>
                </div>
            </div>
            <LoadingOverlay show={loading} />
        </div>
    );
}
