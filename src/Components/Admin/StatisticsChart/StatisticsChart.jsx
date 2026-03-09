import MonthlyOrderStatistic from "../Charts/MonthlyOrderServiceChart";
import OrderChart from "../Charts/OrderChart";
import RevenueChart from "../Charts/RevenueChart";


export default function StatisticsChart() {
    return (
        <div className="bg-white shadow rounded-xl p-6">
            <RevenueChart />
            <OrderChart/>
            <MonthlyOrderStatistic/>
        </div>
    );
}
