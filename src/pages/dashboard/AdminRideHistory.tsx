import { useState } from 'react';
import { useGetRideHistoryQuery } from '../../services/rideApi';
import { Calendar } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';

const AdminRideHistory = () => {
    const [page, setPage] = useState(1);
    const [riderName, setRiderName] = useState('');
    const [driverName, setDriverName] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    
    // Construct query filters
    const queryParams: any = { page, limit: 10 };
    if (riderName) queryParams.riderName = riderName;
    if (driverName) queryParams.driverName = driverName;
    if (statusFilter) queryParams.status = statusFilter;

    const { data, isLoading } = useGetRideHistoryQuery(queryParams);

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4">
                 <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Rider Name</label>
                    <input 
                        type="text" 
                        placeholder="Search by Rider Name" 
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                        value={riderName}
                        onChange={(e) => setRiderName(e.target.value)}
                    />
                </div>
                 <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Driver Name</label>
                     <input 
                        type="text" 
                        placeholder="Search by Driver Name" 
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                        value={driverName}
                        onChange={(e) => setDriverName(e.target.value)}
                    />
                </div>
                <div className="min-w-[150px]">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                    <select 
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="in_transit">In Transit</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                             <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Rider / Driver</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-20 rounded-full" /></td>
                                        <td className="px-6 py-4 text-right"><Skeleton className="h-4 w-24 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : data?.data?.rides?.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-8 text-gray-500">No rides found matching filters.</td></tr>
                            ) : (
                                data?.data?.rides?.map((ride: any) => (
                                    <tr key={ride._id}>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {new Date(ride.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs mt-1">{new Date(ride.createdAt).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 truncate max-w-[200px]">{ride.pickupLocation?.address || ride.pickupLocation}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-[200px] mt-1">To: {ride.destinationLocation?.address || ride.destinationLocation}</div>
                                        </td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            BDT {ride.fare}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize 
                                                ${ride.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                                  ride.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {ride.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                            <div>R: {ride.riderId?.email || 'N/A'}</div>
                                            {ride.driverId && <div className="text-xs text-blue-600">D: {ride.driverId.email}</div>}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                 {/* Pagination */}
                 <div className="p-4 border-t border-gray-100 flex justify-between items-center">
                    <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-gray-600">Page {data?.data?.meta?.page || 1} of {data?.data?.meta?.totalPage || 1}</span>
                    <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setPage(p => p + 1)}
                        disabled={page >= (data?.data?.meta?.totalPage || 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AdminRideHistory;
