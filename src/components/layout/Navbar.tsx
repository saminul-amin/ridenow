import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Car, LogOut } from 'lucide-react';
import { Button } from '../common/Button';
import { cn } from '../../utils/cn';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout, selectCurrentUser } from '../../app/authSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Features', path: '/features' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Car className="h-8 w-8 text-black" />
              <span className="text-xl font-bold tracking-tight">RideNow</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium transition-colors hover:text-black',
                    isActive ? 'text-black' : 'text-gray-500'
                  )
                }
              >
                {link.name}
              </NavLink>
            ))}
            {user ? (
               <div className="flex items-center gap-4">
                 <span className="text-sm font-medium text-gray-700">Hi, {user.name}</span>
                 <Link to="/dashboard">
                   <Button size="sm">Dashboard</Button>
                 </Link>
                 <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                 </Button>
               </div>
            ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'block px-3 py-2 rounded-md text-base font-medium',
                    isActive
                      ? 'bg-gray-100 text-black'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                  )
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="mt-4 flex flex-col gap-2 px-3">
              {user ? (
                 <>
                    <div className="px-3 py-2 text-base font-medium text-gray-800 border-b border-gray-100 mb-2">
                        Hi, {user.name}
                    </div>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                        <Button className="w-full">Dashboard</Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start text-red-600" onClick={() => { handleLogout(); setIsOpen(false); }}>
                        Logout
                    </Button>
                 </>
              ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                        <Button className="w-full">Sign Up</Button>
                    </Link>
                  </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
