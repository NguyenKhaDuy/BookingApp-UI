import { Phone, MessageCircle } from 'lucide-react';

export default function TechnicianActionBar({ phone }) {
    return (
        <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
            {/* Gọi */}
            <a
                href={`tel:${phone}`}
                className="w-14 h-14 rounded-full bg-green-500 shadow-xl flex items-center justify-center hover:bg-green-600 transition"
            >
                <Phone className="text-white w-6 h-6" />
            </a>

            {/* Chat */}
            <button className="w-14 h-14 rounded-full bg-indigo-600 shadow-xl flex items-center justify-center hover:bg-indigo-700 transition">
                <MessageCircle className="text-white w-6 h-6" />
            </button>
        </div>
    );
}
