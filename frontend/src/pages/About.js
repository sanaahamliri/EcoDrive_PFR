const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          À propos d'EcoDrive
        </h1>

        <div className="prose prose-green mx-auto">
          <p className="text-lg text-gray-700 mb-6">
            EcoDrive est une plateforme innovante de covoiturage conçue pour faciliter 
            la mobilité durable au Maroc. Notre mission est de rendre les déplacements 
            plus écologiques, économiques et conviviaux.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            Notre Mission
          </h2>
          <p className="text-gray-700 mb-6">
            Nous nous engageons à :
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Réduire l'empreinte carbone des déplacements</li>
            <li>Rendre les voyages plus accessibles et économiques</li>
            <li>Créer une communauté de voyageurs responsables</li>
            <li>Promouvoir la mobilité partagée au Maroc</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            Comment ça marche ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-primary text-xl font-bold mb-2">1.</div>
              <h3 className="font-semibold mb-2">Inscription</h3>
              <p className="text-gray-600">
                Créez votre compte en tant que passager ou conducteur
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-primary text-xl font-bold mb-2">2.</div>
              <h3 className="font-semibold mb-2">Recherche</h3>
              <p className="text-gray-600">
                Trouvez ou proposez un trajet qui vous convient
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-primary text-xl font-bold mb-2">3.</div>
              <h3 className="font-semibold mb-2">Voyage</h3>
              <p className="text-gray-600">
                Voyagez ensemble et partagez les frais
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            Impact Environnemental
          </h2>
          <p className="text-gray-700 mb-6">
            Chaque trajet partagé contribue à :
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Réduire les émissions de CO2</li>
            <li>Diminuer le trafic routier</li>
            <li>Économiser les ressources énergétiques</li>
          </ul>

          <div className="bg-green-50 p-6 rounded-lg mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Rejoignez notre communauté
            </h2>
            <p className="text-gray-700">
              Ensemble, nous pouvons faire une différence pour l'environnement 
              tout en rendant les voyages plus accessibles et agréables pour tous.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
