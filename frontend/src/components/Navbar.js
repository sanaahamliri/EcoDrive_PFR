import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-green-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold">EcoDrive</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                Accueil
              </Link>
              <Link to="/search" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                Rechercher
              </Link>
              <Link to="/about" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                À propos
              </Link>
              <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                Connexion
              </Link>
              <Link to="/register" className="px-3 py-2 rounded-md text-sm font-medium bg-green-700 hover:bg-green-800">
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
