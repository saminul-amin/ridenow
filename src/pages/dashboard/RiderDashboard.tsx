import { useState, useEffect } from 'react';
import { useRequestRideMutation, useGetSingleRideQuery, useEstimateFareMutation } from '../../services/rideApi';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/common/Button';
import { toast } from 'react-hot-toast';
import { MapPin, Navigation, Clock, User, Phone, ShieldCheck } from 'lucide-react';

const RiderDashboard = () => {
    const [activeRideId, setActiveRideId] = useState<string | null>(localStorage.getItem('activeRideId'));
    const [requestRide, { isLoading }] = useRequestRideMutation();
    const [estimateFare, { data: fareData, isLoading: isEstimating }] = useEstimateFareMutation();
    const { register, handleSubmit, reset, watch } = useForm();
    const [paymentMethod, setPaymentMethod] = useState('cash');

    const pickup = watch('pickupLocation');
    const destination = watch('dropoffLocation');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (pickup && destination && pickup.length > 3 && destination.length > 3) {
                estimateFare({ pickup, destination });
            }
        }, 1000); // 1s debounce
        return () => clearTimeout(timer);
    }, [pickup, destination, estimateFare]);
    
    const { data: rideData } = useGetSingleRideQuery(activeRideId || '', {
        pollingInterval: 3000,
        skip: !activeRideId
    });

    const activeRide = rideData?.data;

    useEffect(() => {
        if (activeRide) {
             if (activeRide.status === 'completed' || activeRide.status === 'cancelled') {
                 toast.success(`Ride ${activeRide.status}!`);
                 setActiveRideId(null);
                 localStorage.removeItem('activeRideId');
             }
        }
    }, [activeRide]);

    const onSubmit = async (data: any) => {
      try {
        const payload = {
            pickupLocation: {
                address: data.pickupLocation,
                latitude: 23.8103 + (Math.random() * 0.01),
                longitude: 90.4125 + (Math.random() * 0.01),
            },
            destinationLocation: {
                address: data.dropoffLocation,
                latitude: 23.8103 + (Math.random() * 0.01) + 0.02,
                longitude: 90.4125 + (Math.random() * 0.01) + 0.02,
            },
            paymentMethod,
            fare: fareData?.data?.fare, // Send estimated fare
            vehicleType: 'car'
        };
        const res = await requestRide(payload).unwrap();
        toast.success('Ride requested successfully! Searching for drivers...');
        reset();
        const newRideId = res.data._id;
        setActiveRideId(newRideId);
        localStorage.setItem('activeRideId', newRideId);
      } catch (error: any) {
          // Parse Zod error if present
          let errorMsg = 'Failed to request ride';
          if (error.data?.err?.message) {
             try {
                 const zodErrors = JSON.parse(error.data.err.message);
                 if (Array.isArray(zodErrors) && zodErrors.length > 0) {
                     errorMsg = zodErrors[0].message;
                 }
             } catch (e) {
                 errorMsg = error.data.message || errorMsg;
             }
          } else {
             errorMsg = error.data?.message || errorMsg;
          }

          toast.error(errorMsg);
          console.error("Ride Request Error:", error);
      }
    };

    if (activeRideId && activeRide) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 bg-black text-white">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Navigation className="h-5 w-5" />
                            Current Ride
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">Status: <span className="text-white font-semibold uppercase">{activeRide.status}</span></p>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="text-center flex-1">
                                <div className={`w-3 h-3 mx-auto rounded-full mb-2 ${activeRide.status === 'pending' ? 'bg-yellow-400 animate-pulse' : 'bg-gray-300'}`}></div>
                                <p className="text-xs text-gray-500">Searching</p>
                            </div>
                            <div className="h-1 w-full bg-gray-100 mt-[-20px]"></div>
                            <div className="text-center flex-1">
                                <div className={`w-3 h-3 mx-auto rounded-full mb-2 ${['accepted', 'in_transit'].includes(activeRide.status) ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                <p className="text-xs text-gray-500">Accepted</p>
                            </div>
                            <div className="h-1 w-full bg-gray-100 mt-[-20px]"></div>
                            <div className="text-center flex-1">
                                <div className={`w-3 h-3 mx-auto rounded-full mb-2 ${activeRide.status === 'in_transit' ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}></div>
                                <p className="text-xs text-gray-500">In Transit</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                            <div>
                                <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12}/> Pickup</p>
                                <p className="font-medium text-gray-900">{activeRide.pickupLocation?.address || activeRide.pickupLocation}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12}/> Dropoff</p>
                                <p className="font-medium text-gray-900">{activeRide.destinationLocation?.address || activeRide.dropoffLocation}</p>
                            </div>
                        </div>

                        {activeRide.driverId && (
                            <div className="border-t pt-4">
                                <h3 className="font-semibold text-gray-900 mb-3">Driver Details</h3>
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                                        <User className="h-6 w-6 text-gray-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">Driver Assigned</p>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
                                                <Phone size={12} /> Call
                                            </Button>
                                            <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
                                                <ShieldCheck size={12} /> SOS
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {activeRide.status === 'pending' && (
                            <div className="text-center py-6">
                                <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-spin-slow" />
                                <p className="text-gray-600">Looking for a nearby driver...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
  
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Hello, Rider!</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h2 className="text-lg font-semibold mb-4">Request a Ride</h2>
             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
                    <input {...register("pickupLocation", { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border" placeholder="Current Location" />
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700">Destination</label>
                     <input {...register("dropoffLocation", { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border" placeholder="Where to?" />
                </div>
                
                {/* Fare Estimation & Payment */}
                <div className="bg-gray-50 p-4 rounded-md">
                     <div className="flex justify-between items-center mb-3">
                         <span className="text-sm font-medium text-gray-700">Estimated Fare</span>
                         {isEstimating ? (
                             <span className="text-xs text-gray-500">Calculating...</span>
                         ) : fareData ? (
                             <span className="text-lg font-bold text-green-600">BDT {fareData.data.fare}</span>
                         ) : (
                             <span className="text-xs text-gray-400">Enter locations</span>
                         )}
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                         <div className="flex gap-2">
                             {['cash', 'card', 'wallet'].map(method => (
                                 <button
                                     key={method}
                                     type="button"
                                     onClick={() => setPaymentMethod(method)}
                                     className={`flex-1 py-2 text-xs font-semibold rounded border capitalize ${
                                         paymentMethod === method 
                                         ? 'bg-black text-white border-black' 
                                         : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                     }`}
                                 >
                                     {method}
                                 </button>
                             ))}
                         </div>
                     </div>
                </div>

                <Button type="submit" className="w-full" isLoading={isLoading} disabled={!fareData}>
                    {fareData ? 'Confirm Request' : 'Enter Route Details'}
                </Button>
             </form>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h2 className="text-lg font-semibold mb-4">Recent Rides</h2>
             <p className="text-gray-500">No rides yet.</p>
          </div>
        </div>
      </div>
    );
  };

export default RiderDashboard;
