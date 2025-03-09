import React from 'react';
import DashboardStats from './DashboardStats';
import TripList from '../../components/TripManagement/TripList';
import CreateTripForm from '../../components/TripManagement/CreateTripForm';

const DriverDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Tableau de bord Conducteur
      </h1>
      
      <DashboardStats />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Proposer un trajet</h2>
        <CreateTripForm />
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Mes trajets</h2>
        <TripList />
      </div>
    </div>
  );
};

export default DriverDashboard; 