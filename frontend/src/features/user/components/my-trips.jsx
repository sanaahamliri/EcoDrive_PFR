import React, { useState, useEffect } from "react";
import UserTripService from "../services/tripService";

const MyTrips = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await UserTripService.getMyTrips();
      setTrips(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des trajets');
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (rideId) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await UserTripService.cancelBooking(rideId);
      setSuccess('Réservation annulée avec succès');
      
      // Rafraîchir la liste des trajets
      await fetchTrips();
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error canceling booking:', err);
      setError(err.response?.data?.error || 'Erreur lors de l\'annulation de la réservation');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isCancellable = (trip) => {
    console.log('Checking trip:', {
      id: trip._id,
      status: trip.status,
      departureTime: trip.departureTime,
      currentTime: new Date()
    });
    
    if (trip.status !== 'pending') {
      console.log('Not cancellable: status is not pending');
      return false;
    }
    
    const departureTime = new Date(trip.departureTime);
    const now = new Date();
    
    // Si la date de départ est dans le passé, on ne peut pas annuler
    if (departureTime < now) {
      console.log('Not cancellable: departure time is in the past');
      return false;
    }
    
    const hoursUntilDeparture = (departureTime - now) / (1000 * 60 * 60);
    
    console.log('Time check:', {
      hoursUntilDeparture,
      isCancellable: hoursUntilDeparture >= 24
    });
    
    return hoursUntilDeparture >= 24;
  };

  const handleContactDriver = (driver) => {
    setSelectedDriver(driver);
    setShowContactModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Mes trajets</h1>
        <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Calendrier
        </button>
      </div>

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

      <div className="w-full">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "upcoming"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              À venir
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "past"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Passés
            </button>
          </nav>
        </div>
        
        <div className="mt-6">
          {activeTab === "upcoming" && (
            <div className="space-y-4">
              {trips.length === 0 ? (
                <p className="text-center text-gray-500">Aucun trajet à venir</p>
              ) : (
                trips.map((trip) => {
                  console.log('Rendering trip:', {
                    id: trip._id,
                    status: trip.status,
                    isCancellable: isCancellable(trip)
                  });
                  
                  return (
                    <div key={trip._id} className="rounded-lg bg-white shadow overflow-hidden">
                      <div className="relative p-6 border-b">
                        {trip.status === "accepted" ? (
                          <span className="absolute right-6 top-6 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Confirmé
                          </span>
                        ) : (
                          <span className="absolute right-6 top-6 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            En attente
                          </span>
                        )}
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-lg font-semibold">
                            {trip.departure.city}
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                            {trip.destination.city}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(trip.departureTime)}
                          </div>
                          <div className="text-xl font-bold text-green-600 mt-2">{trip.price} DH</div>
                        </div>
                      </div>
                      
                      <div className="p-6 grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Conducteur</h3>
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-full overflow-hidden">
                                <img 
                                  src={trip.driver?.avatar || "/placeholder.svg"} 
                                  alt={`${trip.driver?.firstName} ${trip.driver?.lastName}`} 
                                  className="h-full w-full object-cover" 
                                />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {trip.driver?.firstName} {trip.driver?.lastName}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-3 w-3 fill-green-600 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                  <span>{trip.driver?.stats?.rating || 'N/A'}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Véhicule</h3>
                            <div className="space-y-1">
                              <div className="text-sm">
                                <span className="font-medium">Modèle:</span> {trip.vehicle?.model || 'Non spécifié'}
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Couleur:</span> {trip.vehicle?.color || 'Non spécifié'}
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Immatriculation:</span> {trip.vehicle?.plate || 'Non spécifié'}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Point de rendez-vous</h3>
                            <div className="flex items-start space-x-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <div>
                                <div className="font-medium">Gare routière de {trip.departure.city}</div>
                                <div className="text-sm text-gray-500">{trip.departure.address || 'Adresse non spécifiée'}</div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col space-y-2 mt-auto">
                            <button 
                              onClick={() => handleContactDriver(trip.driver)}
                              className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              Contacter le conducteur
                            </button>
                            {trip.status === 'pending' && (
                              <>
                                {isCancellable(trip) ? (
                                  <button 
                                    onClick={() => handleCancelBooking(trip._id)}
                                    className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
                                    disabled={loading}
                                  >
                                    Annuler la réservation
                                  </button>
                                ) : (
                                  <button 
                                    disabled
                                    className="inline-flex items-center rounded-md border border-transparent bg-red-400 px-4 py-2 text-sm font-medium text-white shadow-sm cursor-not-allowed"
                                  >
                                    Impossible d'annuler moins de 24h avant le départ
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === "past" && (
            <div className="rounded-lg bg-white shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Trajets passés</h2>
                <p className="text-sm text-gray-500">Historique de vos trajets précédents</p>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500">
                  Consultez l'historique complet de vos trajets dans la section "Historique".
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de contact */}
      {showContactModal && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Contacter le conducteur</h3>
              <button 
                onClick={() => setShowContactModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-12 w-12 rounded-full overflow-hidden">
                <img 
                  src={selectedDriver.avatar || "/placeholder.svg"} 
                  alt={`${selectedDriver.firstName} ${selectedDriver.lastName}`} 
                  className="h-full w-full object-cover" 
                />
              </div>
              <div>
                <div className="font-medium">
                  {selectedDriver.firstName} {selectedDriver.lastName}
                </div>
                <div className="text-sm text-gray-500">
                  Conducteur
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-2">Numéro de téléphone</div>
              <div className="text-lg font-semibold text-green-600">
                {selectedDriver.phone || 'Non disponible'}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTrips;
