import { ToggleLeft, ToggleRight, MapPin, Navigation, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useGetDriverDashboardQuery, useUpdateDriverStatusMutation, useAcceptRideMutation, useUpdateRideStatusMutation } from '../../services/rideApi';
import { Button } from '../../components/common/Button';
import { toast } from 'react-hot-toast';

const dummyEarningsData = [
  { day: 'Mon', amount: 120 },
  { day: 'Tue', amount: 150 },
  { day: 'Wed', amount: 180 },
  { day: 'Thu', amount: 140 },
  { day: 'Fri', amount: 200 },
  { day: 'Sat', amount: 250 },
  { day: 'Sun', amount: 190 },
];

const DriverDashboard = () => {
  const { data: dashboardData, isLoading: isDashboardLoading } = useGetDriverDashboardQuery(undefined, {
      pollingInterval: 5000,
  });

  const [updateDriverStatus, { isLoading: isStatusUpdating }] = useUpdateDriverStatusMutation();
  const [acceptRide, { isLoading: isAccepting }] = useAcceptRideMutation();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateRideStatusMutation();

  const driver = dashboardData?.data?.driver;
  const activeRide = dashboardData?.data?.activeRide;
  const pendingRides = dashboardData?.data?.pendingRides || [];
  const earnings = dashboardData?.data?.todayEarnings || 0;

  const isOnline = driver?.onlineStatus === 'online';

  const handleToggleStatus = async () => {
      const newStatus = isOnline ? 'offline' : 'online';
      try {
          await updateDriverStatus({ status: newStatus }).unwrap();
          toast.success(`You are now ${newStatus}`);
      } catch (error: any) {
          toast.error(error.data?.message || 'Failed to update status');
      }
  };

  const handleAcceptRide = async (rideId: string) => {
      try {
          await acceptRide(rideId).unwrap();
          toast.success('Ride accepted!');
      } catch (error: any) {
          toast.error(error.data?.message || 'Failed to accept ride');
      }
  };

  const handleUpdateStatus = async (status: string) => {
      if (!activeRide) return;
      try {
          await updateStatus({ id: activeRide._id, status }).unwrap();
          toast.success(`Ride status updated to ${status}`);
      } catch (error: any) {
          toast.error(error.data?.message || 'Failed to update status');
      }
  };

  if (isDashboardLoading && !dashboardData) {
      return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  }

  return (
      <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Driver Dashboard</h1>
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
            <span className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                {isOnline ? 'Online' : 'Offline'}
            </span>
            <button onClick={handleToggleStatus} disabled={isStatusUpdating} className="focus:outline-none disabled:opacity-50">
                {isOnline ? <ToggleRight className="w-10 h-10 text-green-500" /> : <ToggleLeft className="w-10 h-10 text-gray-400" />}
            </button>
        </div>
      </div>

      {activeRide ? (
          <div className="bg-black text-white p-6 rounded-xl shadow-lg mb-8">
              <div className="flex justify-between items-start mb-6">
                  <div>
                      <h2 className="text-xl font-bold flex items-center gap-2">
                          <Navigation className="h-6 w-6 text-green-400" />
                          Active Job
                      </h2>
                      <p className="text-gray-400 mt-1">Ride ID: {activeRide._id}</p>
                  </div>
                  <div className="px-3 py-1 bg-gray-800 rounded-full text-xs font-semibold uppercase tracking-wider text-green-400 border border-gray-700">
                      {activeRide.status}
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                      <div className="flex items-start gap-3">
                          <div className="mt-1"><MapPin className="h-5 w-5 text-gray-400" /></div>
                          <div>
                              <p className="text-gray-500 text-xs uppercase mb-1">Pickup</p>
                              <p className="font-medium text-lg">{activeRide.pickupLocation?.address || activeRide.pickupLocation}</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-3">
                          <div className="mt-1"><MapPin className="h-5 w-5 text-green-400" /></div>
                          <div>
                              <p className="text-gray-500 text-xs uppercase mb-1">Dropoff</p>
                              <p className="font-medium text-lg">{activeRide.destinationLocation?.address || activeRide.dropoffLocation}</p>
                          </div>
                      </div>
                  </div>
                  
                  <div className="flex flex-col justify-end gap-3">
                       {activeRide.status === 'accepted' && (
                           <Button 
                             onClick={() => handleUpdateStatus('picked_up')} 
                             isLoading={isUpdating}
                             className="w-full bg-blue-600 hover:bg-blue-700 border-none"
                           >
                               Arrived & Pickup Passenger
                           </Button>
                       )}
                       {activeRide.status === 'picked_up' && (
                           <Button 
                             onClick={() => handleUpdateStatus('in_transit')} 
                             isLoading={isUpdating}
                             className="w-full bg-blue-600 hover:bg-blue-700 border-none"
                           >
                               <Navigation className="mr-2 h-5 w-5" />
                               Start Trip
                           </Button>
                       )}
                       {activeRide.status === 'in_transit' && (
                           <Button 
                             onClick={() => handleUpdateStatus('completed')} 
                             isLoading={isUpdating}
                             className="w-full bg-green-600 hover:bg-green-700 border-none"
                           >
                               <CheckCircle className="mr-2 h-5 w-5" />
                               Complete Ride
                           </Button>
                       )}
                  </div>
              </div>
          </div>
      ) : (
        <>
            {isOnline && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                  <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
                      Incoming Requests 
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                          {pendingRides.length} nearby
                      </span>
                  </h2>
                  
                  <div className="space-y-4">
                      {pendingRides.map((ride: any) => (
                          <div key={ride._id} className="border border-gray-100 rounded-lg p-4 hover:border-black transition-colors flex flex-col md:flex-row justify-between gap-4 items-center">
                              <div className="flex-1 w-full">
                                  <div className="flex items-center gap-2 mb-2">
                                      <span className="bg-gray-100 text-xs px-2 py-0.5 rounded font-medium">Car</span>
                                      <span className="text-green-600 font-bold">$ Estim. Fare</span>
                                  </div>
                                  <div className="flex flex-col gap-1">
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                          <div className="w-2 h-2 rounded-full bg-black"></div>
                                          {ride.pickupLocation?.address || ride.pickupLocation}
                                      </div>
                                      <div className="h-4 border-l border-dashed border-gray-300 ml-1"></div>
                                      <div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
                                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                          {ride.destinationLocation?.address || ride.dropoffLocation}
                                      </div>
                                  </div>
                              </div>
                              <Button onClick={() => handleAcceptRide(ride._id)} isLoading={isAccepting} className="w-full md:w-auto">
                                  Accept Ride
                              </Button>
                          </div>
                      ))}
                      
                      {pendingRides.length === 0 && (
                          <div className="text-center py-8 text-gray-500 text-sm">
                              No rides available right now.
                          </div>
                      )}
                  </div>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm mb-1">Total Earnings (Today)</div>
                    <div className="text-2xl font-bold text-green-600">${earnings.toFixed(2)}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm mb-1">Rides Completed</div>
                    <div className="text-2xl font-bold text-gray-900">{driver?.stats?.completedRides || 0}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm mb-1">Rating</div>
                    <div className="text-2xl font-bold text-yellow-500">{driver?.stats?.averageRating || 'N/A'}</div>
                </div>
            </div>
        </>
      )}
      
      {!activeRide && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 opacity-50">
            <h2 className="text-lg font-semibold mb-4">Earnings Overview</h2>
            <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={dummyEarningsData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
                   <XAxis dataKey="day" axisLine={false} tickLine={false} />
                   <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                   <Tooltip />
                   <Bar dataKey="amount" fill="#000000" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
          </div>
      )}
    </div>
  );
};

export default DriverDashboard;
