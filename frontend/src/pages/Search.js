import { useState } from 'react';

const Search = () => {
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Recherche:', searchData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Rechercher un Trajet
        </h1>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="from" className="block text-sm font-medium text-gray-700">
                Ville de départ
              </label>
              <input
                type="text"
                id="from"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="Ex: Casablanca"
                value={searchData.from}
                onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700">
                Ville d'arrivée
              </label>
              <input
                type="text"
                id="to"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="Ex: Rabat"
                value={searchData.to}
                onChange={(e) => setSearchData({ ...searchData, to: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date du trajet
              </label>
              <input
                type="date"
                id="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                value={searchData.date}
                onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Rechercher
            </button>
          </form>
        </div>

        {/* Résultats de recherche - à implémenter */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Trajets disponibles
          </h2>
          <div className="space-y-4">
            {/* Example result card */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Casablanca → Rabat
                  </h3>
                  <p className="text-sm text-gray-500">Lundi, 4 Mars 2025</p>
                  <div className="mt-2">
                    <span className="text-sm font-medium text-gray-900">100 DH</span>
                    <span className="mx-2">•</span>
                    <span className="text-sm text-gray-500">2 places disponibles</span>
                  </div>
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
                  Réserver
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
