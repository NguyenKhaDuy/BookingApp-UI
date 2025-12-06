export default function TechnicianFilter({ selected, onSelect }) {
    const skills = ['Tất cả', 'Điện', 'Nước', 'Điện lạnh', 'IT', 'Camera', 'Xây dựng'];

    return (
        <div className="max-w-6xl mx-auto px-6 mt-10">
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
                {skills.map((s) => (
                    <button
                        key={s}
                        onClick={() => onSelect(s)}
                        className={`
                            px-5 py-2.5 rounded-full border text-sm font-medium transition whitespace-nowrap
                            ${
                                selected === s
                                    ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400 hover:text-orange-500'
                            }
                        `}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    );
}
