import React from "react";
import { useNavigate } from "react-router-dom";
import TripService from "../services/tripService";
import ContactModal from "./ContactModal";

export default function TripHistory() {
  const navigate = useNavigate();
  const [trips, setTrips] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedDriver, setSelectedDriver] = React.useState(null);
  const [filters, setFilters] = React.useState({
    period: "all",
    destination: "all",
    search: "",
  });
  const [searchInput, setSearchInput] = React.useState("");
  const searchTimeoutRef = React.useRef(null);

  React.useEffect(() => {
    loadTrips();
  }, [filters]);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const response = await TripService.getMyTrips();

      let pastTrips = response.data.filter((trip) => {
        const tripDate = new Date(trip.departureTime);
        const now = new Date();
        return tripDate < now;
      });

      const { period, destination, search } = filters;

      if (period !== "all") {
        const now = new Date();
        const periodMap = {
          month: 30,
          "3months": 90,
          "6months": 180,
          year: 365,
        };
        const daysToSubtract = periodMap[period];
        const startDate = new Date(now.setDate(now.getDate() - daysToSubtract));

        pastTrips = pastTrips.filter((trip) => {
          const tripDate = new Date(trip.departureTime);
          return tripDate >= startDate;
        });
      }

      if (destination !== "all") {
        pastTrips = pastTrips.filter(
          (trip) =>
            trip.destination.city.toLowerCase() === destination.toLowerCase()
        );
      }

      if (search.trim() !== "") {
        const searchTerm = search.toLowerCase().trim();
        pastTrips = pastTrips.filter(
          (trip) =>
            trip.departure.city.toLowerCase().includes(searchTerm) ||
            trip.destination.city.toLowerCase().includes(searchTerm) ||
            `${trip.driver.firstName} ${trip.driver.lastName}`
              .toLowerCase()
              .includes(searchTerm)
        );
      }

      setTrips(pastTrips);
      setLoading(false);
    } catch (error) {
      setError("Erreur lors du chargement des trajets");
      setLoading(false);
      console.error("Erreur lors du chargement des trajets:", error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleFilterChange("search", value);
    }, 500);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleFilterChange("search", searchInput);
  };

  const exportToCSV = () => {
    const headers = [
      "Date",
      "Heure",
      "Départ",
      "Destination",
      "Conducteur",
      "Prix",
      "Note",
    ];

    const rows = trips.map((trip) => [
      new Date(trip.departureTime).toLocaleDateString("fr-FR"),
      new Date(trip.departureTime).toLocaleTimeString("fr-FR"),
      trip.departure.city,
      trip.destination.city,
      `${trip.driver.firstName} ${trip.driver.lastName}`,
      `${trip.price} DH`,
      trip.userRating || "Non noté",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `historique_trajets_${new Date().toLocaleDateString("fr-FR")}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShowContact = (driver) => {
    setSelectedDriver(driver);
  };

  const handleCloseContact = () => {
    setSelectedDriver(null);
  };

  const handleShowDetails = (tripId) => {
    navigate(`/user/trips/${tripId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Historique des trajets
        </h1>
        <button
          onClick={exportToCSV}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          disabled={trips.length === 0}
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
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                value={filters.period}
                onChange={(e) => handleFilterChange("period", e.target.value)}
              >
                <option value="all">Toutes les périodes</option>
                <option value="month">Dernier mois</option>
                <option value="3months">3 derniers mois</option>
                <option value="6months">6 derniers mois</option>
                <option value="year">Dernière année</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Destination</label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                value={filters.destination}
                onChange={(e) =>
                  handleFilterChange("destination", e.target.value)
                }
              >
                <option value="all">Toutes les destinations</option>
                <option value="rabat">Rabat</option>
                <option value="casablanca">Casablanca</option>
                <option value="marrakech">Marrakech</option>
                <option value="agadir">Agadir</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Recherche</label>
              <form onSubmit={handleSearchSubmit} className="relative flex">
                <input
                  type="text"
                  placeholder="Rechercher un trajet..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Vos trajets passés</h2>
        </div>
        <div className="p-6 overflow-x-auto">
          {trips.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun trajet passé trouvé
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left font-medium">Date</th>
                  <th className="px-4 py-2 text-left font-medium">Trajet</th>
                  <th className="px-4 py-2 text-left font-medium">
                    Conducteur
                  </th>
                  <th className="px-4 py-2 text-left font-medium">Prix</th>
                  <th className="px-4 py-2 text-left font-medium">
                    Votre note
                  </th>
                  <th className="px-4 py-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => (
                  <tr key={trip._id} className="border-b">
                    <td className="px-4 py-4">
                      <div className="font-medium">
                        {new Date(trip.departureTime).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "numeric",
                            month: "short",
                          }
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(trip.departureTime).toLocaleTimeString(
                          "fr-FR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium flex items-center">
                        {trip.departure.city}
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
                        {trip.destination.city}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full overflow-hidden">
                          <img
                            src={trip.driver.avatar || "/placeholder.svg"}
                            alt={`${trip.driver.firstName} ${trip.driver.lastName}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="font-medium">
                          {`${trip.driver.firstName} ${trip.driver.lastName}`}
                        </div>
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
                              star <= (trip.driver.stats?.rating || 0)
                                ? "fill-green-600 text-green-600"
                                : "text-gray-300"
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
                      <button
                        onClick={() => handleShowContact(trip.driver)}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 mr-2"
                      >
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
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="sr-only">Contacter</span>
                      </button>
                      <button
                        onClick={() => handleShowDetails(trip._id)}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Contact Modal */}
      {selectedDriver && (
        <ContactModal driver={selectedDriver} onClose={handleCloseContact} />
      )}
    </div>
  );
}
