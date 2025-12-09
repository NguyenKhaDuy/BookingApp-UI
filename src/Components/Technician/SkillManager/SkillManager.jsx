import { Wrench, Plus, Trash2, Check } from 'lucide-react';
import { useState } from 'react';

export default function SkillManager() {
    const [skills, setSkills] = useState(['Sửa điện', 'Sửa nước', 'Điện lạnh']);

    const [selected, setSelected] = useState(0);
    const [input, setInput] = useState(skills[0]);

    // Chọn skill
    const changeSelected = (index) => {
        setSelected(index);
        setInput(skills[index]);
    };

    // Thêm skill
    const addSkill = () => {
        setSkills([...skills, '']);
        setSelected(skills.length);
        setInput('');
    };

    // Cập nhật skill
    const updateSkill = () => {
        const updated = [...skills];
        updated[selected] = input;
        setSkills(updated);
    };

    // Xóa skill
    const deleteSkill = () => {
        if (skills.length === 1) return;
        const newList = skills.filter((_, i) => i !== selected);
        setSkills(newList);
        setSelected(0);
        setInput(newList[0]);
    };

    return (
        <div className="max-w-4xl">
            {/* Title + Add Button */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Quản lý kỹ năng</h2>

                <button
                    onClick={addSkill}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                >
                    <Plus size={18} /> Thêm kỹ năng
                </button>
            </div>

            <div className="grid grid-cols-3 gap-5">
                {/* LIST SKILLS */}
                <div className="col-span-1 bg-white border rounded-xl shadow p-3">
                    <h3 className="font-semibold mb-3">Danh sách kỹ năng</h3>

                    <div className="space-y-2">
                        {skills.map((skill, index) => (
                            <div
                                key={index}
                                onClick={() => changeSelected(index)}
                                className={`p-2 rounded-lg cursor-pointer border
                                    ${selected === index ? 'bg-orange-100 border-orange-400' : 'hover:bg-orange-50'}
                                `}
                            >
                                <span className="text-sm">{skill || 'Kỹ năng mới'}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* EDIT PANEL */}
                <div className="col-span-2 p-5 bg-white border rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <Wrench className="text-orange-500" />
                        <span className="font-medium">{input || 'Kỹ năng mới'}</span>
                    </div>

                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full p-2 border rounded-lg mb-4"
                        placeholder="Nhập tên kỹ năng..."
                    />

                    {/* Buttons */}
                    <div className="flex gap-3 mb-4">
                        <button
                            onClick={updateSkill}
                            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg"
                        >
                            <Check size={18} /> Cập nhật
                        </button>

                        {skills.length > 0 && (
                            <button
                                onClick={deleteSkill}
                                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
                            >
                                <Trash2 size={18} /> Xóa
                            </button>
                        )}
                    </div>

                    {/* Preview / Decoration */}
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-lg">
                        <span className="text-gray-600">[ Skill Preview ]</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
