import { useParams, useNavigate } from 'react-router-dom';
import { useGetSingleRideQuery } from '../../services/rideApi';
import { ArrowLeft, MapPin, User, DollarSign, Calendar, Clock, CreditCard } from 'lucide-react';
import { Button } from '../../components/common/Button';

const RideDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: rideData, isLoading, error } = useGetSingleRideQuery(id || '');

    const ride = rideData?.data;

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading ride details...</div>;
    if (error || !ride) return <div className="p-8 text-center text-red-500">Ride not found.</div>;

    return (
        <div className="max-w-3xl mx-auto">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 gap-1 pl-0 hover:bg-transparent hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" /> Back to History
            </Button>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-black text-white p-6 flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Ride Details</h1>
                        <p className="text-gray-400 text-sm">ID: {ride._id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                        ride.status === 'completed' ? 'bg-green-500 text-white' : 
                        ride.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                    }`}>
                        {ride.status}
                    </span>
                </div>

                <div className="p-6 space-y-8">
                    {/* Route Info */}
                    <div className="flex flex-col gap-6 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-gray-200"></div>

                        <div className="flex gap-4">
                            <div className="relative z-10">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                    <MapPin className="h-5 w-5 text-gray-600" />
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Pickup Location</p>
                                <p className="font-semibold text-gray-900 text-lg">{ride.pickupLocation?.address || ride.pickupLocation}</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="relative z-10">
                                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shadow-md">
                                    <MapPin className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Destination</p>
                                <p className="font-semibold text-gray-900 text-lg">{ride.destinationLocation?.address || ride.destinationLocation}</p>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><DollarSign className="h-3 w-3" /> Fare</p>
                            <p className="font-bold text-gray-900 text-xl">${ride.fare || '0.00'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><Calendar className="h-3 w-3" /> Date</p>
                            <p className="font-medium text-gray-900">{new Date(ride.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><Clock className="h-3 w-3" /> Time</p>
                            <p className="font-medium text-gray-900">{new Date(ride.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><CreditCard className="h-3 w-3" /> Payment</p>
                            <p className="font-medium text-gray-900 capitalize">{ride.paymentMethod || 'Cash'}</p>
                        </div>
                    </div>

                    {/* Driver/Rider Info (Contextual) */}
                    {ride.driverId && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                            <h3 className="font-semibold text-gray-900 mb-3">Driver Information</h3>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User className="h-6 w-6 text-gray-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{ride.driverId.name}</p>
                                    <p className="text-sm text-gray-500">{ride.driverId.phone}</p>
                                    <p className="text-xs text-gray-400 mt-1">{ride.driverId.email}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RideDetails;
