export default function TechnicianInfoCard({ tech }) {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Thông tin thợ</h2>

            <div className="space-y-3 text-gray-700">
                <p>
                    <strong>Kinh nghiệm:</strong> {tech.experience_year} năm
                </p>
                <p>
                    <strong>Giới tính:</strong> {tech.gender}
                </p>
                <p>
                    <strong>Năm sinh:</strong> {tech?.dob ? `${tech.dob[2]}/${tech.dob[1]}/${tech.dob[0]}` : '—'}
                </p>
                <p>
                    <strong>Khu vực làm việc:</strong> {tech.working_area}
                </p>
                <p>
                    <strong>Level:</strong> {tech.level}
                </p>
                <p>
                    <strong>Số điện thoại:</strong> {tech.phone_number}
                </p>
                <p>
                    <strong>Email:</strong> {tech.email}
                </p>
            </div>
        </div>
    );
}
