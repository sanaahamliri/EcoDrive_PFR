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
      success: null,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      },
      filters: {
        from: "",
        to: "",
        date: "",
        seats: "",
        maxPrice: 300,
        preferences: [],
        driverRating: "",
        departureTime: "",
      },
    }
  }

  componentDidMount() {
    this.fetchTrips({})
  }

  fetchTrips = async (filters = null) => {
    try {
      this.setState({ loading: true, error: null })
      const { currentPage } = this.state.pagination
      
      console.log("Fetching trips with filters:", filters || {})
      const response = await rideService.searchRides(filters || {}, currentPage)
      console.log("Received trips:", response)

      this.setState({
        trips: response.data || [],
        loading: false,
        pagination: {
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          hasNext: response.pagination?.next !== undefined,
          hasPrev: response.pagination?.prev !== undefined
        }
      })

      console.log("Trip data structure:", JSON.stringify(response.data?.[0], null, 2))
    } catch (error) {
      console.error("Error fetching trips:", error)
      this.setState({
        trips: [],
        error: "Impossible de charger les trajets. Veuillez réessayer plus tard.",
        loading: false
      })
    }
  }

  handleBooking = async (rideId, seats = 1) => {
    try {
      this.setState({ loading: true, error: null, success: null })
      await rideService.bookRide(rideId, seats)
      
      this.setState({
        success: "Votre demande de réservation a été envoyée au conducteur. Vous serez notifié dès qu\'il aura confirmé votre réservation.",
        loading: false
      })
      
      setTimeout(() => {
        this.setState({ success: null })
      }, 5000)
      
      this.fetchTrips(this.getCleanFilters())
    } catch (error) {
      this.setState({
        error: typeof error === "string" ? error : "Erreur lors de la réservation",
        loading: false,
        success: null
      })

      if (error.includes("connecter")) {
        localStorage.setItem('redirectAfterLogin', window.location.pathname)
        window.location.href = '/login'
      }
    }
  }
  getCleanFilters = () => {
    return Object.entries(this.state.filters).reduce((acc, [key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        acc[key] = value
      }
      return acc
    }, {})
  }
  handleInputChange = (e) => {
    const { name, value } = e.target
    this.setState(
      (prevState) => ({
        filters: {
          ...prevState.filters,
          [name]: value,
        },
      }),
      () => this.fetchTrips(this.getCleanFilters()),
    )
  }

  handlePriceRangeChange = (e) => {
    const maxPrice = Number.parseInt(e.target.value)
    this.setState(
      (prevState) => ({
        priceRange: [0, maxPrice],
        filters: {
          ...prevState.filters,
          maxPrice,
        },
      }),
      () => this.fetchTrips(this.getCleanFilters()),
    )
  }

  handlePreferenceChange = (preference) => {
    this.setState(
      (prevState) => {
        const preferences = prevState.filters.preferences.includes(preference)
          ? prevState.filters.preferences.filter((p) => p !== preference)
          : [...prevState.filters.preferences, preference]

        return {
          filters: {
            ...prevState.filters,
            preferences,
          },
        }
      },
      () => this.fetchTrips(this.getCleanFilters()),
    )
  }

  handleDriverRatingChange = (e) => {
    this.setState(
      (prevState) => ({
        filters: {
          ...prevState.filters,
          driverRating: e.target.value,
        },
      }),
      () => this.fetchTrips(this.getCleanFilters()),
    )
  }

  handleDepartureTimeChange = (e) => {
    this.setState(
      (prevState) => ({
        filters: {
          ...prevState.filters,
          departureTime: e.target.value,
        },
      }),
      () => this.fetchTrips(this.getCleanFilters()),
    )
  }

  handleSearch = (e) => {
    if (e) e.preventDefault()
    this.fetchTrips(this.getCleanFilters())
  }

  toggleFilters = () => {
    this.setState((prevState) => ({ showFilters: !prevState.showFilters }))
  }

  handlePageChange = (newPage) => {
    this.setState(
      prevState => ({
        pagination: {
          ...prevState.pagination,
          currentPage: newPage
        }
      }),
      () => this.fetchTrips(this.getCleanFilters())
    )
  }

  renderFilterPanel() {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            this.toggleFilters();
          }
        }}
      >
        <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300 animate-fadeIn">
          <div className="absolute -top-3 -right-3">
            <button
              onClick={this.toggleFilters}
              className="bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 text-gray-500 hover:text-gray-700 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Fermer les filtres"
            >
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
          </div>

          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-full bg-green-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600"
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
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Filtres avancés</h2>
              <p className="text-sm text-gray-500">Les résultats se mettent à jour automatiquement</p>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-700 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Prix maximum
                </h3>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  {this.state.filters.maxPrice} DH
                </span>
              </div>
              <div className="px-1">
                <input
                  type="range"
                  min="0"
                  max="300"
                  step="10"
                  value={this.state.filters.maxPrice}
                  onChange={this.handlePriceRangeChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>0 DH</span>
                  <span>150 DH</span>
                  <span>300 DH</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
              <h3 className="font-medium text-gray-700 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Heure de départ
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => this.handleDepartureTimeChange({ target: { value: "morning" } })}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                    this.state.filters.departureTime === "morning"
                      ? "border-green-600 bg-green-50 text-green-700 shadow-md"
                      : "border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 mb-1 ${this.state.filters.departureTime === "morning" ? "text-green-600" : "text-gray-400"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span className="text-xs font-medium">Matin</span>
                  <span className="text-xs">6h - 12h</span>
                </button>
                <button
                  type="button"
                  onClick={() => this.handleDepartureTimeChange({ target: { value: "afternoon" } })}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                    this.state.filters.departureTime === "afternoon"
                      ? "border-green-600 bg-green-50 text-green-700 shadow-md"
                      : "border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 mb-1 ${this.state.filters.departureTime === "afternoon" ? "text-green-600" : "text-gray-400"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span className="text-xs font-medium">Après-midi</span>
                  <span className="text-xs">12h - 18h</span>
                </button>
                <button
                  type="button"
                  onClick={() => this.handleDepartureTimeChange({ target: { value: "evening" } })}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                    this.state.filters.departureTime === "evening"
                      ? "border-green-600 bg-green-50 text-green-700 shadow-md"
                      : "border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 mb-1 ${this.state.filters.departureTime === "evening" ? "text-green-600" : "text-gray-400"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                  <span className="text-xs font-medium">Soir</span>
                  <span className="text-xs">18h - 00h</span>
                </button>
              </div>
              {this.state.filters.departureTime && (
                <button
                  type="button"
                  onClick={() => this.handleDepartureTimeChange({ target: { value: "" } })}
                  className="text-xs text-green-600 hover:text-green-700 mt-1 transition-colors flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Réinitialiser l'heure
                </button>
              )}
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
              <h3 className="font-medium text-gray-700 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                Préférences
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    id: "non-fumeur",
                    label: "Non-fumeur",
                    icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
                  },
                  {
                    id: "musique",
                    label: "Musique",
                    icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
                  },
                  {
                    id: "animaux",
                    label: "Animaux autorisés",
                    icon: "M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z",
                  },
                ].map((pref) => (
                  <div
                    key={pref.id}
                    onClick={() => this.handlePreferenceChange(pref.id)}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                      this.state.filters.preferences.includes(pref.id)
                        ? "border-green-600 bg-green-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 p-2 rounded-full mr-3 ${
                        this.state.filters.preferences.includes(pref.id)
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={pref.icon} />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <div
                        className={`font-medium ${
                          this.state.filters.preferences.includes(pref.id) ? "text-green-700" : "text-gray-700"
                        }`}
                      >
                        {pref.label}
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        this.state.filters.preferences.includes(pref.id)
                          ? "border-green-600 bg-green-600"
                          : "border-gray-300"
                      }`}
                    >
                      {this.state.filters.preferences.includes(pref.id) && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
              <h3 className="font-medium text-gray-700 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                Note minimum du conducteur
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "3", label: "3+" },
                  { value: "4", label: "4+" },
                  { value: "5", label: "5" },
                ].map((rating) => (
                  <button
                    key={rating.value}
                    type="button"
                    onClick={() => this.handleDriverRatingChange({ target: { value: rating.value } })}
                    className={`flex items-center justify-center p-3 rounded-lg border transition-all ${
                      this.state.filters.driverRating === rating.value
                        ? "border-green-600 bg-green-50 text-green-700 shadow-md"
                        : "border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 mr-1 ${this.state.filters.driverRating === rating.value ? "text-yellow-400" : "text-gray-400"}`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        stroke="none"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                      <span className="font-medium">{rating.label}</span>
                    </div>
                  </button>
                ))}
              </div>
              {this.state.filters.driverRating && (
                <button
                  type="button"
                  onClick={() => this.handleDriverRatingChange({ target: { value: "" } })}
                  className="text-xs text-green-600 hover:text-green-700 mt-1 transition-colors flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Toutes les notes
                </button>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={this.toggleFilters}
                className="mt-6 w-full rounded-lg bg-gradient-to-r from-green-600 to-green-500 px-4 py-3.5 text-white font-medium hover:from-green-700 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center transform hover:-translate-y-0.5"
              >
                <span>Appliquer les filtres</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { trips, loading, error } = this.state

    const safeTrips = Array.isArray(trips) ? trips : []

    console.log("Rendering with trips:", safeTrips)

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Rechercher un trajet</h1>
          <button
            onClick={this.toggleFilters}
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-all duration-300 hover:border-green-300 hover:shadow-md"
          >
            <div className="p-1 rounded-full bg-green-50 mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-green-600"
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
            </div>
            Filtres avancés
          </button>
        </div>

        {this.state.showFilters && this.renderFilterPanel()}

        {/* Search Form */}
        <form
          onSubmit={this.handleSearch}
          className="rounded-xl bg-white shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100"
        >
          <div className="bg-gradient-to-r from-green-600 via-green-500 to-green-400 p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20 transform rotate-45"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-10 -mb-10"></div>
            <h2 className="text-xl font-bold relative z-10">Trouvez votre prochain trajet</h2>
            <p className="text-sm text-green-100 mt-1 relative z-10">
              Recherchez parmi des milliers de trajets à petits prix
            </p>
          </div>
          <div className="p-6 bg-gradient-to-b from-white to-gray-50">
            <div className="grid gap-6 md:grid-cols-5">
              <div className="space-y-2 md:col-span-1">
                <label htmlFor="from" className="block text-sm font-medium text-gray-700 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-green-600"
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
                  </svg>
                  Départ
                </label>
                <div className="relative rounded-lg shadow-sm group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 text-green-600"
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
                      </svg>
                    </div>
                  </div>
                  <input
                    id="from"
                    name="from"
                    type="text"
                    value={this.state.filters.from}
                    onChange={this.handleInputChange}
                    placeholder="Ville de départ"
                    className="block w-full rounded-lg border-gray-300 pl-10 py-3 focus:border-green-500 focus:ring-green-500 text-gray-900 placeholder-gray-400 transition-colors group-hover:border-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-1">
                <label htmlFor="to" className="block text-sm font-medium text-gray-700 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-green-600"
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
                  </svg>
                  Destination
                </label>
                <div className="relative rounded-lg shadow-sm group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 text-green-600"
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
                      </svg>
                    </div>
                  </div>
                  <input
                    id="to"
                    name="to"
                    type="text"
                    value={this.state.filters.to}
                    onChange={this.handleInputChange}
                    placeholder="Ville d'arrivée"
                    className="block w-full rounded-lg border-gray-300 pl-10 py-3 focus:border-green-500 focus:ring-green-500 text-gray-900 placeholder-gray-400 transition-colors group-hover:border-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-1">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-green-600"
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
                  Date
                </label>
                <div className="relative rounded-lg shadow-sm group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 text-green-600"
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
                    </div>
                  </div>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={this.state.filters.date}
                    onChange={this.handleInputChange}
                    className="block w-full rounded-lg border-gray-300 pl-10 py-3 focus:border-green-500 focus:ring-green-500 text-gray-900 transition-colors group-hover:border-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-1">
                <label htmlFor="seats" className="block text-sm font-medium text-gray-700 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-green-600"
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
                  Passagers
                </label>
                <div className="relative rounded-lg shadow-sm group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 text-green-600"
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
                    </div>
                  </div>
                  <select
                    id="seats"
                    name="seats"
                    value={this.state.filters.seats}
                    onChange={this.handleInputChange}
                    className="block w-full rounded-lg border-gray-300 pl-10 py-3 focus:border-green-500 focus:ring-green-500 text-gray-900 transition-colors group-hover:border-gray-400"
                  >
                    <option value="">Nombre</option>
                    <option value="1">1 passager</option>
                    <option value="2">2 passagers</option>
                    <option value="3">3 passagers</option>
                    <option value="4">4 passagers</option>
                  </select>
                </div>
              </div>

              <div className="flex items-end md:col-span-1">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-gradient-to-r from-green-600 to-green-500 px-4 py-3.5 text-white font-medium hover:from-green-700 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center transform hover:-translate-y-0.5"
                  disabled={loading}
                >
                  {loading ? (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  )}
                  {loading ? "Recherche..." : "Rechercher"}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Active Filters */}
        {Object.keys(this.getCleanFilters()).length > 0 && (
          <div className="flex flex-wrap items-center gap-2 py-2">
            <span className="text-sm font-medium text-gray-700">Filtres actifs:</span>
            {this.state.filters.maxPrice < 300 && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                Max: {this.state.filters.maxPrice} DH
                <button
                  onClick={() =>
                    this.setState(
                      (prevState) => ({
                        filters: { ...prevState.filters, maxPrice: 300 },
                        priceRange: [0, 300],
                      }),
                      () => this.fetchTrips(this.getCleanFilters()),
                    )
                  }
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {this.state.filters.departureTime && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                {this.state.filters.departureTime === "morning"
                  ? "Matin"
                  : this.state.filters.departureTime === "afternoon"
                    ? "Après-midi"
                    : "Soir"}
                <button
                  onClick={() =>
                    this.setState(
                      (prevState) => ({
                        filters: { ...prevState.filters, departureTime: "" },
                      }),
                      () => this.fetchTrips(this.getCleanFilters()),
                    )
                  }
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {this.state.filters.preferences.map((pref) => (
              <span
                key={pref}
                className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800"
              >
                {pref === "non-fumeur" ? "Non-fumeur" : pref === "musique" ? "Musique" : "Animaux autorisés"}
                <button
                  onClick={() => this.handlePreferenceChange(pref)}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
            {this.state.filters.driverRating && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                {this.state.filters.driverRating}+ étoiles
                <button
                  onClick={() =>
                    this.setState(
                      (prevState) => ({
                        filters: { ...prevState.filters, driverRating: "" },
                      }),
                      () => this.fetchTrips(this.getCleanFilters()),
                    )
                  }
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {Object.keys(this.getCleanFilters()).length > 1 && (
              <button
                onClick={() =>
                  this.setState(
                    {
                      filters: {
                        from: "",
                        to: "",
                        date: "",
                        seats: "",
                        maxPrice: 300,
                        preferences: [],
                        driverRating: "",
                        departureTime: "",
                      },
                      priceRange: [0, 300],
                    },
                    () => this.fetchTrips({}),
                  )
                }
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Effacer tous les filtres
              </button>
            )}
          </div>
        )}

        {/* Search Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Résultats de recherche</h2>
            {!loading && safeTrips.length > 0 && (
              <p className="text-sm text-gray-500">
                {safeTrips.length} trajet{safeTrips.length > 1 ? "s" : ""} trouvé{safeTrips.length > 1 ? "s" : ""}
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-sm text-red-700">{error}</div>
              </div>
            </div>
          )}

          {this.state.success && (
            <div className="rounded-lg bg-green-50 p-4 border border-green-200">
              <div className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div className="text-sm text-green-700">{this.state.success}</div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg
                className="animate-spin h-10 w-10 text-green-600 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-gray-500">Recherche des meilleurs trajets pour vous...</p>
            </div>
          ) : !safeTrips.length ? (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-lg font-medium text-gray-900 mb-1">Aucun trajet trouvé</p>
              <p className="text-gray-500 text-center max-w-md">
                Essayez de modifier vos critères de recherche ou de choisir une autre date pour trouver plus de
                résultats.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {safeTrips.map((trip) => (
                <div
                  key={trip._id}
                  className="rounded-lg bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                >
                  <div className="grid md:grid-cols-[1fr_auto] border-b">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center text-lg font-semibold text-gray-900">
                            {trip.departure?.city}
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
                            {trip.destination?.city}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
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
                        <div className="mt-4 md:mt-0 text-right">
                          <div className="text-2xl font-bold text-green-600">{trip.price} DH</div>
                          <div className="text-sm text-gray-500 flex items-center justify-end">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1 text-gray-400"
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
                            {trip.availableSeats} place{trip.availableSeats > 1 ? "s" : ""} disponible
                            {trip.availableSeats > 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {(trip.features || []).map((feature, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow">
                        <img
                          src={trip.driver?.avatar || "/placeholder.svg"}
                          alt={trip.driver?.firstName || "Conducteur"}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {trip.driver
                            ? `${trip.driver.firstName} ${trip.driver.lastName?.charAt(0) || ""}.`
                            : "Conducteur"}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-1 h-4 w-4 text-yellow-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>{trip.driver?.stats?.rating || "0"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3 mt-4 md:mt-0">
                      <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Détails
                      </button>
                      <button
                        onClick={() => this.handleBooking(trip._id)}
                        className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Réserver
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && safeTrips.length > 0 && (
            <div className="flex items-center justify-center space-x-4 mt-6">
              <button
                onClick={() => this.handlePageChange(this.state.pagination.currentPage - 1)}
                disabled={!this.state.pagination.hasPrev}
                className={`px-4 py-2 rounded-lg border ${
                  this.state.pagination.hasPrev
                    ? "border-green-600 text-green-600 hover:bg-green-50"
                    : "border-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Précédent
              </button>
              <span className="text-sm text-gray-600">
                Page {this.state.pagination.currentPage} sur {this.state.pagination.totalPages}
              </span>
              <button
                onClick={() => this.handlePageChange(this.state.pagination.currentPage + 1)}
                disabled={!this.state.pagination.hasNext}
                className={`px-4 py-2 rounded-lg border ${
                  this.state.pagination.hasNext
                    ? "border-green-600 text-green-600 hover:bg-green-50"
                    : "border-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default TripSearch

