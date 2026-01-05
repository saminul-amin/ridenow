import { useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';

const routeTitles: Record<string, string> = {
  '/': 'Home | RideNow',
  '/about': 'About Us | RideNow',
  '/features': 'Features | RideNow',
  '/contact': 'Contact Us | RideNow',
  '/faq': 'FAQ | RideNow',
  '/login': 'Login | RideNow',
  '/register': 'Create Account | RideNow',
  '/dashboard': 'Dashboard | RideNow',
  '/dashboard/rider': 'Rider Dashboard | RideNow',
  '/dashboard/driver': 'Driver Dashboard | RideNow',
  '/dashboard/admin': 'Admin Dashboard | RideNow',
  '/dashboard/history': 'Ride History | RideNow',
  '/dashboard/profile': 'Profile | RideNow',
  '/dashboard/earnings': 'Earnings | RideNow',
};

const PageTitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    
    // Check for exact matches first
    if (routeTitles[path]) {
      document.title = routeTitles[path];
      return;
    }

    // Handle dynamic routes
    if (matchPath('/dashboard/ride/:id', path)) {
      document.title = 'Ride Details | RideNow';
      return;
    }

    // Default fallback
    document.title = 'RideNow';
  }, [location]);

  return null;
};

export default PageTitleUpdater;
