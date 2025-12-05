export default function NotificationFilter({ selected, onChange }) {
    const filters = ['Tất cả', 'Hệ thống', 'Khuyến mãi', 'Hoạt động'];

    return (
        <div className="flex flex-wrap gap-3 px-6 mt-6">
            {filters.map((item) => (
                <button
                    key={item}
                    onClick={() => onChange(item)}
                    className={`
            px-4 py-2 rounded-full text-sm font-medium transition
            shadow-sm border 
            ${
                selected === item
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-orange-400 hover:text-orange-500'
            }
          `}
                >
                    {item}
                </button>
            ))}
        </div>
    );
}
