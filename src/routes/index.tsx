import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import Home from '../pages/Home';
import About from '../pages/About';
import Features from '../pages/Features';
import Contact from '../pages/Contact';
import FAQ from '../pages/FAQ';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import DashboardLayout from '../layout/DashboardLayout';
import RiderDashboard from '../pages/dashboard/RiderDashboard';
import DriverDashboard from '../pages/dashboard/DriverDashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import RideHistory from '../pages/dashboard/RideHistory';
import Profile from '../pages/dashboard/Profile';
import RideDetails from '../pages/dashboard/RideDetails';
import Earnings from '../pages/dashboard/Earnings';
import { useAppSelector } from '../app/hooks';
import { selectCurrentUser } from '../app/authSlice';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'features',
        element: <Features />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'faq',
        element: <FAQ />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHomeResolver />, // New helper to redirect based on role
      },
      {
        path: 'rider',
        element: <RiderDashboard />,
      },
      {
        path: 'driver',
        element: <DriverDashboard />,
      },
      {
        path: 'admin',
        element: <AdminDashboard />,
      },
      {
        path: 'admin',
        element: <AdminDashboard />,
      },
      {
        path: 'history',
        element: <RideHistory />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'earnings',
        element: <Earnings />,
      },
      {
        path: 'ride/:id',
        element: <RideDetails />,
      },
    ],
  },
]);

import { Navigate } from 'react-router-dom';

function DashboardHomeResolver() {
    const user = useAppSelector(selectCurrentUser);
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
    if (user.role === 'driver') return <Navigate to="/dashboard/driver" replace />;
    return <Navigate to="/dashboard/rider" replace />;
}

export default router;

