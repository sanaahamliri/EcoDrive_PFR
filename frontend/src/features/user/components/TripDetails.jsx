import React from 'react';

const TripDetails = ({ trip, onClose }) => {
  if (!trip) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75 backdrop-blur-sm"></div>
        </div>

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Détails du trajet</h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Trip Route */}
                <div className="mb-6">
                  <div className="flex items-center text-lg font-semibold text-gray-900">
                    <div className="flex-1 text-right">{trip.departure?.city}</div>
                    <div className="mx-4">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                    <div className="flex-1 text-left">{trip.destination?.city}</div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 text-center">
                    {new Date(trip.departureTime).toLocaleString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "Africa/Casablanca"
                    })}
                  </div>
                </div>

                {/* Driver Information */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Informations du conducteur</h4>
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-white shadow">
                      <img
                        src={trip.driver?.avatar || "/placeholder.svg"}
                        alt={trip.driver?.firstName || "Conducteur"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {trip.driver ? `${trip.driver.firstName} ${trip.driver.lastName}` : "Conducteur"}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="mr-1 h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{trip.driver?.stats?.rating || "0"} / 5</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Détails du trajet</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Prix par personne</div>
                      <div className="text-lg font-semibold text-green-600">{trip.price} DH</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Places disponibles</div>
                      <div className="text-lg font-semibold text-gray-900">{trip.availableSeats}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Véhicule</div>
                      <div className="text-lg font-semibold text-gray-900">{trip.vehicle?.brand} {trip.vehicle?.model}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Couleur</div>
                      <div className="text-lg font-semibold text-gray-900">{trip.vehicle?.color}</div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                {trip.features && trip.features.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Options disponibles</h4>
                    <div className="flex flex-wrap gap-2">
                      {trip.features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails; 