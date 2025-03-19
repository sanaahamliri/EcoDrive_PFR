import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DriverRideService from '../../services/rideService';
import CreateTripForm from '../../components/TripManagement/CreateTripForm';
import TripList from '../../components/TripManagement/TripList';
import EditTripForm from '../../components/TripManagement/EditTripForm';

const StatCard = ({ title, value, icon, description }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-green-100">
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-3xl font-bold text-green-600">{value}</p>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
    </div>
  </div>
);

const DriverDashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalTrips: 0,
    upcomingTrips: 0,
    totalRevenue: 0,
    totalPassengers: 0
  });
  const [editingTrip, setEditingTrip] = useState(null);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await DriverRideService.getMyRides();
      setTrips(response.data || []);
      
      // Calcule des statistiques
      const now = new Date();
      const upcomingTrips = response.data.filter(trip => new Date(trip.departureTime) > now);
      const revenue = response.data.reduce((total, trip) => {
        return total + (trip.price * (trip.passengers?.length || 0));
      }, 0);
      const passengers = response.data.reduce((total, trip) => {
        return total + (trip.passengers?.length || 0);
      }, 0);

      setStats({
        totalTrips: response.data.length,
        upcomingTrips: upcomingTrips.length,
        totalRevenue: revenue,
        totalPassengers: passengers
      });

    } catch (err) {
      console.error('Erreur de chargement:', err);
      setError(err.message || 'Erreur lors du chargement des trajets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    setSuccessMessage('Trajet créé avec succès !');
    loadTrips();
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDelete = async (tripId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce trajet ?')) {
      try {
        await DriverRideService.deleteRide(tripId);
        setSuccessMessage('Trajet supprimé avec succès !');
        loadTrips();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError('Erreur lors de la suppression du trajet');
      }
    }
  };

  const handleUpdate = async (tripData) => {
    try {
      await DriverRideService.updateRide(editingTrip._id, tripData);
      setSuccessMessage('Trajet modifié avec succès !');
      setEditingTrip(null);
      loadTrips();
    } catch (err) {
      setError(err.message || 'Erreur lors de la modification du trajet');
    }
  };

  return (
    <div className="p-6">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {/* En-tête */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
        >
          <span className="text-xl mr-2">📅</span>
          Proposer un trajet
        </button>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <StatCard
          title="Passagers"
          value={stats.totalPassengers}
          icon="👥"
        />
        <StatCard
          title="Revenus"
          value={`${stats.totalRevenue} DH`}
          icon="💰"
        />
      </div>

      {/* Formulaire de création */}
      {showCreateForm && (
        <div className="mb-8">
          <CreateTripForm 
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {/* Liste des trajets */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Mes trajets récents
          </h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            </div>
          ) : (
            <TripList
              trips={trips}
              onDelete={handleDelete}
              onUpdate={(trip) => setEditingTrip(trip)}
            />
          )}
        </div>
      </div>

      {/* Modal de modification */}
      {editingTrip && (
        <EditTripForm
          trip={editingTrip}
          onUpdate={handleUpdate}
          onCancel={() => setEditingTrip(null)}
        />
      )}
    </div>
  );
};

export default DriverDashboard;