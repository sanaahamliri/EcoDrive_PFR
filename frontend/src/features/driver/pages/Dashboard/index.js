import React, { useState } from 'react';
import CreateTripForm from '../../components/TripManagement/CreateTripForm';

const DriverDashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    setSuccessMessage('Trajet créé avec succès !');
    setTimeout(() => setSuccessMessage(''), 3000);
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

      {showCreateForm && (
        <div className="mb-6">
          <CreateTripForm onSuccess={handleCreateSuccess} />
        </div>
      )}

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