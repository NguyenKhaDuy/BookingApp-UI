export default function NotificationItem({ icon, title, time, content }) {
    return (
        <div className="w-full bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-orange-100 text-orange-600 text-xl shadow-inner">
                    {icon}
                </div>

                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{content}</p>
                    <span className="text-gray-400 text-xs mt-2 inline-block">{time}</span>
                </div>
            </div>
        </div>
    );
}
