import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Wrench } from 'lucide-react';

export default function TechnicianFilter({
    selectedSkill,
    onSelectSkill,
    selectedService,
    onSelectService,
    keyword,
    onKeywordChange,
}) {
    const [skills, setSkills] = useState([]);
    const [services, setServices] = useState([]);

    useEffect(() => {
        fetchSkills();
        fetchServices();
    }, []);

    const fetchSkills = async () => {
        try {
            const res = await axios.get('http://localhost:8081/api/skill/');
            const skillNames = res.data.data.map((s) => s.skill_name);
            setSkills(['Tất cả', ...skillNames]);
        } catch (error) {
            console.error('Lỗi lấy skill:', error);
        }
    };

    const fetchServices = async () => {
        try {
            const res = await axios.get('http://localhost:8081/api/service/all/');
            const serviceNames = res.data.data.map((s) => s.name_service);
            setServices(['Tất cả', ...serviceNames]);
        } catch (error) {
            console.error('Lỗi lấy service:', error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 mt-10 space-y-6">
            {/* 🔍 SEARCH */}
            <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => onKeywordChange(e.target.value)}
                    placeholder="Tìm kiếm tên thợ..."
                    className="
                        w-full pl-12 pr-5 py-3.5 rounded-2xl
                        border border-gray-200 bg-white shadow-sm
                        focus:outline-none focus:ring-2 focus:ring-orange-400
                        transition
                    "
                />
            </div>

            {/* 🧰 SKILL */}
            <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Kỹ năng</p>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                    {skills.map((s) => (
                        <button
                            key={s}
                            onClick={() => onSelectSkill(s)}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all
                                ${
                                    selectedSkill === s
                                        ? 'bg-orange-500 text-white shadow-md scale-[1.03]'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-400 hover:text-orange-500'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* 🛠 SERVICE */}
            <div>
                <p className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-1">
                    <Wrench className="w-4 h-4" /> Dịch vụ
                </p>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                    {services.map((s) => (
                        <button
                            key={s}
                            onClick={() => onSelectService(s)}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all
                                ${
                                    selectedService === s
                                        ? 'bg-blue-500 text-white shadow-md scale-[1.03]'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-400 hover:text-blue-500'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
