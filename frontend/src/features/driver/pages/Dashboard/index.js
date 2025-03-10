import React, { useState, useEffect } from 'react';
import { 
  CurrencyDollarIcon,
  UserGroupIcon,
  LocationMarkerIcon,
  StarIcon
} from '@heroicons/react/outline';
import CreateTripForm from '../../components/TripManagement/CreateTripForm';
import TripList from '../../components/TripManagement/TripList';
import EditTripForm from '../../components/TripManagement/EditTripForm';
import DriverRideService from '../../services/rideService';

const StatCard = ({ title, value, icon: Icon, change }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-6 w-6 text-gray-400" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {value}
              </div>
              {change && (
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {change >= 0 ? '+' : ''}{change}%
                </div>
              )}
            </dd>
          </dl>
        </div>
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
  const [editingTrip, setEditingTrip] = useState(null);

  // Charger les trajets au chargement du composant
  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await DriverRideService.getMyRides();
      setTrips(response.data || []);
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
    loadTrips(); // Recharger la liste des trajets
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
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Proposer un trajet
        </button>
      </div>

      {/* Messages de succès/erreur */}
      {successMessage && (
        <div className="mt-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Statistiques */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Revenus totaux"
          value="2,500 DH"
          icon={CurrencyDollarIcon}
          change={12}
        />
        <StatCard
          title="Passagers transportés"
          value="48"
          icon={UserGroupIcon}
          change={4}
        />
        <StatCard
          title="Trajets effectués"
          value="24"
          icon={LocationMarkerIcon}
          change={-2}
        />
        <StatCard
          title="Note moyenne"
          value="4.8"
          icon={StarIcon}
          change={8}
        />
      </div>

      {/* Trajets récents */}
      <div className="mt-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h2 className="text-xl font-semibold text-gray-900">Trajets récents</h2>
            <p className="mt-2 text-sm text-gray-700">
              Liste de vos derniers trajets proposés et leur statut.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="mt-6">
            <TripList
              trips={trips}
              onDelete={handleDelete}
              onUpdate={(trip) => setEditingTrip(trip)}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateForm && (
        <CreateTripForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
      
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