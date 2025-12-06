export default function ServiceCategory({ selected, onSelect }) {
    const categories = ['Tất cả', 'Điện', 'Nước', 'Điện lạnh', 'IT', 'Camera', 'Xây dựng'];

    return (
        <div className="mt-10 max-w-6xl mx-auto px-6">
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => onSelect(cat)}
                        className={`
                            px-5 py-2.5 rounded-full text-sm font-medium transition 
                            border shadow-sm whitespace-nowrap
                            ${
                                selected === cat
                                    ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                                    : 'bg-white text-gray-600 border-gray-300 hover:text-orange-500 hover:border-orange-400'
                            }
                        `}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
}
