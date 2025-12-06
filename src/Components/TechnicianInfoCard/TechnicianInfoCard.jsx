export default function TechnicianInfoCard({ tech }) {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Thông tin thợ</h2>

            <div className="space-y-3 text-gray-700">
                <p>
                    <strong>Kinh nghiệm:</strong> {tech.experience} năm
                </p>
                <p>
                    <strong>Khu vực làm việc:</strong> {tech.area}
                </p>
                <p>
                    <strong>Số công việc đã hoàn thành:</strong> {tech.jobsDone}
                </p>
                <p>
                    <strong>Số điện thoại:</strong> {tech.phone}
                </p>
            </div>
        </div>
    );
}
