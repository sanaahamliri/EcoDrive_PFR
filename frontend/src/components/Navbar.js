import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-xl">
              EcoDrive
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="text-white hover:bg-green-700 px-3 py-2 rounded-md">
                Accueil
              </Link>
              <Link to="/search" className="text-white hover:bg-green-700 px-3 py-2 rounded-md">
                Rechercher
              </Link>
              <Link to="/about" className="text-white hover:bg-green-700 px-3 py-2 rounded-md">
                À propos
              </Link>
              <Link to="/login" className="text-white hover:bg-green-700 px-3 py-2 rounded-md">
                Connexion
              </Link>
              <Link to="/register" className="bg-white text-primary hover:bg-gray-100 px-3 py-2 rounded-md">
                Inscription
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-green-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="text-white hover:bg-green-700 block px-3 py-2 rounded-md"
            >
              Accueil
            </Link>
            <Link
              to="/search"
              className="text-white hover:bg-green-700 block px-3 py-2 rounded-md"
            >
              Rechercher
            </Link>
            <Link
              to="/about"
              className="text-white hover:bg-green-700 block px-3 py-2 rounded-md"
            >
              À propos
            </Link>
            <Link
              to="/login"
              className="text-white hover:bg-green-700 block px-3 py-2 rounded-md"
            >
              Connexion
            </Link>
            <Link
              to="/register"
              className="text-white hover:bg-green-700 block px-3 py-2 rounded-md"
            >
              Inscription
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
