import React from 'react';

const TripList = ({ trips, onDelete, onUpdate }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {trips.map((trip) => (
          <li key={trip._id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-green-600 truncate">
                    {trip.departure.city} → {trip.destination.city}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(trip.departureTime)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {trip.availableSeats} places disponibles
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {trip.price} DH
                  </span>
                </div>
              </div>

              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    Départ: {trip.departure.address}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <p>
                    Arrivée: {trip.destination.address}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => onUpdate(trip)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                >
                  Modifier
                </button>
                <button
                  onClick={() => onDelete(trip._id)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </li>
        ))}
        {trips.length === 0 && (
          <li className="px-4 py-8 text-center text-gray-500">
            Aucun trajet proposé pour le moment
          </li>
        )}
      </ul>
    </div>
  );
};

export default TripList; 