"use client"

import React from "react"
import rideService from "../services/tripService"

class TripSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      priceRange: [0, 300],
      showFilters: false,
      trips: [],
      loading: false,
      error: null,
      filters: {
        from: "",
        to: "",
        date: "",
        seats: "",
        maxPrice: 300,
        preferences: [],
      },
    }
  }

  componentDidMount() {
    this.fetchTrips({})
  }

  fetchTrips = async (filters = null) => {
    try {
      this.setState({ loading: true, error: null })

      console.log("Fetching trips with filters:", filters || {})
      const tripsData = await rideService.searchRides(filters || {})
      console.log("Received trips:", tripsData)

      this.setState({
        trips: tripsData || [],
        loading: false,
      })

      console.log("Trip data structure:", JSON.stringify(tripsData?.[0], null, 2))
    } catch (error) {
      console.error("Error fetching trips:", error)
      this.setState({
        trips: [],
        error: "Impossible de charger les trajets. Veuillez réessayer plus tard.",
        loading: false,
      })
    }
  }

  handleBooking = async (rideId) => {
    try {
      await rideService.bookRide(rideId)
      // Rafraîchir les trajets après la réservation
      this.fetchTrips()
    } catch (error) {
      this.setState({
        error: typeof error === "string" ? error : "Erreur lors de la réservation",
      })
    }
  }

  handleInputChange = (e) => {
    const { name, value } = e.target
    this.setState((prevState) => ({
      filters: {
        ...prevState.filters,
        [name]: value,
      },
    }))
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.fetchTrips(this.state.filters)
  }

  handlePriceRangeChange = (e) => {
    const maxPrice = Number.parseInt(e.target.value)
    this.setState((prevState) => ({
      priceRange: [0, maxPrice],
      filters: {
        ...prevState.filters,
        maxPrice,
      },
    }))
  }

  handlePreferenceChange = (preference) => {
    this.setState((prevState) => {
      const preferences = prevState.filters.preferences.includes(preference)
        ? prevState.filters.preferences.filter((p) => p !== preference)
        : [...prevState.filters.preferences, preference]

      return {
        filters: {
          ...prevState.filters,
          preferences,
        },
      }
    })
  }

  applyFilters = () => {
    this.toggleFilters()
    this.fetchTrips()
  }

  toggleFilters = () => {
    this.setState((prevState) => ({ showFilters: !prevState.showFilters }))
  }

  render() {
    const { trips, loading, error } = this.state

    const safeTrips = Array.isArray(trips) ? trips : []

    console.log("Rendering with trips:", safeTrips)

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Rechercher un trajet</h1>
          <button
            onClick={this.toggleFilters}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filtres
          </button>
        </div>

        {/* Filters Panel */}
        {this.state.showFilters && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <button onClick={this.toggleFilters} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-lg font-semibold">Filtres de recherche</h2>
              <p className="text-sm text-gray-500">Affinez votre recherche selon vos préférences</p>

              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Prix</h3>
                  <div className="flex items-center justify-between">
                    <span>{this.state.priceRange[0]} DH</span>
                    <span>{this.state.priceRange[1]} DH</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    step="10"
                    value={this.state.priceRange[1]}
                    onChange={this.handlePriceRangeChange}
                    className="w-full"
                  />
                </div>

                <hr className="my-4" />

                <div className="space-y-2">
                  <h3 className="font-medium">Heure de départ</h3>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2">
                    <option value="">Toute heure</option>
                    <option value="morning">Matin (6h - 12h)</option>
                    <option value="afternoon">Après-midi (12h - 18h)</option>
                    <option value="evening">Soir (18h - 00h)</option>
                  </select>
                </div>

                <hr className="my-4" />

                <div className="space-y-4">
                  <h3 className="font-medium">Préférences</h3>

                  <div className="flex items-center justify-between">
                    <label htmlFor="climatisation" className="text-sm">
                      Climatisation
                    </label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input type="checkbox" id="climatisation" className="sr-only" />
                      <div className="block h-6 bg-gray-300 rounded-full w-10"></div>
                      <div className="dot absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="non-fumeur" className="text-sm">
                      Non-fumeur
                    </label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input type="checkbox" id="non-fumeur" className="sr-only" />
                      <div className="block h-6 bg-gray-300 rounded-full w-10"></div>
                      <div className="dot absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="animaux" className="text-sm">
                      Animaux autorisés
                    </label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input type="checkbox" id="animaux" className="sr-only" />
                      <div className="block h-6 bg-gray-300 rounded-full w-10"></div>
                      <div className="dot absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="bagages" className="text-sm">
                      Bagages volumineux
                    </label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input type="checkbox" id="bagages" className="sr-only" />
                      <div className="block h-6 bg-gray-300 rounded-full w-10"></div>
                      <div className="dot absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition"></div>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="space-y-2">
                  <h3 className="font-medium">Note minimum du conducteur</h3>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2">
                    <option value="">Toutes les notes</option>
                    <option value="5">5 étoiles</option>
                    <option value="4">4 étoiles et plus</option>
                    <option value="3">3 étoiles et plus</option>
                  </select>
                </div>

                <button className="mt-4 w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                  Appliquer les filtres
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Form */}
        <form onSubmit={this.handleSearch} className="rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="grid gap-4 md:grid-cols-5">
              <div className="space-y-2">
                <label htmlFor="from" className="block text-sm font-medium text-gray-700">
                  Départ
                </label>
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <input
                    id="from"
                    name="from"
                    type="text"
                    value={this.state.filters.from}
                    onChange={this.handleInputChange}
                    placeholder="Ville de départ"
                    className="w-full rounded-md border border-gray-300 pl-9 py-2 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="to" className="block text-sm font-medium text-gray-700">
                  Destination
                </label>
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <input
                    id="to"
                    name="to"
                    type="text"
                    value={this.state.filters.to}
                    onChange={this.handleInputChange}
                    placeholder="Ville d'arrivée"
                    className="w-full rounded-md border border-gray-300 pl-9 py-2 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={this.state.filters.date}
                    onChange={this.handleInputChange}
                    className="w-full rounded-md border border-gray-300 pl-9 py-2 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="seats" className="block text-sm font-medium text-gray-700">
                  Passagers
                </label>
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <select
                    id="seats"
                    name="seats"
                    value={this.state.filters.seats}
                    onChange={this.handleInputChange}
                    className="w-full rounded-md border border-gray-300 pl-9 py-2 focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="">Nombre</option>
                    <option value="1">1 passager</option>
                    <option value="2">2 passagers</option>
                    <option value="3">3 passagers</option>
                    <option value="4">4 passagers</option>
                  </select>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? "Recherche..." : "Rechercher"}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Search Results */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Résultats de recherche</h2>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-4">Chargement...</div>
          ) : !safeTrips.length ? (
            <div className="text-center py-4 text-gray-500">Aucun trajet trouvé</div>
          ) : (
            <div className="space-y-4">
              {safeTrips.map((trip) => (
                <div key={trip._id} className="rounded-lg bg-white shadow overflow-hidden">
                  <div className="grid md:grid-cols-[1fr_auto] border-b">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center text-lg font-semibold">
                            {trip.departure}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="mx-2 h-4 w-4 text-gray-400"
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
                          <div className="text-sm text-gray-500">
                            {new Date(trip.date).toLocaleDateString("fr-FR", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })}{" "}
                            à {trip.time}
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0 text-right">
                          <div className="text-2xl font-bold text-green-600">{trip.price} DH</div>
                          <div className="text-sm text-gray-500">{trip.seats} places disponibles</div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {(trip.features || []).map((feature, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img
                          src={trip.driver?.image || "/placeholder.svg"}
                          alt={trip.driver?.name || "Conducteur"}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{trip.driver?.name || "Conducteur"}</div>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-1 h-3 w-3 fill-green-600 text-green-600"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>{trip.driver?.rating || "0"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4 md:mt-0">
                      <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                        Détails
                      </button>
                      <button className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700">
                        Réserver
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default TripSearch

