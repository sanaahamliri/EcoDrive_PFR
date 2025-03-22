import React, { useState, useEffect } from "react";
import UserService from "../services/userService";
import { toast } from "react-toastify";
import { API_URL } from "../../../config/constants";

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

export default function DashboardSidebar({
  activeView,
  setActiveView,
  sidebarOpen,
  setSidebarOpen,
}) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await UserService.getProfile();
        console.log("Sidebar user data:", response); // Pour debug
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Erreur lors du chargement des données utilisateur");
      }
    };

    loadUserData();
  }, []);

  const menuItems = [
    {
      id: "dashboard",
      label: "Accueil",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      id: "trips",
      label: "Mes trajets",
      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 10a3 3 0 11-6 0 3 3 0 016 0z",
    },
    {
      id: "history",
      label: "Historique",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },

    {
      id: "profile",
      label: "Profil",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
  ];

  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  const getAvatarColor = (name) => {
    const colors = [
      "bg-blue-600",
      "bg-green-600",
      "bg-purple-600",
      "bg-pink-600",
      "bg-yellow-600",
      "bg-red-600",
      "bg-indigo-600",
    ];

    if (!name) return colors[0];

    const charCodes = name.split("").map((char) => char.charCodeAt(0));
    const sum = charCodes.reduce((acc, curr) => acc + curr, 0);
    return colors[sum % colors.length];
  };

  const isDefaultAvatar = (avatar) => {
    return !avatar || avatar === "default-avatar.jpg";
  };

  return (
    <div
      className={`bg-white shadow-lg transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-20"
      } fixed inset-y-0 left-0 z-30 md:relative`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-gray-200 pb-2">
          <div className="flex items-center px-4 py-3">
            <div className="flex items-center gap-2">
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
              {sidebarOpen && (
                <div className="font-semibold text-lg">EcoDrive</div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="ml-auto text-gray-500 hover:text-gray-900 md:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center w-full rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    activeView === item.id
                      ? "bg-green-50 text-green-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.icon}
                    />
                  </svg>
                  {sidebarOpen && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}
                  {sidebarOpen && item.badge && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-2 px-3 py-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full overflow-hidden">
              {userData?.avatarUrl ? (
                <img
                  src={userData.avatarUrl}
                  alt={userData?.firstName}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    console.log("Image load error:", {
                      attempted: userData.avatarUrl,
                    });
                    e.target.onerror = null;
                    setUserData((prev) => ({
                      ...prev,
                      avatarUrl: null,
                    }));
                  }}
                />
              ) : (
                <div
                  className={`h-full w-full flex items-center justify-center ${getAvatarColor(
                    `${userData?.firstName} ${userData?.lastName}`
                  )} text-white text-sm font-medium`}
                >
                  {userData
                    ? getInitials(userData.firstName, userData.lastName)
                    : ""}
                </div>
              )}
            </div>
            {sidebarOpen && userData ? (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {`${userData.firstName || ""} ${userData.lastName || ""}`}
                </p>
                <p className="text-xs text-gray-500">
                  {userData?.role === "driver" ? "Conducteur" : "Passager"}
                </p>
              </div>
            ) : (
              sidebarOpen && (
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Chargement...</p>
                </div>
              )
            )}
          </div>
          {sidebarOpen && (
            <button className="mt-4 flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Déconnexion</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
