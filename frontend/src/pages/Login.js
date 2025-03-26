import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { CheckCircle, Mail, Lock, LogIn } from "lucide-react"
import AuthService from "../services/authService"

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await AuthService.login(formData.email, formData.password)
      // Redirection basée sur le rôle
      const role = response.user.role
      switch (role) {
        case "admin":
          navigate("/admin/dashboard")
          break
        case "driver":
          navigate("/driver/dashboard")
          break
        default:
          navigate("/user/dashboard")
      }
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de la connexion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#c9ebff] to-[#e6f7ff] relative overflow-hidden">
      {/* SVG Background similar to home page */}
      <div className="absolute inset-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 750 500"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <g id="Background_Simple">
            <g>
              <path
                style={{ fill: "#92E3A9" }}
                d="M728.637,192.387c0,0-16.398-88.141-133.643-142.581C477.749-4.635,423.461,49.539,364.516,72.14 c-58.945,22.6-90.921-8.508-189.308-23.198C76.821,34.251-8.448,180.289,19.428,294.354 c27.876,114.065,89.368,154.679,223.831,180.603c134.463,25.924,213.992-59.625,309.1-44.071 C647.467,446.441,760.613,359.164,728.637,192.387z"
              />
              <path
                style={{ opacity: 0.7, fill: "#FFFFFF" }}
                d="M728.637,192.387c0,0-16.398-88.141-133.643-142.581 C477.749-4.635,423.461,49.539,364.516,72.14c-58.945,22.6-90.921-8.508-189.308-23.198 C76.821,34.251-8.448,180.289,19.428,294.354c27.876,114.065,89.368,154.679,223.831,180.603 c134.463,25.924,213.992-59.625,309.1-44.071C647.467,446.441,760.613,359.164,728.637,192.387z"
              />
            </g>
          </g>
        </svg>
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#12AD90]/80 to-[#12AD90]/60 mix-blend-multiply"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 max-w-6xl mx-auto">
          {/* Left column with titles */}
          <div className="w-full md:w-2/5 md:pt-16">
            <div className="md:text-left text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Bienvenue sur EcoDrive</h2>
              <p className="text-white/90 text-xl leading-relaxed">
                Connectez-vous pour accéder à votre compte et commencer à voyager
              </p>

              <div className="hidden md:block mt-12">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                  <h3 className="text-white text-xl font-semibold mb-3">Avantages membres</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-white mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-white/90">Réservez des trajets en quelques clics</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-white mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-white/90">Accédez à votre historique de voyages</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-white mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-white/90">Bénéficiez de tarifs préférentiels</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right column with form */}
          <div className="w-full md:w-3/5">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8">
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
                    <span className="mr-2">⚠️</span>
                    {error}
                  </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-[#12AD90] focus:border-[#12AD90] transition-colors"
                        placeholder="votre@email.com"
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                    <div className="relative">
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-[#12AD90] focus:border-[#12AD90] transition-colors"
                        placeholder="••••••••"
                      />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-[#12AD90] focus:ring-[#12AD90] border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Se souvenir de moi
                      </label>
                    </div>

                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-[#12AD90] to-[#0e9a7f] hover:from-[#0e9a7f] hover:to-[#0c8a72] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#12AD90] disabled:opacity-50 transition-all duration-200"
                  >
                    {loading ? (
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <LogIn className="mr-2 h-5 w-5" />
                    )}
                    {loading ? "Connexion..." : "Se connecter"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Vous n'avez pas de compte ?{" "}
                    <Link to="/register" className="font-medium text-[#12AD90] hover:text-[#0e9a7f] transition-colors">
                      Inscrivez-vous
                    </Link>
                  </p>
                </div>
              </div>

              <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-500">© 2025 EcoDrive</span>
                <div className="flex space-x-4">
                  <a href="/" className="text-xs text-gray-500 hover:text-[#12AD90]">
                    Conditions
                  </a>
                  <a href="/" className="text-xs text-gray-500 hover:text-[#12AD90]">
                    Confidentialité
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
    </div>
  )
}

export default Login

