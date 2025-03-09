import React from 'react';
import DashboardStats from './DashboardStats';
import UserList from '../../components/UserManagement/UserList';
import AdminStats from '../../components/Statistics/AdminStats';

const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Tableau de bord Administrateur
      </h1>
      
      <DashboardStats />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Utilisateurs récents</h2>
        <UserList />
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Statistiques globales</h2>
        <AdminStats />
      </div>
    </div>
  );
};

export default AdminDashboard; 