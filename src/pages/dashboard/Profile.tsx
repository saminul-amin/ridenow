import { useForm } from 'react-hook-form';
import { useGetMeQuery, useUpdateProfileMutation, useChangePasswordMutation } from '../../services/authApi';
import { useGetDriverProfileQuery, useUpdateDriverProfileMutation } from '../../services/driverApi';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { User, Mail, Phone, MapPin, Car, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { data: userData, isLoading } = useGetMeQuery(undefined);
  const user = userData?.data;
  const isDriver = user?.role === 'driver';

  const { data: driverData, isLoading: isDriverLoading } = useGetDriverProfileQuery(undefined, {
      skip: !isDriver
  });
  const driverProfile = driverData?.data;

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [updateDriverProfile, { isLoading: isDriverUpdating }] = useUpdateDriverProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isVehicleEditing, setIsVehicleEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);

  const { register: registerInfo, handleSubmit: handleSubmitInfo, reset: resetInfo } = useForm();
  const { register: registerVehicle, handleSubmit: handleSubmitVehicle, reset: resetVehicle } = useForm();
  const { register: registerPassword, handleSubmit: handleSubmitPassword, reset: resetPassword } = useForm();

  useEffect(() => {
    if (user) {
        resetInfo({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
        });
    }
  }, [user, resetInfo]);

  useEffect(() => {
    if (driverProfile?.vehicle) {
        resetVehicle({
            make: driverProfile.vehicle.make || '',
            model: driverProfile.vehicle.model || '',
            year: driverProfile.vehicle.year || '',
            licensePlate: driverProfile.vehicle.licensePlate || '',
            color: driverProfile.vehicle.color || '',
        });
    }
  }, [driverProfile, resetVehicle]);

  const onInfoSubmit = async (data: any) => {
    try {
        const { email, ...updateData } = data;
        await updateProfile(updateData).unwrap();
        toast.success('Profile updated successfully!');
        setIsEditing(false);
    } catch (error: any) {
        console.error('Profile update error:', error);
        const errorMessage = error?.data?.message || error?.message || 'Failed to update profile';
        toast.error(errorMessage);
    }
  };

  const onVehicleSubmit = async (data: any) => {
      try {
          await updateDriverProfile({ vehicle: data }).unwrap();
          toast.success('Vehicle details updated!');
          setIsVehicleEditing(false);
      } catch (error: any) {
          console.error('Vehicle update error:', error);
          const errorMessage = error?.data?.message || error?.message || 'Failed to update vehicle';
          toast.error(errorMessage);
      }
  };

  const onPasswordSubmit = async (data: any) => {
      if (data.newPassword !== data.confirmPassword) {
          toast.error("New passwords don't match");
          return;
      }
      try {
          await changePassword({ oldPassword: data.oldPassword, newPassword: data.newPassword }).unwrap();
          toast.success('Password changed successfully!');
          resetPassword();
          setIsPasswordEditing(false);
      } catch (error: any) {
          console.error('Password change error:', error);
          const errorMessage = error?.data?.message || error?.message || 'Failed to change password';
          toast.error(errorMessage);
      }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Personal Info */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
         <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
            </h2>
            <Button variant={isEditing ? "outline" : "primary"} size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel' : 'Edit Info'}
            </Button>
         </div>

         <div className="p-6">
            <form onSubmit={handleSubmitInfo(onInfoSubmit)} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                        label="Full Name" 
                        {...registerInfo('name')} 
                        disabled={!isEditing} 
                        icon={<User className="h-4 w-4 text-gray-500" />}
                    />
                    <Input 
                        label="Email Address" 
                        {...registerInfo('email')} 
                        disabled 
                        icon={<Mail className="h-4 w-4 text-gray-500" />}
                    />
                    <Input 
                        label="Phone Number" 
                        {...registerInfo('phone')} 
                        disabled={!isEditing} 
                        icon={<Phone className="h-4 w-4 text-gray-500" />}
                    />
                    <Input 
                        label="Address" 
                        {...registerInfo('address')} 
                        disabled={!isEditing} 
                         icon={<MapPin className="h-4 w-4 text-gray-500" />}
                    />
                 </div>
                 {isEditing && (
                     <div className="flex justify-end pt-4">
                         <Button type="submit" isLoading={isUpdating}>Save Changes</Button>
                     </div>
                 )}
            </form>
         </div>
      </div>

        {/* Vehicle Details (Driver Only) */}
        {isDriver && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <Car className="h-5 w-5" />
                        Vehicle Details
                    </h2>
                    <Button variant={isVehicleEditing ? "outline" : "primary"} size="sm" onClick={() => setIsVehicleEditing(!isVehicleEditing)}>
                        {isVehicleEditing ? 'Cancel' : 'Edit Vehicle'}
                    </Button>
                </div>
                <div className="p-6">
                    {isDriverLoading ? (
                        <p>Loading vehicle info...</p>
                    ) : (
                        <form onSubmit={handleSubmitVehicle(onVehicleSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="Make" {...registerVehicle('make')} disabled={!isVehicleEditing} placeholder="e.g. Toyota" />
                                <Input label="Model" {...registerVehicle('model')} disabled={!isVehicleEditing} placeholder="e.g. Corolla" />
                                <Input label="Year" type="number" {...registerVehicle('year')} disabled={!isVehicleEditing} placeholder="e.g. 2020" />
                                <Input label="License Plate" {...registerVehicle('licensePlate')} disabled={!isVehicleEditing} placeholder="e.g. 123-ABC" />
                                <Input label="Color" {...registerVehicle('color')} disabled={!isVehicleEditing} placeholder="e.g. White" />
                            </div>
                            {isVehicleEditing && (
                                <div className="flex justify-end pt-4">
                                    <Button type="submit" isLoading={isDriverUpdating}>Save Vehicle</Button>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </div>
        )}

        {/* Change Password */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Security
                </h2>
                <Button variant={isPasswordEditing ? "outline" : "primary"} size="sm" onClick={() => setIsPasswordEditing(!isPasswordEditing)}>
                    {isPasswordEditing ? 'Cancel' : 'Change Password'}
                </Button>
            </div>
             <div className="p-6">
                 {isPasswordEditing ? (
                    <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-6 max-w-md">
                        <Input label="Current Password" type="password" {...registerPassword('oldPassword')} required />
                        <Input label="New Password" type="password" {...registerPassword('newPassword')} required />
                        <Input label="Confirm New Password" type="password" {...registerPassword('confirmPassword')} required />
                        <div className="flex justify-end pt-4">
                            <Button type="submit" isLoading={isChangingPassword}>Update Password</Button>
                        </div>
                    </form>
                 ) : (
                     <p className="text-gray-500">Password is secure. Click "Change Password" to update it.</p>
                 )}
            </div>
        </div>
    </div>
  );
};
export default Profile;
