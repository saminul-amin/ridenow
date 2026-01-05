

import { useState } from 'react';
import { BarChart as BarChartIcon, Users, Clock } from 'lucide-react';
import AdminAnalytics from './AdminAnalytics';
import UserManagement from './UserManagement';
import AdminRideHistory from './AdminRideHistory';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'rides'>('analytics');

  return (
    <div>
      <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-500">Manage your platform efficiently.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
          <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'analytics' 
                  ? 'border-black text-black' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
              <BarChartIcon size={18} />
              Analytics
          </button>
          <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'users' 
                  ? 'border-black text-black' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
              <Users size={18} />
              User Management
          </button>
          <button
              onClick={() => setActiveTab('rides')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'rides' 
                  ? 'border-black text-black' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
              <Clock size={18} />
              Ride History
          </button>
      </div>

      {/* Content */}
      <div className="transition-all duration-300">
          {activeTab === 'analytics' && <AdminAnalytics />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'rides' && <AdminRideHistory />}
      </div>
    </div>
  );
};

export default AdminDashboard;
