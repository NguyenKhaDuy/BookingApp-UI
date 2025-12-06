import TechnicianCard from '../TechnicianCard/TechnicianCard';

export default function TechnicianGrid({ list }) {
    return (
        <div className="max-w-6xl mx-auto px-6 mt-10 pb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {list.map((t) => (
                    <TechnicianCard key={t.id} tech={t} />
                ))}
            </div>
        </div>
    );
}
