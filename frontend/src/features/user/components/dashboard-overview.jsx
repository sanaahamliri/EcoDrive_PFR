import React from "react";
import rideService from "../services/tripService";
import AuthService from "../../../services/authService";
import Avatar from "../../../components/Avatar";
import { useNavigate } from "react-router-dom";

class TripSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      success: null,
      trips: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
      filters: {
        from: "",
        to: "",
        date: "",
        seats: "",
      },
      userData: AuthService.getUser(),
    };
  }

  componentDidMount() {
    this.unsubscribe = AuthService.subscribe(() => {
      this.setState({ userData: AuthService.getUser() }, () => {
        this.fetchTrips({});
      });
    });
    this.fetchTrips({});
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  fetchTrips = async (filters = null) => {
    try {
      this.setState({ loading: true, error: null });
      const { currentPage } = this.state.pagination;

      console.log("Fetching trips with filters:", filters || {});
      const response = await rideService.searchRides(
        filters || {},
        currentPage
      );
      console.log("Received trips:", response);

      this.setState({
        trips: response.data || [],
        loading: false,
        pagination: {
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          hasNext: response.pagination?.next !== undefined,
          hasPrev: response.pagination?.prev !== undefined,
        },
      });

      console.log(
        "Trip data structure:",
        JSON.stringify(response.data?.[0], null, 2)
      );
    } catch (error) {
      console.error("Error fetching trips:", error);
      this.setState({
        trips: [],
        error:
          "Impossible de charger les trajets. Veuillez réessayer plus tard.",
        loading: false,
      });
    }
  };

  handleBooking = async (rideId, seats = 1) => {
    try {
      this.setState({ loading: true, error: null, success: null });
      await rideService.bookRide(rideId, seats);

      this.setState({
        success:
          "Votre demande de réservation a été envoyée au conducteur. Vous serez notifié dès qu'il aura confirmé votre réservation.",
        loading: false,
      });

      setTimeout(() => {
        this.setState({ success: null });
      }, 5000);

      this.fetchTrips(this.getCleanFilters());
    } catch (error) {
      this.setState({
        error:
          typeof error === "string" ? error : "Erreur lors de la réservation",
        loading: false,
        success: null,
      });

      if (error.includes("connecter")) {
        localStorage.setItem("redirectAfterLogin", window.location.pathname);
        window.location.href = "/login";
      }
    }
  };

  getCleanFilters = () => {
    return Object.entries(this.state.filters).reduce((acc, [key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState(
      (prevState) => ({
        filters: {
          ...prevState.filters,
          [name]: value,
        },
      }),
      () => this.fetchTrips(this.getCleanFilters())
    );
  };

  handleSearch = (e) => {
    if (e) e.preventDefault();
    this.fetchTrips(this.getCleanFilters());
  };

  handlePageChange = (newPage) => {
    this.setState(
      (prevState) => ({
        pagination: {
          ...prevState.pagination,
          currentPage: newPage,
        },
      }),
      () => this.fetchTrips(this.getCleanFilters())
    );
  };

  render() {
    const { trips, loading, error } = this.state;

    const safeTrips = Array.isArray(trips) ? trips : [];

    console.log("Rendering with trips:", safeTrips);

    return (
      <div className="space-y-8">
        <form
          onSubmit={this.handleSearch}
          className="rounded-xl bg-white shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100"
        >
          <div className="bg-gradient-to-r from-green-600 via-green-500 to-green-400 p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20 transform rotate-45"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-10 -mb-10"></div>
            <h2 className="text-xl font-bold relative z-10">
              Trouvez votre prochain trajet
            </h2>
            <p className="text-sm text-green-100 mt-1 relative z-10">
              Recherchez parmi des milliers de trajets à petits prix
            </p>
          </div>
          <div className="p-6 bg-gradient-to-b from-white to-gray-50">
            <div className="grid gap-6 md:grid-cols-5">
              <div className="space-y-2 md:col-span-1">
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

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Résultats de recherche
            </h2>
            {!loading && safeTrips.length > 0 && (
              <p className="text-sm text-gray-500">
                {safeTrips.length} trajet{safeTrips.length > 1 ? "s" : ""}{" "}
                trouvé{safeTrips.length > 1 ? "s" : ""}
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
                <div className="text-sm text-green-700">
                  {this.state.success}
                </div>
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
              <p className="text-gray-500">
                Recherche des meilleurs trajets pour vous...
              </p>
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
              <p className="text-lg font-medium text-gray-900 mb-1">
                Aucun trajet trouvé
              </p>
              <p className="text-gray-500 text-center max-w-md">
                Essayez de modifier vos critères de recherche ou de choisir une
                autre date pour trouver plus de résultats.
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
                            {new Date(trip.departureTime).toLocaleString(
                              "fr-FR",
                              {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                timeZone: "Africa/Casablanca",
                              }
                            )}
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {trip.price} DH
                          </div>
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
                            {trip.availableSeats} place
                            {trip.availableSeats > 1 ? "s" : ""} disponible
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
                        <Avatar
                          src={trip.driver?.avatar}
                          size={48}
                          alt={trip.driver?.firstName || "Conducteur"}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {trip.driver
                            ? `${trip.driver.firstName} ${
                                trip.driver.lastName?.charAt(0) || ""
                              }.`
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
                      <button
                        onClick={() =>
                          (window.location.href = `/trips/${trip._id}`)
                        }
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                      >
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
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
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
                onClick={() =>
                  this.handlePageChange(this.state.pagination.currentPage - 1)
                }
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
                Page {this.state.pagination.currentPage} sur{" "}
                {this.state.pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  this.handlePageChange(this.state.pagination.currentPage + 1)
                }
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
    );
  }
}

export default TripSearch;
