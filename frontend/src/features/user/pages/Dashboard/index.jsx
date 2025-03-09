import React from 'react';
import DashboardStats from './DashboardStats';
import SearchTripForm from '../../components/SearchTrip/SearchTripForm';
import BookingList from '../../components/BookingHistory/BookingList';

const UserDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Tableau de bord Passager
      </h1>
      
      <DashboardStats />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Rechercher un trajet</h2>
        <SearchTripForm />
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Mes réservations</h2>
        <BookingList />
      </div>
    </div>
  );
};

export default UserDashboard;
