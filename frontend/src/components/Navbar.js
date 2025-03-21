import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
<nav className="sticky top-0 bg-gradient-to-r from-[#12AD90] via-[#0e9a7f] to-[#12AD90] shadow z-10 bg-opacity-90">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-white">EcoDrive</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-white hover:text-[#0e9a7f]">
              Connexion
            </Link>
            <Link
              to="/register"
              className="bg-[#0e9a7f] text-white px-4 py-2 rounded-md hover:bg-[#12AD90]"
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
