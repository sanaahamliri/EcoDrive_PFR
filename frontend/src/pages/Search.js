import React, { useState } from 'react';

const Search = () => {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching with params:', searchParams);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Rides</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="from" className="block text-sm font-medium text-gray-700">
              From
            </label>
            <input
              type="text"
              id="from"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={searchParams.from}
              onChange={(e) => setSearchParams({...searchParams, from: e.target.value})}
              placeholder="Enter starting location"
            />
          </div>
          
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-700">
              To
            </label>
            <input
              type="text"
              id="to"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={searchParams.to}
              onChange={(e) => setSearchParams({...searchParams, to: e.target.value})}
              placeholder="Enter destination"
            />
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={searchParams.date}
              onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Search Rides
          </button>
        </form>
      </div>
    </div>
  );
};

export default Search;
