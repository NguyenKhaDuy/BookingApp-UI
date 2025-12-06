export default function ServiceCard({ icon, name, price, desc }) {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl shadow-inner">
                {icon}
            </div>

            <h3 className="text-xl font-semibold mt-4 text-gray-800">{name}</h3>

            <p className="text-gray-500 text-sm mt-2 leading-relaxed">{desc}</p>

            <p className="mt-4 text-orange-600 font-bold text-lg">{price}</p>
        </div>
    );
}
