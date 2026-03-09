import { Wrench, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import getCookie from '../../../utils/getToken';
import { useToast } from '../../../Context/ToastContext';
import LoadingOverlay from '../../../Layouts/LoadingOverLay/LoadingOverlay';

export default function SkillManager() {
    const [allSkills, setAllSkills] = useState([]);
    const [techSkills, setTechSkills] = useState([]);
    const [selected, setSelected] = useState(null);
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    // Lấy skill tổng
    useEffect(() => {
        fetch('http://localhost:8081/api/skill/')
            .then((res) => res.json())
            .then((res) => {
                if (res.data) {
                    const list = res.data.map((s) => ({
                        id: s.id_skill,
                        name: s.skill_name,
                    }));
                    setAllSkills(list);
                }
            })
            .catch((err) => console.error('Lỗi skill tổng:', err));
    }, []);

    // Lấy id_user
    const getTechnicianId = () => {
        const localUser = localStorage.getItem('user');
        if (!localUser) return null;
        return JSON.parse(localUser).id_user;
    };

    const token = getCookie('token');
    const id_user = getTechnicianId();

    // Lấy skill của thợ
    const loadTechSkills = () => {
        fetch(`http://localhost:8081/api/technician/profile/skill/id=${id_user}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.data) {
                    const list = res.data.map((s) => ({
                        id: s.id_skill,
                        name: s.skill_name,
                    }));
                    setTechSkills(list);
                }
            })
            .catch((err) => console.error('Lỗi skill thợ:', err));
    };

    useEffect(() => {
        if (id_user) {
            loadTechSkills();
        }
    }, [id_user]);

    // === THÊM SKILL (CALL API) ===
    const addSkill = async () => {
        if (selected === null) {
            showToast('Vui lòng chọn kĩ năng trước!', 'error');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('http://localhost:8081/api/technician/profile/skill/', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_user: id_user,
                    id_skill: selected,
                }),
            });

            const json = await res.json();
            if (!res.ok) throw json?.message || 'Lỗi API';

            showToast('Thêm kỹ năng thành công!', 'success');

            await loadTechSkills(); // load lại skill
        } catch (err) {
            showToast('Lỗi thêm skill: ' + err, 'error');
            } finally {
                setLoading(false);
            }
    };

    // Xóa skill (chưa call API vì backend chưa có)
    const deleteSkill = async () => {
        if (selected === null) {
            showToast('Vui lòng chọn kỹ năng để xóa!', 'error');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('http://localhost:8081/api/technician/profile/skill/', {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_user: id_user,
                    id_skill: selected,
                }),
            });

            const json = await res.json();
            if (!res.ok) throw json?.message || 'Lỗi API';

            showToast('Xóa kỹ năng thành công!', 'success');

            // Load lại danh sách skill từ server
            await loadTechSkills();

            // Reset lại selection nếu cần
            setSelected(null);
        } catch (err) {
            showToast('Lỗi xóa skill: ' + err, 'error');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Quản lý kỹ năng</h2>
            </div>

            <div className="grid grid-cols-3 gap-5">
                {/* LIST SKILLS của THỢ */}
                <div className="col-span-1 bg-white border rounded-xl shadow p-3">
                    <h3 className="font-semibold mb-3">Kỹ năng của thợ</h3>

                    <div className="flex flex-wrap gap-2">
                        {techSkills.map((skill) => (
                            <button
                                key={skill.id}
                                onClick={() => setSelected(skill.id)}
                                className={`px-4 py-2 rounded-full text-sm border transition 
                                    ${
                                        selected === skill.id
                                            ? 'bg-orange-500 text-white border-orange-500'
                                            : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                                    }
                                `}
                            >
                                {skill.name}
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
                                ? techSkills.find((s) => s.id === selected)?.name || 'Kỹ năng mới'
                                : 'Chưa chọn'}
                        </span>
                    </div>

                    {/* Select từ Skill tổng */}
                    <select
                        value={selected ?? ''}
                        onChange={(e) => {
                            const id = Number(e.target.value);
                            setSelected(id > 0 ? id : null);
                        }}
                        className="w-full p-4 rounded-xl border border-gray-300 outline-orange-500 mb-4 cursor-pointer pr-8"
                    >
                        <option value="">Chọn kỹ năng</option>

                        {allSkills.map((skill) => (
                            <option key={skill.id} value={skill.id}>
                                {skill.name}
                            </option>
                        ))}
                    </select>

                    <div className="flex gap-3 mb-4">
                        <button
                            onClick={addSkill}
                            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                        >
                            <Plus size={18} /> Thêm kỹ năng
                        </button>

                        <button
                            onClick={deleteSkill}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
                        >
                            <Trash2 size={18} /> Xóa
                        </button>
                    </div>

                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-lg">
                        <span className="text-gray-600">[ Skill Preview ]</span>
                    </div>
                </div>
            </div>
            <LoadingOverlay show={loading} />
        </div>
    );
}
