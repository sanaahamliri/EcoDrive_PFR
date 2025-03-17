import React, { useState, useEffect } from 'react';
import DriverRideService from '../../services/rideService';

const Bookings = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const response = await DriverRideService.getMyRides();
      console.log('Rides data:', response.data);
      console.log('First ride passengers:', response.data[0]?.passengers);
      setRides(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des trajets');
      console.error('Error fetching rides:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (rideId, passengerId) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      console.log('Confirming booking:', { rideId, passengerId });
      if (!passengerId) {
        throw new Error('ID du passager manquant');
      }
      await DriverRideService.confirmBooking(rideId, passengerId);
      setSuccess('Réservation confirmée avec succès');
      
      await fetchRides();
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error confirming booking:', err);
      setError(err.response?.data?.error || err.message || 'Erreur lors de la confirmation de la réservation');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (rideId, passengerId) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      console.log('Rejecting booking:', { rideId, passengerId });
      await DriverRideService.rejectBooking(rideId, passengerId);
      setSuccess('Réservation rejetée avec succès');
      
      await fetchRides();
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error rejecting booking:', err);
      setError(err.response?.data?.error || 'Erreur lors du rejet de la réservation');
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
    <div className="px-6 py-4">
      <h1 className="text-2xl font-bold text-gray-900">Mes Trajets et Réservations</h1>
      <p className="text-gray-600">Gérez vos trajets et les demandes de réservation</p>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div className="mt-6 space-y-6">
        {rides.length === 0 ? (
          <p className="text-center text-gray-500">Aucun trajet trouvé</p>
        ) : (
          rides.map((ride) => (
            <div key={ride._id} className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{ride.departure.city} → {ride.destination.city}</h2>
                  <p className="text-sm text-gray-500">{formatDate(ride.departureTime)}</p>
                  <p className="text-sm text-gray-700 font-medium">{ride.price} DH</p>
                </div>
                <p className="text-sm text-gray-600">Places restantes : {ride.availableSeats - (ride.passengers?.length || 0)}/{ride.availableSeats}</p>
              </div>

              <div className="mt-4 space-y-2">
                {ride.passengers && ride.passengers.length > 0 ? (
                  ride.passengers.map((passenger) => {
                    console.log('Passenger data:', passenger);
                    return (
                      <div key={passenger._id || passenger.user?._id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <img
                            src={passenger.user?.avatar || "https://via.placeholder.com/24"}
                            alt=""
                            className="h-8 w-8 rounded-full"
                          />
                          <span className="text-sm text-gray-900 font-medium">
                            {passenger.user?.firstName} {passenger.user?.lastName} ({passenger.bookedSeats} place{passenger.bookedSeats > 1 ? 's' : ''})
                          </span>
                        </div>
                        {passenger.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleConfirm(ride._id, passenger.user._id)}
                              className="bg-green-500 text-white px-3 py-1 rounded-lg flex items-center hover:bg-green-600 transition"
                              disabled={loading}
                            >
                              ✓ Confirmer
                            </button>
                            <button
                              onClick={() => handleReject(ride._id, passenger.user._id)}
                              className="bg-red-500 text-white px-3 py-1 rounded-lg flex items-center hover:bg-red-600 transition"
                              disabled={loading}
                            >
                              ✕ Refuser
                            </button>
                          </div>
                        )}
                        {passenger.status === 'accepted' && (
                          <span className="text-sm text-green-600 font-medium">✓ Confirmé</span>
                        )}
                        {passenger.status === 'rejected' && (
                          <span className="text-sm text-red-600 font-medium">✕ Refusé</span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">Aucune réservation</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Bookings;
