import React from 'react';

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Mes réservations</h3>
        <p className="text-3xl font-bold">0</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Trajets effectués</h3>
        <p className="text-3xl font-bold">0</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Économies réalisées</h3>
        <p className="text-3xl font-bold">0 DH</p>
      </div>
    </div>
  );
};

export default DashboardStats; 