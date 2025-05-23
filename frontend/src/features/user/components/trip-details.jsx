import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TripService from "../services/tripService";
import AuthService from "../../../services/authService";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Car,
  CheckCircle,
  Star,
  Send,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContactModal from "./ContactModal";
import Avatar from "../../../components/Avatar";

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [error, setError] = useState(null);

  const loadTripDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await TripService.getTripDetails(id);
      if (response && response.data) {
        setTrip(response.data);
        try {
          const reviewsResponse = await TripService.getReviews(id);
          const userReview = reviewsResponse.data.userReview;

          if (userReview) {
            setUserRating(userReview.rating);
            setRatingSubmitted(true);
            setUserReview(userReview);
          }
        } catch (reviewError) {
          console.error("Error loading reviews:", reviewError);
        }
      } else {
        setError("Trajet non trouvé");
      }
    } catch (err) {
      toast.error("Erreur lors du chargement des détails du trajet", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Error loading trip details:", err);
      setError(
        "Impossible de charger les détails du trajet. Veuillez réessayer plus tard."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const unsubscribe = AuthService.subscribe(() => {
      if (id) {
        loadTripDetails();
      }
    });

    return () => unsubscribe();
  }, [id, loadTripDetails]);

  useEffect(() => {
    if (id) {
      loadTripDetails();
    }
  }, [id, loadTripDetails]);

  const handleRatingSubmit = async () => {
    if (!userRating) {
      toast.warning(
        "Veuillez sélectionner une note avant d'envoyer votre évaluation",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await TripService.rateTrip(trip._id, userRating);
      setRatingSubmitted(true);
      toast.success("Votre évaluation a été enregistrée avec succès !", {
        position: "top-right",
        autoClose: 3000,
      });
      await loadTripDetails();
    } catch (err) {
      console.error("Error submitting rating:", err);
      const errorMessage = err.message || "Une erreur est survenue";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const getTripStatusBadge = (status) => {
    const statusStyles = {
      completed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      default: "bg-blue-100 text-blue-800 border-blue-200",
    };

    const statusText = {
      completed: "Terminé",
      cancelled: "Annulé",
      default: status,
    };

    const style = statusStyles[status] || statusStyles.default;
    const text = statusText[status] || statusText.default;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${style}`}
      >
        {status === "completed" && (
          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
        )}
        {text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
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
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Trajet non trouvé
          </h2>
          <p className="mt-2 text-gray-600">
            Le trajet que vous recherchez n'existe pas ou a été supprimé.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <ToastContainer />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Détails du trajet</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* En-tête */}
        <div className="bg-blue-50 p-6 border-b">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              {getTripStatusBadge(trip.status)}
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                {trip.price} DH
              </span>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-sm text-gray-600 flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(trip.departureTime)}
              </div>
              <div className="text-sm text-gray-600 flex items-center gap-1.5 mt-1">
                <Clock className="h-4 w-4" />
                {formatTime(trip.departureTime)}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="p-6">
          {/* Itinéraire */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="h-14 w-0.5 bg-blue-200 my-1"></div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <MapPin className="h-5 w-5" />
              </div>
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <h3 className="font-semibold text-lg">{trip.departure.city}</h3>
                <p className="text-gray-600 text-sm">
                  {trip.departure.address}
                </p>
                <p className="text-sm font-medium text-blue-600 mt-1">
                  {formatTime(trip.departureTime)}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {trip.destination.city}
                </h3>
                <p className="text-gray-600 text-sm">
                  {trip.destination.address}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-6">
            {/* Conducteur */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Avatar
                    src={trip.driver?.avatar}
                    size={32}
                    alt={`${trip.driver?.firstName} ${trip.driver?.lastName}`}
                  />
                </span>
                Conducteur
              </h2>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                  {getInitials(trip.driver.firstName, trip.driver.lastName)}
                </div>
                <div>
                  <h3 className="font-medium text-lg">
                    {trip.driver.firstName} {trip.driver.lastName}
                  </h3>
                  <div className="flex items-center mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(trip.driver.stats?.rating || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium">
                      {trip.driver.stats?.rating || "Pas encore noté"}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedDriver(trip.driver)}
                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Contacter le conducteur
                  </button>
                </div>
              </div>
            </div>

            {/* Véhicule */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Car className="h-4 w-4" />
                </span>
                Véhicule
              </h2>
              <div className="p-4 rounded-lg bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Modèle</span>
                  <span className="font-medium">
                    {trip.driver?.driverInfo?.carModel || "Non spécifié"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Année</span>
                  <span className="font-medium">
                    {trip.driver?.driverInfo?.carYear || "Non spécifié"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Immatriculation</span>
                  <span className="font-medium">
                    {trip.driver?.driverInfo?.licensePlate || "Non spécifié"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {userReview && (
          <div className="p-6 border-t">
            <h2 className="text-xl font-semibold mb-4">Votre évaluation</h2>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < userReview.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {new Date(userReview.createdAt).toLocaleDateString()}
                </span>
              </div>
              {userReview.comment && (
                <p className="text-gray-700 italic">"{userReview.comment}"</p>
              )}
            </div>
          </div>
        )}

        {!userReview ? (
          <div className="p-6 bg-gray-50 border-t">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Évaluer votre trajet</h2>

              {ratingSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
                  <div className="flex items-center gap-2 font-medium mb-2">
                    <CheckCircle className="h-5 w-5" />
                    Merci pour votre évaluation !
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < userRating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Noter votre conducteur
                    </label>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setUserRating(i + 1)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-8 w-8 transition-all ${
                              i < userRating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300 hover:text-yellow-200"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleRatingSubmit}
                    disabled={!userRating || isSubmitting}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                        Envoi en cours...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Send className="h-4 w-4" />
                        Envoyer mon évaluation
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 bg-gray-50 border-t">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
              <div className="flex items-center gap-2 font-medium mb-2">
                <CheckCircle className="h-5 w-5" />
                Vous avez déjà évalué ce trajet
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < userReview.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm">
                  Note donnée le{" "}
                  {new Date(userReview.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedDriver && (
        <ContactModal
          driver={selectedDriver}
          onClose={() => setSelectedDriver(null)}
        />
      )}
    </div>
  );
}
