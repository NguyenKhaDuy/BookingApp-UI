import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';

import TechnicianHero from '../../../Components/Client/TechnicianHero/TechnicianHero';
import TechnicianFilter from '../../../Components/Client/TechnicianFilter/TechnicianFilter';
import TechnicianGrid from '../../../Components/Client/TechnicianGrid/TechnicianGrid';

export default function TechnicianPage() {
    // 🔎 Filter states
    const [selectedSkill, setSelectedSkill] = useState('Tất cả');
    const [selectedService, setSelectedService] = useState('Tất cả');
    const [keyword, setKeyword] = useState('');

    // 📦 Data states
    const [technicians, setTechnicians] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);

    useEffect(() => {
        fetchTechnicians(currentPage);
    }, [currentPage]);

    const fetchTechnicians = async (page) => {
        try {
            const res = await axios.get('http://localhost:8081/api/all/technician/', { params: { pageNo: page } });

            // 🔁 map backend → UI model
            const mapped = res.data.data.map((t) => ({
                id: t.id_user,
                name: t.full_name,
                avatar: t.avatarBase64 ? `data:image/png;base64,${t.avatarBase64}` : null,
                skills: t.nameSkillTechnician || [],
                services: t.nameServiceTechnician || [],
                rating: t.total_star ?? 0,
                location: t.working_area,
            }));

            setTechnicians(mapped);
            setTotalPage(res.data.total_page);
        } catch (error) {
            console.error('Lỗi lấy danh sách thợ:', error);
        }
    };

    // 🔍 FILTER LOGIC: Skill + Service + Search
    const filtered = technicians.filter((t) => {
        const matchSkill = selectedSkill === 'Tất cả' || t.skills.includes(selectedSkill);

        const matchService = selectedService === 'Tất cả' || t.services.includes(selectedService);

        const matchKeyword = t.name.toLowerCase().includes(keyword.toLowerCase());

        return matchSkill && matchService && matchKeyword;
    });

    return (
        <Fragment>
            <TechnicianHero />

            <TechnicianFilter
                selectedSkill={selectedSkill}
                onSelectSkill={setSelectedSkill}
                selectedService={selectedService}
                onSelectService={setSelectedService}
                keyword={keyword}
                onKeywordChange={setKeyword}
            />

            <TechnicianGrid list={filtered} />

            {/* Pagination */}
            {totalPage > 1 && (
                <div className="flex justify-center gap-2 mb-12">
                    {Array.from({ length: totalPage }).map((_, index) => {
                        const page = index + 1;
                        return (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-4 py-2 rounded-lg transition ${
                                    page === currentPage ? 'bg-orange-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                            >
                                {page}
                            </button>
                        );
                    })}
                </div>
            )}
        </Fragment>
    );
}
