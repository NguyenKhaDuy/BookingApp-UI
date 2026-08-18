import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LoadingOverlay from '../../../Layouts/LoadingOverLay/LoadingOverlay';
import TechnicianHero from '../../../Components/Client/TechnicianHero/TechnicianHero';
import TechnicianFilter from '../../../Components/Client/TechnicianFilter/TechnicianFilter';
import TechnicianGrid from '../../../Components/Client/TechnicianGrid/TechnicianGrid';

import { API_BASE_URL } from '../../../utils/api';

export default function TechnicianPage() {
    // Đọc service từ URL
    const [searchParams] = useSearchParams();

    const serviceIdFromUrl = searchParams.get('service');
    const serviceNameFromUrl = searchParams.get('serviceName');

    // Filter states
    const [selectedSkill, setSelectedSkill] = useState('Tất cả');

    const [selectedService, setSelectedService] = useState(serviceNameFromUrl || 'Tất cả');

    const [keyword, setKeyword] = useState('');
    // Data states
    const [loading, setLoading] = useState(false);
    const [technicians, setTechnicians] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);

    // Khi URL thay đổi service
    useEffect(() => {
        if (serviceNameFromUrl) {
            setSelectedService(serviceNameFromUrl);
        } else {
            setSelectedService('Tất cả');
        }

        // Khi chọn service mới thì quay về page 1
        setCurrentPage(1);
    }, [serviceIdFromUrl, serviceNameFromUrl]);

    // Fetch technicians
    useEffect(() => {
        fetchTechnicians(currentPage);
    }, [currentPage]);

    const fetchTechnicians = async (page) => {
        try {
            setLoading(true);

            const res = await axios.get(`${API_BASE_URL}/all/technician/`, {
                params: {
                    pageNo: page,
                },
            });

            // Map backend → UI model
            const mapped = res.data.data.map((t) => ({
                id: t.id_user,
                name: t.full_name,
                avatar: t.avatarBase64 ? `data:image/png;base64,${t.avatarBase64}` : null,
                skills: t.nameSkillTechnician || [],
                services: (t.technicianServiceDTOS || []).map((item) => item.name_service),
                rating: t.total_star ?? 0,
                location: t.working_area,
            }));

            setTechnicians(mapped);

            setTotalPage(res.data.total_page);
        } catch (error) {
            console.error('Lỗi lấy danh sách thợ:', error);
        } finally {
            setLoading(false);
        }
    };

    // FILTER
    // Skill + Service + Search
    const filtered = technicians.filter((t) => {
        // Filter skill
        const matchSkill = selectedSkill === 'Tất cả' || t.skills.includes(selectedSkill);

        // Filter service
        const matchService =
            selectedService === 'Tất cả' || t.services.some((s) => s?.toLowerCase() === selectedService?.toLowerCase());

        // Filter keyword
        const matchKeyword = t.name?.toLowerCase().includes(keyword.toLowerCase());

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

            {totalPage > 0 && (
                <div className="flex justify-center items-center gap-2 mb-12">
                    {/* Nút Previous */}
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="
                flex items-center justify-center
                w-10 h-10
                rounded-lg
                bg-gray-200
                hover:bg-orange-100
                hover:text-orange-500
                transition
                disabled:opacity-40
                disabled:cursor-not-allowed
            "
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {/* Các trang */}
                    {Array.from({
                        length: totalPage,
                    }).map((_, index) => {
                        const page = index + 1;

                        return (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`
                        px-4 py-2
                        rounded-lg
                        transition

                        ${page === currentPage ? 'bg-orange-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}
                    `}
                            >
                                {page}
                            </button>
                        );
                    })}

                    {/* Nút Next */}
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPage))}
                        disabled={currentPage === totalPage}
                        className="
                flex items-center justify-center
                w-10 h-10
                rounded-lg
                bg-gray-200
                hover:bg-orange-100
                hover:text-orange-500
                transition
                disabled:opacity-40
                disabled:cursor-not-allowed
            "
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            <LoadingOverlay show={loading} />
        </Fragment>
    );
}
