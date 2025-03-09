import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-green-600">
        <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">Voyagez ensemble,</span>
              <span className="block">économisez plus</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-green-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Trouvez des covoiturages fiables et économiques pour vos trajets quotidiens ou occasionnels.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/search"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Rechercher un trajet
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  to="/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-500 hover:bg-green-600 md:py-4 md:text-lg md:px-10"
                >
                  S'inscrire
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">
              Pourquoi nous choisir
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Une meilleure façon de voyager
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {/* Feature 1 */}
              <div className="text-center">
                <h3 className="mt-2 text-xl leading-7 font-semibold text-gray-900">
                  Économique
                </h3>
                <p className="mt-3 text-base text-gray-500">
                  Partagez les frais de transport et économisez sur vos déplacements.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center">
                <h3 className="mt-2 text-xl leading-7 font-semibold text-gray-900">
                  Écologique
                </h3>
                <p className="mt-3 text-base text-gray-500">
                  Réduisez votre empreinte carbone en partageant vos trajets.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center">
                <h3 className="mt-2 text-xl leading-7 font-semibold text-gray-900">
                  Communautaire
                </h3>
                <p className="mt-3 text-base text-gray-500">
                  Rencontrez des personnes partageant le même itinéraire que vous.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 