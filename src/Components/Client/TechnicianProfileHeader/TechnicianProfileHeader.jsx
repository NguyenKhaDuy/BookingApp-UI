export default function TechnicianProfileHeader({ tech }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-md flex flex-col items-center text-center">
      
      {/* Avatar */}
      <img
        src={tech.avatar}
        alt={tech.name}
        className="w-28 h-28 rounded-full object-cover shadow-md"
      />

      <h1 className="text-2xl font-bold mt-4">{tech.name}</h1>
      <p className="text-gray-500">{tech.specialty}</p>

      {/* Rating */}
      <div className="flex items-center gap-1 mt-2">
        <span className="text-yellow-500">⭐</span>
        <span className="font-semibold">{tech.rating}</span>
        <span className="text-gray-400 text-sm">({tech.totalReviews} đánh giá)</span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        <button className="px-5 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700">
          Đặt lịch
        </button>
        <button className="px-5 py-2 bg-gray-200 text-gray-700 rounded-xl shadow hover:bg-gray-300">
          Nhắn tin
        </button>
      </div>

    </div>
  );
}
