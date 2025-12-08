import TechnicianProfileHeader from '../../../Components/Client/TechnicianProfileHeader/TechnicianProfileHeader';
import TechnicianInfoCard from '../../../Components/Client/TechnicianInfoCard/TechnicianInfoCard';
import TechnicianSkills from '../../../Components/Client/TechnicianSkills/TechnicianSkills';
import TechnicianReviews from '../../../Components/Client/TechnicianReviews/TechnicianReviews';
import TechnicianCalendar from '../../../Components/Client/TechnicianCalendar/TechnicianCalendar';
import TechnicianMap from '../../../Components/Client/TechnicianMap/TechnicianMap';
import TechnicianActionBar from '../../../Components/Client/TechnicianActionBar/TechnicianActionBar';
export default function TechnicianDetailPage() {
    const techData = {
        phone: '0903123456',
        name: 'Nguyễn Văn Khoa',
        avatar: '/img/tech1.jpg',
    };

    const reviews = [
        {
            id: 1,
            name: 'Trần Minh Huy',
            rating: 5,
            comment: 'Thợ làm việc rất nhanh và chuyên nghiệp. Rất hài lòng!',
            date: '2024-11-20',
        },
        {
            id: 2,
            name: 'Lê Thị Trang',
            rating: 4,
            comment: 'Làm việc ổn, nhiệt tình. Sẽ tiếp tục đặt lần sau.',
            date: '2024-11-12',
        },
        {
            id: 3,
            name: 'Phạm Đình Duy',
            rating: 5,
            comment: 'Giải thích rõ ràng, sửa đúng bệnh. Giá hợp lý.',
            date: '2024-10-03',
        },
    ];

    return (
        <div className="bg-gray-100 min-h-screen p-4 md:p-8 space-y-6">
            <TechnicianProfileHeader tech={techData} />
            <TechnicianInfoCard tech={techData} />
            <TechnicianSkills skills={['Điện', 'Điện lạnh', 'Fix PC', 'Camera']} />
            <TechnicianCalendar />
            <TechnicianMap />
            <TechnicianReviews reviews={reviews} />
            {/* Floating Action Buttons */}
            <TechnicianActionBar phone={techData.phone} />
        </div>
    );
}
