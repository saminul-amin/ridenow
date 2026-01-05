import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout, selectCurrentUser } from '../app/authSlice';
import { useGetMeQuery } from '../services/authApi';
import { Button } from '../components/common/Button';
import { Car, LayoutDashboard, History, User, LogOut, Menu, X, DollarSign } from 'lucide-react';
import { cn } from '../utils/cn';
import PageTransition from '../components/layout/PageTransition';

import PageTitleUpdater from '../components/common/PageTitleUpdater';

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: userData } = useGetMeQuery(undefined);
  const authUser = useAppSelector(selectCurrentUser);
  const user = userData?.data || authUser; // Prefer fresh data, fallback to auth state
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Guard if user is null (though ProtectedRoute handles this, for types we check)
  if (!user) return null;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    ...(user.role !== 'admin' ? [
        { name: 'Ride History', path: '/dashboard/history', icon: <History size={20} /> }
    ] : []),
    { name: 'Profile', path: '/dashboard/profile', icon: <User size={20} /> },
    // Role specific items can be conditionally added
    ...(user.role === 'driver' ? [
        { name: 'Earnings', path: '/dashboard/earnings', icon: <DollarSign size={20} /> }
    ] : []),
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <PageTitleUpdater />
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
           <Car className="h-8 w-8 text-black mr-2" />
           <span className="text-xl font-bold">RideNow</span>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/dashboard'} // Dashboard root exact match
                className={({ isActive }) =>
                  cn(
                    'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-gray-100 text-black'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                  )
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-4 px-4">
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-700">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between h-16 bg-white border-b border-gray-200 px-4">
            <div className="flex items-center">
                 <Car className="h-6 w-6 text-black mr-2" />
                 <span className="text-lg font-bold">RideNow</span>
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 -mr-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </header>

        {/* Mobile Menu */}
        {isOpen && (
            <div className="md:hidden fixed inset-0 z-40 flex">
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                    <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                       <span className="text-xl font-bold">Menu</span>
                        <button
                          onClick={() => setIsOpen(false)}
                          className="p-2 rounded-md text-gray-400 hover:text-gray-500"
                        >
                          <X size={24} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto py-4">
                        <nav className="px-2 space-y-1">
                            {navItems.map((item) => (
                              <NavLink
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                  cn(
                                    'flex items-center px-4 py-2 text-base font-medium rounded-md',
                                    isActive
                                      ? 'bg-gray-100 text-black'
                                      : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                                  )
                                }
                              >
                                <span className="mr-3">{item.icon}</span>
                                {item.name}
                              </NavLink>
                            ))}
                        </nav>
                    </div>
                     <div className="p-4 border-t border-gray-200">
                         <div className="flex items-center mb-4">
                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-700">
                              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="ml-3">
                              <p className="text-base font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                            </div>
                        </div>
                         <Button variant="ghost" className="w-full justify-start text-red-600" onClick={handleLogout}>
                            <LogOut className="mr-3 h-5 w-5" />
                            Logout
                         </Button>
                    </div>
                </div>
                <div className="flex-shrink-0 w-14" aria-hidden="true" onClick={() => setIsOpen(false)}></div>
            </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <PageTransition>
                <Outlet />
            </PageTransition>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
