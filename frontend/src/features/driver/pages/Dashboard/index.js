import React, { useState, useEffect } from "react";
import DriverRideService from "../../services/rideService";

const StatCard = ({ title, value, icon, description }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-green-100">
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-3xl font-bold text-green-600">{value}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    </div>
  </div>
);

const DriverDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalTrips: 0,
    upcomingTrips: 0,
    totalRevenue: 0,
    totalPassengers: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await DriverRideService.getMyRides();

      const now = new Date();
      const upcomingTrips = response.data.filter(
        (trip) => new Date(trip.departureTime) > now
      );
      const revenue = response.data.reduce(
        (total, trip) => total + trip.price * (trip.passengers?.length || 0),
        0
      );
      const passengers = response.data.reduce(
        (total, trip) => total + (trip.passengers?.length || 0),
        0
      );

      setStats({
        totalTrips: response.data.length,
        upcomingTrips: upcomingTrips.length,
        totalRevenue: revenue,
        totalPassengers: passengers,
      });
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des statistiques");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord</h1>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Statistiques */}
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Trajets proposés"
            value={stats.totalTrips}
            icon="📍"
          />
          <StatCard
            title="Trajets à venir"
            value={stats.upcomingTrips}
            icon="📅"
          />
          <StatCard title="Passagers" value={stats.totalPassengers} icon="👥" />
          <StatCard
            title="Revenus"
            value={`${stats.totalRevenue} DH`}
            icon="💰"
          />
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
