export default function TechnicianSkills({ skills }) {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Kỹ năng chuyên môn</h2>

            <div className="flex flex-wrap gap-3">
                {skills.map((s, i) => (
                    <span key={i} className="px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 font-medium shadow-sm">
                        {s}
                    </span>
                ))}
            </div>
        </div>
    );
}
