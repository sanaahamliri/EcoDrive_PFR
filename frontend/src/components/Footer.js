import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-600">
            © {new Date().getFullYear()} EcoDrive. Tous droits réservés.
          </p>
          <p className="text-gray-500 mt-2">
            Créé avec ❤️ pour un transport plus écologique au Maroc -{' '}
            <Link to="/about" className="text-primary hover:text-green-700">
              À propos
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
