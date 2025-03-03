import { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'passenger' // 'passenger' ou 'driver'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement registration functionality
    console.log('Register:', formData);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Créer un compte
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary/90">
              connectez-vous à votre compte
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  Prénom
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="exemple@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Type de compte</label>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="radio"
                    id="passenger"
                    name="userType"
                    value="passenger"
                    checked={formData.userType === 'passenger'}
                    onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                    className="sr-only peer"
                  />
                  <label
                    htmlFor="passenger"
                    className="flex justify-center items-center p-2 w-full text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-primary peer-checked:text-primary hover:text-gray-600 hover:bg-gray-100"
                  >
                    Passager
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="driver"
                    name="userType"
                    value="driver"
                    checked={formData.userType === 'driver'}
                    onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                    className="sr-only peer"
                  />
                  <label
                    htmlFor="driver"
                    className="flex justify-center items-center p-2 w-full text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-primary peer-checked:text-primary hover:text-gray-600 hover:bg-gray-100"
                  >
                    Conducteur
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              S'inscrire
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
