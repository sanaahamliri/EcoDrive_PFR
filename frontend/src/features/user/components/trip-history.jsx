import React from "react"

class TripHistory extends React.Component {
  constructor(props) {
    super(props)

    // Mock data
    this.pastTrips = [
      {
        id: 1,
        departure: "Casablanca",
        destination: "Rabat",
        date: "2024-02-15",
        time: "08:00",
        price: 50,
        driver: {
          name: "Mohammed Ali",
          rating: 4.8,
          image: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        userRating: 5,
      },
      {
        id: 2,
        departure: "Marrakech",
        destination: "Agadir",
        date: "2024-02-05",
        time: "10:30",
        price: 120,
        driver: {
          name: "Sara Ahmed",
          rating: 4.9,
          image: "https://randomuser.me/api/portraits/women/1.jpg",
        },
        userRating: 4,
      },
      {
        id: 3,
        departure: "Tanger",
        destination: "Tétouan",
        date: "2024-01-27",
        time: "09:15",
        price: 40,
        driver: {
          name: "Karim Benali",
          rating: 4.7,
          image: "https://randomuser.me/api/portraits/men/2.jpg",
        },
        userRating: 5,
      },
      {
        id: 4,
        departure: "Fès",
        destination: "Meknès",
        date: "2024-01-18",
        time: "14:00",
        price: 35,
        driver: {
          name: "Leila Tazi",
          rating: 4.6,
          image: "https://randomuser.me/api/portraits/women/2.jpg",
        },
        userRating: 4,
      },
    ]
  }

  render() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Historique des trajets</h1>
          <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Exporter
          </button>
        </div>

        <div className="rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Période</label>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2">
                  <option value="all">Toutes les périodes</option>
                  <option value="month">Dernier mois</option>
                  <option value="3months">3 derniers mois</option>
                  <option value="6months">6 derniers mois</option>
                  <option value="year">Dernière année</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Destination</label>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2">
                  <option value="all">Toutes les destinations</option>
                  <option value="rabat">Rabat</option>
                  <option value="casablanca">Casablanca</option>
                  <option value="marrakech">Marrakech</option>
                  <option value="agadir">Agadir</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Recherche</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un trajet..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Vos trajets passés</h2>
          </div>
          <div className="p-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left font-medium">Date</th>
                  <th className="px-4 py-2 text-left font-medium">Trajet</th>
                  <th className="px-4 py-2 text-left font-medium">Conducteur</th>
                  <th className="px-4 py-2 text-left font-medium">Prix</th>
                  <th className="px-4 py-2 text-left font-medium">Votre note</th>
                  <th className="px-4 py-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.pastTrips.map((trip) => (
                  <tr key={trip.id} className="border-b">
                    <td className="px-4 py-4">
                      <div className="font-medium">
                        {new Date(trip.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                      <div className="text-sm text-gray-500">{trip.time}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium flex items-center">
                        {trip.departure}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mx-1 h-3 w-3 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                        {trip.destination}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full overflow-hidden">
                          <img
                            src={trip.driver.image || "/placeholder.svg"}
                            alt={trip.driver.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="font-medium">{trip.driver.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center rounded-full border border-gray-300 px-2.5 py-0.5 text-xs font-semibold">
                        {trip.price} DH
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 ${
                              star <= trip.userRating ? "fill-green-600 text-green-600" : "text-gray-300"
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-1 h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <span className="sr-only">Contacter</span>
                      </button>
                      <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Statistiques</h2>
          </div>
          <div className="p-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Total des trajets</div>
                <div className="text-2xl font-bold">12</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-gray-500">Distance totale</div>
                <div className="text-2xl font-bold">1250 km</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-gray-500">Économies totales</div>
                <div className="text-2xl font-bold">750 DH</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-gray-500">Note moyenne</div>
                <div className="text-2xl font-bold">4.8</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default TripHistory

