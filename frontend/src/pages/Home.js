import {
  Zap,
  CreditCard,
  CheckCircle,
  
  Users,
  Calendar,
} from "lucide-react";
import { Link } from 'react-router-dom';

import casablancaImg from "../assets/images/destinations/casablanca.jpg";
import marrakechImg from "../assets/images/destinations/marrakesh.jpg";
import agadirImg from "../assets/images/destinations/agadir.jpg";
import tangerImg from "../assets/images/destinations/tanger.jpeg";

export default function Home() {
  const destinations = [
    { name: "Casablanca", image: casablancaImg },
    { name: "Marrakech", image: marrakechImg },
    { name: "Agadir", image: agadirImg },
    { name: "Tanger", image: tangerImg },
  ];

  const steps = [
    {
      title: "Ultra rapide",
      description: "Une réservation en quelques clics, c'est parti !",
      icon: <Zap className="w-10 h-10 text-[#12AD90]" />,
    },
    {
      title: "Créer des liens",
      description:
        "Rencontrez de nouvelles personnes et élargissez votre réseau",
      icon: <Users className="w-10 h-10 text-[#12AD90]" />,
    },
    {
      title: "C'est tout",
      description: "Profitez de votre trajet en toute tranquillité",
      icon: <CheckCircle className="w-10 h-10 text-[#12AD90]" />,
    },
  ];

  const benefits = [
    {
      title: "Économique",
      description:
        "Partagez les frais de transport et économisez sur vos déplacements",
      icon: <CreditCard className="w-8 h-8 text-white" />,
    },
    {
      title: "Écologique",
      description:
        "Réduisez votre empreinte carbone en partageant votre trajet",
      icon: <Users className="w-8 h-8 text-white" />,
    },
    {
      title: "Flexible",
      description:
        "Trouvez des trajets qui correspondent à votre emploi du temps",
      icon: <Calendar className="w-8 h-8 text-white" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <main>
        <section className="relative min-h-[600px] overflow-hidden">
          {/* SVG Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#c9ebff] to-[#e6f7ff]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 750 500"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid slice"
            >
              <g id="Background_Simple">
                <g>
                  <path
                    style={{ fill: "#92E3A9" }}
                    d="M728.637,192.387c0,0-16.398-88.141-133.643-142.581C477.749-4.635,423.461,49.539,364.516,72.14 c-58.945,22.6-90.921-8.508-189.308-23.198C76.821,34.251-8.448,180.289,19.428,294.354 c27.876,114.065,89.368,154.679,223.831,180.603c134.463,25.924,213.992-59.625,309.1-44.071 C647.467,446.441,760.613,359.164,728.637,192.387z"
                  />
                  <path
                    style={{ opacity: 0.7, fill: "#FFFFFF" }}
                    d="M728.637,192.387c0,0-16.398-88.141-133.643-142.581 C477.749-4.635,423.461,49.539,364.516,72.14c-58.945,22.6-90.921-8.508-189.308-23.198 C76.821,34.251-8.448,180.289,19.428,294.354c27.876,114.065,89.368,154.679,223.831,180.603 c134.463,25.924,213.992-59.625,309.1-44.071C647.467,446.441,760.613,359.164,728.637,192.387z"
                  />
                </g>
              </g>
            </svg>
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#12AD90]/90 to-[#12AD90]/70 mix-blend-multiply"></div>

          <div className="container mx-auto px-4 py-16 relative z-10 h-full flex flex-col md:flex-row items-center">
            {/* Left content */}
            <div className="w-full md:w-1/2 text-center md:text-left mb-12 md:mb-0">
              <h1 className="text-4xl md:text-6xl text-white font-bold mb-6 max-w-4xl">
                Voyagez ensemble, économisez ensemble
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl">
                Trouvez le covoiturage idéal pour vos trajets entre villes au
                Maroc
              </p>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#12AD90] font-medium rounded-full hover:bg-opacity-90 transition-all"
              >
                S'inscrire
              </Link>
            </div>

            {/* Right content - illustration */}
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-lg">
                {/* Phone with map */}
                <div className="relative z-20 mx-auto w-64 md:w-72">
                  <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-8 border-[#1a237e]/80">
                    <div className="pt-2 bg-[#1a237e]/80 rounded-t-xl">
                      <div className="w-12 h-1 bg-white/30 mx-auto rounded-full"></div>
                    </div>
                    <div className="bg-blue-50 aspect-[9/19] relative">
                      {/* Map content */}
                      <div className="absolute inset-0 bg-blue-50">
                        <div className="w-full h-full relative">
                          {/* Map pins */}
                          <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-[#FF5722] rounded-full flex items-center justify-center animate-pulse">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                          <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-[#FF5722] rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                          <div className="absolute bottom-1/3 left-1/3 w-8 h-8 bg-[#FF5722] rounded-full flex items-center justify-center animate-pulse">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                          <div className="absolute bottom-1/4 right-1/4 w-8 h-8 bg-[#FF5722] rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>

                          {/* Map lines */}
                          <div className="absolute top-0 left-0 w-full h-full">
                            <svg
                              viewBox="0 0 100 100"
                              className="w-full h-full"
                            >
                              <path
                                d="M25 25 L65 50 L35 65 L75 75"
                                stroke="#CBD5E1"
                                strokeWidth="1"
                                fill="none"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Bottom UI elements */}
                      <div className="absolute bottom-0 inset-x-0 bg-white p-3 border-t border-gray-200">
                        <div className="flex space-x-2 mb-2">
                          <div className="w-1/3 h-2 bg-gray-200 rounded-full"></div>
                          <div className="w-1/3 h-2 bg-gray-200 rounded-full"></div>
                          <div className="w-1/3 h-2 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="flex justify-center space-x-1">
                          <div className="w-2 h-2 bg-[#12AD90] rounded-full"></div>
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Car */}
                <div className="absolute bottom-0 right-0 z-10 w-48 md:w-64">
                  <div className="relative">
                    <div className="w-full h-24 bg-blue-500 rounded-t-3xl"></div>
                    <div className="w-full h-12 bg-blue-600 rounded-b-lg"></div>
                    <div className="absolute top-4 left-4 w-12 h-8 bg-blue-400 rounded"></div>
                    <div className="absolute top-4 right-4 w-12 h-8 bg-blue-400 rounded"></div>
                    <div className="absolute bottom-2 left-6 w-8 h-8 bg-gray-300 rounded-full border-4 border-gray-400"></div>
                    <div className="absolute bottom-2 right-6 w-8 h-8 bg-gray-300 rounded-full border-4 border-gray-400"></div>
                  </div>
                </div>

                {/* Location pin */}
                <div className="absolute top-0 right-12 z-30">
                  <div className="w-20 h-20 bg-[#FF5722] rounded-full flex items-center justify-center">
                    <div className="w-10 h-10 bg-white rounded-full"></div>
                  </div>
                  <div className="w-10 h-10 bg-[#FF5722] rotate-45 -mt-4 mx-auto"></div>
                </div>

                {/* People */}
                <div className="absolute bottom-8 left-0 z-20">
                  <div className="w-16 h-24 relative">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full absolute top-0 left-4"></div>
                    <div className="w-12 h-16 bg-yellow-400 rounded-lg absolute bottom-0 left-2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Covoiturage Section with Benefits */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 min-w-[300px]">
            <h2 className="text-3xl font-bold mb-6">
              Vous souhaitez effectuer un{" "}
              <span className="text-[#12AD90]">Covoiturage</span> ?
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Sur EcoDrive, partagez vos trajets avec des passagers qui vont
              dans la même direction que vous. Publiez votre trajet en quelques
              clics et laissez-nous vous mettre en relation avec des passagers
              intéressés.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="bg-[#12AD90] hover:bg-[#0e9a7f] text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Proposer un trajet
              </Link>
              <button
                href="#"
                className="border border-[#12AD90] text-[#12AD90] hover:bg-[#12AD90]/10 font-medium py-2 px-4 rounded-md transition-colors"
              >
                En savoir plus
              </button>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="overflow-hidden border-none shadow-md rounded-lg"
              >
                <div className="flex items-stretch">
                  <div className="w-16 bg-gradient-to-b from-[#12AD90] to-[#0e9a7f] flex items-center justify-center">
                    {benefit.icon}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2">
            Les destinations les plus populaires
          </h2>
          <p className="text-gray-600 mb-10">
            Découvrez les trajets les plus demandés par notre communauté
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination, index) => (
              <div
                key={index}
                className="relative rounded-xl overflow-hidden h-60 group shadow-md transition-transform hover:scale-105 duration-300"
              >
                <div className="w-full h-full relative">
                  <img
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div>
                    <h3 className="text-white text-xl font-semibold mb-1">
                      {destination.name}
                    </h3>
                    <div className="flex items-center gap-1 text-white/80 text-sm">
                      <Users className="w-4 h-4" />
                      <span>Trajets disponibles</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Le Covoiturage selon <span className="text-[#12AD90]">EcoDrive</span>
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
          Notre plateforme rend le covoiturage simple, sécurisé et accessible à
          tous
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="text-center p-6 border-none shadow-md hover:shadow-lg transition-shadow rounded-lg bg-white"
            >
              <div className="pt-6">
                <div className="w-20 h-20 mx-auto mb-6 bg-[#12AD90]/10 rounded-full flex items-center justify-center">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#12AD90] to-[#0e9a7f] py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Prêt à rejoindre la communauté EcoDrive ?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-10 text-lg">
            Inscrivez-vous gratuitement et commencez à économiser sur vos
            trajets tout en réduisant votre empreinte carbone
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
                to="/register"
              className="bg-white text-[#12AD90] hover:bg-gray-100 font-medium px-8 py-3 rounded-md text-lg inline-block transition-colors"
            >
              S'inscrire gratuitement
            </Link>
            <button
              className="border border-white text-white hover:bg-white/20 font-medium px-8 py-3 rounded-md text-lg inline-block transition-colors"
            >
              Comment ça marche
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
