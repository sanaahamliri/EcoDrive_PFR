import React, { useState, useEffect } from 'react';
import CreateTripForm from '../../components/TripManagement/CreateTripForm';
import TripList from '../../components/TripManagement/TripList';
import DriverRideService from '../../services/rideService';

const DriverDashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleUpdate = (trip) => {
    console.log('Modification du trajet:', trip);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Tableau de bord Conducteur
        </h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          {showCreateForm ? 'Annuler' : 'Proposer un trajet'}
        </button>
      </div>

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

      {showCreateForm && (
        <div className="mb-6">
          <CreateTripForm onSuccess={handleCreateSuccess} />
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Mes trajets proposés
        </h2>
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : (
          <TripList
            trips={trips}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Trajets proposés</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Trajets à venir</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Revenus totaux</h3>
          <p className="text-3xl font-bold text-green-600">0 DH</p>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;