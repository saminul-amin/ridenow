import { useState } from 'react';
import { useGetAllUsersQuery, useUpdateUserStatusMutation } from '../../services/authApi';
import { Button } from '../../components/common/Button';
import { toast } from 'react-hot-toast';
import { Search, Ban, CheckCircle } from 'lucide-react';

const UserManagement = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    const { data, isLoading } = useGetAllUsersQuery({ 
        page, 
        limit: 10, 
        searchTerm, 
        role: roleFilter 
    });

    const [updateStatus, { isLoading: isUpdating }] = useUpdateUserStatusMutation();

    const handleStatusUpdate = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
        try {
            await updateStatus({ id: userId, status: newStatus }).unwrap();
            toast.success(`User ${newStatus === 'blocked' ? 'blocked' : 'activated'} successfully`);
        } catch (error) {
            toast.error('Failed to update user status');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            className="pl-9 w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        <option value="rider">Rider</option>
                        <option value="driver">Driver</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan={4} className="text-center py-4">Loading...</td></tr>
                        ) : data?.data?.users?.map((user: any) => (
                            <tr key={user._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${user.role === 'driver' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${user.status === 'blocked' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {user.status || 'active'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {user.role !== 'admin' && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className={user.status === 'blocked' ? 'text-green-600' : 'text-red-600'}
                                            onClick={() => handleStatusUpdate(user._id, user.status || 'active')}
                                            disabled={isUpdating}
                                        >
                                            {user.status === 'blocked' ? <CheckCircle size={16} /> : <Ban size={16} />}
                                            <span className="ml-1">{user.status === 'blocked' ? 'Unblock' : 'Block'}</span>
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
             {/* Pagination (Simple) */}
             <div className="p-4 border-t border-gray-100 flex justify-between items-center">
                <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    Previous
                </Button>
                <span className="text-sm text-gray-600">Page {data?.data?.meta?.page} of {data?.data?.meta?.totalPage}</span>
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
    );
};

export default UserManagement;
