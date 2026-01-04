import { Star, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import defaultAvatar from '../../../assets/default-avatar.jpg';

export default function TechnicianCard({ tech }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 hover:shadow-xl transition cursor-pointer"
        >
            <img
                src={tech.avatar || defaultAvatar}
                alt={tech.name}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultAvatar;
                }}
                className="w-28 h-28 rounded-xl object-cover mx-auto mb-4 shadow"
            />

            <h3 className="text-xl font-semibold text-gray-800 text-center">{tech.name}</h3>

            <p className="text-orange-500 text-center font-medium mt-1">{tech.skill}</p>

            <div className="flex justify-center gap-1 mt-2">
                {Array(5)
                    .fill(0)
                    .map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${i < tech.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill={i < tech.rating ? '#FACC15' : 'none'}
                        />
                    ))}
            </div>

            <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mt-2">
                <MapPin className="w-4 h-4" />
                {tech.location}
            </div>

            <Link
                to={`/technicians/techniciandetail/${tech.id}`}
                className="mt-4 block w-full bg-orange-500 text-white py-2 rounded-lg font-semibold text-center hover:bg-orange-600 transition"
            >
                Xem chi tiết
            </Link>
        </motion.div>
    );
}
