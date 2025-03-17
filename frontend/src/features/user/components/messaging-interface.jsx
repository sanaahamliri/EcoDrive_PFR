import React from "react"

class MessagingInterface extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      message: "",
      activeContactId: 1
    }

    // Mock data
    this.contacts = [
      {
        id: 1,
        name: "Mohammed Ali",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
        lastMessage: "À quelle heure arrivez-vous demain ?",
        time: "10:30",
        unread: 2,
        online: true,
      },
      {
        id: 2,
        name: "Sara Ahmed",
        image: "https://randomuser.me/api/portraits/women/1.jpg",
        lastMessage: "Merci pour le trajet, c'était super !",
        time: "Hier",
        unread: 0,
        online: false,
      },
      {
        id: 3,
        name: "Karim Benali",
        image: "https://randomuser.me/api/portraits/men/2.jpg",
        lastMessage: "Est-ce que vous acceptez les bagages volumineux ?",
        time: "Hier",
        unread: 0,
        online: true,
      },
      {
        id: 4,
        name: "Leila Tazi",
        image: "https://randomuser.me/api/portraits/women/2.jpg",
        lastMessage: "Bonjour, je suis intéressé par votre trajet",
        time: "Lun",
        unread: 0,
        online: false,
      },
    ]

    this.messages = [
      {
        id: 1,
        sender: "other",
        content: "Bonjour ! Je suis intéressé par votre trajet Casablanca → Rabat pour demain.",
        time: "10:15",
      },
      {
        id: 2,
        sender: "me",
        content: "Bonjour ! Oui, j'ai 3 places disponibles. À quelle heure souhaitez-vous partir ?",
        time: "10:18",
      },
      {
        id: 3,
        sender: "other",
        content:
          "Le départ à 8h me convient parfaitement. Est-ce que le point de rendez-vous est toujours à la gare routière ?",
        time: "10:20",
      },
      {
        id: 4,
        sender: "me",
        content: "Oui, exactement. Je serai à l'entrée principale près du parking. J'ai une Dacia Logan blanche.",
        time: "10:22",
      },
      {
        id: 5,
        sender: "other",
        content: "Parfait ! Est-ce que je peux amener une valise moyenne ?",
        time: "10:25",
      },
      {
        id: 6,
        sender: "me",
        content: "Bien sûr, il y a suffisamment de place dans le coffre.",
        time: "10:26",
      },
      {
        id: 7,
        sender: "other",
        content: "Super, merci beaucoup ! À quelle heure arrivez-vous demain ?",
        time: "10:30",
      },
    ]
  }

  handleMessageChange = (e) => {
    this.setState({ message: e.target.value })
  }

  handleSendMessage = () => {
    if (this.state.message.trim()) {
      // In a real app, you would send the message to the server
      this.setState({ message: "" })
    }
  }

  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.handleSendMessage()
    }
  }

  setActiveContactId = (id) => {
    this.setState({ activeContactId: id })
  }

  render() {
    const activeContact = this.contacts.find(contact => contact.id === this.state.activeContactId) || this.contacts[0]

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        </div>

        <div className="rounded-lg bg-white shadow overflow-hidden">
          <div className="grid md:grid-cols-[280px_1fr] h-[600px]">
            {/* Contacts sidebar */}
            <div className="border-r">
              <div className="p-4">
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    className="w-full rounded-md border border-gray-300 pl-9 py-2 focus:border-green-500 focus:ring-green-500" 
                  />
                </div>
              </div>

              <div className="h-[calc(600px-65px)] overflow-y-auto">
                <div className="space-y-1 p-2">
                  {this.contacts.map((contact) => (
                    <button
                      key={contact.id}
                      className={`w-full rounded-lg p-3 text-left transition-colors hover:bg-gray-100 ${
                        this.state.activeContactId === contact.id ? "bg-gray-100" : ""
                      }`}
                      onClick={() => this.setActiveContactId(contact.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full overflow-hidden">
                            <img src={contact.image || "/placeholder.svg"} alt={contact.name} className="h-full w-full object-cover" />
                          </div>
                          {contact.online && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
                          )}
                        </div>
                        <div className="flex-1 truncate">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{contact.name}</span>
                            <span className="text-xs text-gray-500">{contact.time}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="truncate text-sm text-gray-500">{contact.lastMessage}</span>
                            {contact.unread > 0 && (
                              <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
                                {contact.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat area */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img src={activeContact.image || "/placeholder.svg"} alt={activeContact.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <div className="font-medium">{activeContact.name}</div>
                    {activeContact.online ? (
                      <div className="text-xs text-green-500">En ligne</div>
                    ) : (
                      <div className="text-xs text-gray-500">Hors ligne</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="sr-only">Appeler</span>
                  </button>
                  <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="sr-only">Vidéo</span>
                  </button>
                  <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                    <span className="sr-only">Plus</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {this.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.sender === "me" ? "bg-green-600 text-white" : "bg-gray-100"
                        }`}
                      >
                        <div className="text-sm">{msg.content}</div>
                        <div
                          className={`mt-1 text-right text-xs ${
                            msg.sender === "me" ? "text-green-100" : "text-gray-500"
                          }`}
                        >
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t p-4">
                <div className="flex items-center space-x-2">
                  <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="sr-only">Joindre un fichier</span>
                  </button>
                  <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="sr-only">Envoyer une image</span>
                  </button>
                  <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="sr-only">Emoji</span>
                  </button>
                  <input
                    type="text"
                    placeholder="Écrivez un message..."
                    value={this.state.message}
                    onChange={this.handleMessageChange}
                    onKeyDown={this.handleKeyDown}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-green-500"
                  />
                  <button 
                    onClick={this.handleSendMessage}
                    className="rounded-full bg-green-600 p-2 text-white hover:bg-green-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span className="sr-only">Envoyer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MessagingInterface
