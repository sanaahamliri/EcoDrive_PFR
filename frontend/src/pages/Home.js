import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
              Voyagez écologique avec EcoDrive
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl">
              Rejoignez notre communauté de covoiturage écologique et contribuez à réduire l'empreinte carbone.
            </p>
            <div className="mt-5 max-w-md mx-auto flex justify-center gap-3">
              <Link
                to="/search"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-gray-50"
              >
                Rechercher un trajet
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-700 hover:bg-green-800"
              >
                Proposer un trajet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Économisez du temps</h3>
              <p className="mt-2 text-base text-gray-500">
                Trouvez rapidement des trajets qui correspondent à vos besoins
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Réduisez vos coûts</h3>
              <p className="mt-2 text-base text-gray-500">
                Partagez les frais de transport avec d'autres voyageurs
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Protégez l'environnement</h3>
              <p className="mt-2 text-base text-gray-500">
                Contribuez à la réduction des émissions de CO2
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
