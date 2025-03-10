import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  CalendarIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  Cog6ToothIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import AuthService from '../../../services/authService';

const navigation = [
  { name: 'Tableau de bord', href: '/driver/dashboard', icon: HomeIcon },
  { name: 'Mes trajets', href: '/driver/trips', icon: CalendarIcon },
  { name: 'Réservations', href: '/driver/bookings', icon: UserGroupIcon },
  { name: 'Statistiques', href: '/driver/stats', icon: ChartBarIcon },
  { name: 'Paramètres', href: '/driver/settings', icon: Cog6ToothIcon },
];

const DriverLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = AuthService.getUser();

  // Calculer le pourcentage de complétion du profil
  const calculateProfileCompletion = () => {
    const requiredFields = [
      user.firstName,
      user.lastName,
      user.email,
      user.phoneNumber,
      user.driverInfo?.carModel,
      user.driverInfo?.carYear,
      user.driverInfo?.licensePlate,
      user.driverInfo?.drivingLicense,
      user.avatar
    ];
    
    const completedFields = requiredFields.filter(field => field).length;
    return Math.round((completedFields / requiredFields.length) * 100);
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar pour mobile */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          {/* Contenu Sidebar Mobile */}
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <img className="h-8 w-auto" src="/logo.png" alt="Logo" />
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                >
                  <item.icon
                    className={`${
                      location.pathname === item.href ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-4 flex-shrink-0 h-6 w-6`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Sidebar pour desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <img className="h-8 w-auto" src="/logo.png" alt="Logo" />
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon
                    className={`${
                      location.pathname === item.href ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 flex-shrink-0 h-6 w-6`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Barre de navigation supérieure */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 flex-shrink-0">
          <div className="flex-1 px-4 flex justify-between h-16">
            <div className="flex-1 flex">
              <button
                type="button"
                className="lg:hidden px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                onClick={() => setSidebarOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {/* Notifications */}
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                <BellIcon className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="max-w-xs flex items-center text-sm rounded-full focus:outline-none"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.avatar || "https://via.placeholder.com/40"}
                      alt=""
                    />
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-700">{`${user.firstName} ${user.lastName}`}</p>
                      <p className="text-xs text-gray-500">Conducteur</p>
                    </div>
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                    <div className="px-4 py-3">
                      <p className="text-sm text-gray-900">Profil complété à</p>
                      <div className="mt-2">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 rounded-full h-2"
                            style={{ width: `${calculateProfileCompletion()}%` }}
                          ></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 text-right">{calculateProfileCompletion()}%</p>
                      </div>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/driver/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Mon profil
                      </Link>
                      <Link
                        to="/driver/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Paramètres
                      </Link>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                      >
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Zone de contenu principal */}
        <main className="flex-1 pb-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DriverLayout; 