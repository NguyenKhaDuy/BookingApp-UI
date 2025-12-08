import StatCard from '../../Admin/StatCard/StatCard';

export default function StatsGrid() {
    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Users" value="1,241" borderColor="border-orange-500" />
            <StatCard title="Technicians" value="412" borderColor="border-orange-400" />
            <StatCard title="Active Requests" value="87" borderColor="border-orange-300" />
            <StatCard title="Revenue" value="$12,540" borderColor="border-orange-600" />
        </div>
    );
}
