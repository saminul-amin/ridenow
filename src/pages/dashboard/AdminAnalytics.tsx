import { useGetAdminAnalyticsQuery } from '../../services/rideApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '../../components/common/Skeleton';

const AdminAnalytics = () => {
    const { data: analyticsData, isLoading } = useGetAdminAnalyticsQuery();

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                             <Skeleton className="h-4 w-24 mb-2" />
                             <Skeleton className="h-8 w-16" />
                        </div>
                    ))}
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <Skeleton className="h-6 w-48 mb-6" />
                    <Skeleton className="h-64 w-full" />
                 </div>
            </div>
        );
    }

    const { totalUsers, totalDrivers, activeRides, totalRevenue, volumeStats } = analyticsData?.data || {};

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm mb-1">Total Users</div>
                    <div className="text-2xl font-bold text-gray-900">{totalUsers}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm mb-1">Drivers</div>
                    <div className="text-2xl font-bold text-gray-900">{totalDrivers}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm mb-1">Active Rides</div>
                    <div className="text-2xl font-bold text-blue-600">{activeRides}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm mb-1">Total Revenue</div>
                    <div className="text-2xl font-bold text-green-600">BDT {totalRevenue}</div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-6">Ride Volume (Last 7 Days)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={volumeStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#000000" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
