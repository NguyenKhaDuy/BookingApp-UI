import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingOverlay from '../../../Layouts/LoadingOverLay/LoadingOverlay';
import TechnicianProfileHeader from '../../../Components/Client/TechnicianProfileHeader/TechnicianProfileHeader';
import TechnicianInfoCard from '../../../Components/Client/TechnicianInfoCard/TechnicianInfoCard';
import TechnicianSkills from '../../../Components/Client/TechnicianSkills/TechnicianSkills';
import TechnicianReviews from '../../../Components/Client/TechnicianReviews/TechnicianReviews';
import TechnicianCalendar from '../../../Components/Client/TechnicianCalendar/TechnicianCalendar';
import TechnicianMap from '../../../Components/Client/TechnicianMap/TechnicianMap';
import TechnicianService from '../../../Components/Client/TechnicianService/TechnicianService';
import {API_BASE_URL} from '../../../utils/api'

export default function TechnicianDetailPage() {
    const { id_user } = useParams();
    const [techData, setTechData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id_user) return;

        axios
            .get(`${API_BASE_URL}/detail-technician/id=${id_user}`)
            .then((res) => {
                setTechData(res.data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Không tìm thấy kỹ thuật viên');
                setLoading(false);
            });
    }, [id_user]);

    console.log(techData)

    if (loading) return <LoadingOverlay show={loading}/>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="bg-gray-100 min-h-screen p-4 md:p-8 space-y-6">
            <TechnicianProfileHeader tech={techData} />
            <TechnicianInfoCard tech={techData} />
            <TechnicianSkills skills={techData.nameSkillTechnician || []} />
            <TechnicianService services={techData.technicianServiceDTOS || []} />
            <TechnicianCalendar schedules={techData.technicianScheduleDTOS} />
            <TechnicianMap locations={techData.locationTechnicianDTOS || []} />
            <TechnicianReviews ratings={techData.ratingDTOS || []} />
        </div>
    );
}
