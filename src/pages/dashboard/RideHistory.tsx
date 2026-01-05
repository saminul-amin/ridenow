import { History, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetRideHistoryQuery } from '../../services/rideApi';
import { useState } from 'react';
import { Button } from '../../components/common/Button';

const RideHistory = () => {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');

    const { data: ridesResponse, isLoading, error } = useGetRideHistoryQuery({ 
        page, 
        limit: 5, 
        status: statusFilter, 
        date: dateFilter 
    });

    const rides = ridesResponse?.data?.rides || [];
    const meta = ridesResponse?.data?.meta;

    const handlePrevious = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (meta && page < meta.totalPage) setPage(page + 1);
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading ride history...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Failed to load ride history.</div>;
    }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <History className="h-6 w-6" />
            Ride History
          </h1>
          
          <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-md border border-gray-300">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select 
                    title="Status Filter"
                    className="bg-transparent border-none text-sm focus:ring-0 cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="requested">Requested</option>
                  </select>
              </div>
              <input 
                title="Date Filter"
                type="date" 
                className="px-3 py-2 rounded-md border border-gray-300 text-sm"
                value={dateFilter}
                onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
              />
              {(statusFilter !== 'all' || dateFilter) && (
                  <Button variant="ghost" size="sm" onClick={() => { setStatusFilter('all'); setDateFilter(''); setPage(1); }}>
                      Clear
                  </Button>
              )}
          </div>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dropoff</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {rides.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                No rides found matching your filters.
                            </td>
                        </tr>
                    ) : (
                        rides.map((ride: any) => (
                            <tr key={ride._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(ride.createdAt).toLocaleDateString()}
                                    <br/>
                                    <span className="text-xs text-gray-400">
                                        {new Date(ride.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {ride.pickupLocation?.address || ride.pickupLocation}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {ride.destinationLocation?.address || ride.dropoffLocation}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                    ${ride.fare || '0.00'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        ride.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                        ride.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {ride.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Button size="sm" variant="ghost" onClick={() => window.location.href = `/dashboard/ride/${ride._id}`}>
                                        View
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
        
        {/* Pagination Controls */}
        {meta && meta.totalPage > 1 && (
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                    <Button onClick={handlePrevious} disabled={page === 1} size="sm" variant="outline">Previous</Button>
                    <Button onClick={handleNext} disabled={page === meta.totalPage} size="sm" variant="outline">Next</Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing page <span className="font-medium">{page}</span> of <span className="font-medium">{meta.totalPage}</span>
                            <span className="ml-2 text-gray-500">({meta.total} results)</span>
                        </p>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                                onClick={handlePrevious}
                                disabled={page === 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                            >
                                <span className="sr-only">Previous</span>
                                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={page === meta.totalPage}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                            >
                                <span className="sr-only">Next</span>
                                <ChevronRight className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default RideHistory;
