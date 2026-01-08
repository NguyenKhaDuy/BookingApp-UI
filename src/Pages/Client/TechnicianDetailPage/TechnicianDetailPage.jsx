import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import TechnicianProfileHeader from '../../../Components/Client/TechnicianProfileHeader/TechnicianProfileHeader';
import TechnicianInfoCard from '../../../Components/Client/TechnicianInfoCard/TechnicianInfoCard';
import TechnicianSkills from '../../../Components/Client/TechnicianSkills/TechnicianSkills';
import TechnicianReviews from '../../../Components/Client/TechnicianReviews/TechnicianReviews';
import TechnicianCalendar from '../../../Components/Client/TechnicianCalendar/TechnicianCalendar';
import TechnicianMap from '../../../Components/Client/TechnicianMap/TechnicianMap';
import TechnicianActionBar from '../../../Components/Client/TechnicianActionBar/TechnicianActionBar';
import TechnicianService from '../../../Components/Client/TechnicianService/TechnicianService';

export default function TechnicianDetailPage() {
    const { id_user } = useParams();
    console.log(id_user);
    const [techData, setTechData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id_user) return;

        axios
            .get(`http://localhost:8081/api/detail-technician/id=${id_user}`)
            .then((res) => {
                setTechData(res.data.data);// 👈 data backend trả về
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Không tìm thấy kỹ thuật viên');
                setLoading(false);
            });
    }, [id_user]);

    if (loading) return <div>Đang tải dữ liệu...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="bg-gray-100 min-h-screen p-4 md:p-8 space-y-6">
            <TechnicianProfileHeader tech={techData} />
            <TechnicianInfoCard tech={techData} />
            <TechnicianSkills skills={techData.nameSkillTechnician || []} />
            <TechnicianService services={techData.nameServiceTechnician || []} />
            <TechnicianCalendar schedules={techData.technicianScheduleDTOS} />
            <TechnicianMap />
            <TechnicianReviews ratings={techData.ratingDTOS || []} />
            <TechnicianActionBar phone={techData.phone} />
        </div>
    );
}
