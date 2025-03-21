"use client";

import React from "react";
import UserService from "../services/userService";
import { toast } from "react-toastify";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "personal",
      userData: null,
      loading: true,
      preferences: {
        language: "fr",
        notifications: {
          email: true,
          push: true,
        },
        travelPreferences: {
          smoking: false,
          music: true,
          pets: false,
          conversation: "moderate",
        },
      },
    };
  }

  async componentDidMount() {
    try {
      const response = await UserService.getProfile();
      this.setState({
        userData: response.data,
        loading: false,
      });
    } catch (error) {
      toast.error("Erreur lors du chargement du profil");
      console.error("Error loading profile:", error);
    }
  }

  handleProfileUpdate = async (event) => {
    event.preventDefault();
    try {
      const userData = {
        firstName: this.state.userData.firstName,
        lastName: this.state.userData.lastName,
        phoneNumber: this.state.userData.phoneNumber,
        email: this.state.userData.email,
      };

      const response = await UserService.updateProfile(userData);
      this.setState({ userData: response.data });
      toast.success("Profil mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil");
      console.error("Error updating profile:", error);
    }
  };

  handlePreferencesUpdate = async () => {
    try {
      const preferences = {
        language: "fr",
        notifications: {
          email: true,
          push: true,
        },
        travelPreferences: {
          smoking: this.state.preferences.smoking,
          music: this.state.preferences.music,
          pets: this.state.preferences.pets,
          conversation: this.state.preferences.conversation,
        },
      };

      await UserService.updatePreferences(preferences);
      toast.success("Préférences mises à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour des préférences");
      console.error("Error updating preferences:", error);
    }
  };

  setActiveTab = (tab) => {
    this.setState({ activeTab: tab });
  };

  render() {
    const { userData, loading } = this.state;

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      );
    }

    if (!userData) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-gray-600 mb-4">
            Impossible de charger les données du profil
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Réessayer
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Paramètres
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
          <div className="rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full overflow-hidden">
                    <img
                      src={
                        userData?.avatar
                          ? `/uploads/${userData.avatar}`
                          : "https://randomuser.me/api/portraits/men/42.jpg"
                      }
                      alt={userData?.firstName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <button className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full border border-gray-300 bg-white p-1 shadow-sm hover:bg-gray-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-full w-full text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="sr-only">Changer la photo</span>
                  </button>
                </div>

                <div className="text-center">
                  <h2 className="text-xl font-bold">
                    {userData?.firstName} {userData?.lastName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {userData?.role === "driver" ? "Conducteur" : "Passager"}{" "}
                    depuis{" "}
                    {new Date(userData?.createdAt).toLocaleDateString("fr-FR", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`h-4 w-4 ${
                          star <= (userData?.stats?.rating || 0)
                            ? "text-green-600"
                            : "text-gray-300"
                        }`}
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {userData?.stats?.rating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({userData?.stats?.numberOfRatings || 0} avis)
                  </span>
                </div>

                <div className="w-full space-y-2 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Trajets effectués</span>
                    <span className="font-medium">
                      {userData?.stats?.totalTrips || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Distance totale</span>
                    <span className="font-medium">
                      {userData?.stats?.totalDistance || 0} km
                    </span>
                  </div>
                </div>

                <div className="w-full space-y-2 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ${
                          userData?.isVerified
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <span className="text-sm">Profil vérifié</span>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="profile-verified"
                        className="sr-only"
                        checked={userData?.isVerified}
                        readOnly
                      />
                      <div className="block h-6 bg-gray-300 rounded-full w-10"></div>
                      <div
                        className={`dot absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition ${
                          userData?.isVerified ? "translate-x-4" : ""
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => this.setActiveTab("personal")}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    this.state.activeTab === "personal"
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Informations
                </button>
                <button
                  onClick={() => this.setActiveTab("preferences")}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    this.state.activeTab === "preferences"
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Préférences
                </button>
                <button
                  onClick={() => this.setActiveTab("payment")}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    this.state.activeTab === "payment"
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Paiement
                </button>
              </nav>
            </div>

            <div className="pt-4">
              {this.state.activeTab === "personal" && (
                <div className="rounded-lg bg-white shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">
                      Informations personnelles
                    </h2>
                    <p className="text-sm text-gray-500">
                      Mettez à jour vos informations personnelles
                    </p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Prénom
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <input
                            id="firstName"
                            type="text"
                            placeholder="Prénom"
                            value={userData?.firstName || ""}
                            onChange={(e) =>
                              this.handleInputChange(
                                "firstName",
                                e.target.value
                              )
                            }
                            className="w-full rounded-md border border-gray-300 pl-9 py-2"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Nom
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <input
                            id="lastName"
                            type="text"
                            placeholder="Nom"
                            value={userData?.lastName || ""}
                            onChange={(e) =>
                              this.handleInputChange("lastName", e.target.value)
                            }
                            className="w-full rounded-md border border-gray-300 pl-9 py-2"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
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
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <input
                          id="email"
                          type="email"
                          placeholder="Email"
                          value={userData?.email || ""}
                          onChange={(e) =>
                            this.handleInputChange("email", e.target.value)
                          }
                          className="w-full rounded-md border border-gray-300 pl-9 py-2"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Téléphone
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
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <input
                          id="phone"
                          type="text"
                          placeholder="Téléphone"
                          value={userData?.phoneNumber || ""}
                          onChange={(e) =>
                            this.handleInputChange(
                              "phoneNumber",
                              e.target.value
                            )
                          }
                          className="w-full rounded-md border border-gray-300 pl-9 py-2"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Adresse
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
                          id="address"
                          type="text"
                          placeholder="Adresse"
                          value={userData?.address || ""}
                          onChange={(e) =>
                            this.handleInputChange("address", e.target.value)
                          }
                          className="w-full rounded-md border border-gray-300 pl-9 py-2"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="bio"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        placeholder="Parlez-nous de vous..."
                        value={userData?.bio || ""}
                        onChange={(e) =>
                          this.handleInputChange("bio", e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 min-h-[100px]"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={this.handleProfileUpdate}
                        className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                      >
                        Enregistrer les modifications
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {this.state.activeTab === "preferences" && (
                <div className="rounded-lg bg-white shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">
                      Préférences de trajet
                    </h2>
                    <p className="text-sm text-gray-500">
                      Personnalisez vos préférences pour les trajets
                    </p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-4">
                      {Object.entries(this.state.preferences).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between"
                          >
                            <div className="space-y-0.5">
                              <label className="block text-sm font-medium text-gray-700">
                                {this.getPreferenceLabel(key)}
                              </label>
                              <p className="text-sm text-gray-500">
                                {this.getPreferenceDescription(key)}
                              </p>
                            </div>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                              <input
                                type="checkbox"
                                id={key}
                                className="sr-only"
                                checked={value}
                                onChange={(e) =>
                                  this.handlePreferenceChange(
                                    key,
                                    e.target.checked
                                  )
                                }
                              />
                              <div className="block h-6 bg-gray-300 rounded-full w-10"></div>
                              <div
                                className={`dot absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition ${
                                  value ? "translate-x-4" : ""
                                }`}
                              ></div>
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={this.handlePreferencesUpdate}
                        className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                      >
                        Enregistrer les préférences
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {this.state.activeTab === "payment" && (
                <div className="rounded-lg bg-white shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">
                      Méthodes de paiement
                    </h2>
                    <p className="text-sm text-gray-500">
                      Gérez vos méthodes de paiement
                    </p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="rounded-md bg-green-100 p-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-green-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                              />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium">
                              Visa se terminant par 4242
                            </div>
                            <div className="text-sm text-gray-500">
                              Expire le 12/25
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                            Modifier
                          </button>
                          <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>

                    <button className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Ajouter une nouvelle méthode de paiement
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  getPreferenceLabel(key) {
    const labels = {
      smoking: "Non-fumeur",
      music: "Musique",
      pets: "Animaux",
      conversation: "Conversation",
      airConditioning: "Climatisation",
    };
    return labels[key] || key;
  }

  getPreferenceDescription(key) {
    const descriptions = {
      smoking: "Préférence pour les trajets sans fumée",
      music: "Préférence pour la musique pendant le trajet",
      pets: "Accepte les animaux pendant le trajet",
      conversation: "Préférence pour les conversations pendant le trajet",
      airConditioning: "Préférence pour les véhicules climatisés",
    };
    return descriptions[key] || "";
  }

  handleInputChange = (field, value) => {
    this.setState((prevState) => ({
      userData: {
        ...prevState.userData,
        [field]: value,
      },
    }));
  };

  handlePreferenceChange = (preference, value) => {
    this.setState((prevState) => ({
      preferences: {
        ...prevState.preferences,
        [preference]: value,
      },
    }));
  };
}

export default UserProfile;
