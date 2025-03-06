import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">EcoDrive</h3>
            <p className="text-sm text-gray-300">Ensemble pour une mobilité durable</p>
          </div>
          <div className="text-sm text-gray-300">
            © {new Date().getFullYear()} EcoDrive. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
