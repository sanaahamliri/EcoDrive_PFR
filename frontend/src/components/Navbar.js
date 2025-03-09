import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-green-600">EcoDrive</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-700 hover:text-green-600">
              Connexion
            </Link>
            <Link
              to="/register"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Inscription
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 