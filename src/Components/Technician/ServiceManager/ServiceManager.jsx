import { Briefcase, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import getCookie from '../../../utils/getToken';
import { useToast } from '../../../Context/ToastContext';
import LoadingOverlay from '../../../Layouts/LoadingOverLay/LoadingOverlay';

export default function ServiceManager() {
    const [allServices, setAllServices] = useState([]);
    const [techServices, setTechServices] = useState([]);
    const [selected, setSelected] = useState(null);

    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    // =========================
    // GET TECHNICIAN ID
    // =========================
    const getTechnicianId = () => {
        const localUser = localStorage.getItem('user');
        if (!localUser) return null;

        return JSON.parse(localUser).id_user;
    };

    const token = getCookie('token');
    const id_user = getTechnicianId();

    // LOAD ALL SERVICES
    useEffect(() => {
        fetch('http://localhost:8082/api/service/all/')
            .then((res) => res.json())
            .then((res) => {
                if (res.data) {
                    const list = res.data.map((s) => ({
                        id: s.id_service,
                        name: s.name_service,
                    }));

                    setAllServices(list);
                }
            })
            .catch((err) => console.error('Lỗi service tổng:', err));
    }, []);

    // LOAD TECHNICIAN SERVICES
    const loadTechServices = async () => {
        try {
            const res = await fetch(
                `http://localhost:8082/api/technician/profile/service/id=${id_user}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const json = await res.json();

            if (json.data) {
                const list = json.data.map((s) => ({
                    id: s.id_service,
                    name: s.name_service,
                }));

                setTechServices(list);
            }
        } catch (err) {
            console.error('Lỗi service thợ:', err);
        }
    };

    useEffect(() => {
        if (id_user) {
            loadTechServices();
        }
    }, [id_user]);

    // ADD SERVICE
    const addService = async () => {
        if (selected === null) {
            showToast('Vui lòng chọn dịch vụ!', 'error');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                'http://localhost:8082/api/technician/profile/service/',
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id_user,
                        id_service: selected,
                    }),
                }
            );

            const json = await res.json();

            if (!res.ok) {
                throw json?.message || 'Lỗi API';
            }

            showToast('Thêm dịch vụ thành công!', 'success');

            await loadTechServices();
        } catch (err) {
            showToast('Lỗi thêm dịch vụ: ' + err, 'error');
        } finally {
            setLoading(false);
        }
    };

    // DELETE SERVICE
    const deleteService = async () => {
        if (selected === null) {
            showToast('Vui lòng chọn dịch vụ để xóa!', 'error');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                'http://localhost:8082/api/technician/profile/service/',
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id_user,
                        id_service: selected,
                    }),
                }
            );

            const json = await res.json();

            if (!res.ok) {
                throw json?.message || 'Lỗi API';
            }

            showToast('Xóa dịch vụ thành công!', 'success');

            await loadTechServices();

            setSelected(null);
        } catch (err) {
            showToast('Lỗi xóa dịch vụ: ' + err, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Quản lý dịch vụ
                </h2>
            </div>

            {/* CONTENT */}
            <div className="grid grid-cols-3 gap-5">
                {/* LEFT PANEL */}
                <div className="col-span-1 bg-white border rounded-xl shadow p-3">
                    <h3 className="font-semibold mb-3">
                        Dịch vụ của thợ
                    </h3>

                    <div className="flex flex-wrap gap-2">
                        {techServices.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => setSelected(service.id)}
                                className={`px-4 py-2 rounded-full text-sm border transition
                                    ${
                                        selected === service.id
                                            ? 'bg-orange-500 text-white border-orange-500'
                                            : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                                    }
                                `}
                            >
                                {service.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="col-span-2 p-5 bg-white border rounded-xl shadow-sm">
                    {/* TITLE */}
                    <div className="flex items-center gap-3 mb-3">
                        <Briefcase className="text-orange-500" />

                        <span className="font-medium">
                            {selected !== null
                                ? techServices.find(
                                      (s) => s.id === selected
                                  )?.name || 'Dịch vụ mới'
                                : 'Chưa chọn'}
                        </span>
                    </div>

                    {/* SELECT */}
                    <select
                        value={selected ?? ''}
                        onChange={(e) => {
                            const id = Number(e.target.value);

                            setSelected(id > 0 ? id : null);
                        }}
                        className="w-full p-4 rounded-xl border border-gray-300 outline-orange-500 mb-4 cursor-pointer pr-8"
                    >
                        <option value="">Chọn dịch vụ</option>

                        {allServices.map((service) => (
                            <option
                                key={service.id}
                                value={service.id}
                            >
                                {service.name}
                            </option>
                        ))}
                    </select>

                    {/* ACTIONS */}
                    <div className="flex gap-3 mb-4">
                        <button
                            onClick={addService}
                            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                        >
                            <Plus size={18} />
                            Thêm dịch vụ
                        </button>

                        <button
                            onClick={deleteService}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
                        >
                            <Trash2 size={18} />
                            Xóa
                        </button>
                    </div>

                    {/* PREVIEW */}
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-lg">
                        <span className="text-gray-600">
                            [ Service Preview ]
                        </span>
                    </div>
                </div>
            </div>

            {/* LOADING */}
            <LoadingOverlay show={loading} />
        </div>
    );
}