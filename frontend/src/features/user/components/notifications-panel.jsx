"use client"

import React from "react"

class NotificationsPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: "all",
    }

    // Mock data
    this.notifications = [
      {
        id: 1,
        type: "message",
        title: "Nouveau message",
        description: "Mohammed Ali vous a envoyé un message",
        time: "Il y a 10 minutes",
        read: false,
        image: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      {
        id: 2,
        type: "trip",
        title: "Confirmation de réservation",
        description: "Votre trajet Casablanca → Rabat a été confirmé",
        time: "Il y a 2 heures",
        read: false,
        image: null,
      },
      {
        id: 3,
        type: "rating",
        title: "Nouvelle évaluation",
        description: "Sara Ahmed vous a donné 5 étoiles",
        time: "Hier",
        read: true,
        image: "https://randomuser.me/api/portraits/women/1.jpg",
      },
      {
        id: 4,
        type: "trip",
        title: "Rappel de trajet",
        description: "Votre trajet Marrakech → Agadir est prévu pour demain",
        time: "Hier",
        read: true,
        image: null,
      },
      {
        id: 5,
        type: "system",
        title: "Mise à jour du système",
        description: "Nouvelles fonctionnalités disponibles dans l'application",
        time: "Il y a 3 jours",
        read: true,
        image: null,
      },
    ]
  }

  setActiveTab = (tab) => {
    this.setState({ activeTab: tab })
  }

  getIcon = (type) => {
    switch (type) {
      case "message":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-500"
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
        )
      case "trip":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
            />
          </svg>
        )
      case "rating":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-500"
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
        )
      case "system":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-purple-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        )
      default:
        return (
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
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        )
    }
  }

  render() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Tout marquer comme lu
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => this.setActiveTab("all")}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    this.state.activeTab === "all"
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => this.setActiveTab("unread")}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    this.state.activeTab === "unread"
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Non lues
                </button>
                <button
                  onClick={() => this.setActiveTab("read")}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    this.state.activeTab === "read"
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Lues
                </button>
              </nav>
            </div>

            <div className="space-y-4 mt-6">
              {this.state.activeTab === "all" &&
                this.notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`overflow-hidden transition-colors rounded-lg bg-white shadow ${notification.read ? "" : "border-l-4 border-l-green-600"}`}
                  >
                    <div className="p-4">
                      <div className="flex items-start space-x-4">
                        {notification.image ? (
                          <div className="h-10 w-10 rounded-full overflow-hidden">
                            <img
                              src={notification.image || "/placeholder.svg"}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="rounded-full bg-green-100 p-2">{this.getIcon(notification.type)}</div>
                        )}

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{notification.title}</h3>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                          <p className="text-sm text-gray-500">{notification.description}</p>
                        </div>

                        <div className="flex items-center space-x-2">
                          {!notification.read && <span className="h-2 w-2 rounded-full bg-green-600 p-0" />}
                          <button className="text-gray-400 hover:text-gray-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            <span className="sr-only">Supprimer</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              {this.state.activeTab === "unread" &&
                this.notifications
                  .filter((n) => !n.read)
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className="overflow-hidden border-l-4 border-l-green-600 rounded-lg bg-white shadow mb-4"
                    >
                      <div className="p-4">
                        <div className="flex items-start space-x-4">
                          {notification.image ? (
                            <div className="h-10 w-10 rounded-full overflow-hidden">
                              <img
                                src={notification.image || "/placeholder.svg"}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="rounded-full bg-green-100 p-2">{this.getIcon(notification.type)}</div>
                          )}

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{notification.title}</h3>
                              <span className="text-xs text-gray-500">{notification.time}</span>
                            </div>
                            <p className="text-sm text-gray-500">{notification.description}</p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="h-2 w-2 rounded-full bg-green-600 p-0" />
                            <button className="text-gray-400 hover:text-gray-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              <span className="sr-only">Supprimer</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

              {this.state.activeTab === "read" &&
                this.notifications
                  .filter((n) => n.read)
                  .map((notification) => (
                    <div key={notification.id} className="overflow-hidden rounded-lg bg-white shadow mb-4">
                      <div className="p-4">
                        <div className="flex items-start space-x-4">
                          {notification.image ? (
                            <div className="h-10 w-10 rounded-full overflow-hidden">
                              <img
                                src={notification.image || "/placeholder.svg"}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="rounded-full bg-green-100 p-2">{this.getIcon(notification.type)}</div>
                          )}

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{notification.title}</h3>
                              <span className="text-xs text-gray-500">{notification.time}</span>
                            </div>
                            <p className="text-sm text-gray-500">{notification.description}</p>
                          </div>

                          <button className="text-gray-400 hover:text-gray-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            <span className="sr-only">Supprimer</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-white shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Paramètres de notification</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="block text-sm font-medium text-gray-700">Messages</label>
                    <p className="text-sm text-gray-500">Notifications pour les nouveaux messages</p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" id="messages" className="sr-only" defaultChecked={true} />
                    <div className="block h-6 bg-gray-300 rounded-full w-10"></div>
                    <div className="dot absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="block text-sm font-medium text-gray-700">Trajets</label>
                    <p className="text-sm text-gray-500">Confirmations et rappels de trajets</p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" id="trajets" className="sr-only" defaultChecked={true} />
                    <div className="block h-6 bg-gray-300 rounded-full w-10"></div>
                    <div className="dot absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="block text-sm font-medium text-gray-700">Évaluations</label>
                    <p className="text-sm text-gray-500">Nouvelles évaluations reçues</p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" id="evaluations" className="sr-only" defaultChecked={true} />
                    <div className="block h-6 bg-gray-300 rounded-full w-10"></div>
                    <div className="dot absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="block text-sm font-medium text-gray-700">Système</label>
                    <p className="text-sm text-gray-500">Mises à jour et annonces</p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" id="systeme" className="sr-only" defaultChecked={false} />
                    <div className="block h-6 bg-gray-300 rounded-full w-10"></div>
                    <div className="dot absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-500">Recevoir des notifications par email</p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" id="email" className="sr-only" defaultChecked={true} />
                    <div className="block h-6 bg-gray-300 rounded-full w-10"></div>
                    <div className="dot absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="block text-sm font-medium text-gray-700">SMS</label>
                    <p className="text-sm text-gray-500">Recevoir des notifications par SMS</p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" id="sms" className="sr-only" defaultChecked={false} />
                    <div className="block h-6 bg-gray-300 rounded-full w-10"></div>
                    <div className="dot absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Calendrier</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-24 w-24 text-gray-400"
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
                <p className="mt-4 text-center text-sm text-gray-500">
                  Synchronisez vos trajets avec votre calendrier pour ne jamais manquer un départ.
                </p>
                <button className="mt-4 w-full inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700">
                  Connecter le calendrier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default NotificationsPanel

