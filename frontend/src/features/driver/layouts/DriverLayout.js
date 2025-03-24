import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthService from "../../../services/authService";
import api from "../../../config/axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const DEFAULT_AVATAR = "/images/default-avatar.png";

const navigation = [
  { name: "Tableau de bord", href: "/driver/dashboard", icon: "🏠" },
  { name: "Mes trajets", href: "/driver/trips", icon: "📅" },
  { name: "Réservations", href: "/driver/bookings", icon: "👥" },
  { name: "Profile", href: "/driver/profile", icon: "🛠" },
];

const getBackgroundColor = (name) => {
  const colors = [
    "bg-blue-600",
    "bg-green-600",
    "bg-purple-600",
    "bg-yellow-600",
    "bg-red-600",
    "bg-indigo-600",
  ];
  const index =
    name?.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
};

const UserAvatar = ({ user }) => {
  if (!user) return null;

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`;
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`;

  if (user.avatarUrl) {
    return (
      <div className="relative">
        <img
          className="h-8 w-8 rounded-full object-cover"
          src={user.avatarUrl}
          alt={fullName}
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextElementSibling.style.display = "flex";
          }}
        />
        <div
          className={`h-8 w-8 rounded-full hidden items-center justify-center ${getBackgroundColor(
            fullName
          )} text-white`}
        >
          {initials}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-8 w-8 rounded-full flex items-center justify-center ${getBackgroundColor(
        fullName
      )} text-white`}
    >
      {initials}
    </div>
  );
};

const DriverLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(AuthService.getUser());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/api/v1/users/me");
        const updatedUserData = response.data.data;
        console.log("Données utilisateur reçues:", updatedUserData);
        console.log("URL avatar reçue:", updatedUserData.avatar);
        AuthService.updateUser(updatedUserData);
        setUserData(updatedUserData);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données utilisateur:",
          error
        );
      }
    };

    fetchUserData();
  }, [location.pathname]);

  // Calculer le pourcentage de complétion du profil
  const calculateProfileCompletion = () => {
    const requiredFields = [
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.phoneNumber,
      userData.driverInfo?.carModel,
      userData.driverInfo?.carYear,
      userData.driverInfo?.licensePlate,
      userData.avatarUrl || (userData.avatar && userData.avatar.data),
    ];

    const completedFields = requiredFields.filter((field) => field).length;
    return Math.round((completedFields / requiredFields.length) * 100);
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar pour mobile */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          sidebarOpen ? "" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        ></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            ></button>
          </div>
          {/* Contenu Sidebar Mobile */}
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <div className="rounded-md bg-green-600 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-white"
                >
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" />
                  <path d="M6 17h9" />
                  <circle cx="8" cy="17" r="2" />
                  <circle cx="13" cy="17" r="2" />
                </svg>
              </div>
              <div className="font-semibold text-lg ml-2">EcoDrive</div>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                >
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
            <div className="flex-shrink-0 flex items-center px-4">
              <div className="rounded-md bg-green-600 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-white"
                >
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" />
                  <path d="M6 17h9" />
                  <circle cx="8" cy="17" r="2" />
                  <circle cx="13" cy="17" r="2" />
                </svg>
              </div>
              <div className="font-semibold text-lg ml-2">EcoDrive</div>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center w-full rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? "bg-green-50 text-green-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="flex-1 truncate">{item.name}</span>
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
              ></button>
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {/* Notifications */}
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"></button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <UserAvatar user={userData} />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-700">{`${
                      userData?.firstName || ""
                    } ${userData?.lastName || ""}`}</p>
                    <p className="text-xs text-gray-500">Conducteur</p>
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
                            style={{
                              width: `${calculateProfileCompletion()}%`,
                            }}
                          ></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 text-right">
                          {calculateProfileCompletion()}%
                        </p>
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
        <main className="flex-1 pb-8">{children}</main>
      </div>
    </div>
  );
};

export default DriverLayout;
