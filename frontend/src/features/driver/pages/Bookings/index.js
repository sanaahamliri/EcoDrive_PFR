import React, { useState, useEffect } from 'react';
import DriverRideService from '../../services/rideService';

const Bookings = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const response = await DriverRideService.getMyRides();
      setRides(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des trajets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Mes Trajets et Réservations</h1>
          <p className="mt-2 text-sm text-gray-700">
            Liste de tous vos trajets et leurs réservations
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Trajet</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date & Heure</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Prix</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Places</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Réservations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {rides.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-3 py-4 text-center text-sm text-gray-500">
                        Aucun trajet trouvé
                      </td>
                    </tr>
                  ) : (
                    rides.map((ride) => (
                      <tr key={ride._id}>
                        <td className="whitespace-nowrap px-3 py-4">
                          <div className="text-sm text-gray-900">
                            {ride.departure.city} → {ride.destination.city}
                          </div>
                          <div className="text-xs text-gray-500">
                            {ride.departure.address} → {ride.destination.address}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatDate(ride.departureTime)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {ride.price} DH
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {ride.availableSeats - (ride.passengers?.length || 0)}/{ride.availableSeats}
                        </td>
                        <td className="px-3 py-4">
                          {ride.passengers && ride.passengers.length > 0 ? (
                            <div className="space-y-2">
                              {ride.passengers.map((passenger, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <img
                                    src={passenger.user.avatar || "https://via.placeholder.com/24"}
                                    alt=""
                                    className="h-6 w-6 rounded-full"
                                  />
                                  <span className="text-sm text-gray-900">
                                    {passenger.user.firstName} {passenger.user.lastName}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    ({passenger.bookedSeats} place{passenger.bookedSeats > 1 ? 's' : ''})
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Aucune réservation</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings; 