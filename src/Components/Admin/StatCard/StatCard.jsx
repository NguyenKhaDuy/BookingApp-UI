export default function StatCard({ title, value, borderColor }) {
    return (
        <div
            className={`bg-white p-6 rounded-2xl shadow hover:shadow-md transition cursor-pointer border-l-4 ${borderColor}`}
        >
            <h3 className="text-gray-600">{title}</h3>
            <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
    );
}
